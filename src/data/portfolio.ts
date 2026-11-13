export type PortfolioCategory = "todos" | "branding" | "audiovisual" | "retratos" | "conteudo";

export interface PortfolioProject {
  id: string;
  title: string;
  client: string;
  profession: string;
  category: "branding" | "audiovisual" | "retratos" | "conteudo";
  categoryLabel: string;
  serviceSlug: string;
  thumbnail: string;
  videoSrc?: string;
  poster?: string;
  duration?: string;
  format?: "landscape" | "vertical";
  objectPosition?: string;
  explanation: string;
}

export interface PartnerCompany {
  id: string;
  name: string;
  segment: string;
  scope: string;
  logoUrl: string;
  isSvg?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  profession: string;
  avatar: string;
  quote: string;
  service: string;
}

export const portfolioCategories: Array<{ id: PortfolioCategory; label: string }> = [
  { id: "todos", label: "Todos os Trabalhos" },
  { id: "branding", label: "Construção de Marcas" },
  { id: "audiovisual", label: "Produção Audiovisual" },
  { id: "retratos", label: "Retratos de Autoridade" },
  { id: "conteudo", label: "Conteúdo & Comunicação" },
];

export const allPortfolioProjects: PortfolioProject[] = [
  {
    id: "40-anos-resistencia",
    title: "40 Anos da Resistência",
    client: "Resistência Karatê",
    profession: "Sensei Paulo Bartolo · Mestre de Karatê-Do Shotokan",
    category: "audiovisual",
    categoryLabel: "Documentário & Institucional",
    serviceSlug: "producao-audiovisual",
    thumbnail: "/media/portfolio-resistencia-40-anos-poster.webp",
    poster: "/media/portfolio-resistencia-40-anos-poster.webp",
    videoSrc: "/media/portfolio-resistencia-40-anos.mp4",
    duration: "3:27",
    explanation: "Filme institucional e histórico celebrando quatro décadas de tradição marcial em Santos. Uma produção focada na velocidade e precisão dos katas, no resgate documental das origens do dojô e na filosofia transmitida pelo Sensei Paulo Bartolo a gerações de atletas.",
  },
  {
    id: "jardins-do-taquaral",
    title: "Jardins do Taquaral",
    client: "Jardins do Taquaral",
    profession: "Raphael Matheus · Síndico Profissional",
    category: "audiovisual",
    categoryLabel: "Gestão Predial & Espaço",
    serviceSlug: "producao-audiovisual",
    thumbnail: "/media/portfolio-jardins-do-taquaral-poster.webp",
    poster: "/media/portfolio-jardins-do-taquaral-poster.webp",
    videoSrc: "/media/portfolio-jardins-do-taquaral.mp4",
    duration: "4:31",
    explanation: "Registro cinematográfico concebido para evidenciar a harmonia entre arquitetura autoral, luz natural e a vegetação do Jardins do Taquaral. Movimentos fluídos de câmera e planos detalhados que traduzem a sensação de habitar o projeto.",
  },
  {
    id: "gashuku-resistencia",
    title: "Gashuku · Imersão Marcial",
    client: "Resistência Karatê · JKA",
    profession: "Sensei Paulo Bartolo · Mestre de Karatê-Do Shotokan",
    category: "audiovisual",
    categoryLabel: "Imersão & Filosofia Marcial",
    serviceSlug: "producao-audiovisual",
    thumbnail: "/media/portfolio-gashuku-poster.webp",
    poster: "/media/portfolio-gashuku-poster.webp",
    videoSrc: "/media/portfolio-gashuku.mp4",
    duration: "2:24",
    format: "vertical",
    explanation: "Documentação audiovisual do tradicional treinamento intensivo (Gashuku). Uma captação imersiva focada no som da respiração, no impacto das técnicas sobre o gramado ao amanhecer e na resistência física e mental dos faixas-pretas.",
  },
  {
    id: "dossie-nicolle-albanezi",
    title: "Posicionamento Clínico & Tese Editorial",
    client: "Dra. Nicolle Albanezi",
    profession: "Nutricionista Clínica & Comportamental",
    category: "conteudo",
    categoryLabel: "Estratégia Editorial & Autoridade",
    serviceSlug: "conteudo-e-presenca-digital",
    thumbnail: "/covers/real/servico-conteudo-nicolle.webp",
    objectPosition: "center 12%",
    explanation: "Estruturação completa da presença digital e da autoridade profissional da Dra. Nicolle Albanezi. Desenvolvimento do Dossiê Estratégico, tese editorial de combate aos mitos alimentares e condução de sessões de gravação dirigidas para consolidação de público qualificado.",
  },
  {
    id: "retratos-roger-vasconcelos",
    title: "Retratos de Autoridade & Presença Executiva",
    client: "Dr. Roger Vasconcelos",
    profession: "Odontologista · Reabilitação Oral",
    category: "retratos",
    categoryLabel: "Retrato Profissional & Arquétipo",
    serviceSlug: "retratos-profissionais",
    thumbnail: "/covers/real/servico-retratos-roger.webp",
    explanation: "Sessão de retratos dirigida para aproximar precisão técnica, acolhimento e sofisticação no posicionamento do Dr. Roger Vasconcelos. Iluminação controlada de estúdio e enquadramentos focados na transmissão imediata de confiança para pacientes de alta complexidade.",
  },
  {
    id: "retratos-charles-laveso",
    title: "Retrato Autoral & Presença Artística",
    client: "Charles Laveso",
    profession: "Artista Visual & Professor de Desenho Realista",
    category: "retratos",
    categoryLabel: "Retratos de Posicionamento",
    serviceSlug: "retratos-profissionais",
    thumbnail: "/covers/real/servico-retratos-charles.webp",
    explanation: "Direção de imagem e retratos de estúdio concebidos para valorizar a intensidade criativa, a disciplina de ateliê e a autoridade técnica em artes visuais.",
  },
  {
    id: "brandbook-resistencia",
    title: "Jornada Arquetípica de Marca",
    client: "Resistência Karatê",
    profession: "Sensei Paulo Bartolo · Mestre de Karatê-Do",
    category: "branding",
    categoryLabel: "Brandbook & Posicionamento",
    serviceSlug: "construcao-de-marca",
    thumbnail: "/covers/real/servico-construcao-marca.webp",
    explanation: "Redefinição dos pilares de identidade, tom de voz e diretrizes visuais para a Academia Resistência Karatê. Alinhamento entre os valores seculares das artes marciais japonesas e a comunicação contemporânea com alunos e famílias.",
  },
  {
    id: "acai-do-kel-branding",
    title: "Identidade & Estratégia de Franquia",
    client: "Açaí do Kel",
    profession: "Gastronomia & Operação Comercial",
    category: "branding",
    categoryLabel: "Brandbook Comercial & Expansão",
    serviceSlug: "construcao-de-marca",
    thumbnail: "/covers/real/servico-fotografia-comercial-cafe.webp",
    explanation: "Reestruturação do brandbook e padronização visual da marca Açaí do Kel para suporte ao processo de expansão. Alinhamento de cores, pontos de contato, cardápios físicos e comunicação digital.",
  },
];

