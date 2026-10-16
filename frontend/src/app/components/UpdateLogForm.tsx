import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { updateLogAPI } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';
import { FileText } from 'lucide-react';

export function UpdateLogForm() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const logId = searchParams.get('id');
  const isEdit = !!logId;

  const [formData, setFormData] = useState({
    title: '',
    version: '',
    updateDate: new Date().toISOString().split('T')[0],
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 권한 확인
  useEffect(() => {
    if (loading) return;
    
    if (!user || !isManagerOrAbove(user.role)) {
      alert('접근 권한이 없습니다.');
      navigate('/updates');
    }
  }, [user, loading, navigate]);

  // 수정일 경우 기존 데이터 로드
  useEffect(() => {
    if (!user || !isManagerOrAbove(user.role) || !isEdit || !logId) return;
    
    const fetchLog = async () => {
      try {
        setIsLoading(true);
        const data = await updateLogAPI.getUpdateLogById(logId);
        setFormData({
          title: data.title,
          version: data.version,
          updateDate: data.updateDate,
          content: data.content,
        });
      } catch (err) {
        console.error('업데이트 내역 조회 실패:', err);
        alert('업데이트 내역을 불러오는데 실패했습니다.');
        navigate('/updates');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLog();
  }, [user, isEdit, logId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!formData.version.trim()) {
      alert('버전을 입력해주세요.');
      return;
    }
    if (!formData.updateDate) {
      alert('업데이트 날짜를 선택해주세요.');
      return;
    }
    if (!formData.content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isEdit && logId) {
        await updateLogAPI.updateUpdateLog(logId, formData);
        alert('업데이트 내역이 수정되었습니다.');
      } else {
        await updateLogAPI.createUpdateLog(formData);
        alert('업데이트 내역이 등록되었습니다.');
      }

      navigate('/updates');
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      navigate('/updates');
    }
  };

  if (loading || isLoading) {
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

  if (!user || !isManagerOrAbove(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-[#C84630]" />
            <h1 className="text-4xl font-bold text-[#2C2C2C]">
              {isEdit ? '업데이트 내역 수정' : '업데이트 내역 작성'}
            </h1>
          </div>
          <p className="text-[#2C2C2C]/70">
            웹사이트의 업데이트 내용을 작성해주세요.
          </p>
        </div>

        {/* 구분선 */}
        <div className="w-full h-px bg-[#2C2C2C]/20 mb-8"></div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            {/* 제목 */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">
                제목 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="업데이트 제목을 입력하세요"
                className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C]"
                required
              />
            </div>

            {/* 버전 및 날짜 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="version" className="text-base font-medium">
                  버전 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  placeholder="예: 1.0.0"
                  className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C]"
                  required
                />
                <p className="text-sm text-[#2C2C2C]/60">
                  버전 형식: 1.0.0 또는 2024.01.01
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="updateDate" className="text-base font-medium">
                  업데이트 날짜 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="updateDate"
                  type="date"
                  value={formData.updateDate}
                  onChange={(e) => setFormData({ ...formData, updateDate: e.target.value })}
                  className="w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C]"
                  required
                />
              </div>
            </div>

            {/* 내용 */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-base font-medium">
                내용 <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="업데이트 내용을 작성하세요&#10;&#10;예:&#10;- 새로운 기능 추가&#10;- 버그 수정&#10;- 성능 개선"
                className="min-h-[400px] w-full px-4 py-3 border border-[#2C2C2C]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C84630] focus:border-[#C84630] bg-white text-[#2C2C2C] font-mono"
                required
              />
              <p className="text-sm text-[#2C2C2C]/60">
                줄바꿈과 공백이 그대로 유지됩니다.
              </p>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 bg-[#C84630] hover:bg-[#A33520]"
            >
              {isSubmitting ? '저장 중...' : isEdit ? '수정하기' : '등록하기'}
            </Button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
