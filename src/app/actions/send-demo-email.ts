"use server";

import { Resend } from "resend";

/** Format form data as plain text and HTML for email body */
function formatSubmissionBody(
  data: Record<string, unknown>,
  schema: { label: string; name: string }[],
): { text: string; html: string } {
  const lines = schema.map((field) => {
    const value = data[field.name];
    const display = value == null ? "" : String(value);
    return `${field.label}: ${display}`;
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

export async function sendDemoEmail(
  to: string,
  data: Record<string, unknown>,
  schema: { label: string; name: string }[],
): Promise<{ error: Error | null }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[sendDemoEmail] RESEND_API_KEY is not set. Add it to .env.local (get key at https://resend.com/api-keys)");
    return { error: new Error("Email is not configured (missing RESEND_API_KEY)") };
  }
  const { text, html } = formatSubmissionBody(data, schema);
  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "Healumin8 Website <onboarding@resend.dev>";
  const result = await resend.emails.send({
    from,
    to: [to],
    subject: "New demo request from Healumin8 website",
    text,
    html: `<!DOCTYPE html><html><body>${html}</body></html>`,
  });
  if (result.error) {
    console.error("[sendDemoEmail] Resend error:", result.error.message);
    return { error: new Error(result.error.message) };
  }
  return { error: null };
}
