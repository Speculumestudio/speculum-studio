import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  allPortfolioProjects,
  portfolioCategories,
  type PortfolioCategory,
  type PortfolioProject,
} from "@/data/portfolio";
import { PortfolioLogos } from "@/components/portfolio/PortfolioLogos";
import { PortfolioTestimonials } from "@/components/portfolio/PortfolioTestimonials";

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory>("todos");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const filteredProjects = selectedCategory === "todos"
    ? allPortfolioProjects
    : allPortfolioProjects.filter((p) => p.category === selectedCategory);

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      // Pause any other video currently playing
      Object.entries(videoRefs.current).forEach(([otherId, otherVideo]) => {
        if (otherId !== id && otherVideo && !otherVideo.paused) {
          otherVideo.pause();
        }
      });
      video.play().catch(() => {});
      setPlayingId(id);
      trackEvent("play_portfolio_video", { project_id: id });
    }
  };

  const toggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    const currentMuted = video.muted;
    video.muted = !currentMuted;
    setMutedStates((prev) => ({ ...prev, [id]: !currentMuted }));
  };

  const toggleFullscreen = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const portfolioJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Portfólio de Trabalhos Selecionados | Speculum Studio",
    description: "Projetos em construção de marca, produção audiovisual, retratos e conteúdo desenvolvidos pela Speculum Studio.",
    url: "https://speculumstudio.com/portfolio",
    provider: {
      "@type": "ProfessionalService",
      name: "Speculum Studio",
      url: "https://speculumstudio.com",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Seo
        title="Portfólio · Trabalhos Selecionados | Speculum Studio"
        description="Conheça nossos trabalhos em construção de marca, produção audiovisual, retratos de autoridade e conteúdo estratégico."
        path="/portfolio"
        jsonLd={[portfolioJsonLd]}
      />
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="container-editorial pt-12 pb-14 md:pt-20 md:pb-20 border-b border-border/60">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/nosso-estudio"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Conhecer o nosso estúdio
            </Link>
          </motion.div>

          <div className="mt-8 max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-xs uppercase tracking-[0.25em] text-primary mb-4 font-medium"
            >
              Portfólio · Trabalhos Selecionados
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-foreground"
            >
              Imagens, marcas e narrativas com uma{" "}
              <span className="italic text-primary font-normal">razão para existir.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl"
            >
              Cada projeto abaixo foi planejado a partir do contexto real do cliente, combinando rigor técnico,
              clareza de posicionamento e acabamento de estúdio em todas as disciplinas de comunicação.
            </motion.p>
          </div>

          {/* CATEGORY FILTER TABS (Cores Canônicas do Design System) */}
          <div className="mt-10 flex flex-wrap gap-2 sm:gap-3">
            {portfolioCategories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                    active
                      ? "bg-secondary text-primary border border-primary/50 shadow-sm"
                      : "bg-card/40 text-muted-foreground border border-border/60 hover:text-foreground hover:border-border"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* LOGOS REAIS DAS EMPRESAS PARCEIRAS */}
        <PortfolioLogos />

        {/* PROJECTS SHOWCASE GRID (Sem tags poluídas, proporções regulares) */}
        <section className="container-editorial py-16 sm:py-24">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-border/50">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-1">
                Catálogo de Produções
              </p>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground">
                {portfolioCategories.find((c) => c.id === selectedCategory)?.label}
              </h2>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {filteredProjects.length} {filteredProjects.length === 1 ? "projeto" : "projetos"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const isVideo = Boolean(project.videoSrc);
                const isPlaying = playingId === project.id;
                const isMuted = mutedStates[project.id] ?? true;

                return (
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.35, delay: index * 0.04 }}
                    className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/60 transition-all duration-300 hover:border-primary/40 hover:bg-card/90"
                  >
                    {/* CONTAINER DE MÍDIA EDITORIAL (Sem cortes de enquadramento) */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 flex items-center justify-center">
                      {project.format === "vertical" ? (
                        <>
                          {/* Ambient glow backdrop para mídias verticais */}
                          <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            <img
                              src={project.poster || project.thumbnail}
                              alt=""
                              aria-hidden="true"
                              className="w-full h-full object-cover blur-2xl opacity-35 scale-125"
                            />
                          </div>

                          {isVideo ? (
                            <video
                              ref={(el) => (videoRefs.current[project.id] = el)}
                              src={project.videoSrc}
                              poster={project.poster}
                              preload="none"
                              playsInline
                              muted={isMuted}
                              loop
                              className="relative z-10 h-full w-auto max-h-full aspect-[9/16] object-contain shadow-2xl cursor-pointer"
                              onClick={() => togglePlay(project.id)}
                            />
                          ) : (
                            <img
                              src={project.thumbnail}
                              alt={project.title}
                              loading="lazy"
                              decoding="async"
                              className="relative z-10 h-full w-auto max-h-full aspect-[9/16] object-contain shadow-2xl"
                            />
                          )}
                        </>
                      ) : isVideo ? (
                        <video
                          ref={(el) => (videoRefs.current[project.id] = el)}
                          src={project.videoSrc}
                          poster={project.poster}
                          preload="none"
                          playsInline
                          muted={isMuted}
                          loop
                          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102 cursor-pointer"
                          onClick={() => togglePlay(project.id)}
                        />
                      ) : (
                        <div className="relative h-full w-full">
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            loading="lazy"
                            decoding="async"
                            style={project.objectPosition ? { objectPosition: project.objectPosition } : undefined}
                            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-50" />
                        </div>
                      )}

                      {/* Controles de Vídeo (Play, Pause, Som, Tela Cheia) */}
                      {isVideo && (
                        <>
                          {/* Overlay Gradiente Suave */}
                          <div
                            className={`absolute inset-0 z-15 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${
                              isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-80"
                            }`}
                          />

                          {/* Botão Central de Play/Pause */}
                          <button
                            onClick={() => togglePlay(project.id)}
                            aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex h-14 w-14 items-center justify-center rounded-full border border-primary/70 bg-black/60 text-primary backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-108 hover:bg-primary hover:text-primary-foreground ${
                              isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100 scale-100"
                            }`}
                          >
                            {isPlaying ? (
                              <Pause className="h-5 w-5 fill-current" />
                            ) : (
                              <Play className="h-5 w-5 fill-current translate-x-0.5" />
                            )}
                          </button>

                          {/* Controles de Áudio e Duração */}
                          <div className="absolute bottom-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between text-white pointer-events-none">
                            <div className="flex items-center gap-2 pointer-events-auto">
                              <button
                                onClick={(e) => toggleMute(project.id, e)}
                                aria-label={isMuted ? "Ativar som" : "Desativar som"}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-zinc-300 backdrop-blur-md border border-white/10 hover:text-white transition-colors"
                              >
                                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                              </button>
                              {project.duration && (
                                <span className="rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-mono tracking-wider backdrop-blur-md border border-white/10 text-zinc-300">
                                  {project.duration}
                                </span>
                              )}
                            </div>

                            <button
                              onClick={(e) => toggleFullscreen(project.id, e)}
                              aria-label="Tela cheia"
                              className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-zinc-300 backdrop-blur-md border border-white/10 hover:text-white transition-colors"
                            >
                              <Maximize2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* CORPO DO CARTÃO EDITORIAL (Sem tags redundantes) */}
                    <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
                          {project.client}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {project.profession}
                        </p>

                        <h3 className="mt-2.5 font-display text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {project.title}
                        </h3>

                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                          {project.explanation}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                        <Link
                          to={`/servicos/${project.serviceSlug}`}
                          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary hover:text-foreground transition-colors"
                        >
                          <span>Conhecer este serviço</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </section>

        {/* SEÇÃO DE DEPOIMENTOS */}
        <PortfolioTestimonials />

        {/* SEÇÃO FINAL DE CONVERSÃO */}
        <section className="container-editorial py-16 sm:py-24">
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-8 sm:p-14 text-center">
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3 font-medium">
                Próximo Passo · Speculum Studio
              </p>

              <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-foreground leading-tight">
                Pronto para posicionar seu trabalho com direção de estúdio?
              </h2>

              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Seja para reformular a identidade da sua marca, produzir vídeos institucionais, registrar retratos
                de autoridade ou construir uma esteira contínua de conteúdo, nossa equipe organiza o escopo ideal para o seu momento.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary text-primary-foreground font-semibold tracking-wider hover:opacity-90 shadow-sm"
                >
                  <a
                    href="https://wa.me/5513996158177?text=Ol%C3%A1%2C%20gostaria%20de%20conversar%20sobre%20um%20projeto%20com%20a%20Speculum%20Studio."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Conversar via WhatsApp <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>

                <Button asChild size="lg" variant="outline" className="border-border/70 text-foreground hover:bg-card">
                  <Link to="/nosso-estudio#servicos">
                    Explorar todos os serviços
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
