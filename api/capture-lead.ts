// Alinhado com src/integrations/supabase/client.ts (evita herdar VITE_SUPABASE_URL legado da Lovable)
const SUPABASE_URL = "https://mhxwcdxepodoxnofoiya.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_mCNED27_mo9TNmiRI025Mw_8PAI65K8";

const DEFAULT_FROM =
  process.env.RESEND_FROM_EMAIL ||
  "Fabiano | Speculum Studio <fabiano@envio.speculumstudio.com>";

const DEFAULT_REPLY_TO =
  process.env.RESEND_REPLY_TO || "contato@speculumstudio.com";

interface MagnetEmailConfig {
  slug: string;
  eyebrow: string;
  subject: string;
  title: string;
  ctaLabel: string;
  destinationUrl: string;
  highlights: string[];
}

const MAGNET_EMAILS: Record<string, MagnetEmailConfig> = {
  cerebro: {
    slug: "cerebro",
    eyebrow: "Série IA na Prática · Parte 1",
    subject: "Seu acesso ao Segundo Cérebro (6 pastas + 2 comandos)",
    title: "Setup do Segundo Cérebro: Mapa das 6 Pastas e os 2 Comandos",
    ctaLabel: "Abrir tutorial e comandos agora",
    destinationUrl:
      "https://speculumstudio.com/post/setup-segundo-cerebro-ia?acesso=liberado",
    highlights: [
      "Mapa completo das 6 pastas operacionais (clientes, ofertas, referências, projetos, ferramentas e regras).",
      "Comando 1 de inicialização para montar a árvore de pastas e ativar o arquivo mestre de memória.",
      "Comando 2 para estruturar os motores locais de produção direto no computador.",
    ],
  },
};

export interface CaptureLeadPayload {
  slug: string;
  nome: string;
  email: string;
  whatsapp: string;
  consentLgpd: boolean;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  referrer?: string | null;
  pagePath?: string | null;
  perfilAtuacao?: string | null;
  nivelIa?: string | null;
  objetivoPrincipal?: string | null;
}

export interface UpdateSurveyPayload {
  action: "update_survey";
  leadId: string;
  perfilAtuacao?: string | null;
  nivelIa?: string | null;
  objetivoPrincipal?: string | null;
}

