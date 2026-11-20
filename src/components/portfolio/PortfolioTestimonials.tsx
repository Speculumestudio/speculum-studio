import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Quote, ArrowRight } from "lucide-react";
import { clientTestimonials, type Testimonial } from "@/data/portfolio";

export interface PortfolioTestimonialsProps {
  items?: Testimonial[];
  serviceSlug?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  showPortfolioLink?: boolean;
  className?: string;
}

export function PortfolioTestimonials({
  items,
  serviceSlug,
  eyebrow = "Voz de Quem Viveu o Processo",
  title = "A percepção construída na prática.",
  subtitle = "O impacto real de um trabalho feito com intenção, pesquisa e acabamento de estúdio relatado por quem esteve conosco.",
  showPortfolioLink = false,
  className = "",
}: PortfolioTestimonialsProps) {
  const displayItems = React.useMemo(() => {
    if (items && items.length > 0) return items;
    if (serviceSlug) {
      const matched = clientTestimonials.filter((t) =>
        t.serviceSlugs.includes(serviceSlug)
      );
      if (matched.length >= 3) return matched.slice(0, 3);
      const remaining = clientTestimonials.filter(
        (t) => !t.serviceSlugs.includes(serviceSlug)
      );
      return [...matched, ...remaining].slice(0, 3);
    }
    return clientTestimonials;
  }, [items, serviceSlug]);

  return (
    <section
      className={`relative w-full bg-background py-16 sm:py-24 border-t border-border/60 overflow-hidden ${className}`}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/90 mb-2 font-medium">
          {eyebrow}
        </p>

        <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-center text-foreground max-w-3xl leading-tight">
          {title}
        </h3>

        <p className="mt-3 text-center text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          {subtitle}
        </p>

        {/* Grid de Depoimentos */}
        <div className="mt-12 grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayItems.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card/50 p-6 sm:p-7 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-card/80"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-primary">
                  {t.service}
                </span>
                <Quote className="h-5 w-5 text-primary/30 transition-colors group-hover:text-primary/70" />
              </div>

              <blockquote className="flex-1 font-serif text-base leading-relaxed text-foreground/90 italic">
                “{t.quote}”
              </blockquote>

              <div className="mt-6 flex items-center gap-3.5 border-t border-border/40 pt-4">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-primary/30 bg-muted">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-105 group-hover:grayscale-0"
                  />
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold tracking-wide text-foreground">
                    {t.name}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-snug">
                    {t.profession}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {showPortfolioLink && (
          <div className="mt-10">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary hover:text-foreground transition-colors"
            >
              <span>Ver portfólio completo e empresas parceiras</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
