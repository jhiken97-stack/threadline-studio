import { Hono } from 'hono';
import { paymentsRouter } from './routes/payments';
import { webhooksRouter } from './routes/webhooks';

const app = new Hono();

app.get('/health', (c) => c.json({ ok: true }));
app.route('/payments', paymentsRouter);
app.route('/webhooks', webhooksRouter);

export default {
  port: 8787,
  fetch: app.fetch,
};
