import { useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, CheckCircle2, LockOpen, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Seo } from "@/components/Seo";
import { CaptureBrainVisual } from "@/components/CaptureBrainVisual";
import { getLeadMagnetBySlug } from "@/data/leadMagnets";
import { trackEvent } from "@/lib/analytics";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/logo-speculum.png";

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

const captureSchema = z.object({
  nome: z.string().trim().min(2, "Informe seu nome completo.").max(160),
  email: z.string().trim().email("Informe um e-mail válido.").max(255),
  whatsapp: z
    .string()
    .trim()
    .refine((val) => {
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "Informe seu WhatsApp com DDD."),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Confirme o aceite para liberar o acesso." }),
  }),
});

function formatWhatsapp(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const AccessCapture = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();

  const magnet = getLeadMagnetBySlug(slug);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  if (!magnet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
        <Seo
          title="Material não encontrado | Speculum Studio"
          description="Este link de acesso não está disponível no momento."
          path={location.pathname}
          noIndex
        />
        <img src={logo} alt="Speculum Studio" className="h-16 w-16 object-contain mb-6 opacity-90" />
        <p className="text-xs uppercase tracking-[0.25em] text-primary/80">Speculum Studio</p>
        <h1 className="font-display text-4xl mt-3">Material não encontrado.</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          O link que você abriu pode ter mudado de endereço. Você pode explorar todas as matérias abertas no estúdio.
        </p>
        <Link
          to="/explore"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-medium text-primary-foreground transition-transform duration-150 active:scale-[0.97]"
        >
          Explorar matérias
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting || unlocked) return;

    const parsed = captureSchema.safeParse({
      nome,
      email,
      whatsapp,
      consent,
    });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const utmSource = searchParams.get("utm_source");
      const utmMedium = searchParams.get("utm_medium");
      const utmCampaign = searchParams.get("utm_campaign");
      const utmContent = searchParams.get("utm_content");

      const payload = {
        slug: magnet.slug,
        nome: parsed.data.nome,
        email: parsed.data.email,
        whatsapp: parsed.data.whatsapp,
        consentLgpd: true,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
        pagePath: location.pathname,
      };

      let handledByApi = false;
      if (typeof fetch === "function") {
        try {
          const apiResponse = await fetch("/api/capture-lead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const contentType = apiResponse.headers.get("content-type") || "";

          if (contentType.includes("application/json")) {
            handledByApi = true;
            const apiBody = (await apiResponse.json().catch(() => null)) as {
              ok?: boolean;
              error?: string;
            } | null;
            if (!apiResponse.ok || !apiBody?.ok) {
              throw new Error(
                apiBody?.error || "Não foi possível registrar o seu acesso agora."
              );
            }
          }
        } catch (apiError: unknown) {
          if (handledByApi) {
            throw apiError;
          }
        }
      }

      if (!handledByApi) {
        const supabaseRpc = supabase as unknown as {
          rpc: (
            fn: string,
            args: Record<string, unknown>
          ) => Promise<{ data: unknown; error: { message?: string } | null }>;
        };

        const { error } = await supabaseRpc.rpc("capture_studio_lead", {
          p_isca_slug: payload.slug,
          p_nome: payload.nome,
          p_email: payload.email,
          p_whatsapp: payload.whatsapp,
          p_consent_lgpd: true,
          p_utm_source: payload.utmSource,
          p_utm_medium: payload.utmMedium,
          p_utm_campaign: payload.utmCampaign,
          p_utm_content: payload.utmContent,
          p_referrer: payload.referrer,
          p_page_path: payload.pagePath,
        });

        if (error) {
          throw new Error(error.message || "Não foi possível registrar o seu acesso agora.");
        }
      }

      try {
        localStorage.setItem(`speculum_unlocked_${magnet.slug}`, "1");
      } catch {
        // Armazenamento local pode ser restrito em navegadores internos.
      }

      trackEvent("generate_lead", {
        isca_slug: magnet.slug,
        utm_source: utmSource ?? "direto",
        utm_campaign: utmCampaign ?? magnet.slug,
      });

      setUnlocked(true);
      toast.success("Acesso liberado. Abrindo o material agora.");

      const nextParams = new URLSearchParams();
      nextParams.set("acesso", "liberado");
      if (utmSource) nextParams.set("utm_source", utmSource);
      if (utmCampaign) nextParams.set("utm_campaign", utmCampaign);

      window.setTimeout(() => {
        navigate(`${magnet.destinationPath}?${nextParams.toString()}`);
      }, prefersReduced ? 150 : 650);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Falha ao liberar o material. Tente novamente.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      <Seo
        title={magnet.seoTitle}
        description={magnet.seoDescription}
        path={`/acesso/${magnet.slug}`}
        image={magnet.ogImage}
        noIndex
      />

      {/* Atmosfera Speculum (verde profundo + halo dourado sutil) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 80% 0%, rgba(201,168,76,0.13), transparent 60%), radial-gradient(ellipse 65% 60% at 10% 90%, rgba(27,48,34,0.42), transparent 65%), linear-gradient(180deg, #090A08 0%, #060907 100%)",
        }}
      />

      {/* Topo mínimo sem menu para manter foco total na conversão */}
      <header className="w-full border-b border-white/[0.06] bg-black/25 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Speculum Studio"
              className="h-9 w-9 object-contain drop-shadow-[0_4px_14px_rgba(201,168,76,0.35)]"
            />
            <div className="leading-tight">
              <div className="font-display text-lg tracking-wide text-foreground">
                Speculum Studio
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary/80">
                Material Oficial
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10.5px] font-medium uppercase tracking-[0.16em] text-primary">
            <LockOpen className="h-3 w-3" />
            Acesso Gratuito
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-8 sm:px-8 sm:py-12 lg:py-14">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* Coluna esquerda: promessa + lista de entregáveis + visual dinâmico no desktop */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/[0.08] px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary">
                {magnet.eyebrow}
              </span>

              <h1 className="mt-4 font-display text-4xl leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-[54px]">
                {magnet.headline}{" "}
                <span className="text-gradient-gold italic">{magnet.highlight}</span>
              </h1>

              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {magnet.subheadline}
              </p>
            </motion.div>

            {/* Cartão de captura no mobile aparece antes da prévia animada para reduzir scroll */}
            <div className="lg:hidden">
              <CaptureFormCard
                idPrefix="mobile"
                magnet={magnet}
                nome={nome}
                email={email}
                whatsapp={whatsapp}
                consent={consent}
                submitting={submitting}
                unlocked={unlocked}
                prefersReduced={!!prefersReduced}
                onNomeChange={setNome}
                onEmailChange={setEmail}
                onWhatsappChange={(val) => setWhatsapp(formatWhatsapp(val))}
                onConsentChange={setConsent}
                onSubmit={handleSubmit}
              />
            </div>

            {/* Prévia animada do sistema */}
            <div>
              <CaptureBrainVisual />
            </div>

            {/* O que a pessoa libera */}
            <motion.ul
              initial={prefersReduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14, ease: EASE_OUT }}
              className="space-y-3 pt-1"
            >
              {magnet.deliverables.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary">
                    <Check className="h-3 w-3" />
                  </span>
                  <div className="text-sm leading-snug">
                    <div className="font-medium text-foreground">{item.label}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{item.detail}</div>
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Coluna direita (desktop): formulário de alta conversão */}
          <div className="hidden lg:block lg:col-span-6">
            <CaptureFormCard
              idPrefix="desktop"
              magnet={magnet}
              nome={nome}
              email={email}
              whatsapp={whatsapp}
              consent={consent}
              submitting={submitting}
              unlocked={unlocked}
              prefersReduced={!!prefersReduced}
              onNomeChange={setNome}
              onEmailChange={setEmail}
              onWhatsappChange={(val) => setWhatsapp(formatWhatsapp(val))}
              onConsentChange={setConsent}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.06] py-5 text-center text-xs text-muted-foreground/75">
        Speculum Studio · Criação, Marca e Sistemas de IA
      </footer>
    </div>
  );
};

