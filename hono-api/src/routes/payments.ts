import { Hono } from 'hono';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { setEscrowStatusByProjectId } from '../lib/transactions';

type CreateIntentBody = {
  projectId: string;
  amount: number;
  currency?: string;
  connectedAccountId: string;
};

type ReleaseBody = {
  projectId: string;
};

export const paymentsRouter = new Hono();

paymentsRouter.post('/create-intent', async (c) => {
  const body = (await c.req.json()) as CreateIntentBody;

  if (!body.projectId || !body.amount || !body.connectedAccountId) {
    return c.json({ error: 'projectId, amount, and connectedAccountId are required' }, 400);
  }

  const amount = Math.round(body.amount);
  const applicationFeeAmount = Math.round(amount * 0.05);

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: body.currency ?? 'usd',
    application_fee_amount: applicationFeeAmount,
    transfer_data: {
      destination: body.connectedAccountId,
    },
    metadata: {
      projectId: body.projectId,
      platformFeeSplit: '2.5_brand_2.5_vendor',
    },
  });

  const disputeDeadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const { error } = await supabase.from('transactions').upsert(
    {
      project_id: body.projectId,
      amount,
      escrow_status: 'held',
      stripe_payment_intent_id: paymentIntent.id,
      dispute_deadline: disputeDeadline,
    },
    { onConflict: 'project_id' },
  );

  if (error) {
    return c.json({ error: error.message }, 500);
  }

  return c.json({
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    applicationFeeAmount,
  });
});

paymentsRouter.post('/release', async (c) => {
  const body = (await c.req.json()) as ReleaseBody;

  if (!body.projectId) {
    return c.json({ error: 'projectId is required' }, 400);
  }

  await setEscrowStatusByProjectId(body.projectId, 'released');

  return c.json({ success: true, projectId: body.projectId, escrow_status: 'released' });
});