export const partnerCompanies: PartnerCompany[] = [
  {
    id: "resistencia",
    name: "Resistência Karatê",
    segment: "Tradição & Artes Marciais",
    scope: "Audiovisual & Branding",
    logoUrl: "/logos/clients/logo-resistencia-karate.png",
  },
  {
    id: "nicolle",
    name: "Dra. Nicolle Albanezi",
    segment: "Nutrição de Precisão",
    scope: "Conteúdo & Autoridade",
    logoUrl: "/logos/clients/logo-nicolle-albanezi.png",
  },
  {
    id: "taquaral",
    name: "Jardins do Taquaral",
    segment: "Gestão Predial & Espaço",
    scope: "Produção Audiovisual",
    logoUrl: "/logos/clients/logo-jardins-do-taquaral.svg",
    isSvg: true,
  },
  {
    id: "sarkissian",
    name: "Sarkissian Odontologia",
    segment: "Odontologia de Alto Padrão",
    scope: "Retratos de Autoridade",
    logoUrl: "/logos/clients/logo-sarkissian-odontologia.svg",
    isSvg: true,
  },
  {
    id: "roger",
    name: "Dr. Roger Vasconcelos",
    segment: "Odontologia & Reabilitação",
    scope: "Retratos de Posicionamento",
    logoUrl: "/logos/clients/logo-roger-vasconcelos.svg",
    isSvg: true,
  },
  {
    id: "acai-kel",
    name: "Açaí do Kel",
    segment: "Gastronomia & Franquias",
    scope: "Branding & Social Media",
    logoUrl: "/logos/clients/logo-acai-do-kel.png",
  },
  {
    id: "laras",
    name: "Lara's Pizza",
    segment: "Gastronomia Artesanal",
    scope: "Identidade & Embalagens",
    logoUrl: "/logos/clients/logo-laras-pizza.svg",
    isSvg: true,
  },
  {
    id: "transmartyna",
    name: "Transmartyna Logística",
    segment: "Transporte Portuário & Cargas",
    scope: "Comunicação Institucional",
    logoUrl: "/logos/clients/logo-transmartyna.svg",
    isSvg: true,
  },
];

export const clientTestimonials: Testimonial[] = [
  {
    id: "liliane",
    name: "Liliane Oliveira",
    profession: "Especialista em Comunicação & Negócios",
    avatar: "https://assets.zyrosite.com/m5Kvj54gbpTW2gLw/02112023-img_8328-Awv9DqlVn8HPMjz1.jpg",
    quote: "Melhorei meu posicionamento e aumentei meus seguidores após realizar minhas fotos com a Speculum Studio. Muito além de cliques de fotografia, um parceiro estratégico de verdade.",
    service: "Retratos de Autoridade",
  },
  {
    id: "felipe",
    name: "Felipe Ramos Barboza",
    profession: "Executivo & Gestor Estratégico",
    avatar: "https://assets.zyrosite.com/m5Kvj54gbpTW2gLw/16012024-img_9458-AoPe1JZreVUG4la1.jpg",
    quote: "Trabalhar com a Speculum Studio em uma sessão de retratos profissionais superou qualquer expectativa. O cuidado com a direção da luz e a compreensão do meu momento de carreira foram impecáveis.",
    service: "Retratos Profissionais",
  },
  {
    id: "humberto",
    name: "Humberto Cordella",
    profession: "Consultor & Empreendedor",
    avatar: "https://assets.zyrosite.com/m5Kvj54gbpTW2gLw/humberto-cordella-9-m2WEaewBJGsKBpGL.jpg",
    quote: "Tive uma experiência transformadora com o estúdio. Desde o início, o Fabiano compreendeu meu arquétipo e traduziu isso em imagens de um impacto surreal para meus clientes.",
    service: "Construção de Marca",
  },
];

export const featuredProjects: PortfolioProject[] = allPortfolioProjects.filter(
  (p) => p.category === "audiovisual"
);
