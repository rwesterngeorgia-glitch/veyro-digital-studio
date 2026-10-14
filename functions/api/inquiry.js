export async function onRequest({ request, env }) {
  if (!env.CONTACT_DELIVERY) return Response.json({ ok: false, message: "The form is temporarily unavailable. Please email hello@veyro350.com." }, { status: 503, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
  return env.CONTACT_DELIVERY.fetch(request);
}
