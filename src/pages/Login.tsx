import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email("Invalid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
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
        toast.success("Welcome to Speculum Studio.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      nav("/");
    } catch (e: any) {
      toast.error(e.message ?? "Authentication failed");
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error("Google sign-in failed");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container-editorial flex-1 grid place-items-center py-16">
        <div className="w-full max-w-md glass rounded-3xl p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Members</p>
          <h1 className="font-display text-4xl mt-2">Enter the studio.</h1>
          <p className="text-sm text-muted-foreground mt-2">Save, comment, track progress — and shape what comes next.</p>

          <Button onClick={handleGoogle} variant="outline" className="w-full mt-7 h-11">
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.94h5.28c-.23 1.4-1.66 4.1-5.28 4.1-3.18 0-5.78-2.63-5.78-5.88s2.6-5.88 5.78-5.88c1.81 0 3.02.77 3.71 1.43l2.53-2.44C16.83 3.91 14.84 3 12.18 3 6.97 3 2.78 7.19 2.78 12.4s4.19 9.4 9.4 9.4c5.43 0 9.03-3.81 9.03-9.18 0-.62-.07-1.09-.16-1.52z"/></svg>
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 hairline" /> or <div className="flex-1 hairline" />
          </div>

          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-3 mt-5">
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
              <Button onClick={() => handleEmail("signin")} disabled={loading} className="w-full bg-gradient-gold text-primary-foreground">
                {loading ? "…" : "Sign in"}
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-3 mt-5">
              <div><Label>Full name</Label><Input value={name} onChange={(e)=>setName(e.target.value)} /></div>
              <div><Label>Email</Label><Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
              <div><Label>Password</Label><Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} /></div>
              <Button onClick={() => handleEmail("signup")} disabled={loading} className="w-full bg-gradient-gold text-primary-foreground">
                {loading ? "…" : "Create account"}
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
