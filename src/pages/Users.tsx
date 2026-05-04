import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Role = "user" | "contributor" | "admin";

const Users = () => {
  const [rows, setRows] = useState<any[]>([]);

  const load = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    const { data: roles } = await supabase.from("user_roles").select("*");
    const merged = (profiles ?? []).map(p => ({ ...p, roles: (roles ?? []).filter(r => r.user_id === p.id).map(r => r.role) }));
    setRows(merged);
  };
  useEffect(() => { load(); }, []);

  const toggleRole = async (uid: string, role: Role, has: boolean) => {
    if (has) await supabase.from("user_roles").delete().eq("user_id", uid).eq("role", role);
    else await supabase.from("user_roles").insert({ user_id: uid, role });
    toast.success("Updated"); load();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container-editorial pt-14 pb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-2">Admin</p>
        <h1 className="font-display text-5xl">Users & roles</h1>

        <div className="mt-10 glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
              <tr><th className="p-4">Member</th><th className="p-4">Roles</th><th className="p-4 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-border/60">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9"><AvatarImage src={r.avatar_url}/><AvatarFallback>{(r.full_name ?? "U").slice(0,2)}</AvatarFallback></Avatar>
                      <div><div>{r.full_name ?? "—"}</div><div className="text-xs text-muted-foreground">{r.email}</div></div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {(r.roles as Role[]).map(role => <Badge key={role} variant="outline" className="capitalize">{role}</Badge>)}
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {(["contributor","admin"] as Role[]).map(role => {
                      const has = r.roles.includes(role);
                      return <Button key={role} size="sm" variant={has ? "default" : "outline"} onClick={() => toggleRole(r.id, role, has)} className={has ? "bg-gradient-gold text-primary-foreground" : ""}>
                        {has ? `Remove ${role}` : `Make ${role}`}
                      </Button>;
                    })}
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

export default Users;
