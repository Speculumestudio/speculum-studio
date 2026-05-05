import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Image, Plus, Users, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const STATUS_LABEL: Record<string, string> = { draft: "Rascunho", published: "Publicado", archived: "Arquivado" };

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const nav = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    let q = supabase.from("posts").select("id,slug,title,type,status,is_premium,views,likes_count,published_at,author_id").order("created_at", { ascending: false });
    if (!isAdmin) q = q.eq("author_id", user.id);
    q.then(({ data }) => setPosts(data ?? []));
  }, [user, isAdmin]);

  const del = async (id: string) => {
    if (!confirm("Excluir este conteúdo?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) toast.error(error.message); else { setPosts(posts.filter(p => p.id !== id)); toast.success("Excluído"); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container-editorial pt-14 pb-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary/80 mb-2">Estúdio</p>
            <h1 className="font-display text-5xl">Painel</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button asChild variant="outline"><Link to="/media"><Image className="h-4 w-4 mr-2" />Mídia</Link></Button>
            {isAdmin && <Button asChild variant="outline"><Link to="/users"><Users className="h-4 w-4 mr-2" />Usuários</Link></Button>}
            <Button asChild className="bg-gradient-gold text-primary-foreground"><Link to="/editor"><Plus className="h-4 w-4 mr-2"/>Novo conteúdo</Link></Button>
          </div>
        </div>

        <div className="mt-10 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr><th className="p-4">Título</th><th className="p-4">Tipo</th><th className="p-4">Status</th><th className="p-4">Visualizações</th><th className="p-4">Curtidas</th><th className="p-4"></th></tr>
            </thead>
            <tbody>
              {posts.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum conteúdo ainda. <Link to="/editor" className="text-primary">Crie o primeiro.</Link></td></tr>}
              {posts.map(p => (
                <tr key={p.id} className="border-t border-border/60 hover:bg-muted/20">
                  <td className="p-4 font-medium">{p.title}</td>
                  <td className="p-4 capitalize text-muted-foreground">{p.type}</td>
                  <td className="p-4"><Badge variant={p.status === "published" ? "default" : "outline"}>{STATUS_LABEL[p.status] ?? p.status}</Badge>{p.is_premium && <Badge className="ml-2 bg-gradient-gold text-primary-foreground">Premium</Badge>}</td>
                  <td className="p-4 text-muted-foreground">{p.views}</td>
                  <td className="p-4 text-muted-foreground">{p.likes_count}</td>
                  <td className="p-4 text-right">
                    <Button size="icon" variant="ghost" onClick={() => nav(`/editor/${p.id}`)} aria-label="Editar"><Pencil className="h-4 w-4"/></Button>
                    <Button size="icon" variant="ghost" onClick={() => del(p.id)} aria-label="Excluir"><Trash2 className="h-4 w-4"/></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Dashboard;
