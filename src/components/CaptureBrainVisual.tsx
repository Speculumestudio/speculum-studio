import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Check, Cpu, FileCode2, Folder, Sparkles, Terminal } from "lucide-react";

const FOLDERS = [
  { name: "01-clientes/", tag: "contexto", delay: 0.08 },
  { name: "02-ofertas/", tag: "posicionamento", delay: 0.16 },
  { name: "03-referencias/", tag: "curadoria", delay: 0.24 },
  { name: "04-projetos/", tag: "entregas", delay: 0.32 },
  { name: "05-ferramentas/", tag: "motores", delay: 0.4 },
  { name: "CLAUDE.md", tag: "regras", isFile: true, delay: 0.48 },
];

const ENGINES = [
  { name: "Python", status: "pronto" },
  { name: "Voz Neural", status: "ativo" },
  { name: "Áudio -14 LUFS", status: "calibrado" },
  { name: "Vídeo em Código", status: "conectado" },
];

const COMMAND = 'claude "inicializar segundo-cerebro"';
const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];

export function CaptureBrainVisual() {
  const prefersReduced = useReducedMotion();
  const [typedLength, setTypedLength] = useState(prefersReduced ? COMMAND.length : 0);
  const [phase, setPhase] = useState<number>(prefersReduced ? 3 : 0);
  const [activeEngine, setActiveEngine] = useState<number>(prefersReduced ? ENGINES.length : 0);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 140, damping: 24 });
  const smoothY = useSpring(mouseY, { stiffness: 140, damping: 24 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    const unsubX = smoothX.on("change", (x) => setGlowPos((prev) => ({ ...prev, x: x * 100 })));
    const unsubY = smoothY.on("change", (y) => setGlowPos((prev) => ({ ...prev, y: y * 100 })));
    return () => {
      unsubX();
      unsubY();
    };
  }, [smoothX, smoothY]);

  useEffect(() => {
    if (prefersReduced) {
      setTypedLength(COMMAND.length);
      setPhase(3);
      setActiveEngine(ENGINES.length);
      return;
    }

    let cancelled = false;
    const timers: number[] = [];

    const runCycle = () => {
      if (cancelled) return;
      setTypedLength(0);
      setPhase(0);
      setActiveEngine(0);

      for (let i = 1; i <= COMMAND.length; i++) {
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) setTypedLength(i);
          }, 300 + i * 38)
        );
      }

      const afterType = 300 + COMMAND.length * 38 + 260;
      timers.push(window.setTimeout(() => !cancelled && setPhase(1), afterType));
      timers.push(window.setTimeout(() => !cancelled && setPhase(2), afterType + 520));

      ENGINES.forEach((_, idx) => {
        timers.push(
          window.setTimeout(() => {
            if (!cancelled) {
              setPhase(3);
              setActiveEngine(idx + 1);
            }
          }, afterType + 1350 + idx * 340)
        );
      });

      timers.push(window.setTimeout(runCycle, afterType + 5400));
    };

    runCycle();
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [prefersReduced]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      onPointerMove={handlePointerMove}
      className="relative rounded-3xl overflow-hidden border border-primary/25 bg-[#09120E]/90 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.9),0_0_60px_-25px_rgba(201,168,76,0.28)]"
    >
      {/* Brilho orbital sutil guiado pelo cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300"
        style={{
          background: `radial-gradient(420px circle at ${glowPos.x}% ${glowPos.y}%, rgba(201,168,76,0.16), transparent 60%), radial-gradient(360px circle at 15% 85%, rgba(27,48,34,0.65), transparent 65%)`,
        }}
      />

      {/* Micro-grid editorial */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(201,168,76,0.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(201,168,76,0.7) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 p-5 sm:p-6">
        {/* Cabeçalho da janela do estúdio */}
        <div className="flex items-center justify-between border-b border-primary/15 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/25" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary/15" />
            </div>
            <span className="ml-1 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wide text-foreground/80">
              <Terminal className="h-3.5 w-3.5 text-primary" />
              segundo-cerebro · claude
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
            <span className="relative flex h-1.5 w-1.5">
              {!prefersReduced && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Memória ativa
          </div>
        </div>

        {/* Linha de comando viva */}
        <div className="mt-4 rounded-xl border border-white/10 bg-black/50 px-3.5 py-3 font-mono text-xs text-foreground/90">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="select-none text-primary">$</span>
            <span className="truncate">{COMMAND.slice(0, typedLength)}</span>
            {!prefersReduced && (
              <motion.span
                aria-hidden="true"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                className="inline-block h-3.5 w-1.5 shrink-0 bg-primary"
              />
            )}
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 4 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
            className="mt-2 flex items-center gap-2 text-[11px] text-emerald-300/90"
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            <span>Estrutura validada · aguardando sua aprovação</span>
          </motion.div>
        </div>

        {/* Árvore das 6 pastas */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span>Arquitetura da pasta</span>
            <span>6 blocos</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {FOLDERS.map((folder) => {
              const visible = phase >= 2;
              return (
                <motion.div
                  key={folder.name}
                  initial={false}
                  animate={
                    visible
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0.22, y: 6, scale: 0.98 }
                  }
                  transition={{
                    duration: 0.28,
                    delay: visible && !prefersReduced ? folder.delay : 0,
                    ease: EASE_OUT,
                  }}
                  whileHover={prefersReduced ? undefined : { y: -1, scale: 1.01 }}
                  className="group flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 transition-colors duration-150 hover:border-primary/35 hover:bg-primary/[0.07]"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {folder.isFile ? (
                      <FileCode2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                    ) : (
                      <Folder className="h-3.5 w-3.5 shrink-0 text-primary/85" />
                    )}
                    <span className="truncate font-mono text-[11.5px] text-foreground/95">
                      {folder.name}
                    </span>
                  </div>
                  <span className="ml-2 shrink-0 rounded-md bg-black/35 px-1.5 py-0.5 text-[9.5px] uppercase tracking-wider text-primary/80">
                    {folder.tag}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Barra de motores conectados */}
        <div className="mt-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-[#12241B]/90 via-[#0E1B14]/90 to-[#19150C]/90 p-3">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-primary/85">
            <span className="inline-flex items-center gap-1.5">
              <Cpu className="h-3 w-3" />
              Comando 2 · Motores locais
            </span>
            <span className="inline-flex items-center gap-1 text-foreground/70">
              <Sparkles className="h-3 w-3 text-primary" />
              Claude · Codex · Gemini
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {ENGINES.map((engine, idx) => {
              const isOn = activeEngine > idx;
              return (
                <motion.div
                  key={engine.name}
                  initial={false}
                  animate={{
                    opacity: isOn ? 1 : 0.35,
                    scale: isOn ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.22, ease: EASE_OUT }}
                  className={`flex items-center justify-between rounded-lg border px-2.5 py-1.5 text-[11px] transition-colors duration-200 ${
                    isOn
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-white/5 bg-black/25 text-muted-foreground"
                  }`}
                >
                  <span className="truncate font-medium">{engine.name}</span>
                  <span
                    className={`ml-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                      isOn ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-white/20"
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
