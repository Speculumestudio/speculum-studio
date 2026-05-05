import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Bookmark, LayoutDashboard, LogOut, Search, User as UserIcon } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";

export const Navbar = () => {
  const { user, isContributor, isAdmin, signOut } = useAuth();
  const nav = useNavigate();

  const links = [
    { to: "/", label: "Início" },
    { to: "/explore", label: "Explorar" },
    { to: "/explore?type=tutorial", label: "Tutoriais" },
    { to: "/explore?type=prompt", label: "Prompts" },
    { to: "/explore?type=tool", label: "Ferramentas" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="container-editorial flex h-16 items-center justify-between gap-6">
        <Logo size={34} />

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {links.map((l) => (
            <NavLink key={l.label} to={l.to} end={l.to === "/"}
              className={({ isActive }) =>
                `transition-colors hover:text-primary ${isActive ? "text-primary" : "text-muted-foreground"}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => nav("/explore")} aria-label="Buscar">
            <Search className="h-4 w-4" />
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full ring-1 ring-border hover:ring-primary/50 transition" aria-label="Menu da conta">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-secondary text-xs">
                      {(user.email ?? "U").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass">
                <DropdownMenuItem onClick={() => nav(`/profile/${user.id}`)}>
                  <UserIcon className="mr-2 h-4 w-4" /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav("/bookmarks")}>
                  <Bookmark className="mr-2 h-4 w-4" /> Salvos
                </DropdownMenuItem>
                {(isContributor || isAdmin) && (
                  <DropdownMenuItem onClick={() => nav("/dashboard")}>
                    <LayoutDashboard className="mr-2 h-4 w-4" /> Painel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" onClick={() => nav("/login")}>Entrar</Button>
          )}
        </div>
      </div>
    </header>
  );
};
