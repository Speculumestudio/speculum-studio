import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bookmark, Eye, Heart, Lock, MessageCircle, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

interface PostFull {
  id: string; slug: string; title: string; excerpt: string|null;
  cover_image_url: string|null; content: string|null; prompt_text: string|null;
  youtube_url: string|null; type: string; category: string|null; tags: string[]|null;
  is_premium: boolean; views: number; likes_count: number; author_id: string|null;
  published_at: string|null;
}
interface CommentRow {
  id: string; user_id: string; parent_id: string|null; content: string;
  is_answer: boolean; created_at: string;
  profiles?: { full_name: string|null; avatar_url: string|null };
}

const ytId = (url: string|null) => {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/);
  return m?.[1] ?? null;
};

const Post = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<PostFull | null>(null);
  const [author, setAuthor] = useState<any>(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data: p } = await supabase.from("posts").select("*").eq("slug", slug).maybeSingle();
      if (!p) return;
      setPost(p as any);
      await supabase.from("posts").update({ views: (p as any).views + 1 }).eq("id", (p as any).id);
      const { data: a } = await supabase.from("profiles").select("id,full_name,avatar_url,bio").eq("id", (p as any).author_id ?? "").maybeSingle();
      setAuthor(a);
      loadComments((p as any).id);
      if (user) {
        const [{ data: l }, { data: b }, { data: pr }] = await Promise.all([
          supabase.from("likes").select("post_id").eq("post_id", (p as any).id).eq("user_id", user.id).maybeSingle(),
          supabase.from("bookmarks").select("post_id").eq("post_id", (p as any).id).eq("user_id", user.id).maybeSingle(),
          supabase.from("progress").select("progress_percent").eq("post_id", (p as any).id).eq("user_id", user.id).maybeSingle(),
        ]);
        setLiked(!!l); setBookmarked(!!b); setProgress(pr?.progress_percent ?? 0);
      }
    })();
  // eslint-disable-next-line
  }, [slug, user?.id]);

  const loadComments = async (postId: string) => {
    const { data } = await supabase.from("comments")
      .select("id,user_id,parent_id,content,is_answer,created_at, profiles:user_id(full_name,avatar_url)")
      .eq("post_id", postId).eq("is_hidden", false).order("created_at", { ascending: true });
    setComments((data ?? []) as any);
  };

  const toggleLike = async () => {
    if (!user || !post) { toast.error("Entre para curtir"); return; }
    if (liked) {
      await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", post.id);
      setLiked(false);
    } else {
      await supabase.from("likes").insert({ user_id: user.id, post_id: post.id });
      setLiked(true);
    }
  };

  const toggleBookmark = async () => {
    if (!user || !post) { toast.error("Entre para salvar"); return; }
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
    if (!user || !post) { toast.error("Entre para comentar"); return; }
    const parsed = z.string().trim().min(1).max(2000).safeParse(newComment);
    if (!parsed.success) { toast.error("Comentário inválido"); return; }
    const { error } = await supabase.from("comments").insert({
      post_id: post.id, user_id: user.id, content: parsed.data, parent_id: replyTo,
    });
    if (error) { toast.error(error.message); return; }
    setNewComment(""); setReplyTo(null);
    loadComments(post.id);
  };

  const markComplete = async () => {
    if (!user || !post) return;
    await supabase.from("progress").upsert({
      user_id: user.id, post_id: post.id, progress_percent: 100, completed_at: new Date().toISOString(),
    });
    setProgress(100); toast.success("Marcado como concluído");
  };

  if (!post) return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;

  const locked = post.is_premium && !post.content;
  const ytid = ytId(post.youtube_url);
  const roots = comments.filter(c => !c.parent_id);
  const repliesOf = (id: string) => comments.filter(c => c.parent_id === id);

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={`${post.title} — Speculum Studio`}
        description={post.excerpt ?? `${post.title} no Speculum Studio.`}
        path={`/post/${post.slug}`}
        type="article"
        image={post.cover_image_url ?? undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": post.type === "lesson" ? "Course" : "Article",
          headline: post.title,
          description: post.excerpt ?? undefined,
          image: post.cover_image_url ?? undefined,
          datePublished: post.published_at ?? undefined,
          author: author?.full_name ? { "@type": "Person", name: author.full_name } : undefined,
        }}
      />
      <Navbar />
      <article className="container-editorial pt-12 pb-20 max-w-4xl">
        <div className="flex items-center gap-2 mb-5">
          <Badge variant="secondary" className="capitalize">{post.type}</Badge>
          {post.category && <span className="text-xs uppercase tracking-[0.22em] text-primary/80">{post.category}</span>}
          {post.is_premium && <Badge className="bg-gradient-gold text-primary-foreground border-0"><Lock className="h-3 w-3 mr-1" />Premium</Badge>}
        </div>
        <h1 className="font-display text-4xl md:text-6xl leading-[1.05]">{post.title}</h1>
        {post.excerpt && <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{post.excerpt}</p>}

        <div className="mt-8 flex items-center justify-between flex-wrap gap-4">
          <Link to={`/profile/${post.author_id}`} className="flex items-center gap-3 group">
            <Avatar className="h-10 w-10"><AvatarImage src={author?.avatar_url}/><AvatarFallback>{(author?.full_name ?? "?").slice(0,2)}</AvatarFallback></Avatar>
            <div>
              <div className="text-sm group-hover:text-primary transition">{author?.full_name ?? "Anônimo"}</div>
              <div className="text-xs text-muted-foreground">{post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR") : "Rascunho"}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Button variant={liked ? "default" : "outline"} size="sm" onClick={toggleLike} className={liked ? "bg-gradient-gold text-primary-foreground" : ""}>
              <Heart className={`h-4 w-4 mr-1.5 ${liked ? "fill-current" : ""}`} /> {post.likes_count + (liked ? 1 : 0)}
            </Button>
            <Button variant={bookmarked ? "default" : "outline"} size="sm" onClick={toggleBookmark} className={bookmarked ? "bg-gradient-gold text-primary-foreground" : ""} aria-label="Salvar">
              <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
            </Button>
            <span className="text-xs text-muted-foreground inline-flex items-center gap-1 ml-2"><Eye className="h-3.5 w-3.5"/>{post.views}</span>
          </div>
        </div>

        {post.cover_image_url && (
          <div className="mt-10 rounded-2xl overflow-hidden glass">
            <img src={post.cover_image_url} alt={post.title} className="w-full aspect-[16/9] object-cover" loading="lazy" />
          </div>
        )}

        {ytid && (
          <div className="mt-10 rounded-2xl overflow-hidden glass aspect-video">
            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytid}`} title="Vídeo" allowFullScreen />
          </div>
        )}

        {locked ? (
          <div className="mt-12 glass rounded-2xl p-10 text-center">
            <Lock className="h-8 w-8 mx-auto text-primary" />
            <h3 className="font-display text-2xl mt-4">Conteúdo Premium</h3>
            <p className="text-muted-foreground mt-2">Este conteúdo é reservado para membros Premium. Cadastre-se — o Premium chega em breve.</p>
            <Button className="mt-5 bg-gradient-gold text-primary-foreground" asChild><Link to="/login">Tornar-se membro</Link></Button>
          </div>
        ) : (
          <>
            {post.prompt_text && (
              <div className="mt-10 glass rounded-2xl p-6">
                <div className="text-xs uppercase tracking-[0.22em] text-primary/80 mb-3">O prompt</div>
                <pre className="whitespace-pre-wrap text-sm font-mono text-foreground/90">{post.prompt_text}</pre>
              </div>
            )}
            {post.content && (
              <div className="prose prose-invert mt-10 max-w-none font-sans" dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map(t => <Badge key={t} variant="outline">#{t}</Badge>)}
          </div>
        )}

        {post.type === "lesson" && user && (
          <div className="mt-10 glass rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="text-sm">Seu progresso</div>
              <div className="h-2 w-48 rounded bg-muted mt-2 overflow-hidden">
                <div className="h-full bg-gradient-gold" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <Button onClick={markComplete} className="bg-gradient-gold text-primary-foreground">Marcar como concluído</Button>
          </div>
        )}

        <section className="mt-16">
          <h2 className="font-display text-2xl flex items-center gap-2"><MessageCircle className="h-5 w-5"/> {comments.length} comentários</h2>
          {user ? (
            <div className="mt-5 glass rounded-2xl p-4">
              {replyTo && <div className="text-xs text-muted-foreground mb-2">Respondendo… <button className="underline" onClick={()=>setReplyTo(null)}>cancelar</button></div>}
              <Textarea aria-label="Escrever comentário" value={newComment} onChange={(e)=>setNewComment(e.target.value)} placeholder="Compartilhe sua perspectiva…" maxLength={2000} className="bg-background/40" />
              <div className="flex justify-end mt-3">
                <Button onClick={submitComment} className="bg-gradient-gold text-primary-foreground"><Send className="h-4 w-4 mr-2"/>Publicar</Button>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground"><Link to="/login" className="text-primary">Entre</Link> para participar da conversa.</p>
          )}

          <div className="mt-8 space-y-6">
            {roots.map(c => (
              <div key={c.id} className="glass rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9"><AvatarImage src={c.profiles?.avatar_url ?? undefined}/><AvatarFallback>{(c.profiles?.full_name ?? "U").slice(0,2)}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <div className="text-sm">{c.profiles?.full_name ?? "Usuário"} {c.is_answer && <Badge className="ml-2 bg-gradient-gold text-primary-foreground">Útil</Badge>}</div>
                    <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString("pt-BR")}</div>
                    <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap">{c.content}</p>
                    <button className="text-xs text-primary mt-2" onClick={()=>setReplyTo(c.id)}>Responder</button>
                  </div>
                </div>
                {repliesOf(c.id).map(r => (
                  <div key={r.id} className="mt-4 ml-12 pl-4 border-l border-border/60">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8"><AvatarImage src={r.profiles?.avatar_url ?? undefined}/><AvatarFallback>{(r.profiles?.full_name ?? "U").slice(0,2)}</AvatarFallback></Avatar>
                      <div>
                        <div className="text-sm">{r.profiles?.full_name ?? "Usuário"}</div>
                        <p className="mt-1 text-sm whitespace-pre-wrap">{r.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </article>
      <Footer />
    </div>
  );
};

export default Post;
