import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";

export const Footer = () => (
  <footer className="mt-24 border-t border-border/60">
    <div className="container-editorial py-14 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <Logo size={40} />
        <p className="mt-5 text-sm text-muted-foreground max-w-md leading-relaxed">
          Construção de marca, conteúdo, fotografia e audiovisual. Um estúdio que compartilha o que aprende criando.
        </p>
        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-primary/70">
          Lux Imaginis · Vox Interioris
        </p>
      </div>
      <div>
        <h4 className="font-display text-sm mb-3">Descobrir</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/explore" className="hover:text-primary">Todas as matérias</Link></li>
          <li><Link to="/explore?type=prompt" className="hover:text-primary">Prompts</Link></li>
          <li><Link to="/explore?type=tutorial" className="hover:text-primary">Tutoriais</Link></li>
          <li><Link to="/explore?type=tool" className="hover:text-primary">Ferramentas</Link></li>
          <li><Link to="/explore?type=lesson" className="hover:text-primary">Aulas</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-sm mb-3">Estúdio</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/nosso-estudio" className="hover:text-primary">Nosso Estúdio</Link></li>
          <li><Link to="/servicos/construcao-de-marca" className="hover:text-primary">Construção de marca</Link></li>
          <li><Link to="/servicos/producao-audiovisual" className="hover:text-primary">Produção audiovisual</Link></li>
          <li><Link to="/servicos/retratos-profissionais" className="hover:text-primary">Retratos profissionais</Link></li>
          <li><a href="https://speculum-atelie.vercel.app" className="hover:text-primary" target="_blank" rel="noopener noreferrer">Acessar o Ateliê</a></li>
        </ul>
      </div>
    </div>
    <div className="container-editorial py-6 border-t border-border/60 text-xs text-muted-foreground flex flex-wrap gap-2 justify-between">
      <span>© {new Date().getFullYear()} Speculum Studio</span>
      <span>Feito com cuidado editorial.</span>
    </div>
  </footer>
);
