# Founding Supplier Form And Listmonk

## What OAE does

`oae-site` does not call Listmonk from browser code. Its public form posts to `/api/public/early-access-requests`.

In local development, `oae-site/scripts/dev.mjs` proxies that path to the backend Supabase Edge Function route `/server/public/early-access-requests` and adds `X-Public-Proxy-Secret`.

In the backend, the public route validates the request, records it in `early_access_requests`, creates an `early_access_notification_campaign`, and lets the early-access notification processor send configured transactional notifications through Listmonk templates and recipients.

## How EAX applies the same pattern

`eax-site` keeps the same static-front-end boundary:

- The browser submits only public request data.
- The endpoint is configured with `EAX_FOUNDING_SUPPLIER_API_URL`.
- The payload uses `source: "eax-site"` and `requestType: "founding-supplier"`.
- Listmonk credentials and template IDs stay in the backend.

This can target the existing OAE-style endpoint if the backend accepts the `founding-supplier` request type. Otherwise, create a thin public backend route for EAX that accepts the same JSON payload and then creates or sends the appropriate Listmonk transaction server-side.

## Expected request payload

```json
{
  "email": "supplier@example.com",
  "source": "eax-site",
  "requestType": "founding-supplier",
  "listmonkAudience": "eax-founding-suppliers",
  "pageUrl": "https://eaxmarketplace.com/"
}
```

The submitted email should be subscribed or notified by a backend service, not by direct Listmonk API calls from the static site.
