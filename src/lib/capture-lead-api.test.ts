import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "../../api/capture-lead";

describe("POST /api/capture-lead", () => {
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.RESEND_AUDIENCE_ID = "aud_test_123";
    process.env.RESEND_FROM_EMAIL = "Fabiano | Speculum Studio <fabiano@envio.speculumstudio.com>";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("rejeita payload com slug desconhecido sem chamar Supabase nem Resend", async () => {
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const req = new Request("https://speculumstudio.com/api/capture-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "inexistente",
        nome: "Fabiano Teste",
        email: "fabiano@speculumstudio.com",
        whatsapp: "(13) 99615-8177",
        consentLgpd: true,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("persiste no Supabase, sincroniza Audience e envia e-mail de boas-vindas no Resend", async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/rest/v1/rpc/capture_studio_lead")) {
        return new Response(JSON.stringify({ lead_id: "lead-uuid-1", ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (url.includes("/audiences/aud_test_123/contacts")) {
        return new Response(JSON.stringify({ id: "contact-1" }), { status: 200 });
      }
      if (url.includes("api.resend.com/emails")) {
        return new Response(JSON.stringify({ id: "email-1" }), { status: 200 });
      }
      throw new Error(`Unexpected fetch URL: ${url}`);
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const req = new Request("https://speculumstudio.com/api/capture-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "cerebro",
        nome: "Fabiano <Pereira>",
        email: "fabiano@speculumstudio.com",
        whatsapp: "(13) 99615-8177",
        consentLgpd: true,
        utmSource: "instagram",
      }),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      leadId: "lead-uuid-1",
      emailSent: true,
      audienceSynced: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const emailCall = fetchMock.mock.calls.find((call) =>
      String(call[0]).includes("api.resend.com/emails")
    );
    const emailPayload = JSON.parse(String(emailCall?.[1]?.body));
    expect(emailPayload.to).toEqual(["fabiano@speculumstudio.com"]);
    expect(emailPayload.reply_to).toBe("contato@speculumstudio.com");
    expect(emailPayload.html).toContain("https://speculumstudio.com/post/setup-segundo-cerebro-ia?acesso=liberado");
    expect(emailPayload.html).not.toContain("<Pereira>");
  });

  it("bloqueia chamadas ao Resend quando o Supabase rejeita o lead", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Muitas tentativas." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      })
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const req = new Request("https://speculumstudio.com/api/capture-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "cerebro",
        nome: "Fabiano Teste",
        email: "fabiano@speculumstudio.com",
        whatsapp: "(13) 99615-8177",
        consentLgpd: true,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(429);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("libera o acesso mesmo se o Resend falhar temporariamente", async () => {
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/rest/v1/rpc/capture_studio_lead")) {
        return new Response(JSON.stringify({ id: "lead-uuid-2", ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ message: "Domain not verified" }), {
        status: 403,
      });
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const req = new Request("https://speculumstudio.com/api/capture-lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: "cerebro",
        nome: "Fabiano Teste",
        email: "fabiano@speculumstudio.com",
        whatsapp: "(13) 99615-8177",
        consentLgpd: true,
      }),
    });

    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toEqual({
      ok: true,
      leadId: "lead-uuid-2",
      emailSent: false,
      audienceSynced: false,
    });
  });
});
