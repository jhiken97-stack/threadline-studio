# Threadline Hono API (Bun)

Payment and webhook service layer for Threadline.

## Routes

- `POST /webhooks/stripe`
  - Verifies Stripe webhook signatures.
  - Handles:
    - `payment_intent.succeeded` → updates transaction escrow to `held` and sets 48h dispute deadline.
    - `charge.dispute.created` → updates transaction escrow to `disputed`.
  - Also runs a release sweep to mark eligible held escrows as `released` once `dispute_deadline` has passed.
- `POST /payments/create-intent`
  - Creates a Stripe PaymentIntent with Stripe Connect transfer data.
  - Applies `application_fee_amount` at 5% total platform fee (2.5% brand-side + 2.5% vendor-side accounting convention).
  - Upserts a `transactions` row in Supabase.
- `POST /payments/release`
  - Manually marks a project transaction escrow as `released`.

## Environment variables

Create `.env` in `hono-api/` with:

```bash
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

## Run locally

```bash
cd hono-api
bun install
bun run dev
```

Server starts on `http://localhost:8787`.

## Notes

- Supabase writes are done through `@supabase/supabase-js` service-role client.
- For Stripe webhook testing locally, use Stripe CLI and forward events to:
  `http://localhost:8787/webhooks/stripe`
