export type CaptureVisualVariant = "segundo-cerebro";

export interface LeadMagnetConfig {
  slug: string;
  eyebrow: string;
  headline: string;
  highlight: string;
  subheadline: string;
  deliverables: {
    label: string;
    detail: string;
  }[];
  ctaLabel: string;
  trustNote: string;
  destinationPath: string;
  visualVariant: CaptureVisualVariant;
  seoTitle: string;
  seoDescription: string;
  ogImage?: string;
}

export const leadMagnets: LeadMagnetConfig[] = [
  {
    slug: "cerebro",
    eyebrow: "Série IA na Prática · Parte 1",
    headline: "Monte o seu Segundo Cérebro",
    highlight: "direto no computador.",
    subheadline:
      "Libere agora o mapa das 6 pastas, a estrutura do arquivo mestre e os 2 comandos prontos para o Claude Code ou Codex deixarem de entregar respostas genéricas.",
    deliverables: [
      {
        label: "Mapa das 6 pastas operacionais",
        detail: "Estrutura limpa para clientes, ofertas, referências, projetos, ferramentas e regras.",
      },
      {
        label: "Comando 1 de inicialização",
        detail: "Cria a árvore de diretórios, ativa a memória contínua e pede sua aprovação antes de rodar.",
      },
      {
        label: "Comando 2 da base de motores",
        detail: "Configuração inicial de Python, áudio e ambiente de produção para projetos vendáveis.",
      },
    ],
    ctaLabel: "Liberar mapa e comandos agora",
    trustNote: "Acesso imediato na tela seguinte, sem criar senha.",
    destinationPath: "/post/setup-segundo-cerebro-ia",
    visualVariant: "segundo-cerebro",
    seoTitle: "Acesso Gratuito: Mapa e Comandos do Segundo Cérebro | Speculum Studio",
    seoDescription:
      "Receba o mapa das 6 pastas e os 2 comandos de inicialização para estruturar o seu Segundo Cérebro no Claude Code ou Codex.",
    ogImage: "/covers/cover_segundo_cerebro.png",
  },
];

export function getLeadMagnetBySlug(slug: string | undefined): LeadMagnetConfig | undefined {
  if (!slug) return undefined;
  const normalized = slug.trim().toLowerCase();
  return leadMagnets.find((item) => item.slug === normalized);
}
