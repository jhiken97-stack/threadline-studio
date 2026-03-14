import { Hono } from 'hono';
import Stripe from 'stripe';
import { stripe } from '../lib/stripe';
import { env } from '../lib/env';
import { releaseDueEscrows, setEscrowStatusByPaymentIntent } from '../lib/transactions';

export const webhooksRouter = new Hono();

webhooksRouter.post('/stripe', async (c) => {
  const signature = c.req.header('stripe-signature');
  if (!signature) {
    return c.json({ error: 'Missing stripe-signature header' }, 400);
  }

  const body = await c.req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid signature';
    return c.json({ error: message }, 400);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const deadline = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
      await setEscrowStatusByPaymentIntent(paymentIntent.id, 'held', deadline);
      break;
    }
    case 'charge.dispute.created': {
      const charge = event.data.object as Stripe.Dispute;
      if (typeof charge.payment_intent === 'string') {
        await setEscrowStatusByPaymentIntent(charge.payment_intent, 'disputed');
      }
      break;
    }
    default:
      break;
  }

  await releaseDueEscrows();

  return c.json({ received: true, event: event.type });
});
