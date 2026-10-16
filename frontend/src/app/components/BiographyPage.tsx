import { useEffect, useRef, useState } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { websiteAPI, getFullImageUrl } from '@/utils/api';

interface BiographySection {
  id: number;
  title: string;
  heading: string;
  description: string[];
  imageUrl: string;
  imagePosition: 'left' | 'right';
}

export function BiographyPage() {
  const { user } = useAuth();
  const isAdmin = user && isManagerOrAbove(user.role);
  
  const defaultSections: BiographySection[] = [
    {
      id: 1,
      title: "BIOGRAPHY #1",
      heading: "생애 초기 (1939-1960)",
      description: [
        "1939년 경북 청송에서 태어난 이원좌 화백은",
        "어린 시절부터 청량산의 자연에서 영감을 받았습니다.",
        "",
        "전통 서화의 기초를 다지며",
        "예술가로서의 첫 발걸음을 내딛었습니다."
      ],
      imageUrl: "/biography-1.webp",
      imagePosition: "left"
    },
    {
      id: 2,
      title: "BIOGRAPHY #2",
      heading: "작품 활동 (1961-1990)",
      description: [
        "본격적인 작품 활동을 시작하며",
        "한국 동양화의 새로운 지평을 열었습니다.",
        "",
        "전통과 현대의 조화를 추구하며",
        "독자적인 예술 세계를 구축해 나갔습니다."
      ],
      imageUrl: "/biography-2.webp",
      imagePosition: "right"
    },
    {
      id: 3,
      title: "BIOGRAPHY #3",
      heading: "말년의 업적 (1991-2019)",
      description: [
        "노년까지 왕성한 작품 활동을 이어가며",
        "한국 미술계에 깊은 족적을 남겼습니다.",
        "",
        "2019년 별세할 때까지",
        "후학 양성과 예술의 대중화에 힘썼습니다."
      ],
      imageUrl: "/biography-3.webp",
      imagePosition: "left"
    }
  ];
  
  const [sections, setSections] = useState<BiographySection[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSections, setEditingSections] = useState<BiographySection[]>(sections);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState<{ [key: number]: File | null }>({});
  const [imagePreviews, setImagePreviews] = useState<{ [key: number]: string }>({});

  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch biography sections from backend
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const result = await websiteAPI
          .getTextSetting('biography-sections')
          .catch(() => ({ value: JSON.stringify(defaultSections) }));

        console.log('Fetched biography-sections from backend:', result);
        
        const fetchedSections: BiographySection[] = JSON.parse(result.value);
        console.log('Parsed sections:', fetchedSections);
        
        setSections(fetchedSections);
        setEditingSections(fetchedSections);
      } catch (error) {
        console.error('Failed to fetch biography sections:', error);
        setSections(defaultSections);
        setEditingSections(defaultSections);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSections();
  }, []);

  useEffect(() => {
    setPageSEO({
      title: '약력',
      description: '이원좌 화백의 생애와 주요 활동, 그리고 예술가로서의 발자취를 시대별로 소개합니다.',
      keywords: '이원좌, 야송, 약력, 생애, 화백, 동양화, 청송'
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
              <h1 className="text-4xl sm:text-5xl font-bold text-[#2C2C2C] tracking-tight mb-2">약력</h1>
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
                section.imagePosition === "left" ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* 이미지 영역 */}
              <div className="w-full md:w-1/2 relative min-h-[50vh] md:min-h-screen">
                <img
                  src={getFullImageUrl(section.imageUrl)}
                  alt={section.heading}
                  className="w-full h-full object-cover"
                  onLoad={() => {
                    console.log(`Image loaded for section ${section.id}:`, section.imageUrl, '→', getFullImageUrl(section.imageUrl));
                  }}
                  onError={(e) => {
                    console.error(`Image failed to load for section ${section.id}:`, section.imageUrl, '→', getFullImageUrl(section.imageUrl));
                    // 이미지 로드 실패 시 기본 배경색 표시
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.style.backgroundColor = '#E5E5E0';
                  }}
                />
              </div>

              {/* 텍스트 영역 */}
              <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-[#F4F4F0]">
                <div 
                  ref={(el) => { textRefs.current[sectionIndex] = el; }}
                  className="max-w-xl fade-in-text"
                >
                  <p className="text-[#2C2C2C]/60 text-sm mb-4 tracking-wider">{section.title}</p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C2C2C] mb-8 leading-tight">
                    {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {section.description.map((line, index) => (
                      <p key={index} className="text-[#2C2C2C]/80 text-base md:text-lg leading-relaxed">
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
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#2C2C2C]">약력 섹션 수정</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingSections(sections);
                  setImageFiles({});
                  setImagePreviews({});
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8">
              {editingSections.map((section, index) => (
                <div key={section.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-[#2C2C2C]">섹션 {index + 1}</h3>
                    {editingSections.length > 1 && (
                      <button
                        onClick={() => {
                          const sectionToRemove = editingSections[index];
                          const newSections = editingSections.filter((_, i) => i !== index);
                          setEditingSections(newSections);
                          
                          // 삭제된 섹션의 이미지 파일과 미리보기도 제거
                          setImageFiles(prev => {
                            const newFiles = { ...prev };
                            delete newFiles[sectionToRemove.id];
                            return newFiles;
                          });
                          setImagePreviews(prev => {
                            const newPreviews = { ...prev };
                            delete newPreviews[sectionToRemove.id];
                            return newPreviews;
                          });
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* 타이틀 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        타이틀 (예: BIOGRAPHY #1)
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => {
                          const newSections = [...editingSections];
                          newSections[index].title = e.target.value;
                          setEditingSections(newSections);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="BIOGRAPHY #1"
                      />
                    </div>

                    {/* 제목 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        제목
                      </label>
                      <input
                        type="text"
                        value={section.heading}
                        onChange={(e) => {
                          const newSections = [...editingSections];
                          newSections[index].heading = e.target.value;
                          setEditingSections(newSections);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        placeholder="생애 초기 (1939-1960)"
                      />
                    </div>

                    {/* 내용 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        내용 (한 줄당 하나의 문장)
                      </label>
                      <textarea
                        value={section.description.join('\n')}
                        onChange={(e) => {
                          const newSections = [...editingSections];
                          newSections[index].description = e.target.value.split('\n');
                          setEditingSections(newSections);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg h-40"
                        placeholder="내용을 입력하세요. 줄바꿈으로 문단을 구분합니다."
                      />
                    </div>

                    {/* 이미지 업로드 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이미지
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // 파일 저장
                            setImageFiles(prev => ({ ...prev, [section.id]: file }));
                            
                            // 미리보기 생성
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreviews(prev => ({ 
                                ...prev, 
                                [section.id]: reader.result as string 
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        권장 크기: 1920x1080px 이상, 형식: JPG, PNG, WEBP
                      </p>
                      
                      {/* 이미지 미리보기 */}
                      {(imagePreviews[section.id] || section.imageUrl) && (
                        <div className="mt-3 relative">
                          <img
                            src={imagePreviews[section.id] || getFullImageUrl(section.imageUrl)}
                            alt="미리보기"
                            className="w-full h-48 object-cover rounded border"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          {imagePreviews[section.id] && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              새 이미지
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 이미지 위치 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        이미지 위치
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="left"
                            checked={section.imagePosition === 'left'}
                            onChange={(e) => {
                              const newSections = [...editingSections];
                              newSections[index].imagePosition = e.target.value as 'left' | 'right';
                              setEditingSections(newSections);
                            }}
                            className="mr-2"
                          />
                          왼쪽
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            value="right"
                            checked={section.imagePosition === 'right'}
                            onChange={(e) => {
                              const newSections = [...editingSections];
                              newSections[index].imagePosition = e.target.value as 'left' | 'right';
                              setEditingSections(newSections);
                            }}
                            className="mr-2"
                          />
                          오른쪽
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 섹션 추가 버튼 */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => {
                  const maxId = editingSections.length > 0 
                    ? Math.max(...editingSections.map(s => s.id))
                    : 0;
                  const newSection: BiographySection = {
                    id: maxId + 1,
                    title: `BIOGRAPHY #${editingSections.length + 1}`,
                    heading: "새 섹션 제목",
                    description: ["새 섹션의 내용을 입력하세요."],
                    imageUrl: "", // 빈 문자열로 초기화
                    imagePosition: editingSections.length % 2 === 0 ? 'left' : 'right'
                  };
                  setEditingSections([...editingSections, newSection]);
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-[#C84630] hover:text-[#C84630] transition-colors flex items-center justify-center gap-2"
                disabled={isSaving}
              >
                <Plus className="w-5 h-5" />
                <span>섹션 추가</span>
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingSections(sections);
                  setImageFiles({});
                  setImagePreviews({});
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
                    // 1. 먼저 변경된 이미지들을 업로드
                    const updatedSections = [...editingSections];
                    
                    for (let i = 0; i < updatedSections.length; i++) {
                      const section = updatedSections[i];
                      const imageFile = imageFiles[section.id];
                      
                      if (imageFile) {
                        try {
                          // 모든 biography 이미지는 동일한 imageType 사용
                          // 백엔드의 filePrefix 'biography-'와 timestamp로 자동 구분됨
                          const imageType = 'biography';
                          console.log(`Uploading image for section ${i + 1}, imageType: ${imageType}, file:`, imageFile.name);
                          
                          const response = await websiteAPI.uploadImage(imageType, imageFile);
                          console.log(`Upload response for section ${i + 1}:`, response);
                          
                          // 업로드된 이미지 URL로 업데이트
                          if (response.imageUrl) {
                            updatedSections[i].imageUrl = response.imageUrl;
                          }
                        } catch (error: any) {
                          console.error(`Failed to upload image for section ${section.id}:`, error);
                          console.error('Error details:', error.message, error.stack);
                          alert(`섹션 ${i + 1}의 이미지 업로드에 실패했습니다.\n\n에러: ${error.message || '알 수 없는 오류'}`);
                          setIsSaving(false);
                          return;
                        }
                      }
                    }
                    
                    // 2. 업데이트된 섹션 데이터를 저장
                    await websiteAPI.updateTextSetting(
                      'biography-sections',
                      JSON.stringify(updatedSections)
                    );
                    
                    console.log('Saved sections:', updatedSections);
                    
                    setSections(updatedSections);
                    setEditingSections(updatedSections);
                    setIsEditModalOpen(false);
                    setImageFiles({});
                    setImagePreviews({});
                    alert('약력이 성공적으로 저장되었습니다.');
                  } catch (error) {
                    console.error('Failed to save biography:', error);
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
