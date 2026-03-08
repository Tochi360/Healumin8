# Connect the demo form to your email via BaseHub

Your "Request a demo" form already sends submissions to **BaseHub** (Event Block). To also receive each submission at **Hello@healumin8.com** via BaseHub, use a **Workflow** that calls this app’s webhook; the webhook then sends the email with Resend.

## 1. BaseHub: Create a Workflow

1. Open your project in [BaseHub](https://basehub.com).
2. Add a **Workflow** block (or open an existing one).
3. Set the **trigger** to **"New events in Event Block"**.
4. Choose the **Event Block** that receives the "Request a demo" form (the one whose *ingest key* is used by the form on the site).
5. Set **Webhook URL** to your app’s webhook:
   - Production: `https://yourdomain.com/api/basehub-demo-webhook`
   - Local dev: use a tunnel (e.g. [ngrok](https://ngrok.com)) and put `https://your-tunnel.ngrok.io/api/basehub-demo-webhook`
6. **Copy the Webhook Secret** shown in the Workflow (BaseHub generates it).
7. **Commit** the Workflow (required for "New events in Event Block" to run).

Docs: [BaseHub Webhooks](https://docs.basehub.com/documentation/extras/webhooks), [Workflow block](https://docs.basehub.com/blocks/primitives/workflow).

## 2. App: Set environment variables

In `.env.local` (or your host’s env):

```bash
# Required for the webhook to send email
RESEND_API_KEY=re_xxxx
# Optional: sender address (use a verified domain in Resend)
# RESEND_FROM_EMAIL="Healumin8 Website <noreply@healumin8.com>"

# Paste the Webhook Secret from the BaseHub Workflow (step 1)
BASEHUB_DEMO_WEBHOOK_SECRET=bshb_workflow_xxxx:your_secret
```

Restart the app after changing env.

## 3. Flow

1. User submits the demo form on the site.
2. The form sends the data to BaseHub (`sendEvent` → your Event Block).
3. BaseHub runs the Workflow and POSTs to `https://yourdomain.com/api/basehub-demo-webhook`.
4. The API route verifies the webhook (using `BASEHUB_DEMO_WEBHOOK_SECRET`) and sends an email to **Hello@healumin8.com** via Resend.

You can use **only** BaseHub + webhook (this flow), or **also** keep the existing in-form email (Resend in the form action); both can send to the same address.
