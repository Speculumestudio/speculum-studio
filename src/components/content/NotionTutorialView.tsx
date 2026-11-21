import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FolderGit2,
  Terminal,
  Sparkles,
  ShieldCheck,
  Github,
  MessageCircle,
  Lightbulb,
  Zap,
  CheckCircle2,
  ExternalLink,
  ArrowDownCircle,
  ChevronDown,
  ChevronRight,
  FolderArchive,
  Layers,
  Check,
} from "lucide-react";
import { CaptureBrainVisual } from "@/components/CaptureBrainVisual";

interface NotionTutorialViewProps {
  promptBox: React.ReactNode;
  onScrollToForum: () => void;
}

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "step-1",
    label: "Baixar ou criar a pasta principal",
    detail: "Baixar o arquivo .ZIP pronto em 1 clique ou criar a pasta segundo-cerebro em Documentos.",
  },
  {
    id: "step-2",
    label: "Escolher o modo de trabalho",
    detail: "No navegador (Claude Projects / ChatGPT) ou no terminal (Claude Code / Codex).",
  },
  {
    id: "step-3",
    label: "Copiar o Prompt Mestre de Inicialização",
    detail: "Colar as instruções para a IA entender suas regras antes de redigir qualquer trabalho.",
  },
  {
    id: "step-4",
    label: "Conferir o arquivo CLAUDE.md",
    detail: "Garantir que a IA tem o filtro de voz humana e pede seu sim antes de alterar arquivos.",
  },
];

