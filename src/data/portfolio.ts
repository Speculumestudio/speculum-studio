export interface PortfolioProject {
  id: string;
  title: string;
  client: string;
  category: string;
  categoryLabel: string;
  format: "widescreen" | "vertical";
  aspectRatio: "16/9" | "9/16" | "21/9";
  thumbnail: string;
  videoSrc?: string;
  poster?: string;
  duration?: string;
  explanation: string;
  deliverables?: string[];
  context?: string;
  approach?: string;
}

export const featuredProjects: PortfolioProject[] = [
  {
    id: "40-anos-resistencia",
    title: "40 Anos da Resistência",
    client: "Academia Resistência Karatê-Do Shotokan",
    category: "institucional",
    categoryLabel: "Documentário & Institucional",
    format: "widescreen",
    aspectRatio: "16/9",
    thumbnail: "/media/portfolio-resistencia-40-anos-poster.webp",
    poster: "/media/portfolio-resistencia-40-anos-poster.webp",
    videoSrc: "/media/portfolio-resistencia-40-anos.mp4",
    duration: "3:27",
    explanation: "Filme institucional e histórico celebrando quatro décadas de tradição marcial em Santos. Uma produção focada na velocidade e precisão dos katas, no resgate documental das origens do dojô e na filosofia transmitida pelo Sensei Paulo Bartolo a gerações de atletas.",
  },
  {
    id: "jardins-do-taquaral",
    title: "Jardins do Taquaral",
    client: "Raphael Matheus · Arquitetura & Paisagismo",
    category: "arquitetura",
    categoryLabel: "Arquitetura & Espaço",
    format: "widescreen",
    aspectRatio: "16/9",
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
    category: "imersao",
    categoryLabel: "Imersão & Filosofia Marcial",
    format: "vertical",
    aspectRatio: "9/16",
    thumbnail: "/media/portfolio-gashuku-poster.webp",
    poster: "/media/portfolio-gashuku-poster.webp",
    videoSrc: "/media/portfolio-gashuku.mp4",
    duration: "2:24",
    explanation: "Documentação audiovisual do tradicional treinamento intensivo (Gashuku). Uma captação imersiva focada no som da respiração, no impacto das técnicas sobre o tatame ao amanhecer e na resistência física e mental dos faixas-pretas.",
  },
];
