# Founding Supplier Form And Listmonk

## What OAE does

`oae-site` does not call Listmonk from browser code. Its public form posts to `/api/public/early-access-requests`.

In local development, `oae-site/scripts/dev.mjs` proxies that path to the backend Supabase Edge Function route `/server/public/early-access-requests` and adds `X-Public-Proxy-Secret`.

In the backend, the public route validates the request, records it in `early_access_requests`, creates an `early_access_notification_campaign`, and lets the early-access notification processor send configured transactional notifications through Listmonk templates and recipients.

## How EAX applies the same pattern

`eax-site` keeps the same static-front-end boundary:

- The browser submits only public request data.
- The endpoint is configured with `EAX_FOUNDING_SUPPLIER_API_URL`.
- The committed default endpoint is `https://eax-email-relay.peakwalk.tech/api/public/founding-supplier-requests`.
- The payload uses `source: "eax-site"` and `requestType: "founding-supplier"`.
- Listmonk credentials and template IDs stay in the backend.

This can target an OAE-style endpoint if a public relay adds the required server-side secret and the backend accepts the `founding-supplier` request type. The static GitHub Pages site should not call the protected OAE Supabase route directly, because that route requires `X-Public-Proxy-Secret`.

If no compatible relay exists, create a thin public backend route for EAX that accepts the same JSON payload and then creates or sends the appropriate Listmonk transaction server-side.

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