export function NotionTutorialView({ promptBox, onScrollToForum }: NotionTutorialViewProps) {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("speculum_cerebro_checklist");
        return saved ? JSON.parse(saved) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  const [showSimulator, setShowSimulator] = useState(false);
  const [showTerminalGuide, setShowTerminalGuide] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("speculum_cerebro_checklist", JSON.stringify(completedSteps));
    } catch {}
  }, [completedSteps]);

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = CHECKLIST_ITEMS.filter((item) => completedSteps[item.id]).length;
  const progressPercent = Math.round((completedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <div className="space-y-8 font-sans max-w-4xl mx-auto">
      {/* Barra de Topo: Comunidade e Atalho */}
      <div className="flex items-center justify-between flex-wrap gap-4 py-3.5 px-6 rounded-2xl bg-[#EDE7DA] border border-[#DDD5C5] text-[#1B3022] shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-[#142318] tracking-tight">
            Ateliê Aberto · 160+ membros ativos
          </span>
          <span className="text-xs text-[#142318]/80 font-medium hidden sm:inline">
            · Dúvidas respondidas em ~24h
          </span>
        </div>
        <button
          type="button"
          onClick={onScrollToForum}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#1B3022] hover:text-[#C5A059] transition-colors cursor-pointer"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Fórum de Dúvidas</span>
          <ArrowDownCircle className="h-3.5 w-3.5 opacity-80" />
        </button>
      </div>

      {/* DOCUMENTO PRINCIPAL EM PAPEL VERGÊ MARFIM */}
      <div className="rounded-3xl border border-[#DDD5C5] bg-[#F7F5EE] text-[#1C201D] p-6 sm:p-10 md:p-12 space-y-12 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.5),0_0_40px_-20px_rgba(201,168,76,0.25)]">
        
        {/* Cabeçalho do Documento com Faixa / Badge Forte */}
        <div className="space-y-4 border-b border-[#E3DCCF] pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1B3022] text-[#F5D061] font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Setup Prático · Parte 1</span>
          </div>

          <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl text-[#142318] font-extrabold tracking-tight leading-tight">
            Como Estruturar o Seu Segundo Cérebro de IA
          </h2>
          <p className="text-sm sm:text-base text-[#142318] leading-relaxed font-medium">
            Sem uma estrutura de pastas no computador, toda conversa com a IA começa do zero e entrega textos genéricos. Abaixo está o roteiro linear passo a passo para resolver isso em 2 minutos.
          </p>

          {/* Callout de Download Direto com Faixa Sólida */}
          <div className="mt-6 p-6 rounded-2xl border border-[#D5CBBA] bg-[#ECE5D7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <FolderArchive className="h-5 w-5 text-[#1B3022] shrink-0" />
                <span className="text-base sm:text-lg font-extrabold text-[#142318] tracking-tight">
                  Atalho Mais Rápido: Baixar Estrutura Pronta (.ZIP)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#142318] leading-relaxed">
                Não quer mexer com código ou terminal? Baixe o arquivo com as 6 pastas e as regras prontas para extrair em Documentos.
              </p>
            </div>
            <a
              href="/downloads/segundo-cerebro.zip"
              download="segundo-cerebro.zip"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold bg-[#1B3022] text-[#F5D061] hover:bg-[#253F2D] shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>Baixar .ZIP Pronto</span>
            </a>
          </div>
        </div>

        {/* SEÇÃO 1: CHECKLIST DE PROGRESSO */}
        <div className="space-y-5 border-b border-[#E3DCCF] pb-10">
          {/* Faixa de Título da Seção */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE6D8] border border-[#DDD5C5] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B3022] text-[#F5D061] font-mono text-xs font-bold">
                ✓
              </span>
              <h3 className="font-sans text-lg sm:text-xl font-extrabold text-[#142318] tracking-tight">
                Checklist do Setup
              </h3>
            </div>
            <span className="text-xs sm:text-sm font-mono font-bold text-[#1B3022] bg-[#DFD7C7] px-3.5 py-1 rounded-lg border border-[#CEC4B2]">
              {completedCount} de {CHECKLIST_ITEMS.length} prontos ({progressPercent}%)
            </span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-[#E2DCCE] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C5A059] to-[#1B3022] transition-all duration-300 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Itens em Linha Vertical */}
          <div className="divide-y divide-[#E3DCCF] pt-1">
            {CHECKLIST_ITEMS.map((item, idx) => {
              const isChecked = !!completedSteps[item.id];
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleStep(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleStep(item.id);
                    }
                  }}
                  className="flex items-start gap-4 py-3.5 hover:bg-[#EFE9DC]/70 px-2 rounded-xl transition-all cursor-pointer select-none"
                >
                  <div className="mt-1">
                    <Checkbox
                      checked={isChecked}
                      tabIndex={-1}
                      className="pointer-events-none h-5 w-5 rounded border-[#AFA694] data-[state=checked]:bg-[#1B3022] data-[state=checked]:text-[#F5D061] data-[state=checked]:border-[#1B3022]"
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-sm sm:text-base font-bold tracking-tight ${
                        isChecked ? "line-through text-[#828C84]" : "text-[#142318]"
                      }`}
                    >
                      {idx + 1}. {item.label}
                    </div>
                    <p className="text-xs sm:text-sm text-[#142318] mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SEÇÃO 2: O MAPA DAS 6 PASTAS */}
        <div className="space-y-6 border-b border-[#E3DCCF] pb-10">
          {/* Faixa de Título da Seção */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE6D8] border border-[#DDD5C5]">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B3022] text-[#F5D061] font-mono text-sm font-bold">
                1
              </span>
              <h3 className="font-sans text-lg sm:text-2xl font-extrabold text-[#142318] tracking-tight">
                O Mapa das 6 Pastas do Segundo Cérebro
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#142318] mt-2 ml-11 font-medium">
              A pasta principal <code className="text-[#142318] font-mono bg-[#E0D8C8] px-2 py-0.5 rounded border border-[#CFC5B2] font-bold">segundo-cerebro</code> é dividida em apenas 5 gavetas e 1 arquivo mestre:
            </p>
          </div>

          {/* Lista Linear Vertical das Pastas */}
          <div className="space-y-4 pl-1 sm:pl-3">
            
            <div className="flex items-start gap-3.5">
              <span className="font-mono text-xs font-bold text-[#1B3022] mt-1 px-2.5 py-0.5 rounded-md bg-[#E5DFD1] border border-[#D2C8B5] shrink-0">
                01
              </span>
              <div>
                <span className="font-mono text-sm sm:text-base font-extrabold text-[#142318]">
                  01-clientes/
                </span>
                <p className="text-xs sm:text-sm text-[#142318] mt-0.5 leading-relaxed">
                  Uma subpasta por cliente ou projeto. Guarda o briefing, tom de voz, o que ele odeia e histórico de entregas. A IA consulta aqui antes de escrever qualquer palavra.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="font-mono text-xs font-bold text-[#1B3022] mt-1 px-2.5 py-0.5 rounded-md bg-[#E5DFD1] border border-[#D2C8B5] shrink-0">
                02
              </span>
              <div>
                <span className="font-mono text-sm sm:text-base font-extrabold text-[#142318]">
                  02-ofertas/
                </span>
                <p className="text-xs sm:text-sm text-[#142318] mt-0.5 leading-relaxed">
                  A descrição detalhada dos seus serviços, formatos de entrega, escopos e preços. Impede que o modelo invente propostas vagas ou fora do seu padrão comercial.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="font-mono text-xs font-bold text-[#1B3022] mt-1 px-2.5 py-0.5 rounded-md bg-[#E5DFD1] border border-[#D2C8B5] shrink-0">
                03
              </span>
              <div>
                <span className="font-mono text-sm sm:text-base font-extrabold text-[#142318]">
                  03-referencias/
                </span>
                <p className="text-xs sm:text-sm text-[#142318] mt-0.5 leading-relaxed">
                  Banco de referências aprovadas: roteiros premiados, carrosséis de alto engajamento e estruturas que servem de modelo de qualidade para a IA reproduzir.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="font-mono text-xs font-bold text-[#1B3022] mt-1 px-2.5 py-0.5 rounded-md bg-[#E5DFD1] border border-[#D2C8B5] shrink-0">
                04
              </span>
              <div>
                <span className="font-mono text-sm sm:text-base font-extrabold text-[#142318]">
                  04-projetos/
                </span>
                <p className="text-xs sm:text-sm text-[#142318] mt-0.5 leading-relaxed">
                  A mesa de trabalho diária: roteiros em gravação, posts em aprovação e entregas ativas, organizadas por data e cliente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="font-mono text-xs font-bold text-[#1B3022] mt-1 px-2.5 py-0.5 rounded-md bg-[#E5DFD1] border border-[#D2C8B5] shrink-0">
                05
              </span>
              <div>
                <span className="font-mono text-sm sm:text-base font-extrabold text-[#142318]">
                  05-ferramentas/
                </span>
                <p className="text-xs sm:text-sm text-[#142318] mt-0.5 leading-relaxed">
                  Scripts em Python, geradores de áudio, motores de vídeo e as skills prontas da Speculum Studio.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 pt-1">
              <span className="font-mono text-xs font-bold text-[#F5D061] mt-1 px-2.5 py-0.5 rounded-md bg-[#1B3022] border border-[#1B3022] shrink-0">
                REGRA
              </span>
              <div>
                <span className="font-mono text-sm sm:text-base font-extrabold text-[#142318]">
                  CLAUDE.md
                </span>
                <p className="text-xs sm:text-sm text-[#142318] mt-0.5 leading-relaxed font-medium">
                  O arquivo mestre na raiz da pasta. É a constituição do seu sistema: ensina seu tom humano, proíbe vícios robóticos de escrita e exige aprovação antes de qualquer alteração no disco.
                </p>
              </div>
            </div>

          </div>

          {/* Toggle Opcional para ver o Simulador Visual */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowSimulator(!showSimulator)}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#1B3022] hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              {showSimulator ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <span>{showSimulator ? "Ocultar Simulador Visual da Arquitetura" : "▶ Ver Simulador Visual da Arquitetura em Tempo Real"}</span>
            </button>
            {showSimulator && (
              <div className="mt-4 p-5 rounded-2xl border border-[#D8CEBC] bg-[#ECE5D7]">
                <CaptureBrainVisual />
              </div>
            )}
          </div>
        </div>

        {/* SEÇÃO 3: ESCOLHA DO MODO */}
        <div className="space-y-6 border-b border-[#E3DCCF] pb-10">
          {/* Faixa de Título da Seção */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE6D8] border border-[#DDD5C5]">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B3022] text-[#F5D061] font-mono text-sm font-bold">
                2
              </span>
              <h3 className="font-sans text-lg sm:text-2xl font-extrabold text-[#142318] tracking-tight">
                Precisa Abrir o Terminal? (Escolha o Modo)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#142318] mt-2 ml-11 leading-relaxed font-medium">
              <strong className="text-[#142318]">Não.</strong> O Segundo Cérebro funciona perfeitamente sem o terminal. Você só precisa dele se quiser automação avançada via linha de comando (Claude Code ou Codex).
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#142318]">
            <div className="p-5 rounded-2xl bg-[#EDE7DA] border border-[#DDD5C5] space-y-2">
              <div className="font-bold text-[#142318] text-sm sm:text-base flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#1B3022]" />
                Modo 1: No Navegador (Sem Terminal · Recomendado para 90% das pessoas)
              </div>
              <p className="text-[#142318] leading-relaxed">
                Basta <a href="/downloads/segundo-cerebro.zip" download className="text-[#1B3022] font-bold underline hover:text-[#C5A059]">baixar o arquivo .ZIP</a>, extrair na sua pasta Documentos, e abrir o <em>Claude.ai</em> ou o <em>ChatGPT</em>. Crie um <strong>Projeto</strong> e anexe as notas das pastas e o arquivo <code className="text-[#142318] font-bold">CLAUDE.md</code>. A IA já passa a ter memória total.
              </p>
            </div>

            {/* Toggle para o Modo Terminal */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowTerminalGuide(!showTerminalGuide)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#1B3022] hover:text-[#C5A059] transition-colors cursor-pointer"
              >
                {showTerminalGuide ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span>{showTerminalGuide ? "Ocultar instruções do Terminal" : "▶ Quer usar o Claude Code no Terminal? Ver o truque de 5 segundos"}</span>
              </button>

              {showTerminalGuide && (
                <div className="mt-4 p-5 rounded-2xl bg-[#EDE7DA] border border-[#DDD5C5] space-y-4">
                  <div className="space-y-1.5">
                    <strong className="text-[#142318] text-sm font-bold">No Windows (O Truque 'cmd'):</strong>
                    <p className="text-[#142318]">
                      Abra a pasta <code className="text-[#142318] font-mono bg-[#E2DCCE] px-1 rounded">segundo-cerebro</code> no Explorador de Arquivos. Clique na barra de endereço lá em cima, digite apenas <code className="text-[#1B3022] font-mono font-bold">cmd</code> e aperte Enter. O terminal abre na pasta certa em 1 segundo.
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-3 border-t border-[#DFD7C7]">
                    <strong className="text-[#142318] text-sm font-bold">No Mac (Finder):</strong>
                    <p className="text-[#142318]">
                      Clique com o botão direito na pasta <code className="text-[#142318] font-mono bg-[#E2DCCE] px-1 rounded">segundo-cerebro</code> e selecione <em>Novo Terminal na Pasta</em>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEÇÃO 4: O PROMPT MESTRE */}
        <div className="space-y-6 border-b border-[#E3DCCF] pb-10">
          {/* Faixa de Título da Seção */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE6D8] border border-[#DDD5C5]">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B3022] text-[#F5D061] font-mono text-sm font-bold">
                3
              </span>
              <h3 className="font-sans text-lg sm:text-2xl font-extrabold text-[#142318] tracking-tight">
                O Prompt Mestre de Inicialização
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#142318] mt-2 ml-11 font-medium">
              Copie o prompt estruturado com 1 clique abaixo e cole nas instruções do seu Projeto ou na janela do Claude Code:
            </p>
          </div>

          {/* Prompt Box com alto contraste */}
          <div className="rounded-2xl overflow-hidden shadow-md">
            {promptBox}
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl border border-[#D5CBBA] bg-[#ECE5D7] text-xs sm:text-sm text-[#142318] leading-relaxed">
            <ShieldCheck className="h-5 w-5 text-[#1B3022] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#142318]">Trava de Segurança:</strong> O prompt exige que a IA primeiro analise seu ambiente e pergunte o seu OK antes de criar ou modificar qualquer arquivo no computador.
            </div>
          </div>
        </div>

        {/* SEÇÃO 5: O QUE MUDA NA PRÁTICA */}
        <div className="space-y-5 border-b border-[#E3DCCF] pb-10">
          {/* Faixa de Título da Seção */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE6D8] border border-[#DDD5C5]">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B3022] text-[#F5D061] font-mono text-sm font-bold">
                4
              </span>
              <h3 className="font-sans text-lg sm:text-2xl font-extrabold text-[#142318] tracking-tight">
                O Que Muda a Partir de Hoje
              </h3>
            </div>
          </div>

          <ul className="space-y-3 pl-1 text-xs sm:text-sm text-[#142318] leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="text-[#1B3022] font-bold text-base leading-none mt-0.5">✓</span>
              <span><strong className="text-[#142318]">Fim da amnésia:</strong> você nunca mais precisará explicar quem é seu cliente ou o que a sua empresa vende toda vez que abrir um chat novo.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#1B3022] font-bold text-base leading-none mt-0.5">✓</span>
              <span><strong className="text-[#142318]">Zero vícios de robô:</strong> o arquivo de regras bloqueia clichês de inteligência artificial antes do primeiro rascunho sair.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#1B3022] font-bold text-base leading-none mt-0.5">✓</span>
              <span><strong className="text-[#142318]">Base pronta para a Parte 2:</strong> no próximo episódio da série vamos usar essa mesma pasta para produzir um projeto completo de ponta a ponta.</span>
            </li>
          </ul>
        </div>

        {/* SEÇÃO 6: REPOSITÓRIO GITHUB E COMUNIDADE */}
        <div className="space-y-5">
          {/* Faixa de Título da Seção */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#EDE6D8] border border-[#DDD5C5]">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1B3022] text-[#F5D061] font-mono text-sm font-bold">
                5
              </span>
              <h3 className="font-sans text-lg sm:text-2xl font-extrabold text-[#142318] tracking-tight">
                Próximas Skills e Fórum
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#142318] mt-2 ml-11 font-medium">
              Repositório aberto de skills da Speculum Studio no GitHub (motores de carrossel em código, roteiros de Reels e geradores de propostas).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#ECE5D7] border border-[#DDD5C5]">
            <div className="flex items-center gap-3">
              <Github className="h-6 w-6 text-[#142318] shrink-0" />
              <div>
                <div className="text-sm font-extrabold text-[#142318]">studiospeculum / speculum-skills</div>
                <div className="text-xs text-[#142318] font-medium">Código aberto no GitHub</div>
              </div>
            </div>
            <a
              href="https://github.com/studiospeculum"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#1B3022] text-[#F5D061] hover:bg-[#253F2D] transition-all cursor-pointer shadow-sm"
            >
              <span>Ver GitHub</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-80" />
            </a>
          </div>

          <div className="p-5 rounded-2xl border border-[#D5CBBA] bg-[#ECE5D7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-[#142318] leading-relaxed">
              <strong className="text-[#142318]">Qual skill você gostaria de ver liberada primeiro?</strong> Deixe sua resposta no fórum abaixo.
            </p>
            <button
              type="button"
              onClick={onScrollToForum}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#1B3022] text-[#F5D061] hover:bg-[#253F2D] shrink-0 cursor-pointer shadow-sm hover:scale-[1.02] transition-all"
            >
              Ir para o Fórum
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
