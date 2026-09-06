import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { PostCard, PostCardData } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, Wand2, Wrench, GraduationCap, Compass, Newspaper } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  { type: "studio", label: "Nosso Estúdio", icon: Sparkles, desc: "Conheça a Speculum e nossos serviços" },
  { type: "prompt", label: "Prompts", icon: Wand2, desc: "Prompts testados e refinados" },
  { type: "tool", label: "Ferramentas", icon: Wrench, desc: "Softwares de IA selecionados" },
  { type: "tutorial", label: "Tutoriais", icon: BookOpen, desc: "Construa, passo a passo" },
  { type: "lesson", label: "Aulas", icon: GraduationCap, desc: "Acompanhe seu progresso" },
  { type: "guide", label: "Guias", icon: Compass, desc: "Profundos e opinativos" },
  { type: "article", label: "Artigos", icon: Newspaper, desc: "Editoriais e reflexões" },
];

const Index = () => {
  const { user } = useAuth();
  const [featured, setFeatured] = useState<PostCardData[]>([]);
  const [trending, setTrending] = useState<PostCardData[]>([]);

  useEffect(() => {
    (async () => {
      const { data: f } = await supabase.from("posts")
        .select("id,slug,title,excerpt,cover_image_url,type,category,tags,is_premium,views,likes_count")
        .eq("status", "published").eq("is_featured", true).limit(5);
      const { data: t } = await supabase.from("posts")
        .select("id,slug,title,excerpt,cover_image_url,type,category,tags,is_premium,views,likes_count")
        .eq("status", "published").order("views", { ascending: false }).limit(6);
      setFeatured((f ?? []) as PostCardData[]);
      setTrending((t ?? []) as PostCardData[]);
    })();
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
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_155101_f2540600-6fe9-433e-8e48-b3f4b72f0727.mp4"
          poster={heroImg}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/50 to-background" />
        <div className="container-editorial relative py-24 md:py-36 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs uppercase tracking-[0.22em] text-muted-foreground animate-in-up">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Marca · Imagem · Criação
          </div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.98] animate-in-up" style={{ animationDelay: "0.1s" }}>
            Marca, imagem e <span className="text-gradient-gold italic">criação</span> com inteligência.
          </h1>
          <p className="mt-7 text-lg text-muted-foreground max-w-2xl leading-relaxed animate-in-up" style={{ animationDelay: "0.2s" }}>
            Construímos marcas e produzimos conteúdo, fotografia e audiovisual. Aqui, você conhece nosso trabalho e encontra repertório para pensar e criar com mais critério.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 animate-in-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-glow">
              <Link to="/nosso-estudio">Conhecer a Speculum <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/explore">Ler as matérias</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-editorial py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary/80 mb-2">Seções</p>
            <h2 className="font-display text-3xl md:text-4xl">Conheça o estúdio. Explore o repertório.</h2>
          </div>
          <Link to="/explore" className="text-sm text-muted-foreground hover:text-primary hidden md:inline-flex items-center gap-1">
            Ver tudo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Link key={c.type} to={c.type === "studio" ? "/nosso-estudio" : `/explore?type=${c.type}`}
              className="glass rounded-2xl p-6 group hover:shadow-glow transition-all duration-500 hover:-translate-y-0.5">
              <div className="h-11 w-11 rounded-xl bg-secondary/60 grid place-items-center group-hover:bg-gradient-gold transition">
                <c.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition" />
              </div>
              <h3 className="font-display text-xl mt-4">{c.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

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
