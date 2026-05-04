import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostCard, PostCardData } from "@/components/PostCard";
import { useAuth } from "@/contexts/AuthContext";

const Bookmarks = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostCardData[]>([]);
  useEffect(() => {
    if (!user) return;
    supabase.from("bookmarks").select("posts(id,slug,title,excerpt,cover_image_url,type,category,tags,is_premium,views,likes_count)").eq("user_id", user.id)
      .then(({ data }) => setPosts(((data ?? []).map((b: any) => b.posts).filter(Boolean)) as PostCardData[]));
  }, [user]);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="container-editorial pt-14 pb-20">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/80 mb-3">Library</p>
        <h1 className="font-display text-5xl">Your bookmarks.</h1>
        <p className="mt-3 text-muted-foreground">Everything you've saved, in one quiet place.</p>
        <div className="mt-10">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">Nothing saved yet. Browse the studio and tap the bookmark icon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{posts.map(p => <PostCard key={p.id} post={p} />)}</div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Bookmarks;