interface CaptureFormCardProps {
  idPrefix: string;
  magnet: NonNullable<ReturnType<typeof getLeadMagnetBySlug>>;
  nome: string;
  email: string;
  whatsapp: string;
  consent: boolean;
  submitting: boolean;
  unlocked: boolean;
  prefersReduced: boolean;
  onNomeChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onWhatsappChange: (value: string) => void;
  onConsentChange: (value: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

function CaptureFormCard({
  idPrefix,
  magnet,
  nome,
  email,
  whatsapp,
  consent,
  submitting,
  unlocked,
  prefersReduced,
  onNomeChange,
  onEmailChange,
  onWhatsappChange,
  onConsentChange,
  onSubmit,
}: CaptureFormCardProps) {
  const nomeId = `${idPrefix}-capture-nome`;
  const emailId = `${idPrefix}-capture-email`;
  const whatsId = `${idPrefix}-capture-whatsapp`;
  const consentId = `${idPrefix}-capture-consent`;
  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.08, ease: EASE_OUT }}
      className="relative rounded-3xl border border-primary/25 bg-[#0F120F]/90 p-6 sm:p-8 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9),0_0_50px_-20px_rgba(201,168,76,0.22)] backdrop-blur-xl"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
      />

      <div className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-primary">
          Desbloqueio imediato
        </p>
        <h2 className="mt-1.5 font-display text-3xl leading-tight text-foreground">
          Para onde enviamos o seu acesso?
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Preencha os 3 campos abaixo para abrir o tutorial completo com o mapa e os comandos prontos.
        </p>
      </div>

