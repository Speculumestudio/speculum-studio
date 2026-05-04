
-- ENUMS
CREATE TYPE public.app_role AS ENUM ('user','contributor','admin');
CREATE TYPE public.content_type AS ENUM ('prompt','tool','tutorial','lesson','guide','article');
CREATE TYPE public.post_status AS ENUM ('draft','published','archived');

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_premium(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT is_premium FROM public.profiles WHERE id = _user_id), false)
$$;

-- POSTS
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  cover_image_url TEXT,
  content TEXT,
  prompt_text TEXT,
  youtube_url TEXT,
  type content_type NOT NULL DEFAULT 'article',
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  status post_status NOT NULL DEFAULT 'draft',
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_trending BOOLEAN NOT NULL DEFAULT false,
  views INT NOT NULL DEFAULT 0,
  likes_count INT NOT NULL DEFAULT 0,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX ON public.posts (status, published_at DESC);
CREATE INDEX ON public.posts (type);
CREATE INDEX ON public.posts (category);

-- LIKES
CREATE TABLE public.likes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- BOOKMARKS
CREATE TABLE public.bookmarks (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- COMMENTS
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_answer BOOLEAN NOT NULL DEFAULT false,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BADGES
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT
);

CREATE TABLE public.user_badges (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_id)
);

-- PROGRESS
CREATE TABLE public.progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  progress_percent INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, post_id)
);

-- MEDIA
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TRIGGER: auto-create profile + default user role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER posts_updated BEFORE UPDATE ON public.posts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- likes_count maintenance
CREATE OR REPLACE FUNCTION public.bump_likes() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN UPDATE public.posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN UPDATE public.posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.post_id; END IF;
  RETURN NULL;
END; $$;
CREATE TRIGGER likes_count_trg AFTER INSERT OR DELETE ON public.likes FOR EACH ROW EXECUTE FUNCTION public.bump_likes();

-- ENABLE RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "profiles public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles update own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles admin all" ON public.profiles FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ROLES policies
CREATE POLICY "roles read own" ON public.user_roles FOR SELECT USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "roles admin manage" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- POSTS policies
CREATE POLICY "posts public read" ON public.posts FOR SELECT USING (
  status = 'published'
  AND (NOT is_premium OR auth.uid() = author_id OR public.is_premium(auth.uid()) OR public.has_role(auth.uid(),'admin'))
);
CREATE POLICY "posts author read own" ON public.posts FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "posts contributor insert" ON public.posts FOR INSERT WITH CHECK (
  auth.uid() = author_id AND (public.has_role(auth.uid(),'contributor') OR public.has_role(auth.uid(),'admin'))
);
CREATE POLICY "posts author update" ON public.posts FOR UPDATE USING (
  auth.uid() = author_id OR public.has_role(auth.uid(),'admin')
);
CREATE POLICY "posts author delete" ON public.posts FOR DELETE USING (
  auth.uid() = author_id OR public.has_role(auth.uid(),'admin')
);

-- LIKES
CREATE POLICY "likes read all" ON public.likes FOR SELECT USING (true);
CREATE POLICY "likes insert own" ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes delete own" ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- BOOKMARKS
CREATE POLICY "bookmarks read own" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookmarks insert own" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookmarks delete own" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- COMMENTS
CREATE POLICY "comments read visible" ON public.comments FOR SELECT USING (NOT is_hidden OR auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "comments insert own" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments update own or admin" ON public.comments FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "comments delete own or admin" ON public.comments FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- BADGES
CREATE POLICY "badges read all" ON public.badges FOR SELECT USING (true);
CREATE POLICY "badges admin manage" ON public.badges FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "user_badges read all" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "user_badges admin manage" ON public.user_badges FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- PROGRESS
CREATE POLICY "progress read own" ON public.progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "progress upsert own" ON public.progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "progress update own" ON public.progress FOR UPDATE USING (auth.uid() = user_id);

-- MEDIA
CREATE POLICY "media read all" ON public.media FOR SELECT USING (true);
CREATE POLICY "media insert own" ON public.media FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "media admin delete" ON public.media FOR DELETE USING (auth.uid() = uploaded_by OR public.has_role(auth.uid(),'admin'));

-- STORAGE BUCKET
INSERT INTO storage.buckets (id, name, public) VALUES ('media','media', true) ON CONFLICT DO NOTHING;
CREATE POLICY "media bucket public read" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "media bucket auth upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.uid() IS NOT NULL);
CREATE POLICY "media bucket owner update" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND owner = auth.uid());
CREATE POLICY "media bucket owner delete" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND (owner = auth.uid() OR public.has_role(auth.uid(),'admin')));
