import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { PostCard, PostCardData } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import coverBrand from "@/assets/covers/optimized/cover-brand.webp";
import coverAudiovisual from "@/assets/covers/optimized/cover-audiovisual.webp";
import coverRetratos from "@/assets/covers/optimized/cover-retratos.webp";
import coverConteudo from "@/assets/covers/optimized/cover-conteudo.webp";
import coverEstudio from "@/assets/covers/optimized/cover-estudio.webp";
import coverPrompts from "@/assets/covers/optimized/cover-prompts.webp";
import coverFerramentas from "@/assets/covers/optimized/cover-ferramentas.webp";
import coverTutoriais from "@/assets/covers/optimized/cover-tutoriais.webp";
import coverAulas from "@/assets/covers/optimized/cover-aulas.webp";
import coverGuias from "@/assets/covers/optimized/cover-guias.webp";
import coverArtigos from "@/assets/covers/optimized/cover-artigos.webp";
import { useAuth } from "@/contexts/AuthContext";
import { CoverFlowCarousel } from "@/components/ui/3-d-coverflow-carousel";
import { ServicesSection } from "@/components/ServicesSection";

const studioAreas = [
  {
    tag: "#Estratégia",
    titleLine1: "CONSTRUÇÃO DE MARCAS",
    titleLine2: "– POSICIONAMENTO",
    desc: "Clareza estratégica para transformar identidade, percepção e comunicação em direção de marca.",
    img: coverBrand,
    ctaText: "Ver serviço",
    ctaUrl: "/servicos/construcao-de-marca",
  },
  {
    tag: "#Cinema",
    titleLine1: "PRODUÇÃO AUDIOVISUAL",
    titleLine2: "– IMAGEM EM MOVIMENTO",
    desc: "Filmes, vídeos e narrativas visuais para apresentar ideias com clareza e intenção.",
    img: coverAudiovisual,
    ctaText: "Ver serviço",
    ctaUrl: "/servicos/producao-audiovisual",
  },
  {
    tag: "#Identidade",
    titleLine1: "RETRATOS",
    titleLine2: "– DEPOIMENTOS",
    desc: "Retratos dirigidos para aproximar imagem, personalidade e posicionamento profissional.",
    img: coverRetratos,
    ctaText: "Ver serviço",
    ctaUrl: "/servicos/retratos-profissionais",
  },
  {
    tag: "#Editorial",
    titleLine1: "CONTEÚDO E COMUNICAÇÃO",
    titleLine2: "– REPERTÓRIO VIVO",
    desc: "Conteúdo com consistência editorial para fazer sua marca ser encontrada e lembrada.",
    img: coverConteudo,
    ctaText: "Ver serviço",
    ctaUrl: "/servicos/conteudo-e-presenca-digital",
  },
];

const editorialAreas = [
  {
    tag: "#Institucional",
    titleLine1: "NOSSO ESTÚDIO",
    titleLine2: "– A SPECULUM",
    desc: "Conheça a visão, os serviços e o modo de criar da Speculum Studio.",
    img: coverEstudio,
    ctaText: "Conhecer",
    ctaUrl: "/nosso-estudio",
  },
  {
    tag: "#Prática",
    titleLine1: "PROMPTS",
    titleLine2: "– TESTADOS",
    desc: "Prompts refinados para transformar intenção em resultado visual.",
    img: coverPrompts,
    ctaText: "Explorar",
    ctaUrl: "/explore?type=prompt",
  },
  {
    tag: "#Curadoria",
    titleLine1: "FERRAMENTAS",
    titleLine2: "– ESCOLHAS",
    desc: "Softwares e recursos de IA selecionados para criar com mais critério.",
    img: coverFerramentas,
    ctaText: "Explorar",
    ctaUrl: "/explore?type=tool",
  },
  {
    tag: "#Processo",
    titleLine1: "TUTORIAIS",
    titleLine2: "– PASSO A PASSO",
    desc: "Aprendizados aplicáveis para construir, testar e melhorar seu processo.",
    img: coverTutoriais,
    ctaText: "Explorar",
    ctaUrl: "/explore?type=tutorial",
  },
  {
    tag: "#Aprendizado",
    titleLine1: "AULAS",
    titleLine2: "– DESENVOLVIMENTO",
    desc: "Conteúdos para aprofundar repertório e desenvolver autonomia criativa.",
    img: coverAulas,
    ctaText: "Explorar",
    ctaUrl: "/explore?type=lesson",
  },
  {
    tag: "#Visão",
    titleLine1: "GUIAS",
    titleLine2: "– PERSPECTIVA",
    desc: "Leituras profundas para enxergar melhor marcas, imagem e criação.",
    img: coverGuias,
    ctaText: "Explorar",
    ctaUrl: "/explore?type=guide",
  },
  {
    tag: "#Editorial",
    titleLine1: "ARTIGOS",
    titleLine2: "– REFLEXÕES",
    desc: "Ideias e experiências para pensar o trabalho criativo no presente.",
    img: coverArtigos,
    ctaText: "Explorar",
    ctaUrl: "/explore?type=article",
  },
];