      {unlocked ? (
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className="rounded-2xl border border-emerald-400/35 bg-emerald-950/35 p-6 text-center"
        >
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
          <h3 className="mt-3 font-display text-2xl text-foreground">Acesso liberado!</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Abrindo o material completo agora...
          </p>
        </motion.div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor={nomeId} className="text-xs uppercase tracking-[0.14em] text-foreground/85">
              Nome completo *
            </Label>
            <Input
              id={nomeId}
              name="nome"
              type="text"
              autoComplete="name"
              required
              placeholder="Como podemos te chamar?"
              value={nome}
              onChange={(e) => onNomeChange(e.target.value)}
              className="h-12 rounded-xl border-white/10 bg-black/40 text-foreground placeholder:text-muted-foreground/60 transition-colors duration-150 focus-visible:border-primary/70 focus-visible:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={emailId} className="text-xs uppercase tracking-[0.14em] text-foreground/85">
              Seu melhor e-mail *
            </Label>
            <Input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="voce@seudominio.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className="h-12 rounded-xl border-white/10 bg-black/40 text-foreground placeholder:text-muted-foreground/60 transition-colors duration-150 focus-visible:border-primary/70 focus-visible:ring-primary/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={whatsId} className="text-xs uppercase tracking-[0.14em] text-foreground/85">
              WhatsApp com DDD *
            </Label>
            <Input
              id={whatsId}
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="(13) 99999-9999"
              value={whatsapp}
              onChange={(e) => onWhatsappChange(e.target.value)}
              className="h-12 rounded-xl border-white/10 bg-black/40 text-foreground placeholder:text-muted-foreground/60 transition-colors duration-150 focus-visible:border-primary/70 focus-visible:ring-primary/30"
            />
          </div>

          <div className="flex items-start gap-2.5 pt-1">
            <Checkbox
              id={consentId}
              checked={consent}
              onCheckedChange={(checked) => onConsentChange(checked === true)}
              className="mt-0.5 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <label
              htmlFor={consentId}
              className="cursor-pointer text-xs leading-relaxed text-muted-foreground"
            >
              Concordo em receber o acesso ao material e atualizações práticas da Speculum Studio.
            </label>
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={prefersReduced ? undefined : { y: -1 }}
            whileTap={prefersReduced ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="group relative mt-2 flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-gold px-6 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground shadow-[0_12px_36px_-10px_rgba(201,168,76,0.55)] transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            <span className="relative z-10">
              {submitting ? "Liberando acesso..." : magnet.ctaLabel}
            </span>
            {!submitting && (
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            )}
          </motion.button>

          <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[11.5px] text-muted-foreground/85">
            <ShieldCheck className="h-3.5 w-3.5 text-primary/80" />
            {magnet.trustNote}
          </p>
        </form>
      )}
    </motion.div>
  );
}

export default AccessCapture;
