import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const Editor = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: "", slug: "", excerpt: "", content: "", prompt_text: "", youtube_url: "",
    cover_image_url: "", type: "article", category: "", tags: "",
    status: "draft", is_premium: false, is_featured: false, is_trending: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("posts").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (data) setForm({ ...form, ...data, tags: (data.tags ?? []).join(", ") } as any);
    });
    // eslint-disable-next-line
  }, [id]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const upload = async (file: File) => {
    if (!user) return;
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) { toast.error(error.message); return; }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    set("cover_image_url", data.publicUrl);
    await supabase.from("media").insert({ url: data.publicUrl, type: file.type, uploaded_by: user.id });
    toast.success("Uploaded");
  };

  const save = async (status?: string) => {
    if (!user) return;
    if (!form.title) return toast.error("Title required");
    setLoading(true);
    const slug = form.slug || slugify(form.title);
    const payload: any = {
      ...form, slug,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      author_id: user.id,
      status: status ?? form.status,
      published_at: (status === "published" || form.status === "published") ? new Date().toISOString() : null,
    };
    const res = id
      ? await supabase.from("posts").update(payload).eq("id", id).select().single()
      : await supabase.from("posts").insert(payload).select().single();
    setLoading(false);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    nav(`/editor/${res.data.id}`, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container-editorial pt-14 pb-20 max-w-4xl">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-2">Composition</p>
        <h1 className="font-display text-4xl">{id ? "Edit post" : "New post"}</h1>

        <div className="mt-10 glass rounded-2xl p-6 md:p-8 space-y-5">
          <div><Label>Title</Label><Input value={form.title} onChange={(e)=>set("title", e.target.value)} maxLength={200} /></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Slug</Label><Input value={form.slug} onChange={(e)=>set("slug", e.target.value)} placeholder={slugify(form.title)} /></div>
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v)=>set("type", v)}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>{["prompt","tool","tutorial","lesson","guide","article"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><Label>Category</Label><Input value={form.category} onChange={(e)=>set("category", e.target.value)} /></div>
            <div><Label>Tags (comma-separated)</Label><Input value={form.tags} onChange={(e)=>set("tags", e.target.value)} /></div>
          </div>
          <div><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e)=>set("excerpt", e.target.value)} maxLength={500} /></div>
          <div>
            <Label>Cover image</Label>
            <div className="flex gap-2 items-center">
              <Input value={form.cover_image_url} onChange={(e)=>set("cover_image_url", e.target.value)} placeholder="https://…" />
              <Input type="file" accept="image/*" className="max-w-xs" onChange={(e)=>e.target.files?.[0] && upload(e.target.files[0])} />
            </div>
          </div>
          <div><Label>YouTube URL</Label><Input value={form.youtube_url} onChange={(e)=>set("youtube_url", e.target.value)} /></div>
          <div><Label>Prompt text</Label><Textarea value={form.prompt_text} onChange={(e)=>set("prompt_text", e.target.value)} className="font-mono text-sm" /></div>
          <div><Label>Content (HTML)</Label><Textarea rows={14} value={form.content} onChange={(e)=>set("content", e.target.value)} className="font-mono text-sm" /></div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_premium} onCheckedChange={(v)=>set("is_premium", v)} />Premium</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_featured} onCheckedChange={(v)=>set("is_featured", v)} />Featured</label>
            <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_trending} onCheckedChange={(v)=>set("is_trending", v)} />Trending</label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/60">
            <Button variant="outline" onClick={() => save("draft")} disabled={loading}>Save draft</Button>
            <Button onClick={() => save("published")} disabled={loading} className="bg-gradient-gold text-primary-foreground">Publish</Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Editor;