const Index = () => {
  const { user } = useAuth();
  const [featured, setFeatured] = useState<PostCardData[]>([]);
  const [trending, setTrending] = useState<PostCardData[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      if (!active) return;
      const [{ data: f }, { data: t }] = await Promise.all([supabase.from("posts")
        .select("id,slug,title,excerpt,cover_image_url,type,category,tags,is_premium,views,likes_count")
        .eq("status", "published").eq("is_featured", true).limit(5),
      supabase.from("posts")
        .select("id,slug,title,excerpt,cover_image_url,type,category,tags,is_premium,views,likes_count")
        .eq("status", "published").order("views", { ascending: false }).limit(6)]);
      if (!active) return;
      setFeatured((f ?? []) as PostCardData[]);
      setTrending((t ?? []) as PostCardData[]);
    })().catch((error) => console.error("Home articles could not load", error));
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Speculum Studio | Marca, imagem e criação"
        description="Construção de marca, conteúdo, fotografia e audiovisual. Conheça a Speculum Studio e explore artigos, processos e materiais de criação."
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Speculum Studio",
            url: "https://speculumstudio.com/",
            description: "Estúdio de construção de marca, conteúdo, fotografia e produção audiovisual.",
            email: "contato@speculumstudio.com",
            telephone: "+55 13 99615-8177",
            sameAs: ["https://www.instagram.com/studiospeculum/"],
          },
          { "@context": "https://schema.org", "@type": "WebSite", name: "Speculum Studio", url: "https://speculumstudio.com/", inLanguage: "pt-BR" },
        ]}
      />
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        <div className="container-editorial relative py-24 md:py-36 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Marca · Imagem · Criação
          </div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.98]">
            Marca, imagem e <span className="text-gradient-gold italic">criação</span> com inteligência.
          </h1>
          <p className="mt-7 text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Construímos marcas e produzimos conteúdo, fotografia e audiovisual. Aqui, você conhece nosso trabalho e encontra repertório para pensar e criar com mais critério.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-glow">
              <Link to="/nosso-estudio">Conhecer a Speculum <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/explore">Ver conteúdos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <ServicesSection items={studioAreas} sectionLabel="Serviços" />
      <CoverFlowCarousel items={editorialAreas} sectionLabel="Conteúdos" autoplayDelay={5000} />

      {/* FEATURED */}
      {featured.length > 0 && (
        <section className="container-editorial py-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary/80 mb-2">Destaques</p>
              <h2 className="font-display text-3xl md:text-4xl">Da mesa do editor.</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5 auto-rows-fr">
            {featured.map((p, i) => <PostCard key={p.id} post={p} featured={i === 0} />)}
          </div>
        </section>
      )}

      {/* TRENDING */}
      {trending.length > 0 && (
        <section className="container-editorial py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-primary/80 mb-2">Em alta</p>
              <h2 className="font-display text-3xl md:text-4xl">O que a comunidade está lendo.</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trending.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-editorial py-24">
        <div className="glass rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-aurora opacity-10" />
          <div className="relative">
            <h2 className="font-display text-4xl md:text-5xl max-w-2xl mx-auto leading-tight">
              Faça parte de um estúdio de <span className="text-gradient-gold italic">mentes curiosas</span>.
            </h2>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
              Crie sua conta para salvar conteúdos e organizar suas referências de marca, imagem e criação.
            </p>
            <Button asChild size="lg" className="mt-8 bg-gradient-gold text-primary-foreground shadow-glow">
              <Link to={user ? "/explore" : "/login"}>{user ? "Continuar explorando" : "Criar minha conta"} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