function timeoutSignal(ms: number): AbortSignal | undefined {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  return undefined;
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function buildWelcomeEmailHtml(
  nome: string,
  magnet: MagnetEmailConfig
): string {
  const { firstName } = splitName(nome);
  const safeFirstName = escapeHtml(firstName || "tudo bem");
  const safeEyebrow = escapeHtml(magnet.eyebrow);
  const safeTitle = escapeHtml(magnet.title);
  const safeCta = escapeHtml(magnet.ctaLabel);
  const safeUrl = escapeHtml(magnet.destinationUrl);
  const itemsHtml = magnet.highlights
    .map(
      (item) =>
        `<li style="margin:0 0 10px 0;padding:0;color:#2C2F2B;font-size:15px;line-height:1.6;">${escapeHtml(
          item
        )}</li>`
    )
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(magnet.subject)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F2EFE9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#181A17;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#F2EFE9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#FAF8F4;border-radius:16px;overflow:hidden;border:1px solid #E5DEC9;">
            <tr>
              <td style="background-color:#0B0D0B;padding:28px 32px;border-bottom:2px solid #C9A84C;">
                <p style="margin:0;font-size:11px;letter-spacing:2.4px;text-transform:uppercase;color:#C9A84C;font-weight:600;">
                  Speculum Studio
                </p>
                <p style="margin:8px 0 0 0;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#B8B4A8;">
                  ${safeEyebrow}
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#181A17;">
                  Olá, ${safeFirstName}.
                </p>
                <p style="margin:0 0 20px 0;font-size:15px;line-height:1.65;color:#2C2F2B;">
                  Aqui está o link salvo do material completo, para você abrir com calma direto no computador sem perder a página no navegador do Instagram:
                </p>
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin:24px 0;">
                  <tr>
                    <td style="border-radius:10px;background-color:#0B0D0B;border:1px solid #C9A84C;">
                      <a href="${safeUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 24px;font-size:14px;font-weight:600;color:#F5E6B8;text-decoration:none;letter-spacing:0.3px;">
                        ${safeCta} &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 0 10px 0;font-size:13px;letter-spacing:1.4px;text-transform:uppercase;color:#8A6D22;font-weight:600;">
                  O que você encontra na página
                </p>
                <p style="margin:0 0 12px 0;font-size:17px;font-weight:600;color:#181A17;line-height:1.35;">
                  ${safeTitle}
                </p>
                <ul style="margin:0 0 24px 0;padding-left:20px;">
                  ${itemsHtml}
                </ul>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:#2C2F2B;">
                  Se surgir qualquer dúvida na hora de rodar no Claude Code ou no Codex, pode deixar um comentário no final da página ou responder este e-mail diretamente. Me conta qual entrega mais consome o seu tempo hoje: estamos definindo a ordem das próximas matérias e skills abertas a partir dessas respostas.
                </p>
                <p style="margin:24px 0 0 0;font-size:15px;line-height:1.6;color:#181A17;">
                  Bom trabalho por aí,<br />
                  <strong>Fabiano</strong> · Speculum Studio
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background-color:#F4F0E6;border-top:1px solid #E5DEC9;">
                <p style="margin:0;font-size:12px;line-height:1.55;color:#66635B;">
                  Você recebeu este e-mail porque solicitou o material gratuito em speculumstudio.com/acesso/${escapeHtml(
                    magnet.slug
                  )}.<br />
                  Link direto: <a href="${safeUrl}" style="color:#8A6D22;text-decoration:underline;">${safeUrl}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function buildWelcomeEmailText(
  nome: string,
  magnet: MagnetEmailConfig
): string {
  const { firstName } = splitName(nome);
  const greeting = firstName ? `Olá, ${firstName}.` : "Olá.";
  const bullets = magnet.highlights.map((item) => `- ${item}`).join("\n");

  return [
    greeting,
    "",
    "Aqui está o link salvo do material completo da Speculum Studio, para você abrir com calma direto no computador:",
    magnet.destinationUrl,
    "",
    `O que você encontra em "${magnet.title}":`,
    bullets,
    "",
    "Se surgir qualquer dúvida na hora de rodar no Claude Code ou no Codex, pode comentar no final da página ou responder este e-mail diretamente. Me conta qual entrega mais consome o seu tempo hoje.",
    "",
    "Bom trabalho por aí,",
    "Fabiano · Speculum Studio",
    "https://speculumstudio.com",
  ].join("\n");
}

function validatePayload(raw: unknown): {
  valid: true;
  data: CaptureLeadPayload;
  magnet: MagnetEmailConfig;
} | { valid: false; message: string } {
  if (!raw || typeof raw !== "object") {
    return { valid: false, message: "Requisição inválida." };
  }

  const input = raw as Record<string, unknown>;
  const slug = typeof input.slug === "string" ? input.slug.trim().toLowerCase() : "";
  const magnet = MAGNET_EMAILS[slug];
  if (!magnet) {
    return { valid: false, message: "Material não encontrado." };
  }

  const nome = typeof input.nome === "string" ? input.nome.trim() : "";
  if (nome.length < 2 || nome.length > 160) {
    return { valid: false, message: "Informe seu nome completo." };
  }

  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
    return { valid: false, message: "Informe um e-mail válido." };
  }

  const whatsapp =
    typeof input.whatsapp === "string" ? input.whatsapp.trim() : "";
  const digits = whatsapp.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) {
    return { valid: false, message: "Informe seu WhatsApp com DDD." };
  }

  if (input.consentLgpd !== true) {
    return { valid: false, message: "Confirme o aceite para liberar o acesso." };
  }

  const optStr = (value: unknown) =>
    typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

  return {
    valid: true,
    magnet,
    data: {
      slug,
      nome,
      email,
      whatsapp,
      consentLgpd: true,
      utmSource: optStr(input.utmSource),
      utmMedium: optStr(input.utmMedium),
      utmCampaign: optStr(input.utmCampaign),
      utmContent: optStr(input.utmContent),
      referrer: optStr(input.referrer),
      pagePath: optStr(input.pagePath),
      perfilAtuacao: optStr(input.perfilAtuacao, 100),
      nivelIa: optStr(input.nivelIa, 100),
      objetivoPrincipal: optStr(input.objetivoPrincipal, 120),
    },
  };
}

function validateSurveyPayload(raw: unknown): {
  valid: true;
  data: UpdateSurveyPayload;
} | { valid: false; message: string } {
  if (!raw || typeof raw !== "object") {
    return { valid: false, message: "Requisição inválida." };
  }
  const input = raw as Record<string, unknown>;
  const leadId = typeof input.leadId === "string" ? input.leadId.trim() : "";
  if (!leadId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(leadId)) {
    return { valid: false, message: "Identificador do lead inválido." };
  }
  const optStr = (v: unknown, maxLen = 120) =>
    typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, maxLen) : null;

  return {
    valid: true,
    data: {
      action: "update_survey",
      leadId,
      perfilAtuacao: optStr(input.perfilAtuacao, 100),
      nivelIa: optStr(input.nivelIa, 100),
      objetivoPrincipal: optStr(input.objetivoPrincipal, 120),
    },
  };
}

