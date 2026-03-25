import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ChevronRight, BookOpen, FileText, Award, Camera, Edit } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { websiteAPI } from '@/utils/api';

interface Story {
  id: number;
  heading: string;
  description: string[];
}

export function StoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user && isManagerOrAbove(user.role);
  
  const defaultStories: Story[] = [
    {
      id: 1,
      heading: "이원좌 화백",
      description: [
        "1939년 경북 청송에서 태어나 2019년 별세하신 이원좌 화백은",
        "한국 근현대 미술사에 큰 족적을 남긴 동양화의 거장입니다.",
        "",
        "청량산의 맑은 기운과 자연의 아름다움을 담아내며",
        "독자적인 화풍을 완성하였습니다."
      ]
    },
    {
      id: 2,
      heading: "예술의 세계",
      description: [
        "청량대운도를 비롯한 수많은 작품들은",
        "자연과 인간의 조화를 표현한 걸작으로 평가받고 있습니다.",
        "",
        "전통 수묵화의 정수를 계승하면서도",
        "현대적 감각을 더한 그만의 독특한 예술 세계를 구축하였습니다."
      ]
    },
    {
      id: 3,
      heading: "청송의 자랑",
      description: [
        "고향 청송을 사랑하고 한국 미술의 발전에 헌신한",
        "이원좌 화백의 예술 정신은 오늘날까지 이어지고 있습니다.",
        "",
        "그의 작품들은 많은 이들에게 감동과 영감을 주며",
        "한국 미술의 소중한 문화유산으로 자리매김하고 있습니다."
      ]
    }
  ];
  
  const [stories, setStories] = useState<Story[]>(defaultStories);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStories, setEditingStories] = useState<Story[]>(stories);
  const [isSaving, setIsSaving] = useState(false);

  const navigationItems = [
    {
      id: 'biography',
      title: '약력',
      description: '이원좌 화백의 생애와 주요 활동',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      action: () => {
        navigate('/biography');
      }
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
      }
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
      }
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
      }
    }
  ];

  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch stories from backend
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const result = await websiteAPI
          .getTextSetting('story_list')
          .catch(() => ({ value: JSON.stringify(defaultStories) }));

        const fetchedStories: Story[] = JSON.parse(result.value);
        setStories(fetchedStories);
        setEditingStories(fetchedStories);
      } catch (error) {
        console.error('Failed to fetch stories:', error);
        setStories(defaultStories);
        setEditingStories(defaultStories);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    setPageSEO({
      title: '야송 이야기',
      description: '이원좌 화백의 생애와 예술 세계, 그리고 그가 남긴 위대한 업적들을 소개합니다.',
      keywords: '이원좌, 야송, 약력, 일대기, 화백, 동양화, 청송'
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
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
            
      <div className="pt-24 pb-4 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] tracking-tight mb-2">야송이야기</h1>
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
                ref={(el) => { textRefs.current[storyIndex] = el; }}
                className="fade-in-text mb-24 last:mb-0 text-center"
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C2C2C] mb-8 leading-tight">
                  {story.heading}
                </h2>
                <div className="space-y-4">
                  {story.description.map((line, index) => (
                    <p key={index} className="text-[#2C2C2C]/80 text-base md:text-lg leading-relaxed">
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4">
                자세히 보기
              </h2>
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
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2C2C2C]">스토리 내용 수정</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingStories(stories); // 취소 시 원래 값으로 복원
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              {editingStories.map((story, index) => (
                <div key={story.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      스토리 {index + 1} 제목
                    </label>
                    {editingStories.length > 1 && (
                      <button
                        onClick={() => {
                          const newStories = editingStories.filter((_, i) => i !== index);
                          setEditingStories(newStories);
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                      >
                        🗑️ 삭제
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={story.heading}
                    onChange={(e) => {
                      const newStories = [...editingStories];
                      newStories[index].heading = e.target.value;
                      setEditingStories(newStories);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                    placeholder="제목을 입력하세요"
                  />

                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    스토리 {index + 1} 내용 (한 줄당 하나의 문장)
                  </label>
                  <textarea
                    value={story.description.join('\n')}
                    onChange={(e) => {
                      const newStories = [...editingStories];
                      newStories[index].description = e.target.value.split('\n');
                      setEditingStories(newStories);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg h-40"
                    placeholder="내용을 입력하세요. 줄바꿈으로 문단을 구분합니다."
                  />
                </div>
              ))}
            </div>

            {/* 스토리 추가 버튼 */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  const maxId = editingStories.length > 0 
                    ? Math.max(...editingStories.map(s => s.id))
                    : 0;
                  const newStory: Story = {
                    id: maxId + 1,
                    heading: "새 스토리 제목",
                    description: ["새 스토리의 내용을 입력하세요."]
                  };
                  setEditingStories([...editingStories, newStory]);
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-[#C84630] hover:text-[#C84630] transition-colors flex items-center justify-center gap-2"
                disabled={isSaving}
              >
                <span className="text-xl">+</span>
                <span>스토리 추가</span>
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingStories(stories);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                disabled={isSaving}
              >
                취소
              </button>
              <button
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    await websiteAPI.updateTextSetting(
                      'story_list',
                      JSON.stringify(editingStories)
                    );
                    
                    setStories(editingStories);
                    setIsEditModalOpen(false);
                    alert('스토리가 성공적으로 저장되었습니다.');
                  } catch (error) {
                    console.error('Failed to save stories:', error);
                    alert('저장에 실패했습니다.');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className="px-6 py-2 bg-[#C84630] text-white rounded-lg hover:bg-[#A73925] disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
