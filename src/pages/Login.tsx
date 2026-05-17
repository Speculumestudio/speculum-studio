import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import logo from "@/assets/logo-speculum.png";

const schema = z.object({
  email: z.string().trim().email("E-mail inválido").max(255),
  password: z.string().min(6, "Mínimo de 6 caracteres").max(72),
});

const Login = () => {
  const nav = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (user) nav("/", { replace: true }); }, [user, nav]);

  const handleEmail = async (mode: "signin" | "signup") => {
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Bem-vindo ao Speculum Studio.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      nav("/");
    } catch (e: any) {
      toast.error(e.message ?? "Falha na autenticação");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) toast.error("Falha no login com Google");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Seo
        title="Entrar no Speculum Studio"
        description="Acesse sua conta no Speculum Studio para salvar conteúdos, comentar e acompanhar seu progresso."
        path="/login"
      />
      <Navbar />
      <section className="container-editorial flex-1 grid place-items-center py-16">
        <div className="w-full max-w-md glass rounded-3xl p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            <img src={logo} alt="Speculum Studio" className="h-20 w-20 object-contain drop-shadow-[0_4px_20px_rgba(212,175,55,0.35)]" />
            <p className="mt-5 text-xs uppercase tracking-[0.25em] text-primary/80">Membros</p>
            <h1 className="font-display text-4xl mt-2">Entre no estúdio.</h1>
            <p className="text-sm text-muted-foreground mt-2">Salve, comente, acompanhe seu progresso — e ajude a moldar o que vem a seguir.</p>
          </div>

          <Button onClick={handleGoogle} variant="outline" className="w-full mt-7 h-11">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.94h5.28c-.23 1.4-1.66 4.1-5.28 4.1-3.18 0-5.78-2.63-5.78-5.88s2.6-5.88 5.78-5.88c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.83 3.91 14.84 3 12.18 3 6.97 3 2.78 7.19 2.78 12.4s4.19 9.4 9.4 9.4c5.43 0 9.03-3.81 9.03-9.18 0-.62-.07-1.09-.16-1.52z"/></svg>
            Continuar com Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 hairline" /> ou <div className="flex-1 hairline" />
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-3 mt-5">
              <div><Label htmlFor="signin-email">E-mail</Label><Input id="signin-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
              <div><Label htmlFor="signin-password">Senha</Label><Input id="signin-password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
              <Button onClick={() => handleEmail("signin")} disabled={loading} className="w-full bg-gradient-gold text-primary-foreground">
                {loading ? "…" : "Entrar"}
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-3 mt-5">
              <div><Label htmlFor="signup-name">Nome completo</Label><Input id="signup-name" value={name} onChange={(e)=>setName(e.target.value)} /></div>
              <div><Label htmlFor="signup-email">E-mail</Label><Input id="signup-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
              <div><Label htmlFor="signup-password">Senha</Label><Input id="signup-password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
              <Button onClick={() => handleEmail("signup")} disabled={loading} className="w-full bg-gradient-gold text-primary-foreground">
                {loading ? "…" : "Criar conta"}
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;
