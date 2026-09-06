import { Link } from "react-router-dom";
import { motion, MotionConfig } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { services } from "@/data/services";

export default function Studio() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex flex-col">
        <Seo
          title="Nosso Estúdio | Marca, conteúdo e audiovisual | Speculum Studio"
          description="Conheça a Speculum Studio: construção de marca, conteúdo, retratos, produção audiovisual e orientação estratégica com Fabiano Pereira."
          path="/nosso-estudio"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Serviços da Speculum Studio",
            itemListElement: services.map((service, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: service.shortName,
              url: `https://speculumstudio.com/servicos/${service.slug}`,
            })),
          }}
        />
        <Navbar />
        <main>
          <section className="container-editorial pt-16 pb-16 md:pt-24 md:pb-24">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-6">Nosso Estúdio / Speculum Studio</p>
              <h1 className="font-display text-5xl md:text-7xl max-w-4xl leading-[1.02]">Clareza para sua marca.<br /><span className="text-primary">Direção para o que ela comunica.</span></h1>
              <p className="mt-7 text-lg text-muted-foreground max-w-2xl leading-relaxed">Construção de marca, conteúdo, retratos e produção audiovisual para profissionais e empresas que querem comunicar o valor do seu trabalho.</p>
              <div className="flex flex-wrap gap-4 mt-9">
                <Button asChild size="lg"><a href="#contato">Conversar sobre um projeto <ArrowUpRight className="ml-2 h-4 w-4" /></a></Button>
                <Button asChild size="lg" variant="outline"><a href="#servicos">Conhecer os serviços</a></Button>
              </div>
            </motion.div>
          </section>

          <section id="servicos" className="container-editorial py-14 border-t border-border scroll-mt-24">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">O que fazemos</p>
            <h2 className="font-display text-4xl md:text-5xl mb-6">O trabalho que sua marca precisa agora.</h2>
            <p className="text-muted-foreground max-w-2xl mb-10">Podemos começar por um desafio específico ou conectar as diferentes frentes da sua comunicação. A primeira conversa ajuda a definir o escopo.</p>
            <div className="grid md:grid-cols-2 gap-5">{services.map((service, index) => (
              <motion.article id={service.slug} key={service.slug} className="glass rounded-2xl p-7 md:p-9 scroll-mt-24" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.4 }}>
                <p className="text-xs tracking-widest text-primary mb-5">0{index + 1}</p>
                <h3 className="font-display text-3xl">{service.shortName}</h3>
                <p className="mt-4 leading-relaxed">{service.description}</p>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{service.lead}</p>
                <Link to={`/servicos/${service.slug}`} className="inline-flex items-center gap-2 mt-6 text-sm text-primary hover:underline">Entender este trabalho <ArrowRight className="h-4 w-4" /></Link>
              </motion.article>
            ))}</div>
          </section>

          <section className="container-editorial py-16 md:py-24">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Como trabalhamos</p>
            <h2 className="font-display text-4xl md:text-5xl max-w-2xl">O contexto vem antes da criação.</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">{[
              ["Escutar", "Compreender a história, o momento do negócio e o desafio de comunicação."],
              ["Definir", "Organizar prioridades e dar uma direção para o projeto."],
              ["Criar", "Transformar essa direção em identidade, imagens e conteúdo."],
              ["Acompanhar", "Revisar a aplicação e orientar os próximos passos, conforme o escopo contratado."],
            ].map(([title, body]) => <div key={title} className="border-t border-border pt-5"><h3 className="font-display text-3xl">{title}</h3><p className="mt-3 text-sm text-muted-foreground leading-relaxed">{body}</p></div>)}</div>
          </section>

          <section id="sobre" className="container-editorial py-14 border-t border-border scroll-mt-24 grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-16">
            <div><p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Quem está por trás</p><h2 className="font-display text-4xl md:text-5xl">Um olhar que conecta estratégia e criação.</h2></div>
            <div className="text-muted-foreground space-y-5 leading-relaxed"><p>A Speculum Studio é dirigida por Fabiano Pereira e reúne construção de marca, conteúdo e produção audiovisual. A fotografia e o trabalho com pessoas fazem parte desse olhar: compreender o contexto para decidir o que a comunicação precisa mostrar.</p><p>Aqui no site, compartilhamos também repertório, processos e materiais de criação. Esse espaço aproxima o trabalho do estúdio de quem quer aprender com ele.</p><Link className="inline-flex items-center gap-2 text-primary hover:underline" to="/explore">Explorar os conteúdos <ArrowRight className="h-4 w-4" /></Link></div>
          </section>

          <section id="contato" className="container-editorial py-20 md:py-28 scroll-mt-24 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">Vamos falar do seu projeto</p>
            <h2 className="font-display text-4xl md:text-6xl">O que sua marca precisa comunicar?</h2>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">Conte o momento do seu negócio e o que você quer construir. A conversa começa pelo seu contexto.</p>
            <Button asChild size="lg" className="mt-8"><a href="https://wa.me/5513996158177" target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <ArrowUpRight className="ml-2 h-4 w-4" /></a></Button>
            <a className="block mt-5 text-sm text-muted-foreground hover:text-primary" href="mailto:contato@speculumstudio.com">contato@speculumstudio.com</a>
          </section>
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
