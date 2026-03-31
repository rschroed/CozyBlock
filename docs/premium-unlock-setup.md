# Premium Unlock Setup

This document is the source of truth for CozyBlock's Gumroad premium unlock configuration.

It exists to unblock:
- issue `#33` webhook ingestion
- issue `#34` claim and restore endpoints
- issue `#35` in-game premium UX

## Product Summary

- Product name: `Unlock Full Game`
- Product type: one-time purchase
- Launch price: `$3.00`
- Promise: one purchase unlocks all current and future premium worlds
- Restore model: no account or email restore in v1; the player must save their restore code

## Hosted Product Values

- Production app base URL: `https://playcozyblock.com`
- Gumroad hosted product URL: `https://ryanschroeder.gumroad.com/l/tjkti`
- Gumroad hosted link slug / permalink: `tjkti`
- Gumroad product ID: `EIMdnG5PO1Mswtbp0o8vUg==`
- Purchase success redirect URL: `https://playcozyblock.com/premium/success`
- Gumroad Ping/webhook URL: `https://playcozyblock.com/.netlify/functions/gumroad-webhook`

## Storefront Copy

### Product title

`Unlock Full Game`

### Short description

Unlock all premium CozyBlock worlds for $3.00 with one purchase. Your unlock also covers future premium worlds added to the game.

### Restore copy

This version of CozyBlock does not use accounts or email restore. After purchase, CozyBlock will show you a restore code. Save that code somewhere safe because you will need it to restore premium access on a new browser or device.

### CTA guidance

Use purchase copy that keeps the promise simple:
- $3.00 one-time unlock
- unlock all premium worlds
- future premium worlds included
- save your restore code after checkout

## Redirect Contract

After a successful purchase, Gumroad should redirect the buyer to:

`https://playcozyblock.com/premium/success`

Downstream app work should assume:
- the redirect remains on the SPA route above rather than returning to `/`
- Gumroad query parameters should be preserved on redirect
- issue `#35` will read those query parameters and call the claim endpoint rather than inventing a separate success payload

Observed success redirect on `2026-03-30`:

`https://playcozyblock.com/premium/success?sale_id=9gT_oOaqbhTVw_9CHH-xJw%3D%3D&product_id=EIMdnG5PO1Mswtbp0o8vUg%3D%3D&product_permalink=tjkti`

Observed query parameters:
- `sale_id`
- `product_id`
- `product_permalink`

If Gumroad offers multiple redirect settings, use the product-level setting that sends the buyer directly back to the CozyBlock app after checkout.

## Webhook Contract

Configure Gumroad Ping/webhook delivery to:

`https://playcozyblock.com/.netlify/functions/gumroad-webhook`

Downstream backend work should treat `gumroad-webhook` as the stable function name and should not rename this endpoint without updating this document and the hosted Gumroad product settings.

## Identifier Notes

Gumroad uses two distinct identifiers in CozyBlock's purchase flow:
- public hosted link slug / permalink: `tjkti`
- opaque Gumroad product ID: `EIMdnG5PO1Mswtbp0o8vUg==`

These values are not interchangeable. Client and backend code should treat `product_id` and `product_permalink` as separate fields.

## Suggested Runtime Config Names

If later implementation work introduces env vars, prefer these names:
- `VITE_GUMROAD_PRODUCT_URL`
- `GUMROAD_WEBHOOK_URL`
- `GUMROAD_PRODUCT_ID`
- `GUMROAD_PRODUCT_PERMALINK`
- `APP_BASE_URL`

This issue does not wire those variables into runtime code; it only reserves clear names for later work.

## Validation Checklist

- [x] Production app base URL recorded from Netlify as `https://playcozyblock.com`
- [x] Hosted Gumroad purchase URL recorded as `https://ryanschroeder.gumroad.com/l/tjkti`
- [x] Launch price fixed at `$3.00`
- [x] Success redirect target fixed at `https://playcozyblock.com/premium/success`
- [x] Webhook target fixed at `https://playcozyblock.com/.netlify/functions/gumroad-webhook`
- [x] Storefront copy documents the restore-code model
- [x] Confirm the opaque Gumroad `product_id` as `EIMdnG5PO1Mswtbp0o8vUg==`
- [x] Confirm the Gumroad permalink as `tjkti`
- [x] Run a checkout-path smoke test and record the observed redirect query parameters here

## Current Endpoint Status

As of `2026-03-30`, Gumroad is attempting to `POST` to:

`https://playcozyblock.com/.netlify/functions/gumroad-webhook`

The current response is `404 Not Found`. That is expected until issue `#33` implements and deploys the `gumroad-webhook` Netlify function.

## Smoke Test Notes

Safe checkout-path smoke test recorded on `2026-03-30`:
- exact redirect URL observed after purchase:
  `https://playcozyblock.com/premium/success?sale_id=9gT_oOaqbhTVw_9CHH-xJw%3D%3D&product_id=EIMdnG5PO1Mswtbp0o8vUg%3D%3D&product_permalink=tjkti`
- query parameter names returned by Gumroad:
  `sale_id`, `product_id`, `product_permalink`
- redirect lands directly on `/premium/success`
