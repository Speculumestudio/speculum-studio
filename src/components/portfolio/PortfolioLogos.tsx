import React from "react";
import { motion } from "framer-motion";
import { partnerCompanies } from "@/data/portfolio";

export function PortfolioLogos() {
  return (
    <section className="relative w-full border-y border-border/60 bg-background/60 py-14 sm:py-18 overflow-hidden">
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-primary/90 mb-2 font-medium">
          Confiança & Parcerias
        </p>

        <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-center text-foreground max-w-2xl leading-tight">
          Empresas que acreditam no nosso olhar.
        </h3>
        
        <p className="mt-2 text-center text-sm text-muted-foreground max-w-xl leading-relaxed">
          Marcas e profissionais que confiaram sua presença, narrativa e estética à direção da Speculum Studio.
        </p>

        {/* Grid com Logotipos Oficiais dos Clientes */}
        <div className="mt-10 grid w-full grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {partnerCompanies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative flex flex-col items-center justify-center rounded-xl border border-border/50 bg-card/40 p-6 text-center transition-all duration-300 hover:border-primary/40 hover:bg-card/80 hover:shadow-sm"
            >
              {/* Logotipo Real */}
              <div className="flex h-12 w-full items-center justify-center">
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  loading="lazy"
                  className="max-h-11 max-w-[170px] w-auto object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </div>

              <div className="mt-3 pt-3 border-t border-border/30 w-full text-center">
                <h4 className="font-display text-xs font-semibold tracking-wide text-foreground">
                  {company.name}
                </h4>
                <p className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wider">
                  {company.scope}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
