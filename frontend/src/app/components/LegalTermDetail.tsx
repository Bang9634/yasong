import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { legalAPI } from '@/utils/api';
import { ChevronLeft, Calendar, FileText, Edit2, Trash2, CheckCircle, Plus } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';

interface LegalTerm {
  id: number;
  type: 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY';
  version: string;
  content: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function LegalTermDetail() {
  const { id, type } = useParams<{ id?: string; type?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [term, setTerm] = useState<LegalTerm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const canManage = user && isManagerOrAbove(user.role);

  useEffect(() => {
    fetchTerm();
  }, [id, type]);

  const fetchTerm = async () => {
    try {
      setIsLoading(true);
      let data;
      
      if (id) {
        // ID로 조회
        data = await legalAPI.getTermById(parseInt(id));
      } else if (type) {
        // 현재 활성화된 약관 조회
        const termType = type === 'terms' ? 'TERMS_OF_SERVICE' : 'PRIVACY_POLICY';
        data = await legalAPI.getCurrentTerm(termType);
      }

      if (data) {
        setTerm(data);
        const title = data.type === 'TERMS_OF_SERVICE' ? '이용약관' : '개인정보 처리방침';
        setPageSEO({
          title: `${title} (${data.version})`,
          description: `야송 ${title}`,
          keywords: `야송, ${title}`,
        });
      } else {
        // 약관이 없는 경우
        setTerm(null);
        const title = type === 'terms' ? '이용약관' : type === 'privacy' ? '개인정보 처리방침' : '약관';
        setPageSEO({
          title: title,
          description: `야송 ${title}`,
          keywords: `야송, ${title}`,
        });
      }
    } catch (error) {
      console.error('약관 조회 실패:', error);
      // 에러가 발생해도 약관이 없는 것으로 처리 (리다이렉트하지 않음)
      setTerm(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeDisplayName = (type: string) => {
    return type === 'TERMS_OF_SERVICE' ? '이용약관' : '개인정보 처리방침';
  };

  const handleViewHistory = () => {
    if (term) {
      const typeParam = term.type === 'TERMS_OF_SERVICE' ? 'terms' : 'privacy';
      navigate(`/legal/${typeParam}/history`);
    }
  };

  const handleEdit = () => {
    if (term) {
      navigate(`/admin/legal/edit/${term.id}`);
    }
  };

  const handleDelete = async () => {
    if (!term) return;
    if (!window.confirm('정말로 이 약관을 삭제하시겠습니까?')) return;

    try {
      await legalAPI.deleteTerm(term.id);
      alert('약관이 삭제되었습니다.');
      navigate('/admin/legal');
    } catch (error) {
      console.error('약관 삭제 실패:', error);
      alert('약관 삭제에 실패했습니다.');
    }
  };

  const handleActivate = async () => {
    if (!term) return;
    if (!window.confirm('이 약관을 활성화하시겠습니까?\n현재 활성화된 약관은 자동으로 비활성화됩니다.')) return;

    try {
      await legalAPI.activateTerm(term.id);
      alert('약관이 활성화되었습니다.');
      fetchTerm();
    } catch (error) {
      console.error('약관 활성화 실패:', error);
      alert('약관 활성화에 실패했습니다.');
    }
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

  if (!term) {
    // 약관이 없을 때, type 파라미터로 약관 종류를 파악
    const termType = type === 'terms' ? 'TERMS_OF_SERVICE' : type === 'privacy' ? 'PRIVACY_POLICY' : null;
    const displayName = type === 'terms' ? '이용약관' : type === 'privacy' ? '개인정보 처리방침' : '약관';

    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
        <Header />
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
          {/* 뒤로 가기 버튼 */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#2C2C2C]/60 hover:text-[#C84630] transition-colors mb-8"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>뒤로 가기</span>
          </button>

          <div className="flex flex-col items-center justify-center py-16">
            <FileText className="w-16 h-16 text-[#2C2C2C]/30 mb-4" />
            <p className="text-xl text-[#2C2C2C]/60 mb-2">등록된 {displayName}이(가) 없습니다.</p>
            <p className="text-sm text-[#2C2C2C]/40 mb-8">
              아직 {displayName}이(가) 등록되지 않았습니다.
            </p>
            
            {/* 관리자 전용 버튼 */}
            {canManage && termType && (
              <button
                onClick={() => navigate(`/admin/legal/new?type=${termType}`)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C84630] text-white rounded-lg hover:bg-[#A33520] transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                {displayName} 추가하기
              </button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#C84630]" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] tracking-tight">
                {getTypeDisplayName(term.type)}
              </h1>
            </div>
            {/* 관리자 버튼 */}
            {canManage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 transition-colors rounded-lg text-blue-700 text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  수정
                </button>
                {!term.isActive && (
                  <button
                    onClick={handleActivate}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 transition-colors rounded-lg text-green-700 text-sm font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    활성화
                  </button>
                )}
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 transition-colors rounded-lg text-red-700 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
              </div>
            )}
          </div>
          
          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#2C2C2C]/70">
            <div className="flex items-center gap-2">
              <span className="font-medium">버전:</span>
              <span>{term.version}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>시행일: {new Date(term.startDate).toLocaleDateString('ko-KR')}</span>
            </div>
            {term.isActive && (
              <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full font-medium">
                현재 적용 중
              </span>
            )}
            {!term.isActive && term.endDate && (
              <span className="px-3 py-1 bg-gray-500 text-white text-xs rounded-full font-medium">
                종료됨 ({new Date(term.endDate).toLocaleDateString('ko-KR')})
              </span>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-[#2C2C2C]/20 mb-8"></div>

        {/* 약관 내용 */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-[#2C2C2C] leading-relaxed whitespace-pre-wrap"
              style={{ wordBreak: 'keep-all' }}
            >
              {term.content}
            </div>
          </div>
        </div>

        {/* 하단 안내 */}
        <div className="mt-8 text-center">
          <button
            onClick={handleViewHistory}
            className="inline-flex items-center gap-2 text-[#2C2C2C]/70 hover:text-[#C84630] transition-colors text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            <span>이전 {getTypeDisplayName(term.type)} 전체 목록 보기</span>
          </button>
        </div>

        {/* 마지막 업데이트 정보 */}
        <div className="mt-8 pt-8 border-t border-[#2C2C2C]/10 text-center text-xs text-[#2C2C2C]/50">
          <p>마지막 업데이트: {new Date(term.updatedAt).toLocaleDateString('ko-KR')}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
