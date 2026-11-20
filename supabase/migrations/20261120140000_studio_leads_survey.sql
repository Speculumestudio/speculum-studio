-- Adiciona campos de qualificacao/pesquisa de lead (3 perguntas rapidas)
ALTER TABLE public.studio_leads
  ADD COLUMN IF NOT EXISTS perfil_atuacao TEXT,
  ADD COLUMN IF NOT EXISTS nivel_ia TEXT,
  ADD COLUMN IF NOT EXISTS objetivo_principal TEXT;

-- Atualiza a funcao capture_studio_lead para aceitar campos opcionais de qualificacao
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
  p_page_path TEXT DEFAULT NULL,
  p_perfil_atuacao TEXT DEFAULT NULL,
  p_nivel_ia TEXT DEFAULT NULL,
  p_objetivo_principal TEXT DEFAULT NULL
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
    page_path,
    perfil_atuacao,
    nivel_ia,
    objetivo_principal
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
    nullif(left(trim(coalesce(p_page_path, '')), 200), ''),
    nullif(left(trim(coalesce(p_perfil_atuacao, '')), 100), ''),
    nullif(left(trim(coalesce(p_nivel_ia, '')), 100), ''),
    nullif(left(trim(coalesce(p_objetivo_principal, '')), 120), '')
  )
  RETURNING id INTO v_lead_id;

  RETURN jsonb_build_object('ok', true, 'lead_id', v_lead_id);
END;
$$;

-- Permissoes para a versao expandida de capture_studio_lead
GRANT EXECUTE ON FUNCTION public.capture_studio_lead(
  TEXT, TEXT, TEXT, TEXT, BOOLEAN, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated;

-- Funcao para atualizar as 3 respostas de qualificacao do lead (Passo 2)
CREATE OR REPLACE FUNCTION public.update_studio_lead_survey(
  p_lead_id UUID,
  p_perfil_atuacao TEXT DEFAULT NULL,
  p_nivel_ia TEXT DEFAULT NULL,
  p_objetivo_principal TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF p_lead_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'lead_id obrigatorio');
  END IF;

  UPDATE public.studio_leads
  SET
    perfil_atuacao = coalesce(nullif(left(trim(p_perfil_atuacao), 100), ''), perfil_atuacao),
    nivel_ia = coalesce(nullif(left(trim(p_nivel_ia), 100), ''), nivel_ia),
    objetivo_principal = coalesce(nullif(left(trim(p_objetivo_principal), 120), ''), objetivo_principal)
  WHERE id = p_lead_id;

  RETURN jsonb_build_object('ok', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_studio_lead_survey(
  UUID, TEXT, TEXT, TEXT
) TO anon, authenticated;