export async function POST(request: Request): Promise<Response> {
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "JSON inválido." }, 400);
  }

  // Se for atualizacao da pesquisa de qualificacao (Passo 2)
  if (rawBody && typeof rawBody === "object" && (rawBody as Record<string, unknown>).action === "update_survey") {
    const surveyCheck = validateSurveyPayload(rawBody);
    if (!surveyCheck.valid) {
      return jsonResponse({ ok: false, error: surveyCheck.message }, 400);
    }
    const { leadId, perfilAtuacao, nivelIa, objetivoPrincipal } = surveyCheck.data;

    try {
      const rpcRes = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/update_studio_lead_survey`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            p_lead_id: leadId,
            p_perfil_atuacao: perfilAtuacao ?? null,
            p_nivel_ia: nivelIa ?? null,
            p_objetivo_principal: objetivoPrincipal ?? null,
          }),
          signal: timeoutSignal(6000),
        }
      );
      if (rpcRes.ok) {
        return jsonResponse({ ok: true, updated: true });
      }
    } catch {
      // Falha silenciosa para nao interromper o fluxo do usuario
    }
    return jsonResponse({ ok: true, updated: false });
  }

  const validated = validatePayload(rawBody);
  if (!validated.valid) {
    return jsonResponse({ ok: false, error: validated.message }, 400);
  }

  const { data, magnet } = validated;

  // 1. Persistir no Supabase via RPC (fonte canônica + rate limit por e-mail)
  let leadId: string | null = null;
  try {
    const sbResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/rpc/capture_studio_lead`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          p_isca_slug: data.slug,
          p_nome: data.nome,
          p_email: data.email,
          p_whatsapp: data.whatsapp,
          p_consent_lgpd: true,
          p_utm_source: data.utmSource ?? null,
          p_utm_medium: data.utmMedium ?? null,
          p_utm_campaign: data.utmCampaign ?? null,
          p_utm_content: data.utmContent ?? null,
          p_referrer: data.referrer ?? null,
          p_page_path: data.pagePath ?? null,
        }),
        signal: timeoutSignal(8000),
      }
    );

    if (!sbResponse.ok) {
      const errBody = await sbResponse.json().catch(() => null);
      const errMessage =
        (errBody && typeof errBody.message === "string" && errBody.message) ||
        "Não foi possível registrar o seu acesso agora.";
      const status = sbResponse.status === 429 ? 429 : 400;
      return jsonResponse({ ok: false, error: errMessage }, status);
    }

    const sbData = await sbResponse.json().catch(() => null);
    if (sbData && typeof sbData.lead_id === "string") {
      leadId = sbData.lead_id;
    } else if (sbData && typeof sbData.id === "string") {
      leadId = sbData.id;
    }
  } catch {
    return jsonResponse(
      { ok: false, error: "Falha temporária ao registrar seu acesso. Tente novamente." },
      502
    );
  }

  // 2. Sincronizar com Resend (Audience da newsletter + e-mail imediato com o link)
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendAudienceId = process.env.RESEND_AUDIENCE_ID;
  const resendFrom =
    process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;
  const resendReplyTo =
    process.env.RESEND_REPLY_TO || DEFAULT_REPLY_TO;
  let audienceSynced = false;
  let emailSent = false;

  if (resendApiKey) {
    const { firstName, lastName } = splitName(data.nome);
    const headers = {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    };

    const tasks: Promise<void>[] = [];

    if (resendAudienceId) {
      tasks.push(
        fetch(
          `https://api.resend.com/audiences/${encodeURIComponent(
            resendAudienceId
          )}/contacts`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              email: data.email,
              first_name: firstName,
              last_name: lastName,
              unsubscribed: false,
            }),
            signal: timeoutSignal(6000),
          }
        )
          .then((res) => {
            if (res.ok) audienceSynced = true;
          })
          .catch(() => {})
      );
    }

    tasks.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers,
        body: JSON.stringify({
          from: resendFrom,
          to: [data.email],
          reply_to: resendReplyTo,
          subject: magnet.subject,
          html: buildWelcomeEmailHtml(data.nome, magnet),
          text: buildWelcomeEmailText(data.nome, magnet),
        }),
        signal: timeoutSignal(6000),
      })
        .then((res) => {
          if (res.ok) emailSent = true;
        })
        .catch(() => {})
    );

    await Promise.allSettled(tasks);
  }

  return jsonResponse({
    ok: true,
    leadId,
    emailSent,
    audienceSynced,
  });
}
