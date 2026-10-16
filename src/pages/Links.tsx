import { Globe2, Instagram, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Seo } from "@/components/Seo";
import { trackEvent } from "@/lib/analytics";
import bookclothTexture from "@/assets/speculum-bookcloth-texture.webp";
import printMaterials from "@/assets/speculum-print-materials-v11.webp";

const whatsappUrl =
  "https://wa.me/5513996158177?text=Ol%C3%A1%2C%20Speculum.%20Quero%20conversar%20sobre%20um%20projeto.";

const links = [
  {
    label: "Construção de marca",
    detail: "Posicionamento, identidade e narrativa",
    to: "/servicos/construcao-de-marca",
  },
  {
    label: "Produção audiovisual",
    detail: "Filmes, vídeos e histórias em movimento",
    to: "/servicos/producao-audiovisual",
  },
  {
    label: "Retratos profissionais",
    detail: "Imagem dirigida para pessoas e marcas",
    to: "/servicos/retratos-profissionais",
  },
  {
    label: "Matérias e referências",
    detail: "Conteúdo sobre marca, imagem e criação",
    to: "/explore",
  },
];

const Links = () => (
  <main className="min-h-screen bg-background text-foreground">
    <Seo
      title="Links | Speculum Studio"
      description="Canais e caminhos para conhecer a Speculum Studio."
      path="/links"
      image="/covers/cover-estudio.webp"
      noIndex
    />

    <section className="relative isolate min-h-screen overflow-hidden bg-[#091A14] pb-10 sm:pb-14">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_38rem,rgba(212,175,55,0.055),transparent_32rem),linear-gradient(180deg,#0D241C_0%,#091A14_56%,#050F0C_100%)]" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.28] brightness-[0.68] saturate-[0.92]"
        style={{
          backgroundImage: `url(${bookclothTexture})`,
          backgroundRepeat: "repeat",
          backgroundSize: "360px 360px",
        }}
        aria-hidden="true"
      />

      <div className="relative w-full overflow-hidden">
        <img
          className="aspect-[16/9] w-full object-cover"
          src={printMaterials}
          alt="Materiais impressos da Speculum Studio"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 48%, rgba(0,0,0,0.94) 62%, rgba(0,0,0,0.72) 76%, rgba(0,0,0,0.34) 90%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 48%, rgba(0,0,0,0.94) 62%, rgba(0,0,0,0.72) 76%, rgba(0,0,0,0.34) 90%, transparent 100%)",
          }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-col items-center px-5 sm:px-8">
        <Link className="-mt-12 relative z-10" to="/" aria-label="Ir para o site da Speculum Studio">
          <Logo size={112} withWordmark={false} className="justify-center" />
        </Link>
        <p className="mt-4 text-center text-[0.66rem] uppercase tracking-[0.3em] text-[#D4AF37]">
          Marca · imagem · criação
        </p>
        <h1 className="mt-3 text-center font-display text-5xl leading-[0.88] text-[#F4F1EA] sm:text-6xl">
          Speculum <span className="italic text-[#D4AF37]">Studio</span>
        </h1>
        <p className="mt-5 max-w-md text-center text-sm leading-relaxed text-[#F4F1EA]/72 sm:text-base">
          Construção de marca, conteúdo, fotografia e audiovisual para tornar
          uma ideia mais clara, coerente e reconhecível.
        </p>

        <div className="mt-6 flex items-center gap-5 text-[#F4F1EA]/70" aria-label="Canais da Speculum">
          <a
            className="transition-colors hover:text-[#D4AF37]"
            href="https://www.instagram.com/studiospeculum/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da Speculum"
            onClick={() => trackEvent("social_click", { platform: "instagram", cta_location: "links_social_top" })}
          >
            <Instagram className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
          <a
            className="transition-colors hover:text-[#D4AF37]"
            href="mailto:contato@speculumstudio.com"
            aria-label="E-mail da Speculum"
            onClick={() => trackEvent("generate_lead", { contact_method: "email", cta_location: "links_social_top" })}
          >
            <Mail className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
          <Link className="transition-colors hover:text-[#D4AF37]" to="/" aria-label="Site da Speculum">
            <Globe2 className="h-[18px] w-[18px]" aria-hidden="true" />
          </Link>
          <a
            className="transition-colors hover:text-[#D4AF37]"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp da Speculum"
            onClick={() => trackEvent("generate_lead", { contact_method: "whatsapp", cta_location: "links_social_top" })}
          >
            <MessageCircle className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
        </div>

        <div className="mt-7 flex w-36 items-center gap-3 text-[#D4AF37]/65" aria-hidden="true">
          <span className="h-px flex-1 bg-current" />
          <span className="text-[0.6rem]">✦</span>
          <span className="h-px flex-1 bg-current" />
        </div>

        <a
          className="mt-7 flex w-full items-center justify-center border border-[#D4AF37]/35 bg-[#1A3A2E]/92 px-5 py-4 text-center text-[#F4F1EA] shadow-[0_10px_30px_rgba(4,15,11,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/65 hover:bg-[#214738]"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("generate_lead", { contact_method: "whatsapp", cta_location: "links_primary" })}
        >
          <span>
            <strong className="block text-sm font-semibold uppercase tracking-[0.08em]">Conversar sobre um projeto</strong>
            <small className="mt-1 block text-xs text-[#F4F1EA]/60">WhatsApp direto com a Speculum</small>
          </span>
        </a>

        <nav className="mt-3 flex w-full flex-col gap-3" aria-label="Caminhos da Speculum">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group flex items-center justify-center border border-[#F4F1EA]/14 bg-[#1A3A2E]/78 px-5 py-4 text-center text-[#F4F1EA] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/55 hover:bg-[#214738]"
            >
              <span>
                <strong className="block text-sm font-medium uppercase tracking-[0.08em]">{item.label}</strong>
                <small className="mt-1 block text-xs text-[#F4F1EA]/58">{item.detail}</small>
              </span>
            </Link>
          ))}
        </nav>

        <p className="mt-9 text-center text-[0.62rem] uppercase tracking-[0.22em] text-[#F4F1EA]/45">
          speculumstudio.com · @studiospeculum
        </p>
      </div>
    </section>
  </main>
);

export default Links;
