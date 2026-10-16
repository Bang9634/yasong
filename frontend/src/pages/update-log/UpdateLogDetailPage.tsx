import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Calendar, FileText, Edit2, Trash2, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { updateLogAPI } from '@/utils/api';
import { setPageSEO } from '@/utils/seo';

interface UpdateLogDetail {
  id: number;
  title: string;
  version: string;
  updateDate: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function UpdateLogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [log, setLog] = useState<UpdateLogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManage = user && isManagerOrAbove(user.role);

  useEffect(() => {
    const fetchLog = async () => {
      if (!id) {
        setError('잘못된 접근입니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await updateLogAPI.getUpdateLogById(id);
        setLog(data);

        setPageSEO({
          title: `${data.title} - v${data.version}`,
          description: data.content.replace(/<[^>]*>/g, '').substring(0, 150),
          keywords: `야송, 업데이트, ${data.version}`,
        });
      } catch (err) {
        console.error('업데이트 내역 조회 실패:', err);
        setError('업데이트 내역을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLog();
  }, [id]);

  const handleDelete = async () => {
    if (!log || !id) return;
    if (!window.confirm('정말로 이 업데이트 내역을 삭제하시겠습니까?')) return;

    try {
      await updateLogAPI.deleteUpdateLog(id);
      alert('업데이트 내역이 삭제되었습니다.');
      navigate('/updates');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
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

  if (error || !log) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#2C2C2C]/60 mb-4">{error || '업데이트 내역을 찾을 수 없습니다.'}</p>
            <button
              onClick={() => navigate('/updates')}
              className="text-[#C84630] hover:underline"
            >
              목록으로 돌아가기
            </button>
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
          onClick={() => navigate('/updates')}
          className="flex items-center gap-2 text-[#2C2C2C]/60 hover:text-[#C84630] transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>목록으로</span>
        </button>

        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* 버전 배지 */}
              <div className="w-full flex items-center gap-2 flex-wrap mb-4">
                <span className="px-3 py-1 bg-[#C84630] text-[#F4F4F0] text-sm rounded font-medium">
                  v{log.version}
                </span>
              </div>
              
              {/* 제목 */}
              <h1 className="w-full text-4xl md:text-5xl font-bold text-[#2C2C2C] leading-tight mb-4">
                {log.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#2C2C2C]/60">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>업데이트: {new Date(log.updateDate).toLocaleDateString('ko-KR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>등록: {new Date(log.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            </div>

            {/* 관리자 버튼 */}
            {canManage && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/updates/write?id=${log.id}`)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#2C2C2C] hover:bg-[#2C2C2C]/90 transition-colors rounded-lg text-[#F4F4F0] text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#C84630] hover:bg-[#A83820] transition-colors rounded-lg text-[#F4F4F0] text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-[#2C2C2C]/20 mb-8"></div>

        {/* 내용 */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <div 
              className="text-[#2C2C2C] leading-relaxed whitespace-pre-wrap"
              style={{ wordBreak: 'keep-all' }}
            >
              {log.content}
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/updates')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2C2C2C] text-white rounded-lg hover:bg-[#1C1C1C] transition-colors font-medium"
          >
            <FileText className="w-5 h-5" />
            목록으로 돌아가기
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
