import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export const Footer = () => (
  <footer className="mt-24 border-t border-border/60 bg-green-950">
    <div className="container-editorial py-14 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <Logo size={40} />
        <p className="mt-5 text-sm text-muted-foreground max-w-md leading-relaxed">
          Um espaço editorial para quem cria com inteligência — prompts, tutoriais, aulas, ferramentas e guias selecionados para os criadores que estão moldando a próxima década.
        </p>
        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-primary/70">
          Lux Imaginis · Vox Interioris
        </p>
      </div>
      <div>
        <h4 className="font-display text-sm mb-3">Descobrir</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/explore" className="hover:text-primary">Explorar</Link></li>
          <li><Link to="/explore?type=prompt" className="hover:text-primary">Prompts</Link></li>
          <li><Link to="/explore?type=tutorial" className="hover:text-primary">Tutoriais</Link></li>
          <li><Link to="/explore?type=tool" className="hover:text-primary">Ferramentas</Link></li>
          <li><Link to="/explore?type=lesson" className="hover:text-primary">Aulas</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-sm mb-3">Estúdio</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/login" className="hover:text-primary">Entrar</Link></li>
          <li><Link to="/dashboard" className="hover:text-primary">Painel</Link></li>
          <li><Link to="/bookmarks" className="hover:text-primary">Salvos</Link></li>
        </ul>
      </div>
    </div>
    <div className="container-editorial py-6 border-t border-border/60 text-xs text-muted-foreground flex flex-wrap gap-2 justify-between">
      <span>© {new Date().getFullYear()} Speculum Studio</span>
      <span>Feito com cuidado editorial.</span>
    </div>
  </footer>
);
