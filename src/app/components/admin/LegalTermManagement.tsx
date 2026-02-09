import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { legalAPI } from '@/utils/api';
import { Plus, Edit2, Trash2, CheckCircle, Calendar, FileText } from 'lucide-react';
import { setPageSEO } from '@/utils/seo';

interface LegalTermSummary {
  id: number;
  type: 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY';
  version: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
}

export function LegalTermManagement() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'TERMS_OF_SERVICE' | 'PRIVACY_POLICY'>('TERMS_OF_SERVICE');
  const [terms, setTerms] = useState<LegalTermSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loading) return;
    
    if (!user || !isManagerOrAbove(user.role)) {
      alert('관리자만 접근 가능합니다.');
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isManagerOrAbove(user.role)) {
      fetchTerms();
    }
  }, [activeTab, user]);

  useEffect(() => {
    setPageSEO({
      title: '약관 관리',
      description: '야송미술관 약관 관리',
    });
  }, []);

  const fetchTerms = async () => {
    try {
      setIsLoading(true);
      const data = await legalAPI.getTermHistory(activeTab);
      setTerms(data || []);
    } catch (error) {
      console.error('약관 목록 조회 실패:', error);
      alert('약관 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    navigate(`/admin/legal/new?type=${activeTab}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/legal/edit/${id}`);
  };

  const handleDelete = async (id: number, version: string) => {
    if (!window.confirm(`정말로 버전 ${version}을(를) 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await legalAPI.deleteTerm(id);
      alert('약관이 삭제되었습니다.');
      fetchTerms();
    } catch (error) {
      console.error('약관 삭제 실패:', error);
      alert('약관 삭제에 실패했습니다.');
    }
  };

  const handleActivate = async (id: number, version: string) => {
    if (!window.confirm(`버전 ${version}을(를) 활성화하시겠습니까?\n현재 활성화된 약관은 자동으로 비활성화됩니다.`)) {
      return;
    }

    try {
      await legalAPI.activateTerm(id);
      alert('약관이 활성화되었습니다.');
      fetchTerms();
    } catch (error) {
      console.error('약관 활성화 실패:', error);
      alert('약관 활성화에 실패했습니다.');
    }
  };

  const handleViewDetail = (id: number) => {
    navigate(`/legal/detail/${id}`);
  };

  const getTypeDisplayName = (type: string) => {
    return type === 'TERMS_OF_SERVICE' ? '이용약관' : '개인정보 처리방침';
  };

  if (loading || !user) {
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
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2C2C2C] tracking-tight mb-2">
                약관 관리
              </h1>
              <p className="text-[#2C2C2C]/70">이용약관과 개인정보 처리방침을 관리합니다.</p>
            </div>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-[#C84630] text-white rounded-lg hover:bg-[#A33520] transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              약관 추가
            </button>
          </div>
        </div>

        {/* 탭 */}
        <div className="mb-6 border-b border-[#2C2C2C]/20">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('TERMS_OF_SERVICE')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'TERMS_OF_SERVICE'
                  ? 'border-[#C84630] text-[#C84630]'
                  : 'border-transparent text-[#2C2C2C]/60 hover:text-[#2C2C2C]'
              }`}
            >
              이용약관
            </button>
            <button
              onClick={() => setActiveTab('PRIVACY_POLICY')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'PRIVACY_POLICY'
                  ? 'border-[#C84630] text-[#C84630]'
                  : 'border-transparent text-[#2C2C2C]/60 hover:text-[#2C2C2C]'
              }`}
            >
              개인정보 처리방침
            </button>
          </nav>
        </div>

        {/* 약관 목록 */}
        {isLoading ? (
          <div className="text-center py-12">로딩 중...</div>
        ) : terms.length === 0 ? (
          <div className="text-center py-12 text-[#2C2C2C]/60">
            등록된 {getTypeDisplayName(activeTab)}이(가) 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {terms.map((term) => (
              <div
                key={term.id}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-[#2C2C2C]">
                        v{term.version}
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
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[#2C2C2C]/70 mb-4">
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

                    {/* 버튼 그룹 */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(term.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 transition-colors rounded-lg text-[#2C2C2C] text-sm font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        상세보기
                      </button>
                      <button
                        onClick={() => handleEdit(term.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 transition-colors rounded-lg text-blue-700 text-sm font-medium"
                      >
                        <Edit2 className="w-4 h-4" />
                        수정
                      </button>
                      {!term.isActive && (
                        <button
                          onClick={() => handleActivate(term.id, term.version)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 transition-colors rounded-lg text-green-700 text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          활성화
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(term.id, term.version)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 transition-colors rounded-lg text-red-700 text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="mt-12 pt-8 border-t border-[#2C2C2C]/10">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2">안내</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 새로운 약관을 추가하면 이전 약관은 자동으로 비활성화됩니다.</li>
              <li>• 활성화 버튼을 누르면 해당 버전이 현재 약관으로 적용됩니다.</li>
              <li>• 사용자에게는 현재 활성화된 약관만 표시됩니다.</li>
              <li>• 삭제된 약관은 복구할 수 없으니 신중히 결정해주세요.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
