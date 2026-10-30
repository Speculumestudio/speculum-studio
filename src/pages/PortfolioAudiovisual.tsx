import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Clapperboard,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { featuredProjects, type PortfolioProject } from "@/data/portfolio";

export default function PortfolioAudiovisual() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({
    "40-anos-resistencia": true,
    "jardins-do-taquaral": true,
    "gashuku-resistencia": true,
  });
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const togglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingId === id) {
      video.pause();
      setPlayingId(null);
    } else {
      // Pause any other video playing
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

    const newMuted = !video.muted;
    video.muted = newMuted;
    setMutedStates((prev) => ({ ...prev, [id]: newMuted }));
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
    name: "Portfólio Audiovisual | Speculum Studio",
    description: "Trabalhos selecionados de produção audiovisual: 40 anos da Resistência, Jardins do Taquaral e Gashuku pela Speculum Studio.",
    url: "https://speculumstudio.com/portfolio/audiovisual",
    provider: {
      "@type": "ProfessionalService",
      name: "Speculum Studio",
      url: "https://speculumstudio.com",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Seo
        title="Portfólio Audiovisual | Trabalhos Selecionados | Speculum Studio"
        description="Projetos selecionados de produção audiovisual da Speculum Studio: 40 anos da Resistência, Jardins do Taquaral por Raphael Matheus e o documentário Gashuku."
        path="/portfolio/audiovisual"
        jsonLd={[portfolioJsonLd]}
      />
      <Navbar />

      <main className="flex-1">
        {/* INTRO HERO */}
        <section className="container-editorial pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border/60">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/servicos/producao-audiovisual"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar para o serviço de Produção Audiovisual
            </Link>
          </motion.div>

          <div className="mt-8 max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-xs uppercase tracking-[0.25em] text-primary mb-4 flex items-center gap-2"
            >
              <Clapperboard className="h-3.5 w-3.5" />
              <span>Portfólio · Trabalhos Selecionados</span>
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl leading-[1.05]"
            >
              Imagens em movimento com uma{" "}
              <span className="text-gradient-gold italic">razão para existir</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl"
            >
              Filmes dirigidos para marcas e projetos que valorizam contexto, presença e ritmo.
              Cada trabalho abaixo foi estruturado com intenção narrativa, captação cinematográfica e rigor estético.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8 flex flex-wrap items-center gap-4 text-xs tracking-wider uppercase text-muted-foreground"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Santos · São Paulo · Brasil
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm">
                <span>{featuredProjects.length} Produções em destaque</span>
              </span>
            </motion.div>
          </div>
        </section>

        {/* STACKING CARDS SECTION */}
        <section className="container-editorial py-16 md:py-24 relative">
          <div className="space-y-16 md:space-y-24">
            {featuredProjects.map((project, index) => {
              const isPlaying = playingId === project.id;
              const isMuted = mutedStates[project.id] ?? true;

              return (
                <div
                  key={project.id}
                  className="sticky top-20 md:top-24 transition-all duration-300"
                  style={{
                    zIndex: 10 + index,
                    paddingTop: `${index * 12}px`,
                  }}
                >
                  <article className="glass rounded-3xl p-6 sm:p-10 md:p-12 border border-border/80 shadow-[0_-20px_50px_rgba(0,0,0,0.85)] bg-card/95 backdrop-blur-xl relative overflow-hidden group">
                    {/* Background subtle radial glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    {/* TOP META & NUMBER */}
                    <div className="flex items-center justify-between border-b border-border/50 pb-5 mb-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(197,168,128,0.8)]" />
                        <span className="text-primary font-semibold">{project.categoryLabel}</span>
                        <span className="text-border">•</span>
                        <span>{project.client}</span>
                      </div>
                      <span className="font-mono text-sm text-primary font-bold">
                        0{index + 1} / 0{featuredProjects.length}
                      </span>
                    </div>

                    {/* 1. TÍTULO EM CIMA */}
                    <div>
                      <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
                        {project.title}
                      </h2>

                      {/* 2. BREVE EXPLICAÇÃO EM BAIXO */}
                      <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-4xl">
                        {project.explanation}
                      </p>
                    </div>

                    {/* 3. VÍDEO GRANDE EM BAIXO DISSO */}
                    <div className="mt-8 relative w-full aspect-[16/9] md:aspect-[16/9] lg:aspect-[21/10] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-2xl group/player">
                      {project.videoSrc ? (
                        <>
                          <video
                            ref={(el) => {
                              videoRefs.current[project.id] = el;
                            }}
                            src={project.videoSrc}
                            poster={project.poster || project.thumbnail}
                            loop
                            playsInline
                            muted={isMuted}
                            preload="metadata"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => togglePlay(project.id)}
                          />

                          {/* Central Play/Pause Overlay Button */}
                          <button
                            type="button"
                            onClick={() => togglePlay(project.id)}
                            className={`absolute inset-0 m-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-black/60 border border-primary/50 text-primary backdrop-blur-md shadow-2xl flex items-center justify-center transition-all duration-300 group-hover/player:scale-110 ${
                              isPlaying ? "opacity-0 hover:opacity-100" : "opacity-90"
                            }`}
                            aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                          >
                            {isPlaying ? (
                              <Pause className="h-7 w-7 sm:h-8 sm:w-8" />
                            ) : (
                              <Play className="h-7 w-7 sm:h-8 sm:w-8 ml-1" />
                            )}
                          </button>

                          {/* Bottom Control Bar */}
                          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                            <div className="flex items-center gap-2 pointer-events-auto">
                              <button
                                type="button"
                                onClick={(e) => toggleMute(project.id, e)}
                                className="h-10 w-10 rounded-full bg-black/70 border border-white/20 text-zinc-200 hover:text-primary hover:border-primary backdrop-blur-md flex items-center justify-center transition shadow-lg"
                                aria-label={isMuted ? "Ativar som" : "Desativar som"}
                              >
                                {isMuted ? (
                                  <VolumeX className="h-4 w-4" />
                                ) : (
                                  <Volume2 className="h-4 w-4" />
                                )}
                              </button>
                              {project.duration && (
                                <span className="text-xs font-mono font-medium px-3 py-2 rounded-full bg-black/70 border border-white/15 text-zinc-300 backdrop-blur-md">
                                  {project.duration}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pointer-events-auto">
                              <button
                                type="button"
                                onClick={(e) => toggleFullscreen(project.id, e)}
                                className="h-10 w-10 rounded-full bg-black/70 border border-white/20 text-zinc-200 hover:text-primary hover:border-primary backdrop-blur-md flex items-center justify-center transition shadow-lg"
                                aria-label="Tela cheia"
                              >
                                <Maximize2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Frame border highlight */}
                      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
                    </div>

                    {/* Card Footer CTA */}
                    <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Roteiro, Direção & Pós-produção · Speculum Studio
                      </p>
                      <Button asChild variant="outline" size="sm" className="w-fit">
                        <a
                          href={`https://wa.me/5513996158177?text=Ol%C3%A1!%20Vi%20o%20trabalho%20"${encodeURIComponent(project.title)}"%20no%20portf%C3%B3lio%20da%20Speculum%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto%20similar.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackEvent("generate_lead", { contact_method: "whatsapp", cta_location: `card_${project.id}` })}
                        >
                          Conversar sobre este projeto <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </section>

        {/* METHODOLOGY SECTION */}
        <section className="container-editorial py-16 md:py-24 border-t border-border/60">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">
            Critério Editorial
          </p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl max-w-3xl">
            Como direcionamos cada produção audiovisual.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl text-base md:text-lg leading-relaxed">
            Nenhum enquadramento existe por acaso. Nosso fluxo garante que a técnica
            esteja a serviço da intenção de comunicação da sua marca.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              {
                step: "01",
                title: "Roteiro & Pergunta Central",
                desc: "Definimos com clareza o que o vídeo precisa responder, para quem ele existe e qual a ação esperada de quem assiste.",
              },
              {
                step: "02",
                title: "Direção de Cena & Fala",
                desc: "Orientamos postura, dicção e naturalidade diante da lente, transformando conhecimento técnico em comunicação segura.",
              },
              {
                step: "03",
                title: "Captação Cinematográfica",
                desc: "Iluminação dramática com identidade própria, áudio direto cristalino e movimentos de câmera pensados para a mensagem.",
              },
              {
                step: "04",
                title: "Montagem & Color Grading",
                desc: "Edição rítmica, sonoplastia de impacto e tratamento de cor autoral que consolida a unidade visual da marca.",
              },
            ].map((item) => (
              <div key={item.step} className="glass rounded-xl p-6 border border-border/60">
                <span className="text-xs font-mono tracking-widest text-primary font-bold">
                  {item.step}
                </span>
                <h3 className="font-display text-2xl font-bold mt-3 text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CONVERSION CTA */}
        <section className="container-editorial py-20 md:py-28 text-center border-t border-border/60">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5 font-semibold">
            Início de Conversa
          </p>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl max-w-3xl mx-auto leading-tight">
            Vamos planejar a produção audiovisual da sua marca?
          </h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto text-base md:text-lg leading-relaxed">
            Conte o momento do seu negócio e o que você precisa comunicar em vídeo.
            A primeira conversa serve para desenhar o formato, roteiro e viabilidade técnica.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground shadow-glow">
              <a
                href="https://wa.me/5513996158177?text=Ol%C3%A1!%20Estive%20olhando%20o%20portf%C3%B3lio%20audiovisual%20da%20Speculum%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("generate_lead", { contact_method: "whatsapp", cta_location: "portfolio_audiovisual_final" })}
              >
                Conversar pelo WhatsApp <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/servicos/producao-audiovisual">Ver detalhes do serviço</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
