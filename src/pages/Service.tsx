import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { getServiceBySlug, services } from "@/data/services";

const SITE_URL = "https://speculumstudio.com";

export default function Service() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  if (!service) return <Navigate to="/nosso-estudio" replace />;

  const path = `/servicos/${service.slug}`;
  const serviceUrl = `${SITE_URL}${path}`;
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.shortName,
    serviceType: service.shortName,
    description: service.description,
    url: serviceUrl,
    provider: { "@type": "ProfessionalService", name: "Speculum Studio", url: SITE_URL },
    areaServed: { "@type": "Country", name: "Brasil" },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Nosso Estúdio", item: `${SITE_URL}/nosso-estudio` },
      { "@type": "ListItem", position: 3, name: service.shortName, item: serviceUrl },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Seo title={service.seoTitle} description={service.description} path={path} jsonLd={[serviceJsonLd, faqJsonLd, breadcrumbJsonLd]} />
      <Navbar />
      <main>
        <section className="container-editorial pt-12 pb-16 md:pt-20 md:pb-24">
          <Link to="/nosso-estudio#servicos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Todos os serviços
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-primary mt-12 mb-5">{service.eyebrow}</p>
          <h1 className="font-display text-5xl md:text-7xl max-w-4xl leading-[1.02]">{service.title}</h1>
          <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">{service.lead}</p>
          <Button asChild size="lg" className="mt-9">
            <a href="https://wa.me/5513996158177" target="_blank" rel="noopener noreferrer">Conversar sobre este projeto <ArrowUpRight className="ml-2 h-4 w-4" /></a>
          </Button>
        </section>

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
          <Button asChild size="lg" className="mt-8"><a href="https://wa.me/5513996158177" target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <ArrowUpRight className="ml-2 h-4 w-4" /></a></Button>
        </section>

        <section className="container-editorial pb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">Outras frentes</p>
          <div className="grid sm:grid-cols-2 gap-4">{services.filter((item) => item.slug !== service.slug).slice(0, 4).map((item) => <Link key={item.slug} to={`/servicos/${item.slug}`} className="glass rounded-xl p-5 flex items-center justify-between gap-4 hover:shadow-glow transition"><span className="font-display text-xl">{item.shortName}</span><ArrowRight className="h-4 w-4 text-primary shrink-0" /></Link>)}</div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
