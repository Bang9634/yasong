export function Hero() {
  return (
    <section id="hero" className="relative h-screen">
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src="/hero-img.webp"
          alt="군립청송야송미술관"
          className="w-full h-full object-cover"
          loading="eager"
          fetchpriority="high"
          sizes="100vw"
        />
        {/* 어두운 오버레이 - 하단으로 갈수록 더 어둡게 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60" />
      </div>
      
      {/* 하단 텍스트 */}
      <div className="relative h-full flex items-end pb-0 px-4 overflow-hidden">
        <div className="w-full">
          <h1 className="text-7xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-tight">
            <span className="block sm:inline-block animate-[slideUp_0.5s_ease-out_0.1s_both]">이원좌</span>
            <span className="block sm:inline-block sm:ml-6 animate-[slideUp_0.5s_ease-out_0.4s_both]">화백의</span>
            <span className="block sm:inline-block sm:ml-6 animate-[slideUp_0.5s_ease-out_0.7s_both]">예술 세계</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
