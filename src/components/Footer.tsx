import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export const Footer = () => (
  <footer className="mt-24 border-t border-border/60">
    <div className="container-editorial py-14 grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-gold grid place-items-center"><Sparkles className="h-4 w-4 text-primary-foreground" /></div>
          <span className="font-display text-xl">Speculum <span className="text-gradient-gold">Studio</span></span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
          A premium editorial space for AI craft — prompts, tutorials, lessons and tools curated for the makers shaping the next decade.
        </p>
      </div>
      <div>
        <h4 className="font-display text-sm mb-3">Discover</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/explore" className="hover:text-primary">Explore</Link></li>
          <li><Link to="/explore?type=prompt" className="hover:text-primary">Prompts</Link></li>
          <li><Link to="/explore?type=tutorial" className="hover:text-primary">Tutorials</Link></li>
          <li><Link to="/explore?type=tool" className="hover:text-primary">Tools</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-display text-sm mb-3">Studio</h4>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><Link to="/login" className="hover:text-primary">Sign in</Link></li>
          <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
        </ul>
      </div>
    </div>
    <div className="container-editorial py-6 border-t border-border/60 text-xs text-muted-foreground flex justify-between">
      <span>© {new Date().getFullYear()} Speculum Studio</span>
      <span>Crafted with care.</span>
    </div>
  </footer>
);
