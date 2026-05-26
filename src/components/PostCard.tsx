import { Link } from "react-router-dom";
import { Eye, Heart, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PostCardData {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  type: string;
  category: string | null;
  tags: string[] | null;
  is_premium: boolean;
  views: number;
  likes_count: number;
}

const typeLabel: Record<string, string> = {
  prompt: "Prompt", tool: "Ferramenta", tutorial: "Tutorial",
  lesson: "Aula", guide: "Guia", article: "Artigo",
};

export const PostCard = ({ post, featured = false }: { post: PostCardData; featured?: boolean }) => (
  <Link to={`/post/${post.slug}`}
    className={`group glass rounded-2xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-1 hover:shadow-glow ${featured ? "md:col-span-2 md:row-span-2" : ""}`}>
    <div className={`relative overflow-hidden ${featured ? "aspect-[16/10]" : "aspect-square"}`}>
      {post.cover_image_url ? (
        <img src={post.cover_image_url} alt={post.title} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      ) : (
        <div className="w-full h-full bg-gradient-aurora animate-shimmer" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
      <div className="absolute top-3 left-3 flex gap-2">
        <Badge variant="secondary" className="backdrop-blur bg-background/60 border border-border/60 text-foreground">
          {typeLabel[post.type] ?? post.type}
        </Badge>
        {post.is_premium && (
          <Badge className="bg-gradient-gold text-primary-foreground border-0">
            <Lock className="h-3 w-3 mr-1" /> Premium
          </Badge>
        )}
      </div>
    </div>
    <div className="p-5 flex flex-col flex-1">
      {post.category && (
        <span className="text-[11px] uppercase tracking-[0.18em] text-primary/80 mb-2">{post.category}</span>
      )}
      <h3 className={`font-display leading-tight ${featured ? "text-2xl md:text-3xl" : "text-lg"} group-hover:text-gradient-gold transition`}>
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
      )}
      <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{post.views}</span>
        <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{post.likes_count}</span>
      </div>
    </div>
  </Link>
);
