import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ChevronLeft, Search, ChevronRight } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';

interface NoticeItem {
  id: number;
  title: string;
  date: string;
  content: string;
  isImportant: boolean;
  views: number;
  category: '일반' | '전시' | '교육' | '행사';
}

// 임시 공지사항 데이터 (추후 백엔드 API로 대체)
const allNotices: NoticeItem[] = [
  {
    id: 1,
    title: '2026년 설 연휴 휴관 안내',
    date: '2026.01.10',
    content: '설 연휴 기간(1월 28일~30일) 동안 미술관은 휴관합니다. 양해 부탁드립니다.',
    isImportant: true,
    views: 1250,
    category: '일반'
  },
  {
    id: 2,
    title: '이원좌 화백 탄생 100주년 특별전 개최 안내',
    date: '2026.01.08',
    content: '이원좌 화백 탄생 100주년을 기념하는 특별전이 2월 1일부터 4월 30일까지 개최됩니다.',
    isImportant: true,
    views: 2340,
    category: '전시'
  },
  {
    id: 3,
    title: '겨울방학 어린이 미술교실 수강생 모집',
    date: '2026.01.05',
    content: '초등학생을 대상으로 한 겨울방학 미술교실 수강생을 모집합니다. 선착순 30명.',
    isImportant: false,
    views: 890,
    category: '교육'
  },
  {
    id: 4,
    title: '1월 문화가 있는 날 무료 관람 안내',
    date: '2026.01.03',
    content: '매월 마지막 주 수요일은 문화가 있는 날로 무료 관람이 가능합니다.',
    isImportant: false,
    views: 1560,
    category: '일반'
  },
  {
    id: 5,
    title: '미술관 주차장 확장 공사 완료',
    date: '2025.12.28',
    content: '주차장 확장 공사가 완료되어 더욱 편리한 주차 환경을 제공합니다.',
    isImportant: false,
    views: 670,
    category: '일반'
  },
  {
    id: 6,
    title: '2025년 연말 특별 기획전 종료 안내',
    date: '2025.12.25',
    content: '올 한 해 사랑해주신 관람객 여러분께 감사드립니다.',
    isImportant: false,
    views: 920,
    category: '전시'
  },
  {
    id: 7,
    title: '겨울 시즌 도슨트 프로그램 운영',
    date: '2025.12.20',
    content: '매주 토요일, 일요일 오후 2시 무료 도슨트 프로그램이 운영됩니다.',
    isImportant: false,
    views: 780,
    category: '교육'
  },
  {
    id: 8,
    title: '연말연시 특별 이벤트 안내',
    date: '2025.12.15',
    content: '12월 한 달간 미술관 방문 시 특별 기념품을 증정합니다.',
    isImportant: false,
    views: 1450,
    category: '행사'
  },
  {
    id: 9,
    title: '미술관 홈페이지 리뉴얼 완료',
    date: '2025.12.10',
    content: '더욱 편리해진 홈페이지를 통해 미술관 소식을 확인하세요.',
    isImportant: false,
    views: 1120,
    category: '일반'
  },
  {
    id: 10,
    title: '청소년 미술 공모전 수상작 전시',
    date: '2025.12.05',
    content: '2025 청소년 미술 공모전 수상작 전시가 12월 한 달간 진행됩니다.',
    isImportant: false,
    views: 850,
    category: '전시'
  },
  {
    id: 11,
    title: '가을 특별 기획전 개최 안내',
    date: '2025.11.28',
    content: '가을을 주제로 한 특별 기획전이 개최됩니다.',
    isImportant: false,
    views: 920,
    category: '전시'
  },
  {
    id: 12,
    title: '11월 문화의 날 행사 안내',
    date: '2025.11.20',
    content: '다양한 문화 행사가 준비되어 있습니다.',
    isImportant: false,
    views: 650,
    category: '행사'
  },
  {
    id: 13,
    title: '미술관 무료 셔틀버스 운행 안내',
    date: '2025.11.15',
    content: '주말 및 공휴일 무료 셔틀버스가 운행됩니다.',
    isImportant: false,
    views: 1100,
    category: '일반'
  },
  {
    id: 14,
    title: '추석 연휴 특별 개관 안내',
    date: '2025.09.20',
    content: '추석 연휴 기간에도 정상 운영합니다.',
    isImportant: false,
    views: 890,
    category: '일반'
  },
  {
    id: 15,
    title: '여름방학 청소년 미술캠프 안내',
    date: '2025.08.10',
    content: '중고등학생 대상 2박 3일 미술캠프 참가자를 모집합니다.',
    isImportant: false,
    views: 1340,
    category: '교육'
  },
  {
    id: 16,
    title: '미술관 리모델링 공사 완료',
    date: '2025.07.25',
    content: '전시실 리모델링이 완료되어 더욱 쾌적한 관람 환경을 제공합니다.',
    isImportant: false,
    views: 760,
    category: '일반'
  },
  {
    id: 17,
    title: '여름 특별 전시회 오픈',
    date: '2025.07.15',
    content: '여름을 주제로 한 특별 전시회가 개최됩니다.',
    isImportant: false,
    views: 980,
    category: '전시'
  },
  {
    id: 18,
    title: '미술관 가이드 앱 출시',
    date: '2025.06.30',
    content: '스마트폰으로 더욱 편리하게 미술관을 관람하세요.',
    isImportant: false,
    views: 1250,
    category: '일반'
  },
  {
    id: 19,
    title: '봄꽃 사진 공모전 개최',
    date: '2025.05.20',
    content: '미술관 정원의 봄꽃을 주제로 한 사진 공모전을 개최합니다.',
    isImportant: false,
    views: 870,
    category: '행사'
  },
  {
    id: 20,
    title: '개관 10주년 기념 행사 안내',
    date: '2025.05.01',
    content: '미술관 개관 10주년을 기념하는 다양한 행사가 준비되어 있습니다.',
    isImportant: false,
    views: 1890,
    category: '행사'
  },
  {
    id: 21,
    title: '어린이날 특별 프로그램 운영',
    date: '2025.04.25',
    content: '어린이날을 맞아 다양한 체험 프로그램을 운영합니다.',
    isImportant: false,
    views: 1120,
    category: '교육'
  },
  {
    id: 22,
    title: '봄맞이 야외 조각 전시',
    date: '2025.04.10',
    content: '미술관 정원에서 야외 조각 전시가 진행됩니다.',
    isImportant: false,
    views: 950,
    category: '전시'
  },
  {
    id: 23,
    title: '3월 무료 도슨트 프로그램 확대',
    date: '2025.03.15',
    content: '주중에도 무료 도슨트 프로그램이 운영됩니다.',
    isImportant: false,
    views: 720,
    category: '교육'
  },
  {
    id: 24,
    title: '설 연휴 특별 개관 안내',
    date: '2025.02.10',
    content: '설 연휴 기간에도 정상 개관합니다.',
    isImportant: false,
    views: 1050,
    category: '일반'
  },
  {
    id: 25,
    title: '신년 특별 기획전 개최',
    date: '2025.01.05',
    content: '새해를 맞아 특별 기획전이 개최됩니다.',
    isImportant: false,
    views: 1430,
    category: '전시'
  }
];

