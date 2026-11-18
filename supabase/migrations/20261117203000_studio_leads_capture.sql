-- Captura dedicada de leads para iscas digitais e tutoriais do Speculum Studio (/acesso/:slug).
-- Separada de public.atelie_clientes para nao misturar leads de produtos digitais com o CRM high-ticket do Atelie.

CREATE TABLE IF NOT EXISTS public.studio_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  isca_slug TEXT NOT NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  whatsapp_digits TEXT NOT NULL,
  consent_lgpd BOOLEAN NOT NULL DEFAULT true,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  referrer TEXT,
  page_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS studio_leads_slug_created_idx
  ON public.studio_leads (isca_slug, created_at DESC);

CREATE INDEX IF NOT EXISTS studio_leads_email_slug_idx
  ON public.studio_leads (lower(email), isca_slug, created_at DESC);

ALTER TABLE public.studio_leads ENABLE ROW LEVEL SECURITY;

-- Nenhum acesso publico de leitura, edicao ou exclusao.
-- Apenas administradores autenticados consultam os leads capturados.
DROP POLICY IF EXISTS "Admins podem ler studio_leads" ON public.studio_leads;
CREATE POLICY "Admins podem ler studio_leads"
  ON public.studio_leads
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.capture_studio_lead(
  p_isca_slug TEXT,
  p_nome TEXT,
  p_email TEXT,
  p_whatsapp TEXT,
  p_consent_lgpd BOOLEAN DEFAULT true,
  p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_utm_content TEXT DEFAULT NULL,
  p_referrer TEXT DEFAULT NULL,
  p_page_path TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_slug TEXT := lower(trim(coalesce(p_isca_slug, '')));
  v_nome TEXT := trim(coalesce(p_nome, ''));
  v_email TEXT := lower(trim(coalesce(p_email, '')));
  v_whatsapp TEXT := trim(coalesce(p_whatsapp, ''));
  v_digits TEXT := regexp_replace(v_whatsapp, '[^0-9]', '', 'g');
  v_recent_count INTEGER;
  v_lead_id UUID;
BEGIN
  IF length(v_slug) < 2 OR length(v_slug) > 80 OR v_slug !~ '^[a-z0-9-]+$' THEN
    RAISE EXCEPTION 'Identificador de material invalido';
  END IF;

  IF length(v_nome) < 2 OR length(v_nome) > 160 THEN
    RAISE EXCEPTION 'Informe seu nome completo';
  END IF;

  IF length(v_email) < 5 OR length(v_email) > 255 OR v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Informe um e-mail valido';
  END IF;

  IF length(v_digits) < 10 OR length(v_digits) > 15 THEN
    RAISE EXCEPTION 'Informe um WhatsApp valido com DDD';
  END IF;

  IF p_consent_lgpd IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Confirmacao de consentimento obrigatoria';
  END IF;

  SELECT count(*) INTO v_recent_count
  FROM public.studio_leads
  WHERE lower(email) = v_email
    AND isca_slug = v_slug
    AND created_at > now() - interval '1 hour';

  IF v_recent_count >= 5 THEN
    RETURN jsonb_build_object('ok', true, 'duplicate', true);
  END IF;

  INSERT INTO public.studio_leads (
    isca_slug,
    nome,
    email,
    whatsapp,
    whatsapp_digits,
    consent_lgpd,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    referrer,
    page_path
  )
  VALUES (
    v_slug,
    v_nome,
    v_email,
    v_whatsapp,
    v_digits,
    true,
    nullif(left(trim(coalesce(p_utm_source, '')), 120), ''),
    nullif(left(trim(coalesce(p_utm_medium, '')), 120), ''),
    nullif(left(trim(coalesce(p_utm_campaign, '')), 120), ''),
    nullif(left(trim(coalesce(p_utm_content, '')), 120), ''),
    nullif(left(trim(coalesce(p_referrer, '')), 300), ''),
    nullif(left(trim(coalesce(p_page_path, '')), 200), '')
  )
  RETURNING id INTO v_lead_id;

  RETURN jsonb_build_object('ok', true, 'lead_id', v_lead_id);
END;
$$;

REVOKE ALL ON FUNCTION public.capture_studio_lead(
  TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.capture_studio_lead(
  TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated;

-- Correcao de leitura publica de comentarios para visitantes sem login
-- (evita chamar has_role para o papel anon, que teve EXECUTE revogado em 20260504020115).
DROP POLICY IF EXISTS "comments read visible" ON public.comments;
DROP POLICY IF EXISTS "comments public read visible" ON public.comments;
DROP POLICY IF EXISTS "comments own or admin read hidden" ON public.comments;

CREATE POLICY "comments public read visible"
  ON public.comments
  FOR SELECT
  TO anon, authenticated
  USING (NOT is_hidden);

CREATE POLICY "comments own or admin read hidden"
  ON public.comments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
