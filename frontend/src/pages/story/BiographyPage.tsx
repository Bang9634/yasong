import { BiographyEditorDialog } from './components/BiographyEditorDialog';
import { useBiographyEditor } from './hooks/useBiographyEditor';
import { useEffect, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Edit } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { getFullImageUrl } from '@/utils/api';

export function BiographyPage() {
  const { user } = useAuth();
  const isAdmin = user && isManagerOrAbove(user.role);

  const {
    sections,
    isEditModalOpen,
    setIsEditModalOpen,
    editingSections,
    setEditingSections,
    isSaving,
    isLoading,
    setImageFiles,
    imagePreviews,
    setImagePreviews,
    handleSave,
  } = useBiographyEditor();
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  // SEO와 본문 등장 효과
  useEffect(() => {
    setPageSEO({
      title: '약력',
      description:
        '이원좌 화백의 생애와 주요 활동, 그리고 예술가로서의 발자취를 시대별로 소개합니다.',
      keywords: '이원좌, 야송, 약력, 생애, 화백, 동양화, 청송',
    });

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
        rootMargin: '0px 0px -100px 0px',
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
  }, [sections]);

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
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
      {/* 페이지 헤더 */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] tracking-tight mb-2">
                약력
              </h1>
              <p className="text-[#2C2C2C]/70">이원좌 화백의 생애와 예술 세계</p>
            </div>
            {isAdmin && !isLoading && (
              <button
                onClick={() => {
                  setIsEditModalOpen(true);
                  setImageFiles({});
                  setImagePreviews({});
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#C84630] text-white rounded-lg hover:bg-[#A73925] transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>수정</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Biography Sections */}
      <section className="bg-[#F4F4F0]">
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C84630] mx-auto mb-4"></div>
              <p className="text-[#2C2C2C]/70">로딩 중...</p>
            </div>
          </div>
        ) : (
          sections.map((section, sectionIndex) => (
            <div
              key={section.id}
              className={`min-h-screen flex flex-col ${
                section.imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* 이미지 영역 */}
              <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen">
                <img
                  src={getFullImageUrl(section.imageUrl)}
                  alt={section.heading}
                  className="w-full h-full object-cover"
                  onLoad={() => {
                    console.log(
                      `Image loaded for section ${section.id}:`,
                      section.imageUrl,
                      '→',
                      getFullImageUrl(section.imageUrl)
                    );
                  }}
                  onError={(e) => {
                    console.error(
                      `Image failed to load for section ${section.id}:`,
                      section.imageUrl,
                      '→',
                      getFullImageUrl(section.imageUrl)
                    );
                    // 이미지 로드 실패 시 기본 배경색 표시
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.style.backgroundColor = '#E5E5E0';
                  }}
                />
              </div>

              {/* 텍스트 영역 */}
              <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-[#F4F4F0]">
                <div
                  ref={(el) => {
                    textRefs.current[sectionIndex] = el;
                  }}
                  className="max-w-xl fade-in-text"
                >
                  <p className="text-[#2C2C2C]/60 text-sm mb-4 tracking-wider">{section.title}</p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C2C2C] mb-8 leading-tight">
                    {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {section.description.map((line, index) => (
                      <p
                        key={index}
                        className="text-[#2C2C2C]/80 text-base md:text-lg leading-relaxed"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
      {/* 수정 모달 */}
      <BiographyEditorDialog
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setEditingSections={setEditingSections}
        sections={sections}
        setImageFiles={setImageFiles}
        setImagePreviews={setImagePreviews}
        editingSections={editingSections}
        imagePreviews={imagePreviews}
        isSaving={isSaving}
        handleSave={handleSave}
      />{' '}
      <Footer />
    </div>
  );
}