export function NoticePage() {
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'전체' | '일반' | '전시' | '교육' | '행사'>('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 검색 및 필터링
  const filteredNotices = allNotices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '전체' || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNotices = filteredNotices.slice(startIndex, endIndex);

  // 페이지 변경 시 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 검색어나 카테고리 변경 시 첫 페이지로 리셋
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: '전체' | '일반' | '전시' | '교육' | '행사') => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* 메인 컨텐츠 - 헤더 높이만큼 상단 여백 추가 */}
      <div className="pt-24">
        {!selectedNotice ? (
          // 공지사항 목록
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* 페이지 헤더 */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <Bell className="w-8 h-8 text-teal-800 mr-3" />
                <h1 className="text-4xl font-bold text-teal-900">공지사항</h1>
              </div>
              <Link 
                to="/" 
                className="inline-flex items-center text-gray-600 hover:text-teal-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                홈으로 돌아가기
              </Link>
            </div>

            {/* 검색 및 필터 */}
            <div className="mb-8 bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* 검색바 */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="공지사항 검색..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                {/* 카테고리 필터 */}
                <div className="flex gap-2 flex-wrap">
                  {(['전체', '일반', '전시', '교육', '행사'] as const).map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        selectedCategory === category
                          ? 'bg-teal-700 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 공지사항 목록 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {currentNotices.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {currentNotices.map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => setSelectedNotice(notice)}
                      className="p-5 hover:bg-teal-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {notice.isImportant && (
                              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                중요
                              </span>
                            )}
                            <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">
                              {notice.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {notice.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {notice.content}
                          </p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-sm text-gray-500">{notice.date}</p>
                          <p className="text-xs text-gray-400 mt-1">조회 {notice.views}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-gray-500">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>

            {/* 페이지네이션 */}
            {filteredNotices.length > 0 && totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  {/* 이전 페이지 버튼 */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md transition-colors ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* 페이지 번호 */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md transition-colors ${
                        currentPage === page
                          ? 'bg-teal-700 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* 다음 페이지 버튼 */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md transition-colors ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          // 공지사항 상세보기
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* 헤더 */}
              <div className="bg-teal-700 text-white p-6">
                <div className="flex items-center gap-2 mb-3">
                  {selectedNotice.isImportant && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      중요
                    </span>
                  )}
                  <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded">
                    {selectedNotice.category}
                  </span>
                </div>
                <h1 className="text-2xl font-bold mb-3">{selectedNotice.title}</h1>
                <div className="flex items-center text-teal-100 text-sm gap-4">
                  <span>작성일: {selectedNotice.date}</span>
                  <span>조회수: {selectedNotice.views}</span>
                </div>
              </div>

              {/* 본문 */}
              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedNotice.content}
                  </p>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="border-t border-gray-200 p-6 flex gap-3">
                <button
                  onClick={() => setSelectedNotice(null)}
                  className="px-6 py-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-colors"
                >
                  목록으로
                </button>
                <Link
                  to="/"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                >
                  홈으로
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
