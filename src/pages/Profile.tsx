import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PostCard, PostCardData } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const [bookmarks, setBookmarks] = useState<PostCardData[]>([]);
  const [stats, setStats] = useState({ posts: 0, completed: 0 });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(""); const [bio, setBio] = useState(""); const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle();
      setProfile(p); setName(p?.full_name ?? ""); setBio(p?.bio ?? ""); setAvatar(p?.avatar_url ?? "");
      const { data: posts } = await supabase.from("posts")
        .select("id,slug,title,excerpt,cover_image_url,type,category,tags,is_premium,views,likes_count")
        .eq("author_id", id).eq("status", "published").order("published_at", { ascending: false });
      setPosts((posts ?? []) as PostCardData[]);
      if (user?.id === id) {
        const { data: bm } = await supabase.from("bookmarks").select("posts(id,slug,title,excerpt,cover_image_url,type,category,tags,is_premium,views,likes_count)").eq("user_id", id);
        setBookmarks(((bm ?? []).map((b: any) => b.posts).filter(Boolean)) as PostCardData[]);
      }
      const { count } = await supabase.from("progress").select("*", { count: "exact", head: true }).eq("user_id", id).not("completed_at","is",null);
      setStats({ posts: posts?.length ?? 0, completed: count ?? 0 });
    })();
  }, [id, user?.id]);

  const save = async () => {
    if (!user || user.id !== id) return;
    const { error } = await supabase.from("profiles").update({ full_name: name, bio, avatar_url: avatar }).eq("id", user.id);
    if (error) toast.error(error.message); else { toast.success("Salvo"); setEditing(false); setProfile({ ...profile, full_name: name, bio, avatar_url: avatar }); }
  };

  if (!profile) return <div className="min-h-screen grid place-items-center text-muted-foreground">Carregando…</div>;
  const isOwn = user?.id === id;

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title={`${profile.full_name ?? "Perfil"} — Speculum Studio`}
        description={profile.bio ?? `Perfil de ${profile.full_name ?? "membro"} no Speculum Studio.`}
        path={`/profile/${id}`}
      />
      <Navbar />
      <section className="container-editorial pt-14 pb-10">
        <div className="glass rounded-3xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
          <Avatar className="h-28 w-28"><AvatarImage src={profile.avatar_url}/><AvatarFallback className="text-2xl">{(profile.full_name ?? "U").slice(0,2)}</AvatarFallback></Avatar>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3 max-w-md">
                <Input aria-label="Nome completo" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nome completo" />
                <Input aria-label="URL do avatar" value={avatar} onChange={(e)=>setAvatar(e.target.value)} placeholder="URL do avatar" />
                <Textarea aria-label="Mini bio" value={bio} onChange={(e)=>setBio(e.target.value)} placeholder="Mini bio" maxLength={500} />
                <div className="flex gap-2"><Button onClick={save} className="bg-gradient-gold text-primary-foreground">Salvar</Button><Button variant="ghost" onClick={()=>setEditing(false)}>Cancelar</Button></div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-4xl">{profile.full_name ?? "Sem nome"}</h1>
                {profile.bio && <p className="mt-3 text-muted-foreground max-w-xl leading-relaxed">{profile.bio}</p>}
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge variant="outline">{stats.posts} contribuições</Badge>
                  <Badge variant="outline">{stats.completed} aulas concluídas</Badge>
                  {profile.is_premium && <Badge className="bg-gradient-gold text-primary-foreground">Premium</Badge>}
                </div>
                {isOwn && <Button variant="outline" className="mt-5" onClick={()=>setEditing(true)}>Editar perfil</Button>}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="container-editorial pb-10">
        <h2 className="font-display text-2xl mb-6">Contribuições</h2>
        {posts.length === 0 ? <p className="text-muted-foreground text-sm">Nenhum conteúdo publicado ainda.</p> :
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{posts.map(p => <PostCard key={p.id} post={p} />)}</div>}
      </section>

      {isOwn && bookmarks.length > 0 && (
        <section className="container-editorial pb-20">
          <h2 className="font-display text-2xl mb-6">Salvos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{bookmarks.map(p => <PostCard key={p.id} post={p} />)}</div>
        </section>
      )}
      <Footer />
    </div>
  );
};

export default Profile;
