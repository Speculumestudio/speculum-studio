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
  location?: string;
  applications?: Array<{ title: string; description: string }>;
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
    principle: "Nosso trabalho começa no contexto: o que a marca representa, para quem ela existe e qual percepção precisa construir. A Jornada Arquetípica de Construção de Marca é um método próprio da Speculum Studio para conectar história, percepção, posicionamento, expressão e conteúdo. A estética vem depois, como expressão dessa definição.",
    fit: [
      "Sua marca cresceu, mas a comunicação não acompanhou o negócio.",
      "As pessoas ainda não entendem com clareza o valor do seu trabalho.",
      "Identidade visual, discurso e comunicação digital parecem partes desconectadas.",
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
      { title: "O Farol", description: "Lemos história, contexto, valores e ruídos para entender o que a marca precisa preservar e transformar." },
      { title: "O Guardião", description: "Reconhecemos forças, limites e critérios de personalidade que devem orientar a comunicação." },
      { title: "A Bússola", description: "Mapeamos mercado, concorrência e espaço de diferenciação para definir posicionamento e proposta de valor." },
      { title: "O Artesão", description: "Traduzimos a direção em identidade visual, linguagem, fotografia, movimento e experiência." },
      { title: "O Vilarejo", description: "Entendemos o público, seus desejos, objeções e situações de decisão para tornar a mensagem relevante." },
      { title: "O Castelo", description: "Organizamos narrativa, conteúdo e aplicações para a marca existir com coerência no dia a dia." },
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
    seoTitle: "Produtora audiovisual em Santos | Vídeos institucionais | Speculum",
    description: "Produção audiovisual em Santos e na Baixada Santista: vídeos institucionais, entrevistas, produtos e conteúdo para empresas, com roteiro, direção e edição.",
    location: "Produção audiovisual em Santos e na Baixada Santista, com projetos em outras cidades conforme o escopo e a logística.",
    applications: [
      { title: "Vídeos institucionais", description: "Apresentar uma empresa, explicar um serviço ou mostrar como o trabalho acontece. O roteiro organiza o que precisa ser entendido e por quem." },
      { title: "Entrevistas e depoimentos", description: "Dar espaço à experiência de clientes, profissionais e equipes, com preparação das perguntas, direção e captação de imagem e som." },
      { title: "Conteúdo para redes sociais", description: "Planejar uma captação que possa gerar vídeos curtos, demonstrações e diferentes versões para os canais da marca, conforme o escopo." },
      { title: "Produtos e gastronomia", description: "Mostrar preparo, textura, uso e detalhes que ajudam o público a entender a oferta. Fotografia e vídeo podem ser planejados no mesmo projeto." },
    ],
    eyebrow: "Direção / Captação / Edição",
    lead: "Criamos vídeos que transformam uma intenção de comunicação em cena, ritmo e narrativa, do planejamento à entrega.",
    principle: "Cada produção começa pela pergunta que o filme precisa responder. Isso orienta roteiro, formato, linguagem visual e os desdobramentos necessários para cada canal.",
    fit: [
      "Sua empresa precisa se apresentar com clareza e intenção.",
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
      { question: "A Speculum é uma produtora audiovisual em Santos?", answer: "Sim. A Speculum Studio trabalha com roteiro, direção, captação e edição a partir de Santos, atendendo a Baixada Santista e projetos em outras cidades conforme o escopo." },
      { question: "Preciso de um videomaker ou de uma produção completa?", answer: "Depende do que já está definido. Se a mensagem, o roteiro e o formato ainda precisam ser construídos, o projeto pode incluir essas etapas além da captação e edição. A primeira conversa organiza o que você precisa contratar." },
      { question: "Quanto custa um vídeo institucional?", answer: "O orçamento depende de roteiro, locais, tempo de captação, equipe e versões de entrega. Começamos pelo objetivo, pelos canais de uso e pelo prazo para definir uma proposta compatível com a produção." },
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
    description: "Retratos profissionais com direção de imagem para comunicar personalidade, identidade e contexto de marca.",
    eyebrow: "Retrato / Direção / Identidade",
    lead: "O retrato profissional não precisa parecer uma fórmula. Ele pode revelar personalidade e o modo como você quer ser reconhecido.",
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
      "Direção de expressão, postura e identidade",
      "Seleção e tratamento das imagens",
      "Retratos para marca pessoal, equipes e comunicação institucional",
    ],
    steps: [
      { title: "Compreender", description: "Conversamos sobre seu trabalho, sua personalidade e onde as imagens serão usadas." },
      { title: "Dirigir", description: "Criamos condições para uma expressão natural e coerente diante da câmera." },
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
    shortName: "Conteúdo e comunicação digital",
    title: "Conteúdo que nasce da marca e aprende com a prática.",
    seoTitle: "Produção de conteúdo e comunicação digital | Speculum Studio",
    description: "Produção de conteúdo para empresas e profissionais: estratégia editorial, roteiros, fotografia e vídeos para redes sociais. Speculum Studio, em Santos.",
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
    slug: "fotografia-comercial",
    shortName: "Fotografia comercial",
    title: "Imagens que ajudam a entender o que sua marca entrega.",
    seoTitle: "Fotografia de produtos e gastronomia em Santos | Speculum Studio",
    description: "Fotografia comercial em Santos e na Baixada Santista: produtos, alimentos e imagens para cardápios, lojas online e comunicação de marca.",
    eyebrow: "Produtos / Gastronomia / Comunicação",
    lead: "Fotografamos produtos, alimentos e detalhes do trabalho para que a pessoa consiga reconhecer o que está escolhendo. Luz, composição e contexto partem do uso real da imagem.",
    location: "Projetos de fotografia comercial em Santos e na Baixada Santista. Outras cidades e condições de produção são avaliadas na conversa inicial.",
    principle: "Uma foto para o cardápio, uma loja online e uma campanha cumprem funções diferentes. Antes de fotografar, definimos o que precisa aparecer, como será visto e quais informações a imagem deve transmitir.",
    fit: [
      "Você precisa atualizar as imagens de produtos ou de um cardápio.",
      "As fotografias atuais não mostram bem os detalhes e a qualidade da oferta.",
      "Sua comunicação mistura imagens com estilos e condições de luz diferentes.",
      "Você quer planejar fotografia e vídeo a partir da mesma direção de marca.",
    ],
    inclusions: [
      "Conversa sobre produto, público e canais de uso",
      "Planejamento de enquadramentos, luz e composição",
      "Fotografia de produtos e alimentos",
      "Seleção, tratamento e formatos de entrega definidos no escopo",
      "Planejamento conjunto com audiovisual, quando necessário",
    ],
    applications: [
      { title: "Restaurantes e alimentação", description: "Fotografia gastronômica para cardápios, delivery e comunicação do negócio. Ingredientes, montagem e apresentação precisam corresponder ao que o cliente recebe." },
      { title: "Produtos e lojas online", description: "Imagens para apresentar formato, textura, proporção e uso do produto. Definimos se o projeto pede fundo neutro, ambientação ou uma combinação dos dois." },
      { title: "Conteúdo de marca", description: "Uma seleção de imagens para site, materiais comerciais e redes sociais, com unidade visual e formatos pensados para os canais de uso." },
    ],
    steps: [
      { title: "Definir o uso", description: "Entendemos o que será fotografado, a quantidade de imagens, os canais e as condições de produção." },
      { title: "Preparar e fotografar", description: "Organizamos luz, composição e preparação dos produtos com as responsabilidades combinadas antes da sessão." },
      { title: "Selecionar e entregar", description: "Tratamos as imagens escolhidas e preparamos os arquivos nos formatos definidos para o projeto." },
    ],
    faq: [
      { question: "Vocês fazem fotografia para restaurantes e cardápios?", answer: "Sim. O projeto pode reunir fotografia de pratos, produtos e detalhes do preparo para cardápio, delivery, site e redes sociais. A preparação dos alimentos e as condições da sessão são combinadas no planejamento." },
      { question: "É possível produzir fotos e vídeos juntos?", answer: "Sim. Quando o projeto pede os dois formatos, planejamos as etapas com a equipe de audiovisual para aproveitar a produção e manter a mesma direção visual." },
      { question: "Como é definido o orçamento de fotografia de produtos?", answer: "Consideramos quantidade e tipo de produtos, preparação, cenários, local de captação, tratamento e usos das imagens. Essas informações permitem definir o escopo antes da sessão." },
      { question: "O atendimento é somente em Santos?", answer: "Nossa base fica em Santos. Atendemos a Baixada Santista e avaliamos projetos em outras cidades conforme logística e condições de produção." },
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
      "Sua marca pessoal precisa alinhar discurso, imagem e comunicação.",
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
      { question: "A conversa é indicada para marca pessoal?", answer: "Sim. Ela pode abordar posicionamento profissional, percepção, imagem, narrativa e comunicação digital." },
      { question: "Quantos encontros são necessários?", answer: "Isso depende do problema. Algumas questões cabem em um encontro; outras pedem um ciclo de acompanhamento definido após a conversa inicial." },
    ],
  },
];

export const getServiceBySlug = (slug?: string) => services.find((service) => service.slug === slug);
