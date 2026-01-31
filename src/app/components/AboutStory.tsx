import { useEffect, useRef } from 'react';

export function AboutStory() {
  const stories = [
    {
      id: 1,
      title: "STORY #1",
      heading: "이원좌 화백",
      description: [
        "1939년 경북 청송에서 태어나 2019년 별세하신 이원좌 화백은",
        "한국 근현대 미술사에 큰 족적을 남긴 동양화의 거장입니다.",
        "",
        "청량산의 맑은 기운과 자연의 아름다움을 담아내며",
        "독자적인 화풍을 완성하였습니다."
      ],
      imageUrl: "/story-1.webp", // public 폴더에 이미지 추가 필요
      imagePosition: "left"
    },
    {
      id: 2,
      title: "STORY #2",
      heading: "예술의 세계",
      description: [
        "청량대운도를 비롯한 수많은 작품들은",
        "자연과 인간의 조화를 표현한 걸작으로 평가받고 있습니다.",
        "",
        "전통 수묵화의 정수를 계승하면서도",
        "현대적 감각을 더한 그만의 독특한 예술 세계를 구축하였습니다."
      ],
      imageUrl: "/story-2.webp", // public 폴더에 이미지 추가 필요
      imagePosition: "right"
    }
  ];

  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    textRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      textRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section className="bg-[#2C2C2C]">
      <style>{`
        .fade-in-text {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        
        .fade-in-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      
      {stories.map((story, storyIndex) => (
        <div
          key={story.id}
          className={`min-h-screen flex flex-col ${
            story.imagePosition === "left" ? "md:flex-row" : "md:flex-row-reverse"
          }`}
        >
          {/* 이미지 영역 */}
          <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen">
            <img
              src={story.imageUrl}
              alt={story.heading}
              className="w-full h-full object-cover"
            />
          </div>

          {/* 텍스트 영역 */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24">
            <div 
              ref={(el) => (textRefs.current[storyIndex] = el)}
              className="max-w-xl fade-in-text"
            >
              <p className="text-white/60 text-sm mb-4 tracking-wider">{story.title}</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
                {story.heading}
              </h2>
              <div className="space-y-4">
                {story.description.map((line, index) => (
                  <p key={index} className="text-white/80 text-base md:text-lg leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
