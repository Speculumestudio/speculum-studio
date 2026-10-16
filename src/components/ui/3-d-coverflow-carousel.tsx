import { useCallback, useEffect, useRef, useState } from "react";

export interface CarouselItem {
  tag?: string;
  titleLine1: string;
  titleLine2?: string;
  desc?: string;
  img: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface CoverFlowCarouselProps {
  items: CarouselItem[];
  sectionLabel?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
}

const positionFor = (offset: number, total: number) => {
  if (offset === 0) return { transform: "translateX(0) scale(1)", opacity: 1, zIndex: 30, filter: "brightness(1)" };
  if (offset === 1) return { transform: "translateX(285px) scale(.84) rotateY(-24deg)", opacity: .62, zIndex: 20, filter: "brightness(.68)" };
  if (offset === total - 1) return { transform: "translateX(-285px) scale(.84) rotateY(24deg)", opacity: .62, zIndex: 20, filter: "brightness(.68)" };
  if (offset === 2) return { transform: "translateX(510px) scale(.68) rotateY(-38deg)", opacity: .28, zIndex: 10, filter: "brightness(.5) blur(1px)" };
  if (offset === total - 2) return { transform: "translateX(-510px) scale(.68) rotateY(38deg)", opacity: .28, zIndex: 10, filter: "brightness(.5) blur(1px)" };
  return { transform: "translateX(0) scale(.35)", opacity: 0, zIndex: 0, filter: "brightness(.3)" };
};

export function CoverFlowCarousel({
  items,
  sectionLabel = "ÁREAS DE ATUAÇÃO",
  autoplay = true,
  autoplayDelay = 4200,
  className = "",
}: CoverFlowCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const total = items.length;

  const nextSlide = useCallback(() => setCurrentIndex((index) => (index + 1) % total), [total]);
  const prevSlide = useCallback(() => setCurrentIndex((index) => (index - 1 + total) % total), [total]);

  useEffect(() => {
    if (!autoplay || isHovered || total < 2) return undefined;
    const interval = window.setInterval(nextSlide, autoplayDelay);
    return () => window.clearInterval(interval);
  }, [autoplay, autoplayDelay, isHovered, nextSlide, total]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") prevSlide();
      if (event.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  if (!items.length) return null;

  return (
    <section
      className={`relative w-full overflow-hidden bg-[#0c0a09] py-20 text-white select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
      onTouchEnd={(event) => {
        const diff = event.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(diff) > 45) (diff < 0 ? nextSlide : prevSlide)();
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <img src={items[currentIndex].img} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover scale-110 blur-3xl opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,10,9,.28),rgba(12,10,9,.96)_76%)]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4">
        <div className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[.3em] text-[#c5a880]">
          <span className="h-px w-9 bg-gradient-to-r from-transparent to-[#c5a880]" />
          {sectionLabel}
          <span className="h-px w-9 bg-gradient-to-r from-[#c5a880] to-transparent" />
        </div>

        <div className="relative flex h-[470px] w-full items-center justify-center [perspective:1400px] sm:h-[520px]">
          {items.map((item, index) => {
            const offset = (index - currentIndex + total) % total;
            const position = positionFor(offset, total);
            const isCenter = offset === 0;
            return (
              <article
                key={`${item.titleLine1}-${index}`}
                onClick={() => { if (!isCenter) setCurrentIndex(index); }}
                className="absolute h-[390px] w-[255px] overflow-hidden rounded-2xl border border-white/10 bg-[#171311] shadow-2xl transition-all duration-700 ease-out sm:h-[500px] sm:w-[330px]"
                style={{ ...position, cursor: isCenter ? "default" : "pointer" }}
              >
                <img src={item.img} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/95" />
                <div className={`relative z-10 flex h-full flex-col justify-between p-5 text-center transition-opacity duration-500 sm:p-6 ${isCenter ? "opacity-100" : "opacity-0"}`}>
                  <span className="self-end text-xs font-semibold tracking-wider text-white/80">{item.tag}</span>
                  <div className="mt-auto">
                    <h3 className="font-display text-2xl font-black uppercase leading-tight tracking-wide sm:text-[1.65rem]">{item.titleLine1}</h3>
                    {item.titleLine2 && <p className="mt-1 text-sm font-bold uppercase tracking-widest text-white/80">{item.titleLine2}</p>}
                    <div className="mx-auto my-3 h-0.5 w-9 rounded bg-[#c5a880]" />
                    <p className="mx-auto mb-4 max-w-[270px] text-sm italic leading-relaxed text-white/80">{item.desc}</p>
                    <a href={item.ctaUrl || "#"} className="inline-flex rounded-full bg-gradient-to-br from-[#c5a880] to-[#a48256] px-5 py-2 text-xs font-extrabold uppercase tracking-[.14em] text-[#110d0c]">{item.ctaText || "Conhecer"} <span className="ml-2">→</span></a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="flex items-center gap-3" aria-label="Navegação das áreas">
          <button type="button" onClick={prevSlide} aria-label="Área anterior" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-xl hover:bg-white/10">‹</button>
          {items.map((item, index) => <button type="button" key={item.titleLine1} onClick={() => setCurrentIndex(index)} aria-label={`Mostrar ${item.titleLine1}`} className={`h-2 rounded-full transition-all ${index === currentIndex ? "w-8 bg-[#c5a880]" : "w-2 bg-white/25"}`} />)}
          <button type="button" onClick={nextSlide} aria-label="Próxima área" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-xl hover:bg-white/10">›</button>
        </div>
      </div>
    </section>
  );
}

export default CoverFlowCarousel;
