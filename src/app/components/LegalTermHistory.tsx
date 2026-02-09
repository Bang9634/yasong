import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { legalAPI } from '@/utils/api';
import { ChevronLeft, FileText, Calendar, CheckCircle, Settings } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';

interface LegalTermSummary {
  id: number;
  type: 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY';
  version: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export function LegalTermHistory() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [terms, setTerms] = useState<LegalTermSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const canManage = user && isManagerOrAbove(user.role);

  useEffect(() => {
    if (type) {
      fetchHistory();
    }
  }, [type]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const termType = type === 'terms' ? 'TERMS_OF_SERVICE' : 'PRIVACY_POLICY';
      const data = await legalAPI.getTermHistory(termType);
      setTerms(data || []);
      
      const title = type === 'terms' ? '이용약관' : '개인정보 처리방침';
      setPageSEO({
        title: `${title} 히스토리`,
        description: `야송 ${title} 변경 이력`,
        keywords: `야송, ${title}, 히스토리`,
      });
    } catch (error) {
      console.error('히스토리 조회 실패:', error);
      alert('히스토리를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeDisplayName = () => {
    return type === 'terms' ? '이용약관' : '개인정보 처리방침';
  };

  const handleTermClick = (termId: number) => {
    navigate(`/legal/detail/${termId}`);
  };

  const handleBackToCurrent = () => {
    navigate(`/legal/${type}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#2C2C2C]/60">로딩 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#2C2C2C]/60 hover:text-[#C84630] transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>뒤로 가기</span>
        </button>

        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#C84630]" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] tracking-tight">
                  {getTypeDisplayName()} 히스토리
                </h1>
                <p className="text-[#2C2C2C]/70 mt-2">
                  과거 버전을 포함한 모든 {getTypeDisplayName()} 목록입니다.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canManage && (
                <button
                  onClick={() => navigate('/admin/legal')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#2C2C2C] text-white rounded-lg hover:bg-[#1C1C1C] transition-colors text-sm font-medium"
                >
                  <Settings className="w-4 h-4" />
                  관리하기
                </button>
              )}
              {terms.length > 0 && (
                <button
                  onClick={handleBackToCurrent}
                  className="px-4 py-2 bg-[#C84630] text-white rounded-lg hover:bg-[#A33520] transition-colors text-sm font-medium"
                >
                  현재 약관 보기
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-[#2C2C2C]/20 mb-8"></div>

        {/* 약관 목록 */}
        {terms.length === 0 ? (
          <div className="text-center py-12 text-[#2C2C2C]/60">
            등록된 {getTypeDisplayName()}이(가) 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {terms.map((term) => (
              <div
                key={term.id}
                onClick={() => handleTermClick(term.id)}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#2C2C2C] group-hover:text-[#C84630] transition-colors">
                        {getTypeDisplayName()} v{term.version}
                      </h3>
                      {term.isActive && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
                          <CheckCircle className="w-3 h-3" />
                          현재 적용 중
                        </span>
                      )}
                      {!term.isActive && term.endDate && (
                        <span className="px-3 py-1 bg-gray-500 text-white text-xs rounded-full font-medium">
                          종료됨
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#2C2C2C]/70">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>시행일: {new Date(term.startDate).toLocaleDateString('ko-KR')}</span>
                      </div>
                      {term.endDate && (
                        <div className="flex items-center gap-2">
                          <span>종료일: {new Date(term.endDate).toLocaleDateString('ko-KR')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span>등록일: {new Date(term.createdAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <ChevronLeft className="w-5 h-5 text-[#2C2C2C]/40 group-hover:text-[#C84630] transition-colors rotate-180" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 하단 안내 */}
        <div className="mt-12 pt-8 border-t border-[#2C2C2C]/10 text-center text-sm text-[#2C2C2C]/60">
          <p>약관을 클릭하면 전체 내용을 확인할 수 있습니다.</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
