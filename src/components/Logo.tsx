import { Link } from "react-router-dom";
import logo from "@/assets/logo-speculum.png";

export const Logo = ({ size = 36, withWordmark = true, className = "" }: { size?: number; withWordmark?: boolean; className?: string }) => (
  <Link to="/" className={`flex items-center gap-3 group ${className}`}>
    <img
      src={logo}
      alt="Speculum Studio"
      width={size}
      height={size}
      className="object-contain drop-shadow-[0_2px_12px_rgba(212,175,55,0.35)] transition-transform duration-500 group-hover:scale-[1.04]"
      style={{ height: size, width: size }}
    />
    {withWordmark && (
      <span className="font-display text-xl tracking-tight leading-none">
        Speculum<span className="text-gradient-gold"> Studio</span>
      </span>
    )}
  </Link>
);
