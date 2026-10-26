import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface ServiceItem {
  tag?: string;
  titleLine1: string;
  titleLine2?: string;
  desc?: string;
  img: string;
  ctaText?: string;
  ctaUrl: string;
}

export interface ServicesSectionProps {
  items: ServiceItem[];
  sectionLabel?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ServicesSection({
  items,
  sectionLabel = "Serviços",
  title = "O que construímos para marcas e negócios.",
  subtitle = "Direção, imagem e narrativa para posicionar sua empresa com clareza estratégica e acabamento de estúdio.",
  className = "",
}: ServicesSectionProps) {
  if (!items.length) return null;

  return (
    <section className={`relative w-full overflow-hidden bg-[#0c0a09] py-20 text-white select-none ${className}`}>
      {/* Background glow ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#c5a880]/5 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,10,9,.3),rgba(12,10,9,.98)_85%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6">
        {/* Label with gold lines */}
        <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[.3em] text-[#c5a880]">
          <span className="h-px w-9 bg-gradient-to-r from-transparent to-[#c5a880]" />
          {sectionLabel}
          <span className="h-px w-9 bg-gradient-to-r from-[#c5a880] to-transparent" />
        </div>

        {/* Section Heading */}
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-center text-white max-w-3xl leading-tight">
          {title}
        </h2>

        {/* Section Subtitle */}
        {subtitle && (
          <p className="mt-4 text-center text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Grid of Cards - 100% Clickable & Visual (Inspiração Mahara Digital) */}
        <div className="mt-12 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const cleanSubtitle = item.titleLine2?.replace(/^[–—\-]\s*/, "");
            return (
              <Link
                key={`${item.titleLine1}-${index}`}
                to={item.ctaUrl}
                aria-label={`${item.titleLine1} - ${cleanSubtitle || "Ver serviço"}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161311]/90 backdrop-blur-md shadow-2xl transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#c5a880]/60 hover:bg-[#1a1614] hover:shadow-[0_20px_45px_rgba(197,168,128,0.16)]"
              >
                {/* Visual Image Header */}
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-black/50">
                  <img
                    src={item.img}
                    alt={item.titleLine1}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  {/* Subtle dark gradient overlay to anchor image into card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-black/25 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-65" />

                  {/* Category Tag Badge */}
                  {item.tag && (
                    <span className="absolute top-3.5 right-3.5 rounded-full border border-white/15 bg-black/65 backdrop-blur-md px-3 py-1 text-[11px] font-semibold tracking-wider text-[#c5a880] uppercase shadow-md">
                      {item.tag}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    {cleanSubtitle && (
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c5a880]">
                        {cleanSubtitle}
                      </p>
                    )}
                    <h3 className="mt-1 font-display text-xl font-bold uppercase leading-snug tracking-wide text-white transition-colors duration-300 group-hover:text-[#e4cfb3]">
                      {item.titleLine1}
                    </h3>
                    <div className="my-3 h-0.5 w-8 rounded bg-[#c5a880]/50 transition-all duration-300 group-hover:w-14 group-hover:bg-[#c5a880]" />
                    <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
                      {item.desc}
                    </p>
                  </div>

                  {/* Card Footer Link CTA */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs font-extrabold uppercase tracking-[0.16em] text-[#c5a880] transition-colors duration-300 group-hover:text-white">
                    <span>{item.ctaText || "Ver serviço"}</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#c5a880]/40 bg-[#c5a880]/10 text-sm text-[#c5a880] transition-all duration-300 group-hover:border-[#c5a880] group-hover:bg-[#c5a880] group-hover:text-[#110d0c] group-hover:translate-x-1">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
