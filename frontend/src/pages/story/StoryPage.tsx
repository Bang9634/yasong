import { StoryEditorDialog } from './components/StoryEditorDialog';
import { useStoryEditor } from './hooks/useStoryEditor';
import type { Story } from '@/pages/story/types';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ChevronRight, BookOpen, FileText, Award, Camera, Edit } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';

export function StoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user && isManagerOrAbove(user.role);

  const {
    stories,
    isEditModalOpen,
    setIsEditModalOpen,
    editingStories,
    setEditingStories,
    isSaving,
    handleSave,
  } = useStoryEditor();
  const navigationItems = [
    {
      id: 'biography',
      title: '약력',
      description: '이원좌 화백의 생애와 주요 활동',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      action: () => {
        navigate('/biography');
      },
    },
    {
      id: 'chronicle',
      title: '일대기',
      description: '시대별 주요 행적과 업적',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      action: () => {
        // TODO: 일대기 페이지 구현 후 navigate 추가
        alert('일대기 페이지는 준비 중입니다.');
      },
    },
    {
      id: 'evaluation',
      title: '화업의 평가, 평론',
      description: '작품 세계와 예술적 성취',
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      action: () => {
        // TODO: 화업의 평가 페이지 구현 후 navigate 추가
        alert('화업의 평가, 평론 페이지는 준비 중입니다.');
      },
    },
    {
      id: 'photos',
      title: '사진 자료',
      description: '화백의 모습과 작업 현장',
      icon: Camera,
      color: 'from-orange-500 to-orange-600',
      action: () => {
        // TODO: 사진 자료 페이지 구현 후 navigate 추가
        navigate('/photos');
      },
    },
  ];

  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  // SEO와 본문 등장 효과
  useEffect(() => {
    setPageSEO({
      title: '야송 이야기',
      description: '이원좌 화백의 생애와 예술 세계, 그리고 그가 남긴 위대한 업적들을 소개합니다.',
      keywords: '이원좌, 야송, 약력, 일대기, 화백, 동양화, 청송',
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
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      <div className="pt-24 pb-4 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] tracking-tight mb-2">
                야송이야기
              </h1>
              <p className="text-[#2C2C2C]/70">야송 이원좌 화백의 이야기를 만나보세요</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#C84630] text-white rounded-lg hover:bg-[#A73925] transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>수정</span>
              </button>
            )}
          </div>
        </div>
      </div>
      <main className="flex-1">
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

        {/* Story 섹션 */}
        <section className="bg-[#F4F4F0] py-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {stories.map((story, storyIndex) => (
              <div
                key={story.id}
                ref={(el) => {
                  textRefs.current[storyIndex] = el;
                }}
                className="fade-in-text mb-24 last:mb-0 text-center"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C2C2C] mb-8 leading-tight">
                  {story.heading}
                </h2>
                <div className="space-y-4">
                  {story.description.map((line, index) => (
                    <p
                      key={index}
                      className="text-[#2C2C2C]/80 text-base md:text-lg leading-relaxed"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 네비게이션 섹션 */}
        <section className="bg-[#F4F4F0] py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4">자세히 보기</h2>
              <p className="text-[#2C2C2C]/70 text-lg">
                이원좌 화백의 삶과 예술 세계를 더욱 자세히 탐험해보세요
              </p>
            </div>

            <nav className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="group flex items-center gap-2 text-[#2C2C2C] hover:text-[#C84630] transition-colors py-2 relative text-base md:text-lg font-medium"
                >
                  <span className="relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-[#2C2C2C]/20 after:transition-all after:duration-300 group-hover:after:bg-[#C84630] group-hover:after:h-[3px]">
                    {item.title}
                  </span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              ))}
            </nav>
          </div>
        </section>
      </main>
      {/* 수정 모달 */}
      <StoryEditorDialog
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setEditingStories={setEditingStories}
        stories={stories}
        editingStories={editingStories}
        isSaving={isSaving}
        handleSave={handleSave}
      />{' '}
      <Footer />
    </div>
  );
}
