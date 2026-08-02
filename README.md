# eax-site

Static EAX Marketplace website converted from the original one-file export into a small Parcel project that can build and deploy through GitHub Pages.

## Local commands

```sh
npm install
npm run dev
npm test
npm run build
```

The production build is written to `public/`.

## Founding supplier form

The `Become a Founding Supplier` form posts JSON to a public backend endpoint. The static page does not call Listmonk directly, because Listmonk API credentials must stay server-side.

Set this build-time variable in GitHub Actions or locally before `npm run build`:

```sh
EAX_FOUNDING_SUPPLIER_API_URL=https://eax-email-relay.peakwalk.tech/api/public/founding-supplier-requests
```

The committed page also has the EAX relay URL as its default form endpoint, so the GitHub Pages build works even if this variable is not set. Keep using the variable when a build needs to point at another relay/API endpoint. The static page never calls Listmonk directly, because Listmonk API credentials must stay server-side.

More detail is in `docs/listmonk-integration.md`.

## GitHub repository setup

```sh
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin git@github.com:peakwalk/eax-site.git
git push -u origin main
```
