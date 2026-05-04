import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard, PostCardData } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, Wand2, Wrench, GraduationCap, Compass, Newspaper } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { useAuth } from "@/contexts/AuthContext";

const categories = [
  { type: "prompt", label: "Prompts", icon: Wand2, desc: "Battle-tested prompts" },
  { type: "tool", label: "Tools", icon: Wrench, desc: "Curated AI software" },
  { type: "tutorial", label: "Tutorials", icon: BookOpen, desc: "Build, step by step" },
  { type: "lesson", label: "Lessons", icon: GraduationCap, desc: "Track your progress" },
  { type: "guide", label: "Guides", icon: Compass, desc: "Deep, opinionated" },
  { type: "article", label: "Articles", icon: Newspaper, desc: "Editorial dispatches" },
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
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <img src={heroImg} alt="" width={1920} height={1080}
          className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        <div className="container-editorial relative py-24 md:py-36 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs uppercase tracking-[0.2em] text-muted-foreground animate-in-up">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Issue 01 · A new editorial for AI
          </div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] animate-in-up" style={{ animationDelay: "0.1s" }}>
            The studio for those who <span className="text-gradient-gold italic">craft</span> with intelligence.
          </h1>
          <p className="mt-7 text-lg text-muted-foreground max-w-2xl leading-relaxed animate-in-up" style={{ animationDelay: "0.2s" }}>
            Speculum Studio is a curated library of prompts, tools, lessons and guides — published like a magazine, designed for makers shaping what comes next.
          </p>
          <div className="mt-10 flex flex-wrap gap-3 animate-in-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="bg-gradient-gold text-primary-foreground hover:opacity-90 shadow-glow">
              <Link to="/explore">Explore the studio <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            {!user && (
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Create an account</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-editorial py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-2">Sections</p>
            <h2 className="font-display text-3xl md:text-4xl">Six ways to learn.</h2>
          </div>
          <Link to="/explore" className="text-sm text-muted-foreground hover:text-primary hidden md:inline-flex items-center gap-1">
            All sections <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Link key={c.type} to={`/explore?type=${c.type}`}
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
              <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-2">Featured</p>
              <h2 className="font-display text-3xl md:text-4xl">From the editor's desk.</h2>
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
              <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-2">Trending</p>
              <h2 className="font-display text-3xl md:text-4xl">What the community is reading.</h2>
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
              Join a studio of <span className="text-gradient-gold italic">curious minds</span>.
            </h2>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
              Save what inspires you, track your learning, and become a contributor. Premium soon — early members shape it with us.
            </p>
            <Button asChild size="lg" className="mt-8 bg-gradient-gold text-primary-foreground shadow-glow">
              <Link to={user ? "/explore" : "/login"}>{user ? "Continue exploring" : "Create your account"} <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
