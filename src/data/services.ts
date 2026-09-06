export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceDefinition {
  slug: string;
  shortName: string;
  title: string;
  seoTitle: string;
  description: string;
  eyebrow: string;
  lead: string;
  principle: string;
  fit: string[];
  inclusions: string[];
  steps: Array<{ title: string; description: string }>;
  faq: ServiceFaq[];
}

export const services: ServiceDefinition[] = [
  {
    slug: "construcao-de-marca",
    shortName: "Construção de marca",
    title: "Uma marca clara antes de uma marca barulhenta.",
    seoTitle: "Construção de marca e posicionamento | Speculum Studio",
    description: "Posicionamento, identidade e narrativa para profissionais e empresas que precisam organizar como são percebidos.",
    eyebrow: "Posicionamento / Identidade / Narrativa",
    lead: "Organizamos a identidade da marca para que suas escolhas de imagem, linguagem e conteúdo expressem a mesma direção.",
    principle: "Nosso trabalho começa no contexto: o que a marca representa, para quem ela existe e qual percepção precisa construir. A estética vem depois, como expressão dessa definição.",
    fit: [
      "Sua marca cresceu, mas a comunicação não acompanhou o negócio.",
      "As pessoas ainda não entendem com clareza o valor do seu trabalho.",
      "Identidade visual, discurso e presença digital parecem partes desconectadas.",
      "Você está lançando, reposicionando ou profissionalizando uma marca.",
    ],
    inclusions: [
      "Diagnóstico de marca e percepção",
      "Posicionamento e proposta de valor",
      "Território verbal, narrativa e mensagens centrais",
      "Direção visual e identidade de marca",
      "Orientações para aplicação em conteúdo e pontos de contato",
    ],
    steps: [
      { title: "Ler o contexto", description: "Reunimos história, negócio, público, referências e o problema que precisa ser resolvido." },
      { title: "Definir a direção", description: "Organizamos posicionamento, proposta de valor e critérios para a comunicação." },
      { title: "Dar forma", description: "Traduzimos a estratégia em linguagem, identidade e aplicações coerentes." },
    ],
    faq: [
      { question: "Construção de marca é somente identidade visual?", answer: "Não. A identidade visual faz parte do projeto, mas nasce de decisões sobre posicionamento, público, valor e narrativa." },
      { question: "Vocês também fazem reposicionamento de marcas existentes?", answer: "Sim. O trabalho pode partir do que já existe, preservar os ativos relevantes e reorganizar o que deixou de representar o momento atual." },
      { question: "O projeto inclui conteúdo para redes sociais?", answer: "A direção de conteúdo pode integrar o projeto ou ser contratada como uma frente complementar, conforme o diagnóstico e o escopo." },
    ],
  },
  {
    slug: "producao-audiovisual",
    shortName: "Produção audiovisual",
    title: "Imagens em movimento com uma razão para existir.",
    seoTitle: "Produção audiovisual e filmes de marca | Speculum Studio",
    description: "Direção, captação e edição de vídeos para apresentar marcas, pessoas, produtos, serviços e histórias.",
    eyebrow: "Direção / Captação / Edição",
    lead: "Criamos vídeos que transformam uma intenção de comunicação em cena, ritmo e narrativa, do planejamento à entrega.",
    principle: "Cada produção começa pela pergunta que o filme precisa responder. Isso orienta roteiro, formato, linguagem visual e os desdobramentos necessários para cada canal.",
    fit: [
      "Sua empresa precisa se apresentar com clareza e presença.",
      "Um produto, serviço ou história pede mais contexto do que uma peça estática comporta.",
      "Você quer produzir depoimentos, entrevistas ou conteúdo recorrente com direção.",
      "A comunicação em vídeo existe, mas ainda não expressa a identidade da marca.",
    ],
    inclusions: [
      "Conceito, abordagem e roteiro",
      "Direção de cena e de pessoas",
      "Captação de imagem e som",
      "Montagem, edição e tratamento",
      "Filmes de marca, entrevistas, depoimentos e vídeos para conteúdo",
    ],
    steps: [
      { title: "Planejar", description: "Definimos objetivo, público, mensagem, formato e condições reais de produção." },
      { title: "Produzir", description: "Dirigimos a captação com atenção à pessoa, ao ambiente e à identidade da marca." },
      { title: "Construir a narrativa", description: "Editamos o material para dar clareza, ritmo e unidade à mensagem." },
    ],
    faq: [
      { question: "Que tipos de vídeo a Speculum produz?", answer: "Filmes de marca, apresentações institucionais, entrevistas, depoimentos, vídeos de produtos e serviços e conteúdo para canais digitais." },
      { question: "Vocês cuidam do roteiro e da direção?", answer: "Sim. O escopo pode reunir estratégia, roteiro, direção, captação e edição, conforme a necessidade da produção." },
      { question: "É possível criar versões para diferentes canais?", answer: "Sim. Os formatos e desdobramentos são definidos no planejamento para preservar a mensagem em cada canal." },
    ],
  },
  {
    slug: "retratos-profissionais",
    shortName: "Retratos profissionais",
    title: "Antes de você falar, sua imagem já comunicou.",
    seoTitle: "Retratos profissionais e posicionamento de imagem | Speculum",
    description: "Retratos profissionais com direção de imagem para comunicar personalidade, presença e contexto de marca.",
    eyebrow: "Retrato / Direção / Presença",
    lead: "O retrato profissional não precisa parecer uma fórmula. Ele pode revelar presença, personalidade e o modo como você quer ser reconhecido.",
    principle: "A experiência de Fabiano Pereira com retratos parte da escuta e da direção. Cenário, luz, expressão e postura são escolhidos para sustentar uma intenção, sem apagar quem está diante da câmera.",
    fit: [
      "Sua imagem atual não acompanha a qualidade ou o momento do seu trabalho.",
      "Você precisa de retratos para site, imprensa, redes sociais ou materiais institucionais.",
      "Fotos corporativas genéricas não representam sua personalidade.",
      "Sua marca pessoal pede uma linguagem visual mais consciente e coerente.",
    ],
    inclusions: [
      "Conversa de contexto e intenção de imagem",
      "Direção visual e preparação da sessão",
      "Direção de expressão, postura e presença",
      "Seleção e tratamento das imagens",
      "Retratos para marca pessoal, equipes e comunicação institucional",
    ],
    steps: [
      { title: "Compreender", description: "Conversamos sobre seu trabalho, sua personalidade e onde as imagens serão usadas." },
      { title: "Dirigir", description: "Criamos condições para uma presença natural e coerente diante da câmera." },
      { title: "Selecionar", description: "Escolhemos e tratamos retratos que funcionem nos contextos definidos." },
    ],
    faq: [
      { question: "Preciso saber posar?", answer: "Não. A direção existe justamente para orientar expressão, postura e movimento durante a sessão." },
      { question: "O ensaio serve para marca pessoal?", answer: "Sim. A sessão pode ser pensada para site, redes sociais, imprensa, palestras e outros pontos de contato da sua marca." },
      { question: "Vocês fotografam equipes e empresas?", answer: "Sim. O projeto pode contemplar uma pessoa, lideranças ou equipes, mantendo unidade visual e espaço para a identidade de cada retratado." },
    ],
  },
  {
    slug: "conteudo-e-presenca-digital",
    shortName: "Conteúdo e presença digital",
    title: "Conteúdo que nasce da marca e aprende com a prática.",
    seoTitle: "Estratégia de conteúdo e presença digital | Speculum",
    description: "Estratégia editorial, roteiros e produção para construir uma presença digital coerente e contínua.",
    eyebrow: "Estratégia / Roteiro / Continuidade",
    lead: "Transformamos posicionamento e experiência real em uma linha editorial que a marca consegue sustentar, observar e aprimorar.",
    principle: "Conteúdo não é uma coleção de formatos. É um sistema de decisões sobre assuntos, linguagem, frequência, produção e aprendizado.",
    fit: [
      "Você publica, mas a comunicação ainda parece dispersa.",
      "A rotina de produção depende de improviso e recomeça toda semana.",
      "Sua equipe precisa de direção editorial e critérios claros.",
      "A marca tem repertório, mas ainda não o transforma em conteúdo útil.",
    ],
    inclusions: [
      "Diagnóstico editorial e objetivos de comunicação",
      "Pilares, pautas, formatos e linha editorial",
      "Roteiros, textos e direção criativa",
      "Produção fotográfica e audiovisual, conforme o escopo",
      "Leitura de desempenho e ajustes de direção",
    ],
    steps: [
      { title: "Encontrar a matéria-prima", description: "Mapeamos experiência, repertório, público e os temas que a marca pode sustentar." },
      { title: "Organizar o sistema", description: "Definimos linha editorial, formatos, responsabilidades e fluxo de produção." },
      { title: "Produzir e aprender", description: "Criamos, publicamos e usamos a resposta do público para refinar as próximas decisões." },
    ],
    faq: [
      { question: "Vocês fazem apenas o planejamento ou também produzem?", answer: "As duas possibilidades existem. O projeto pode entregar direção editorial ou incluir roteiro, criação, fotografia e vídeo." },
      { question: "A estratégia serve somente para Instagram?", answer: "Não. Os canais são escolhidos a partir do público, do objetivo e da capacidade de produção da marca." },
      { question: "É possível começar por um projeto piloto?", answer: "Sim. Um ciclo inicial pode validar temas, formatos e processo antes de ampliar a operação." },
    ],
  },
  {
    slug: "mentorias-e-consultorias",
    shortName: "Mentorias e consultorias",
    title: "Clareza para decidir o próximo movimento.",
    seoTitle: "Mentoria de marca, imagem e comunicação | Speculum",
    description: "Orientação com Fabiano Pereira para profissionais e empresas tomarem decisões sobre marca, imagem e comunicação.",
    eyebrow: "Leitura / Decisão / Direção",
    lead: "Uma frente de trabalho para quem precisa organizar o problema, enxergar prioridades e sair da conversa com decisões aplicáveis.",
    principle: "A orientação parte do contexto real, das evidências disponíveis e do objetivo do cliente. O método ajuda a estruturar perguntas e escolhas, sem substituir a experiência de quem conduz o negócio.",
    fit: [
      "Você está diante de uma mudança de posicionamento ou de carreira.",
      "Há muitas ideias, mas falta uma ordem clara para executá-las.",
      "Sua marca pessoal precisa alinhar discurso, imagem e presença.",
      "Uma equipe precisa de uma leitura externa para destravar decisões.",
    ],
    inclusions: [
      "Leitura do contexto e do desafio central",
      "Organização de hipóteses, prioridades e critérios",
      "Orientação sobre marca, imagem e comunicação",
      "Plano de próximos passos compatível com o momento",
      "Acompanhamento, quando previsto no escopo",
    ],
    steps: [
      { title: "Delimitar", description: "Definimos a questão que precisa de resposta e reunimos as informações necessárias." },
      { title: "Interpretar", description: "Conectamos sinais, possibilidades e limites para tornar o cenário legível." },
      { title: "Decidir", description: "Transformamos a leitura em prioridades e próximos passos concretos." },
    ],
    faq: [
      { question: "Qual é a diferença entre mentoria e um projeto de marca?", answer: "A mentoria orienta decisões e próximos passos. Um projeto de marca inclui desenvolvimento e entregas de estratégia, identidade ou comunicação." },
      { question: "A conversa é indicada para marca pessoal?", answer: "Sim. Ela pode abordar posicionamento profissional, percepção, imagem, narrativa e presença digital." },
      { question: "Quantos encontros são necessários?", answer: "Isso depende do problema. Algumas questões cabem em um encontro; outras pedem um ciclo de acompanhamento definido após a conversa inicial." },
    ],
  },
];

export const getServiceBySlug = (slug?: string) => services.find((service) => service.slug === slug);
