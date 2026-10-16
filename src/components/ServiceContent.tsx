import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { services, type ServiceDefinition } from "@/data/services";

const portraitPortfolio = [
  {
    src: "https://assets.zyrosite.com/m5Kvj54gbpTW2gLw/02112023-img_8328-Awv9DqlVn8HPMjz1.jpg",
    alt: "Retrato profissional em estúdio",
    label: "Retrato profissional",
  },
  {
    src: "https://assets.zyrosite.com/m5Kvj54gbpTW2gLw/16012024-img_9458-AoPe1JZreVUG4la1.jpg",
    alt: "Retrato autoral com direção de luz",
    label: "Direção de luz",
  },
  {
    src: "https://assets.zyrosite.com/m5Kvj54gbpTW2gLw/humberto-cordella-9-m2WEaewBJGsKBpGL.jpg",
    alt: "Retrato editorial em preto e branco",
    label: "Retrato editorial",
  },
  {
    src: "https://assets.zyrosite.com/m5Kvj54gbpTW2gLw/retrato-luiz-alta-fundo-1-AVLJnvR8xET5Qle8.jpg",
    alt: "Retrato profissional com fundo escuro",
    label: "Identidade em cena",
  },
];


// Shared by the browser and the build so crawlers receive the same visible service text.
export function ServiceContent({ service }: { service: ServiceDefinition }) {
  const [isMuted, setIsMuted] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
      <main>
        <section className="container-editorial pt-12 pb-16 md:pt-20 md:pb-24">
          <Link to="/nosso-estudio#servicos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Todos os serviços
          </Link>

          {service.slug === "producao-audiovisual" ? (
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-14 items-center mt-12">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">{service.eyebrow}</p>
                <h1 className="font-display text-5xl md:text-7xl leading-[1.02]">{service.title}</h1>
                <p className="mt-7 text-lg md:text-xl text-muted-foreground leading-relaxed">{service.lead}</p>
                {service.location && <p className="mt-5 text-sm text-muted-foreground max-w-2xl leading-relaxed">{service.location}</p>}
                <Button asChild size="lg" className="mt-9">
                  <a href="https://wa.me/5513996158177" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("generate_lead", { contact_method: "whatsapp", cta_location: `${service.slug}_hero` })}>Conversar sobre este projeto <ArrowUpRight className="ml-2 h-4 w-4" /></a>
                </Button>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-card">
                  <video
                    ref={videoRef}
                    src="/media/producao-audiovisual-reel.mp4"
                    poster="/media/producao-audiovisual-poster.webp"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground select-none">
                    Reel / Speculum
                  </div>
                  <button
                    type="button"
                    onClick={toggleAudio}
                    className="absolute bottom-4 right-4 z-10 flex items-center justify-center h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border/60 text-foreground hover:bg-background transition shadow-lg"
                    aria-label={isMuted ? "Ativar som do vídeo" : "Desativar som do vídeo"}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <div className="absolute inset-0 pointer-events-none rounded-2xl ring-1 ring-inset ring-foreground/10" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mt-12 mb-5">{service.eyebrow}</p>
              <h1 className="font-display text-5xl md:text-7xl max-w-4xl leading-[1.02]">{service.title}</h1>
              <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">{service.lead}</p>
              {service.location && <p className="mt-5 text-sm text-muted-foreground max-w-2xl leading-relaxed">{service.location}</p>}
              <Button asChild size="lg" className="mt-9">
                <a href="https://wa.me/5513996158177" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("generate_lead", { contact_method: "whatsapp", cta_location: `${service.slug}_hero` })}>Conversar sobre este projeto <ArrowUpRight className="ml-2 h-4 w-4" /></a>
              </Button>
            </>
          )}
        </section>

        {service.slug === "retratos-profissionais" && (
          <section className="container-editorial pb-16 md:pb-24 border-t border-border">
            <div className="pt-14 md:pt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Retratos / Portfólio</p>
                <h2 className="font-display text-4xl md:text-5xl max-w-2xl">Seu trabalho já tem valor. Sua imagem precisa torná-lo visível.</h2>
              </div>
              <p className="text-muted-foreground max-w-md leading-relaxed">Uma seleção de retratos dirigidos para apresentar profissionais com identidade, contexto e coerência com o trabalho que realizam.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {portraitPortfolio.map((portrait) => (
                <figure key={portrait.src} className="group">
                  <div className="aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                    <img src={portrait.src} alt={portrait.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <figcaption className="mt-3 text-sm text-muted-foreground">{portrait.label}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

        <section className="container-editorial py-14 md:py-20 border-t border-border grid md:grid-cols-[0.8fr_1.2fr] gap-8 md:gap-16">
          <div><p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Nosso ponto de partida</p><h2 className="font-display text-4xl md:text-5xl">Forma com intenção.</h2></div>
          <p className="text-lg text-muted-foreground leading-relaxed">{service.principle}</p>
        </section>

        <section className="container-editorial py-16 md:py-24 grid lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Quando faz sentido</p>
            <h2 className="font-display text-4xl md:text-5xl">Este trabalho pode ajudar quando...</h2>
            <ul className="mt-8 space-y-5">{service.fit.map((item) => <li key={item} className="flex gap-3 leading-relaxed"><Check className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span>{item}</span></li>)}</ul>
          </div>
          <div className="glass rounded-2xl p-7 md:p-10">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">O que pode fazer parte</p>
            <h2 className="font-display text-3xl md:text-4xl">Um escopo construído para o desafio.</h2>
            <ul className="mt-8 divide-y divide-border">{service.inclusions.map((item) => <li key={item} className="py-4 flex items-start gap-3"><span className="text-primary">+</span><span>{item}</span></li>)}</ul>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">A combinação final de entregas é definida depois de entendermos o contexto, as prioridades e as condições do projeto.</p>
          </div>
        </section>

        {service.applications && (
          <section className="container-editorial py-16 md:py-24 border-t border-border" aria-labelledby="applications-title">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Aplicações</p>
            <h2 id="applications-title" className="font-display text-4xl md:text-5xl">O formato acompanha o que precisa ser mostrado.</h2>
            <div className="grid md:grid-cols-2 gap-8 mt-10">{service.applications.map((item) => <article key={item.title} className="border-t border-border pt-6"><h3 className="font-display text-3xl">{item.title}</h3><p className="mt-4 text-muted-foreground leading-relaxed">{item.description}</p></article>)}</div>
            {service.slug === "producao-audiovisual" && <Link to="/servicos/fotografia-comercial" className="inline-flex items-center gap-2 mt-8 text-primary hover:underline">Fotografia de produtos e gastronomia <ArrowRight className="h-4 w-4" /></Link>}
            {service.slug === "fotografia-comercial" && <Link to="/servicos/producao-audiovisual" className="inline-flex items-center gap-2 mt-8 text-primary hover:underline">Conhecer a produção audiovisual <ArrowRight className="h-4 w-4" /></Link>}
          </section>
        )}

        <section className="container-editorial py-16 md:py-24 border-t border-border">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Como acontece</p>
          <h2 className="font-display text-4xl md:text-5xl">Do contexto à entrega.</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">{service.steps.map((step, index) => <article key={step.title} className="border-t border-border pt-5"><p className="text-xs tracking-widest text-primary">0{index + 1}</p><h3 className="font-display text-3xl mt-4">{step.title}</h3><p className="mt-3 text-muted-foreground leading-relaxed">{step.description}</p></article>)}</div>
        </section>

        <section className="container-editorial py-16 md:py-24 border-t border-border">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Perguntas frequentes</p>
          <h2 className="font-display text-4xl md:text-5xl">Antes da primeira conversa.</h2>
          <div className="mt-10 max-w-4xl divide-y divide-border">{service.faq.map((item) => <article key={item.question} className="py-6"><h3 className="font-display text-2xl">{item.question}</h3><p className="mt-3 text-muted-foreground leading-relaxed">{item.answer}</p></article>)}</div>
        </section>

        <section className="container-editorial py-20 md:py-28 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">Próximo passo</p>
          <h2 className="font-display text-4xl md:text-6xl">Vamos entender o que seu projeto pede.</h2>
          <p className="mt-5 text-muted-foreground max-w-xl mx-auto">Conte o momento da sua marca e o resultado que precisa construir. A primeira conversa serve para organizar o desafio e definir o melhor caminho.</p>
          <Button asChild size="lg" className="mt-8"><a href="https://wa.me/5513996158177" target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("generate_lead", { contact_method: "whatsapp", cta_location: `${service.slug}_final_cta` })}>Conversar pelo WhatsApp <ArrowUpRight className="ml-2 h-4 w-4" /></a></Button>
        </section>

        <section className="container-editorial pb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">Outras frentes</p>
          <div className="grid sm:grid-cols-2 gap-4">{services.filter((item) => item.slug !== service.slug).slice(0, 4).map((item) => <Link key={item.slug} to={`/servicos/${item.slug}`} className="glass rounded-xl p-5 flex items-center justify-between gap-4 hover:shadow-glow transition"><span className="font-display text-xl">{item.shortName}</span><ArrowRight className="h-4 w-4 text-primary shrink-0" /></Link>)}</div>
        </section>
      </main>
  );
}
