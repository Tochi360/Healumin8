import { NextResponse } from "next/server";
import { authenticateWebhook } from "basehub/workflows";
import { Resend } from "resend";

const DEMO_EMAIL = "Hello@healumin8.com";

/** Format event data (flat object) as email body */
function formatEventDataAsEmail(data: Record<string, unknown>): { text: string; html: string } {
  const lines = Object.entries(data).map(([key, value]) => {
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
    const display = value == null ? "" : String(value);
    return `${label}: ${display}`;
  });
  const text = lines.join("\n");
  const html = lines
    .map((line) => {
      const i = line.indexOf(": ");
      const label = i >= 0 ? line.slice(0, i) : line;
      const value = i >= 0 ? line.slice(i + 2) : "";
      return `<p><strong>${label}:</strong> ${value}</p>`;
    })
    .join("\n");
  return { text, html };
}

/**
 * BaseHub Workflow webhook: when the "Request a demo" form sends an event to BaseHub,
 * BaseHub POSTs here. We forward the submission to your email via Resend.
 *
 * Setup: https://docs.basehub.com/documentation/extras/webhooks
 */
export async function POST(request: Request) {
  const secret = process.env.BASEHUB_DEMO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[basehub-demo-webhook] BASEHUB_DEMO_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const result = await authenticateWebhook({
    body: request.body,
    signature: request.headers,
    secret: secret as `bshb_workflow_${string}:${string}`,
  });

  if (!result.success) {
    console.error("[basehub-demo-webhook] Auth failed:", result.error);
    return NextResponse.json({ error: result.error }, { status: 401 });
  }

  const payload = result.payload as {
    type: string;
    timestamp?: string;
    data?: { eventBlockId?: string; eventBlockTitle?: string; data?: Record<string, unknown> };
  };

  if (payload.type !== "event-block.created" || !payload.data?.data) {
    return NextResponse.json({ received: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[basehub-demo-webhook] RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Email not configured" }, { status: 500 });
  }

  const { text, html } = formatEventDataAsEmail(payload.data.data as Record<string, unknown>);
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "Healumin8 Website <onboarding@resend.dev>";
  const { error } = await resend.emails.send({
    from,
    to: [DEMO_EMAIL],
    subject: "New demo request from Healumin8 website (BaseHub)",
    text,
    html: `<!DOCTYPE html><html><body>${html}</body></html>`,
  });

  if (error) {
    console.error("[basehub-demo-webhook] Resend error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
