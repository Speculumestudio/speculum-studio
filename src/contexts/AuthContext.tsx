import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";

type Role = "user" | "contributor" | "admin";

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: Role[];
  isAdmin: boolean;
  isContributor: boolean;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({} as AuthCtx);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    import("@/integrations/supabase/client").then(({ supabase }) => {
      if (!active) return;
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        if (!active) return;
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) {
          setTimeout(() => { if (active) void fetchRoles(s.user.id); }, 0);
        } else {
          setRoles([]);
        }
      });
      unsubscribe = () => sub.subscription.unsubscribe();
      return supabase.auth.getSession().then(({ data }) => {
        if (!active) return;
        setSession(data.session);
        setUser(data.session?.user ?? null);
        if (data.session?.user) void fetchRoles(data.session.user.id);
        setLoading(false);
      });
    }).catch((error) => {
      console.error("Authentication could not initialize", error);
      if (active) setLoading(false);
    });
    return () => { active = false; unsubscribe?.(); };
  }, []);

  const fetchRoles = async (uid: string) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles((data ?? []).map((r) => r.role as Role));
  };

  const signOut = async () => {
    const { supabase } = await import("@/integrations/supabase/client");
    await supabase.auth.signOut();
  };

  return (
    <Ctx.Provider value={{
      user, session, loading, roles,
      isAdmin: roles.includes("admin"),
      isContributor: roles.includes("contributor") || roles.includes("admin"),
      signOut,
    }}>
      {children}
    </Ctx.Provider>
  );
};

export const useAuth = () => useContext(Ctx);
