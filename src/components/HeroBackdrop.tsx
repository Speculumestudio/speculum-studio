export function HeroBackdrop() {
  return (
    <div className="absolute inset-0 opacity-50" aria-hidden="true">
      <img src="/media/hero-poster.webp" alt="" {...{ fetchpriority: "high" }}
        width={1280} height={724}
        className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
}
