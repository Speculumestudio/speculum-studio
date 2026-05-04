import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Copy, Trash2 } from "lucide-react";

const MediaLibrary = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  const load = () => supabase.from("media").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
  useEffect(() => { load(); }, []);

  const upload = async (file: File) => {
    if (!user) return;
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("media").upload(path, file);
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    await supabase.from("media").insert({ url: data.publicUrl, type: file.type, uploaded_by: user.id });
    toast.success("Uploaded"); load();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container-editorial pt-14 pb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-2">Studio</p>
        <h1 className="font-display text-5xl">Media library</h1>
        <div className="mt-8 glass rounded-2xl p-5">
          <Input type="file" accept="image/*,video/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map(m => (
            <div key={m.id} className="glass rounded-xl overflow-hidden group">
              <div className="aspect-square bg-muted">
                {m.type?.startsWith("image") ? <img src={m.url} alt="" className="w-full h-full object-cover" loading="lazy" /> : <div className="grid place-items-center h-full text-muted-foreground text-xs">{m.type}</div>}
              </div>
              <div className="p-2 flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(m.url); toast.success("URL copied"); }}><Copy className="h-3.5 w-3.5"/></Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MediaLibrary;
