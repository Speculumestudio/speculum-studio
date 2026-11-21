import { useEffect, useState, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowDownCircle,
  ArrowRight,
  Bookmark,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  Heart,
  Lock,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { getCoverImage } from "@/lib/cover-images";
import { CaptureBrainVisual } from "@/components/CaptureBrainVisual";
import { NotionTutorialView } from "@/components/content/NotionTutorialView";
import logo from "@/assets/logo-speculum.png";

interface PostFull {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  content: string | null;
  prompt_text: string | null;
  youtube_url: string | null;
  type: string;
  category: string | null;
  tags: string[] | null;
  is_premium: boolean;
  views: number;
  likes_count: number;
  author_id: string | null;
  published_at: string | null;
  updated_at: string;
}

interface CommentRow {
  id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  is_answer: boolean;
  created_at: string;
  profiles?: { full_name: string | null; avatar_url: string | null };
}

const ytId = (url: string | null) => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return m?.[1] ?? null;
};

const Post = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const accessGranted = searchParams.get("acesso") === "liberado";
  const [post, setPost] = useState<PostFull | null>(null);
  const [author, setAuthor] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [submittingComment, setSubmittingComment] = useState(false);
  const forumRef = useRef<HTMLElement>(null);

  const scrollToForum = () => {
    forumRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data: p } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
      if (!p) return;
      setPost(p as any);
      if (user && (p as any).author_id === user.id) {
        await supabase.from("posts").update({ views: (p as any).views + 1 }).eq("id", (p as any).id);
      }
      const { data: a } = await supabase
        .from("profiles")
        .select("id,full_name,avatar_url,bio")
        .eq("id", (p as any).author_id ?? "")
        .maybeSingle();
      setAuthor(a);
      loadComments((p as any).id);
      if (user) {
        const [{ data: l }, { data: b }, { data: pr }] = await Promise.all([
          supabase.from("likes").select("post_id").eq("post_id", (p as any).id).eq("user_id", user.id).maybeSingle(),
          supabase.from("bookmarks").select("post_id").eq("post_id", (p as any).id).eq("user_id", user.id).maybeSingle(),
          supabase.from("progress").select("progress_percent").eq("post_id", (p as any).id).eq("user_id", user.id).maybeSingle(),
        ]);
        setLiked(!!l);
        setBookmarked(!!b);
        setProgress(pr?.progress_percent ?? 0);
      }
    })();
    // eslint-disable-next-line
  }, [slug, user?.id]);

  // Adiciona botão de cópia com 1 clique para blocos de código dentro do conteúdo editorial
  useEffect(() => {
    if (!post?.content) return;
    const timeout = setTimeout(() => {
      const preElements = document.querySelectorAll(".prose-editorial pre");
      preElements.forEach((pre) => {
        if (pre.querySelector(".code-copy-btn")) return;
        const btn = document.createElement("button");
        btn.className =
          "code-copy-btn absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-white/10 hover:bg-white/20 text-[#F5D061] transition-all cursor-pointer flex items-center gap-1 z-10";
        btn.innerHTML = `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span>Copiar</span>`;
        btn.onclick = async (e) => {
          e.stopPropagation();
          const codeEl = pre.querySelector("code");
          const codeText = codeEl ? codeEl.innerText : pre.innerText.replace(/Copiar|Copiado!/g, "").trim();
          try {
            await navigator.clipboard.writeText(codeText.trim());
            btn.innerHTML = `<svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg><span class="text-emerald-400">Copiado!</span>`;
            toast.success("Código copiado!");
            setTimeout(() => {
              btn.innerHTML = `<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg><span>Copiar</span>`;
            }, 2000);
          } catch {
            toast.error("Falha ao copiar código.");
          }
        };
        (pre as HTMLElement).style.position = "relative";
        pre.appendChild(btn);
      });
    }, 100);
    return () => clearTimeout(timeout);
  }, [post?.content, post?.slug]);

  const loadComments = async (postId: string) => {
    const { data, error } = await supabase
      .from("comments")
      .select("id,user_id,parent_id,content,is_answer,created_at")
      .eq("post_id", postId)
      .eq("is_hidden", false)
      .order("created_at", { ascending: true });

    if (error || !data) {
      setComments([]);
      return;
    }

    const userIds = Array.from(new Set(data.map((row) => row.user_id).filter(Boolean)));
    const profileMap = new Map<string, { full_name: string | null; avatar_url: string | null }>();

    if (userIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id,full_name,avatar_url")
        .in("id", userIds);
      for (const prof of profs ?? []) {
        profileMap.set(prof.id, { full_name: prof.full_name, avatar_url: prof.avatar_url });
      }
    }

    setComments(
      data.map((row) => ({
        ...row,
        profiles: profileMap.get(row.user_id),
      }))
    );
  };

  const toggleLike = async () => {
    if (!user || !post) {
      toast.error("Entre para curtir");
      return;
    }
    if (liked) {
      await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", post.id);
      setLiked(false);
    } else {
      await supabase.from("likes").insert({ user_id: user.id, post_id: post.id });
      setLiked(true);
    }
  };

  const toggleBookmark = async () => {
    if (!user || !post) {
      toast.error("Entre para salvar");
      return;
    }
    if (bookmarked) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("post_id", post.id);
      setBookmarked(false);
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, post_id: post.id });
      setBookmarked(true);
      toast.success("Salvo na biblioteca");
    }
  };

  const submitComment = async () => {
    if (!user || !post) {
      toast.error("Entre para comentar");
      return;
    }
    const parsed = z.string().trim().min(1, "Escreva algo antes de publicar.").max(2000).safeParse(newComment);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setSubmittingComment(true);
    try {
      const { error } = await supabase.from("comments").insert({
        post_id: post.id,
        user_id: user.id,
        content: parsed.data,
        parent_id: replyTo,
      });
      if (error) throw error;
      setNewComment("");
      setReplyTo(null);
      toast.success("Comentário publicado no fórum!");
      loadComments(post.id);
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao publicar comentário.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.href,
        },
      });
      if (error) throw error;
    } catch (e: any) {
      toast.error(e?.message ?? "Falha no login com Google");
    }
  };

  const markComplete = async () => {
    if (!user || !post) return;
    await supabase.from("progress").upsert({
      user_id: user.id,
      post_id: post.id,
      progress_percent: 100,
      completed_at: new Date().toISOString(),
    });
    setProgress(100);
    toast.success("Marcado como concluído");
  };

  if (!post) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;
  }

  const locked = post.is_premium && !user;
  const ytid = ytId(post.youtube_url);
  const roots = comments.filter((c) => !c.parent_id);
  const repliesOf = (id: string) => comments.filter((c) => c.parent_id === id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Seo
        title={`${post.title} — Speculum Studio`}
        description={post.excerpt ?? `${post.title} no Speculum Studio.`}
        path={`/post/${post.slug}`}
        type="article"
        image={post.cover_image_url ?? undefined}
        publishedTime={post.published_at ?? undefined}
        modifiedTime={post.updated_at}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": post.type === "lesson" ? "Course" : "Article",
          headline: post.title,
          description: post.excerpt ?? undefined,
          image: post.cover_image_url ?? undefined,
          datePublished: post.published_at ?? undefined,
          dateModified: post.updated_at ?? post.published_at ?? undefined,
          mainEntityOfPage: `https://speculumstudio.com/post/${post.slug}`,
          author: author?.full_name
            ? { "@type": "Person", name: author.full_name }
            : { "@type": "Organization", name: "Speculum Studio", url: "https://speculumstudio.com" },
          keywords: post.tags?.join(", ") || undefined,
        }}
      />
      <Navbar />

      <main className="container-editorial pt-10 pb-20 max-w-6xl">
        {/* Banner de Acesso Liberado para quem veio da captura */}
        {accessGranted && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-primary/40 bg-primary/[0.08] p-4 sm:p-5 text-sm text-foreground shadow-[0_4px_24px_-4px_rgba(201,168,76,0.18)]">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="leading-relaxed">
              <div className="font-semibold text-foreground">Acesso liberado ao material completo.</div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Salve este endereço nos seus favoritos. Você já pode ler o tutorial, copiar os comandos e participar das discussões no fórum da comunidade abaixo.
              </p>
            </div>
          </div>
        )}

        {/* Grid de 2 colunas: Conteúdo Principal (8 cols) + Lateral de Comunidade (4 cols) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* Coluna Principal: Artigo + Fórum */}
          <article className="lg:col-span-8 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge variant="secondary" className="capitalize text-xs">
                  {post.type}
                </Badge>
                {post.category && (
                  <span className="text-[11px] uppercase tracking-[0.22em] text-primary/80 font-medium">
                    {post.category}
                  </span>
                )}
                {post.is_premium && (
                  <Badge className="bg-gradient-gold text-primary-foreground border-0 text-xs">
                    <Lock className="h-3 w-3 mr-1" />
                    Membros
                  </Badge>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl leading-[1.08] text-foreground">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-6 flex items-center justify-between flex-wrap gap-4 pt-2 border-t border-white/[0.06]">
                <Link
                  to={post.author_id ? `/profile/${post.author_id}` : "/nosso-estudio"}
                  className="flex items-center gap-3 group"
                >
                  <Avatar className="h-10 w-10 ring-1 ring-primary/30">
                    <AvatarImage src={author?.avatar_url} />
                    <AvatarFallback>{(author?.full_name ?? "SP").slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium group-hover:text-primary transition-colors text-foreground">
                      {author?.full_name ?? "Speculum Studio"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR") : "Rascunho"}
                    </div>
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  <Button
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    onClick={toggleLike}
                    className={`h-9 px-3 ${liked ? "bg-gradient-gold text-primary-foreground" : "border-white/10"}`}
                  >
                    <Heart className={`h-4 w-4 mr-1.5 ${liked ? "fill-current" : ""}`} />
                    {post.likes_count + (liked ? 1 : 0)}
                  </Button>
                  <Button
                    variant={bookmarked ? "default" : "outline"}
                    size="sm"
                    onClick={toggleBookmark}
                    className={`h-9 px-3 ${bookmarked ? "bg-gradient-gold text-primary-foreground" : "border-white/10"}`}
                    aria-label="Salvar"
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
                  </Button>
                  <span className="text-xs text-muted-foreground inline-flex items-center gap-1 ml-1">
                    <Eye className="h-3.5 w-3.5" />
                    {post.views}
                  </span>
                </div>
              </div>
            </div>

            {post.cover_image_url && (
              <div className="flex justify-center rounded-2xl overflow-hidden border border-white/[0.08] bg-black/40">
                <img
                  {...getCoverImage(post.slug, post.cover_image_url, true)}
                  alt={post.title}
                  className="w-full max-w-[640px] h-auto object-contain"
                  loading="lazy"
                />
              </div>
            )}

            {locked ? (
              <div className="glass rounded-3xl p-8 sm:p-10 text-center border border-primary/30">
                <Lock className="h-9 w-9 mx-auto text-primary" />
                <h3 className="font-display text-2xl mt-4 text-foreground">Conteúdo exclusivo para membros</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Entre na sua conta ou crie seu acesso gratuito em 1 clique para liberar este material e salvar na sua biblioteca.
                </p>
                <Button
                  onClick={handleGoogleLogin}
                  className="mt-6 bg-gradient-gold text-primary-foreground font-semibold px-6 py-2.5"
                >
                  Continuar com Google
                </Button>
              </div>
            ) : (
              <>
                {ytid && (
                  <div className="rounded-2xl overflow-hidden glass aspect-video border border-white/[0.08]">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${ytid}`}
                      title="Vídeo"
                      allowFullScreen
                    />
                  </div>
                )}
                {post.slug === "setup-segundo-cerebro-ia" ? (
                  <>
                    {post.prompt_text && (
                      <div className="glass rounded-2xl p-6 border border-primary/20 bg-black/40">
                        <div className="text-xs uppercase tracking-[0.22em] text-primary/80 mb-3 font-semibold">
                          Comando de Inicialização
                        </div>
                        <pre className="whitespace-pre-wrap text-sm font-mono text-foreground/90 overflow-x-auto">
                          {post.prompt_text}
                        </pre>
                      </div>
                    )}
                    <NotionTutorialView
                      promptBox={<InteractivePromptBox />}
                      onScrollToForum={scrollToForum}
                    />
                  </>
                ) : (
                  <div className="space-y-8 font-sans">
                    {/* Barra de Topo: Comunidade e Atalho */}
                    <div className="flex items-center justify-between flex-wrap gap-4 py-3.5 px-6 rounded-2xl bg-[#EDE7DA] border border-[#DDD5C5] text-[#1B3022] shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
                        <span className="text-xs sm:text-sm font-bold text-[#142318] tracking-tight">
                          Ateliê Aberto · 160+ membros ativos
                        </span>
                        <span className="text-xs text-[#142318]/80 font-medium hidden sm:inline">
                          · Dúvidas respondidas em ~24h
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={scrollToForum}
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#1B3022] hover:text-[#C5A059] transition-colors cursor-pointer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>Fórum de Dúvidas</span>
                        <ArrowDownCircle className="h-3.5 w-3.5 opacity-80" />
                      </button>
                    </div>

                    {/* DOCUMENTO PRINCIPAL EM PAPEL VERGÊ MARFIM */}
                    <div className="rounded-3xl border border-[#DDD5C5] bg-[#F7F5EE] text-[#142318] p-6 sm:p-10 md:p-12 space-y-8 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5),0_0_40px_-20px_rgba(201,168,76,0.25)]">
                      {/* Cabeçalho do Documento */}
                      <div className="space-y-4 border-b border-[#E3DCCF] pb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1B3022] text-[#F5D061] font-mono text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>{post.category || "Editorial Speculum"} · {post.type}</span>
                        </div>

                        <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl text-[#142318] font-extrabold tracking-tight leading-tight">
                          {post.title}
                        </h2>

                        {post.excerpt && (
                          <p className="text-sm sm:text-base text-[#142318] leading-relaxed font-medium">
                            {post.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Prompt Pronto com Botão de Cópia em 1 Clique */}
                      {post.prompt_text && (
                        <PromptCopyCard promptText={post.prompt_text} />
                      )}

                      {/* Corpo do Artigo com Tipografia Editorial Tinta Negra */}
                      {post.content && (
                        <div
                          className="prose-editorial max-w-none font-sans text-base sm:text-[16.5px] leading-relaxed text-[#142318]"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4">
                {post.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs border-white/10 text-muted-foreground">
                    #{t}
                  </Badge>
                ))}
              </div>
            )}

            {post.type === "lesson" && user && (
              <div className="glass rounded-2xl p-5 flex items-center justify-between border border-primary/20">
                <div>
                  <div className="text-sm font-medium text-foreground">Seu progresso no módulo</div>
                  <div className="h-2 w-48 rounded bg-muted mt-2 overflow-hidden">
                    <div className="h-full bg-gradient-gold" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <Button onClick={markComplete} className="bg-gradient-gold text-primary-foreground text-xs font-semibold">
                  Marcar como concluído
                </Button>
              </div>
            )}

            {/* Card de Comunidade no Mobile (aparece antes do fórum) */}
            <div className="lg:hidden">
              <CommunitySidebar author={author} onGoogleLogin={handleGoogleLogin} user={user} />
            </div>

            {/* Fórum da Comunidade / Seção de Discussão */}
            <section id="forum-comunidade" ref={forumRef} className="pt-10 border-t border-white/[0.08] space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                    <MessageCircle className="h-4 w-4" />
                  </span>
                  <div>
                    <h2 className="font-display text-2xl text-foreground">Fórum da Comunidade</h2>
                    <p className="text-xs text-muted-foreground">
                      Tire dúvidas sobre o setup, compartilhe seus resultados e peça as próximas skills.
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                  {comments.length} {comments.length === 1 ? "discussão" : "discussões"}
                </Badge>
              </div>

              {/* Caixa de Entrada de Comentário */}
              {user ? (
                <div className="glass rounded-2xl p-5 border border-primary/25 bg-[#0F120F]/90 shadow-glow">
                  {replyTo && (
                    <div className="text-xs text-primary/80 mb-2 flex items-center justify-between">
                      <span>Respondendo a um membro da comunidade…</span>
                      <button
                        className="underline text-muted-foreground hover:text-foreground"
                        onClick={() => setReplyTo(null)}
                      >
                        cancelar
                      </button>
                    </div>
                  )}
                  <Textarea
                    aria-label="Escrever comentário"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Compartilhe sua dúvida, sugestão ou resultado do seu Segundo Cérebro..."
                    maxLength={2000}
                    className="min-h-[96px] bg-black/40 border-white/10 text-foreground placeholder:text-muted-foreground/60 focus-visible:border-primary/60 focus-visible:ring-primary/20"
                  />
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      Comentando como <strong className="text-foreground">{user.email}</strong>
                    </span>
                    <Button
                      onClick={submitComment}
                      disabled={submittingComment || !newComment.trim()}
                      className="bg-gradient-gold text-primary-foreground font-semibold px-5 h-9"
                    >
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      {submittingComment ? "Enviando..." : "Publicar no fórum"}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Card de Convite para a Comunidade (semelhante ao Skool) */
                <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/[0.08] to-black/40 p-6 sm:p-8 text-center shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8),0_0_40px_-20px_rgba(201,168,76,0.2)]">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-primary/15 text-primary mb-3">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-2xl text-foreground">
                    Faça parte do Ateliê de IA
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Entre com o Google em 1 clique para tirar dúvidas direto com o Fabiano, compartilhar prints do seu Segundo Cérebro e pedir as próximas skills abertas.
                  </p>
                  <Button
                    onClick={handleGoogleLogin}
                    className="mt-6 bg-gradient-gold text-primary-foreground font-semibold px-6 py-3 h-11 text-sm shadow-[0_8px_24px_-6px_rgba(201,168,76,0.5)]"
                  >
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M21.35 11.1h-9.17v2.94h5.28c-.23 1.4-1.66 4.1-5.28 4.1-3.18 0-5.78-2.63-5.78-5.88s2.6-5.88 5.78-5.88c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.83 3.91 14.84 3 12.18 3 6.97 3 2.78 7.19 2.78 12.4s4.19 9.4 9.4 9.4c5.43 0 9.03-3.81 9.03-9.18 0-.62-.07-1.09-.16-1.52z"
                      />
                    </svg>
                    Entrar com o Google em 1 clique
                  </Button>
                  <p className="mt-3 text-[11px] text-muted-foreground/75 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary/80" />
                    Leva menos de 3 segundos e salva suas matérias na sua conta.
                  </p>
                </div>
              )}

              {/* Lista de Discussões / Tópicos */}
              <div className="space-y-4 pt-2">
                {roots.length === 0 ? (
                  <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-8 text-center text-sm text-muted-foreground">
                    Seja a primeira pessoa a deixar uma dúvida ou resultado sobre este material.
                  </div>
                ) : (
                  roots.map((c) => (
                    <div key={c.id} className="glass rounded-2xl p-5 border border-white/[0.06] bg-black/30">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-9 w-9 ring-1 ring-white/10">
                          <AvatarImage src={c.profiles?.avatar_url ?? undefined} />
                          <AvatarFallback className="text-xs">
                            {(c.profiles?.full_name ?? "U").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-foreground">
                              {c.profiles?.full_name ?? "Membro da Comunidade"}
                            </span>
                            {c.is_answer && (
                              <Badge className="bg-gradient-gold text-primary-foreground text-[10px] py-0 px-2">
                                Resposta Oficial
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {new Date(c.created_at).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                            {c.content}
                          </p>
                          {user && (
                            <button
                              className="text-xs text-primary mt-2 font-medium hover:underline"
                              onClick={() => setReplyTo(c.id)}
                            >
                              Responder
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Respostas Aninhadas */}
                      {repliesOf(c.id).map((r) => (
                        <div key={r.id} className="mt-4 ml-6 sm:ml-10 pl-4 border-l border-primary/30">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8 ring-1 ring-white/10">
                              <AvatarImage src={r.profiles?.avatar_url ?? undefined} />
                              <AvatarFallback className="text-xs">
                                {(r.profiles?.full_name ?? "U").slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {r.profiles?.full_name ?? "Membro"}
                              </div>
                              <p className="mt-1 text-sm whitespace-pre-wrap text-foreground/90">{r.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
                )}
              </div>
            </section>
          </article>

          {/* Coluna Direita (Desktop): Barra Lateral de Comunidade estilo Skool */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
            <CommunitySidebar author={author} onGoogleLogin={handleGoogleLogin} user={user} />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface CommunitySidebarProps {
  author: any;
  onGoogleLogin: () => void;
  user: any;
}

function CommunitySidebar({ author, onGoogleLogin, user }: CommunitySidebarProps) {
  return (
    <div className="space-y-6">
      {/* Card Principal da Comunidade em Papel Vergê Marfim */}
      <div className="rounded-3xl border border-[#DDD5C5] bg-[#F7F5EE] p-6 sm:p-7 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5),0_0_35px_-20px_rgba(201,168,76,0.2)] text-[#1C201D]">
        
        {/* Status Superior da Comunidade */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse ring-2 ring-emerald-600/20" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#1B3022]">
              Comunidade Ativa
            </span>
          </div>
          <Badge className="bg-[#1B3022] text-[#F5D061] text-[10px] font-bold py-0.5 px-2.5">
            Acesso Livre
          </Badge>
        </div>

        {/* Título com Fonte Quadrada e Encorpada */}
        <h3 className="mt-3 font-sans text-2xl font-extrabold text-[#142318] tracking-tight">
          Ateliê de IA
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-[#142318] font-medium leading-relaxed">
          O ponto de encontro da Speculum Studio para criadores, agências e desenvolvedores trocarem códigos e fluxos práticos de inteligência artificial.
        </p>

        {/* Métricas e Prova Social */}
        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#E3DCCF] py-4">
          <div className="rounded-2xl bg-[#EDE7DA] border border-[#DDD5C5] p-3 text-center space-y-1">
            <div className="font-sans text-2xl font-extrabold text-[#142318] tracking-tight">160+</div>
            <div className="text-[10.5px] uppercase tracking-wider font-extrabold text-[#142318]">
              Membros Ativos
            </div>
            <div className="flex items-center justify-center -space-x-1.5 pt-0.5">
              <img className="inline-block h-5 w-5 rounded-full ring-1.5 ring-[#EDE7DA] object-cover" src="/covers/real/servico-retratos-roger.webp" alt="Membro" />
              <img className="inline-block h-5 w-5 rounded-full ring-1.5 ring-[#EDE7DA] object-cover" src="/covers/real/servico-conteudo-nicolle.webp" alt="Membro" />
              <img className="inline-block h-5 w-5 rounded-full ring-1.5 ring-[#EDE7DA] object-cover" src="/covers/real/servico-retratos-felipe.webp" alt="Membro" />
              <img className="inline-block h-5 w-5 rounded-full ring-1.5 ring-[#EDE7DA] object-cover" src="/covers/real/servico-retratos-charles.webp" alt="Membro" />
            </div>
          </div>
          <div className="rounded-2xl bg-[#EDE7DA] border border-[#DDD5C5] p-3 text-center space-y-1">
            <div className="font-sans text-2xl font-extrabold text-[#1B3022] tracking-tight">~24h</div>
            <div className="text-[10.5px] uppercase tracking-wider font-extrabold text-[#142318]">
              Resposta Média
            </div>
            <div className="text-[10px] font-bold text-emerald-800 pt-0.5 flex items-center justify-center gap-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Fórum moderado
            </div>
          </div>
        </div>

        {/* Card do Instrutor */}
        <div className="mt-5 rounded-2xl border border-[#D5CBBA] bg-[#ECE5D7] p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-[#1B3022]/30 shrink-0">
              <AvatarImage src="/covers/real/fabiano-avatar.webp" alt="Fabiano Pereira" className="object-cover" />
              <AvatarFallback className="bg-[#1B3022] text-[#F5D061] font-bold">FP</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-[#142318] tracking-tight">
                  Fabiano Pereira
                </span>
                <Sparkles className="h-3.5 w-3.5 text-[#C5A059] shrink-0" />
              </div>
              <div className="text-[10.5px] text-[#1B3022] font-bold uppercase tracking-wider leading-tight">
                Diretor Criativo · Speculum
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#142318] font-medium">
            Compartilho os códigos, motores de vídeo e fluxos de IA que usamos na agência todos os dias para produzir sem depender de templates genéricos.
          </p>
        </div>

        {/* Regras e Conteúdos do Fórum */}
        <div className="mt-5 space-y-2.5">
          <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#142318]">
            O que você encontra aqui:
          </div>
          <ul className="space-y-2 text-xs text-[#142318] font-medium">
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-[#1B3022] shrink-0 mt-0.5 stroke-[2.5]" />
              <span>Dúvidas de instalação de terminais, Claude Code e Codex</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-[#1B3022] shrink-0 mt-0.5 stroke-[2.5]" />
              <span>Roteiros, comandos e códigos prontos para download</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-3.5 w-3.5 text-[#1B3022] shrink-0 mt-0.5 stroke-[2.5]" />
              <span>Votação das próximas matérias e skills abertas</span>
            </li>
          </ul>
        </div>

        {/* Botão de Acesso com Google ou Status de Logado */}
        {!user ? (
          <div className="mt-6 pt-5 border-t border-[#E3DCCF] space-y-2">
            <Button
              onClick={onGoogleLogin}
              className="w-full bg-[#1B3022] text-[#F5D061] hover:bg-[#253F2D] font-extrabold h-11 text-xs shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Users className="h-4 w-4 mr-2" />
              Entrar na Comunidade com Google
            </Button>
            <p className="text-[10.5px] text-center text-[#142318] font-medium">
              Acesso livre e imediato com sua conta Google
            </p>
          </div>
        ) : (
          <div className="mt-6 pt-4 border-t border-[#E3DCCF] flex items-center justify-between text-xs">
            <span className="font-bold text-[#1B3022] flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Você é membro ativo
            </span>
            <a href="#forum-comunidade" className="text-xs font-bold text-[#142318] underline hover:text-[#C5A059]">
              Fazer uma pergunta
            </a>
          </div>
        )}
      </div>

      {/* Card de Próximo Degrau / Explorar em Harmonia Marfim */}
      <div className="rounded-3xl border border-[#DDD5C5] bg-[#F7F5EE] p-6 text-[#1C201D] shadow-sm">
        <div className="text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#9A7B38]">
          Série IA na Prática
        </div>
        <div className="mt-1 font-sans text-lg font-extrabold text-[#142318] tracking-tight">
          Explore outros tutoriais do estúdio
        </div>
        <p className="mt-1 text-xs text-[#142318] leading-relaxed font-medium">
          Direção de arte com IA, motores de carrossel em código e workflows avançados.
        </p>
        <Link
          to="/explore"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#1B3022] hover:text-[#C5A059] transition-colors"
        >
          Ver todas as matérias
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

const TERMINAL_MASTER_PROMPT = `Atue como o arquiteto de sistemas e memória do meu Segundo Cérebro local.

Execute este plano passo a passo, conferindo cada etapa e pedindo minha confirmação antes de criar arquivos:

ETAPA 1 · CRIAÇÃO DA ESTRUTURA DE PASTAS:
Crie dentro do diretório atual as 5 pastas operacionais fundamentais:
- 01-clientes/ (uma subpasta por cliente com briefing, restrições e tom de voz)
- 02-ofertas/ (descrição detalhada dos meus serviços, entregáveis e preços)
- 03-referencias/ (banco de referências aprovadas de roteiros, layouts e carrosseis)
- 04-projetos/ (produção ativa separada por data e tema)
- 05-ferramentas/ (scripts, automações, skills e modelos reutilizáveis)

ETAPA 2 · ARQUIVO MESTRE DE MEMÓRIA (CLAUDE.md):
Crie na raiz da pasta o arquivo CLAUDE.md com as seguintes diretrizes inegociáveis:
# Segundo Cérebro · Diretrizes Operacionais
1. Leitura Prévia Obrigatória: Antes de redigir qualquer texto, roteiro ou código, consulte o arquivo do cliente em 01-clientes/ e a oferta correspondente em 02-ofertas/.
2. Tom Autêntico e Humano: Proibido usar jargões clichês de IA (como "no mundo acelerado de hoje", "revolucionário", "mergulhe", "orquestração"). Nunca use travessões em lugar de vírgulas ou pontos.
3. Segurança e Aprovação: Apresente um resumo curto do que pretende fazer e peça minha aprovação antes de criar arquivos grandes ou rodar scripts.
4. Fechamento de Sessão: Ao final de cada trabalho, grave um resumo do que foi entregue e a próxima pendência no arquivo de memória dentro de 04-projetos/.

ETAPA 3 · DIAGNÓSTICO DO AMBIENTE LOCAL:
Verifique se Python 3 e Node.js estão instalados no meu sistema operacional. Se faltar algo, apenas me informe como instalar manualmente no meu sistema (Windows ou macOS) sem quebrar nada.

Apresente um resumo do plano na tela e aguarde meu OK para criar a estrutura.`;

const BROWSER_PROJECTS_PROMPT = `Você é o assistente oficial do meu Segundo Cérebro. Toda vez que iniciarmos uma conversa neste Projeto, siga rigorosamente estas regras:
1. Consulte sempre as notas do cliente e das minhas ofertas anexadas a este Projeto antes de sugerir ou redigir qualquer material.
2. Escreva sempre com linguagem direta, autêntica e sem clichês de inteligência artificial. Nunca use travessões soltos no meio do texto.
3. Seja cirúrgico: entregue a resposta ou o rascunho completo na primeira mensagem, sem introduções genéricas.
4. Ao final de cada sessão, me pergunte se desejo registrar o aprendizado do dia na nota do projeto.`;

function PromptCopyCard({ promptText }: { promptText: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(promptText);
        setCopied(true);
        toast.success("Comando copiado com sucesso!");
        window.setTimeout(() => setCopied(false), 2400);
      }
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <div className="rounded-2xl border border-primary/30 bg-[#0A0D0A] p-5 sm:p-6 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.6)] my-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
        <div className="text-xs uppercase tracking-[0.22em] text-[#F5D061] font-bold flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Comando / Prompt Pronto</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            copied
              ? "bg-emerald-500 text-white"
              : "bg-gradient-gold text-primary-foreground hover:scale-105 active:scale-95 shadow-sm"
          }`}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? "Copiado!" : "Copiar Prompt"}</span>
        </button>
      </div>
      <pre className="whitespace-pre-wrap text-xs sm:text-sm font-mono text-[#F7F5EE] overflow-x-auto leading-relaxed select-all">
        {promptText}
      </pre>
    </div>
  );
}

function InteractivePromptBox() {
  const [tab, setTab] = useState<"terminal" | "browser">("terminal");
  const [copied, setCopied] = useState(false);

  const activePrompt = tab === "terminal" ? TERMINAL_MASTER_PROMPT : BROWSER_PROJECTS_PROMPT;

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(activePrompt);
        setCopied(true);
        toast.success("Prompt copiado com sucesso!");
        window.setTimeout(() => setCopied(false), 2400);
      }
    } catch {
      toast.error("Não foi possível copiar automaticamente.");
    }
  };

  return (
    <div className="rounded-3xl border border-primary/35 bg-[#0A0D0A]/95 p-5 sm:p-7 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9),0_0_40px_-20px_rgba(201,168,76,0.25)] my-10">
      {/* Barra superior de controle */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10">
          <button
            type="button"
            onClick={() => setTab("terminal")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === "terminal"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Terminal (Claude Code ou Codex)
          </button>
          <button
            type="button"
            onClick={() => setTab("browser")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              tab === "browser"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Navegador (Claude / ChatGPT Projects)
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-150 cursor-pointer ${
            copied
              ? "bg-emerald-500 text-white shadow-[0_0_18px_rgba(16,185,129,0.5)] scale-[1.02]"
              : "bg-gradient-gold text-primary-foreground shadow-[0_4px_16px_rgba(201,168,76,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              <span>Prompt Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              <span>Copiar Prompt Mestre</span>
            </>
          )}
        </button>
      </div>

      {/* Area de codigo */}
      <div className="pt-4">
        <div className="flex items-center justify-between text-[11.5px] text-muted-foreground mb-2.5">
          <span className="font-medium text-foreground/80">
            {tab === "terminal"
              ? "Prompt Mestre Unificado · Copie e cole na janela do Claude Code ou Codex"
              : "Prompt de Regras · Copie e cole nas instruções do seu Projeto no navegador"}
          </span>
          <span className="font-mono text-primary/90 hidden sm:inline">1 clique para copiar</span>
        </div>
        <pre className="rounded-2xl border border-white/[0.08] bg-black/70 p-4 sm:p-5 font-mono text-xs text-foreground/95 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
          {activePrompt}
        </pre>
      </div>
    </div>
  );
}

export default Post;