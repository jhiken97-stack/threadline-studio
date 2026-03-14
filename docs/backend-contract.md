# Threadline Backend Contract Checklist

This document is the single source of truth for backend alignment with the existing frontend.

Legend:
- `[ ]` Not started
- `[~]` In progress
- `[x]` Done

## 1) Required Tables

- [x] `users`
- [x] `vendors`
- [x] `briefs`
- [x] `projects`
- [x] `messages`
- [x] `transactions`
- [x] `user_roles`
- [x] `vendor_profiles`
- [x] `project_timeline`
- [x] `project_substep_progress`
- [x] `conversations`
- [ ] `invoices`
- [ ] `files`
- [ ] `shipment_tracking`
- [ ] `shipment_events`
- [ ] `contracts`
- [ ] `disputes`
- [ ] `amendments`
- [ ] `saved_vendors`
- [ ] `notifications`
- [ ] `reviews`

## 2) Required API Routes

### Already implemented
- [x] `POST /payments/create-intent`
- [x] `POST /payments/release`
- [x] `POST /webhooks/stripe`
- [x] `POST /functions/v1/match-vendors`

### Needed next
- [ ] Conversations/messages API (`/conversations`, `/messages`, mark-read)
- [ ] Invoices API (`/invoices` create/list/status)
- [ ] Contracts API (`/contracts` create/sign/list)
- [ ] Amendments API (`/amendments` create/respond)
- [ ] Disputes API (`/disputes` file/resolve)
- [ ] Shipment API (`/shipments`, `/shipment-events`)
- [ ] Notifications API (`/notifications`, mark-read)
- [ ] Reviews API (`/reviews`, ratings summary)

## 3) Required Storage Buckets

- [ ] `project-files` (private)
- [ ] `invoice-pdfs` (private)
- [ ] `vendor-portfolios` (public)
- [ ] `avatars` (public)

## 4) Required Edge Functions

- [x] `match-vendors`
- [ ] `generate-invoice-pdf`
- [ ] `process-payment`
- [ ] `escrow-release`
- [ ] `send-notification`
- [ ] `tracking-webhook` (optional)

## 5) Required Business Rules

- [ ] 50% deposit before production, 50% balance after QC before shipping
- [x] 5% platform fee logic present in payment intent creation (2.5% brand-side + 2.5% vendor-side accounting)
- [~] Escrow held/released/disputed lifecycle implemented, but needs shipment + dispute-gating rules
- [ ] Contract activation requires both signatures
- [ ] Amendment approval by non-requesting party only
- [ ] Open disputes block escrow release
- [ ] Sequential sub-step progression with payment gates

## 6) Required RLS Coverage

### Implemented
- [x] `users`
- [x] `vendors`
- [x] `briefs`
- [x] `projects`
- [x] `messages`
- [x] `transactions`
- [x] `conversations`

### Missing
- [ ] `invoices`
- [ ] `files`
- [ ] `contracts`
- [ ] `disputes`
- [ ] `amendments`
- [ ] `shipment_tracking`
- [ ] `shipment_events`
- [ ] `notifications`
- [ ] `reviews`

## 7) Realtime Requirements

- [ ] `messages`
- [x] `project_substep_progress`
- [ ] `shipment_events`
- [ ] `amendments`
- [ ] `disputes`
- [ ] `notifications` (optional)

## Next Step (Do only this next)

- [x] Stage 1 migration A: added `user_roles`, `vendor_profiles`, `conversations`, and workflow tables/enums.


## 8) Stage-by-Stage Deploy/Test Instructions

### Stage 1A (this PR)
1. **Commit & Push** this migration PR.
2. **Vercel Preview deploy** auto-runs from the PR.
3. **Apply migration to Supabase staging** (SQL editor or migration pipeline).
4. **Test staging immediately**:
   - Login works
   - Existing pages load
   - No permission errors on existing flows

### Stage 2 (API flows)
1. Commit API route changes.
2. Push PR, wait for Vercel preview green.
3. Test chat + invoices + disputes in staging.

### Stage 3 (storage/realtime)
1. Commit storage/realtime changes.
2. Push PR and deploy preview.
3. Test uploads + live updates in staging.

### Production release
Only promote to production after all Stage 1A/2/3 staging tests pass.
