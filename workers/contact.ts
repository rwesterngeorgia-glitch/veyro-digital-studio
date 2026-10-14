import {
  inquiryText,
  validateInquiry,
  type Inquiry,
} from "../src/utils/inquiry";

interface Env {
  EMAIL: {
    send(message: {
      from: string;
      to: string;
      replyTo: string;
      subject: string;
      text: string;
    }): Promise<unknown>;
  };
  TURNSTILE_SECRET: string;
  IP_LIMIT: { limit(input: { key: string }): Promise<{ success: boolean }> };
  SEND_LIMIT: { limit(input: { key: string }): Promise<{ success: boolean }> };
}
const origins = new Set([
  "https://veyro350.com",
  "https://veyro-digital-studio.pages.dev",
]);
const fields = [
  "name",
  "email",
  "business",
  "project",
  "budget",
  "details",
  "preferred",
  "website",
] as const;
function response(status: number, message: string, ok = false) {
  return Response.json(
    { ok, message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
        ...(status === 429 ? { "Retry-After": "60" } : {}),
      },
    },
  );
}
export async function handleInquiry(
  request: Request,
  env: Env,
  verify: typeof fetch = fetch,
): Promise<Response> {
  if (request.method !== "POST")
    return response(405, "Use the contact form to send an inquiry.");
  const origin = request.headers.get("Origin") || "";
  if (!origins.has(origin))
    return response(403, "Please send your inquiry from veyro350.com.");
  if (!request.headers.get("Content-Type")?.startsWith("application/json"))
    return response(415, "Unsupported request format.");
  if (!env.EMAIL || !env.TURNSTILE_SECRET || !env.IP_LIMIT || !env.SEND_LIMIT)
    return response(
      503,
      "The form is temporarily unavailable. Please email hello@veyro350.com.",
    );
  try {
    if (
      !(
        await env.IP_LIMIT.limit({
          key: request.headers.get("CF-Connecting-IP") || "unknown",
        })
      ).success
    )
      return response(429, "Please wait a minute before trying again.");
    const reader = request.body?.getReader();
    if (!reader) return response(400, "Please complete the form.");
    let bytes = 0,
      raw = "";
    const decoder = new TextDecoder();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 24576) {
        await reader.cancel();
        return response(413, "Your inquiry is too long.");
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
    let data: Record<string, unknown>;
    try {
      data = JSON.parse(raw);
    } catch {
      return response(400, "Please check the form and try again.");
    }
    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data) ||
      fields.some((field) => typeof data[field] !== "string")
    )
      return response(400, "Please complete the form correctly.");
    const inquiry = Object.fromEntries(
      fields.map((field) => [field, (data[field] as string).trim()]),
    ) as unknown as Inquiry;
    if (
      inquiry.website ||
      inquiry.preferred !== "Email" ||
      Object.keys(validateInquiry(inquiry)).length
    )
      return response(400, "Please check the required fields.");
    if (
      typeof data.turnstileToken !== "string" ||
      !data.turnstileToken ||
      data.turnstileToken.length > 2048
    )
      return response(400, "Please complete the security check.");
    const verification = await verify(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET,
          response: data.turnstileToken,
        }),
        signal: AbortSignal.timeout(10000),
      },
    );
    const result = (await verification.json()) as {
      success?: boolean;
      action?: string;
      hostname?: string;
    };
    if (
      !verification.ok ||
      !result.success ||
      result.action !== "inquiry" ||
      result.hostname !== new URL(origin).hostname
    )
      return response(400, "The security check expired. Please try again.");
    if (!(await env.SEND_LIMIT.limit({ key: "inquiries" })).success)
      return response(
        429,
        "The form is busy. Please try again in a minute or email us.",
      );
    await env.EMAIL.send({
      from: "hello@veyro350.com",
      to: "veyro350@gmail.com",
      replyTo: inquiry.email,
      subject: "New Veyro project inquiry",
      text: inquiryText(inquiry),
    });
    return response(200, "Your inquiry has been sent to Veyro.", true);
  } catch {
    return response(
      503,
      "We couldn’t confirm your inquiry was sent. Please retry or email hello@veyro350.com.",
    );
  }
}
export default {
  fetch(request: Request, env: Env) {
    return handleInquiry(request, env);
  },
};
