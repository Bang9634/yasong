import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { noticeAPI } from '@/utils/api';
import { isManagerOrAbove } from '@/utils/auth';

export function NoticeForm() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const noticeId = searchParams.get('id');
  const isEdit = !!noticeId;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'GENERAL',
    isPinned: false,
    status: 'PUBLISHED',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 권한 확인
  useEffect(() => {
    if (loading) return;
    
    if (!user || !isManagerOrAbove(user.role)) {
      alert('접근 권한이 없습니다.');
      navigate('/notice');
    }
  }, [user, loading, navigate]);

  // 수정일 경우 기존 데이터 로드
  useEffect(() => {
    if (!user || !isManagerOrAbove(user.role) || !isEdit || !noticeId) return;
    
    const fetchNotice = async () => {
      try {
        setIsLoading(true);
        const data = await noticeAPI.getNoticeById(noticeId);
        setFormData({
          title: data.title,
          content: data.content,
          category: data.category,
          isPinned: data.isPinned || false,
          status: data.status || 'PUBLISHED',
        });
      } catch (err) {
        console.error('공지사항 조회 실패:', err);
        alert('공지사항을 불러오는데 실패했습니다.');
        navigate('/notice');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [user, isEdit, noticeId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (isEdit && noticeId) {
        await noticeAPI.updateNotice(noticeId, formData);
        alert('공지사항이 수정되었습니다.');
      } else {
        await noticeAPI.createNotice(formData);
        alert('공지사항이 작성되었습니다.');
      }

      navigate('/notice');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '작업에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user || !isManagerOrAbove(user.role)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-24 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-gray-500">로딩 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 페이지 헤더 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-teal-900 mb-2">
              {isEdit ? '공지사항 수정' : '공지사항 작성'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? '공지사항을 수정합니다.' : '새로운 공지사항을 작성합니다.'}
            </p>
          </div>

          {/* 작성 폼 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="category">카테고리 *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="GENERAL">일반</option>
                  <option value="EXHIBITION">전시</option>
                  <option value="MAINTENANCE">시스템</option>
                </select>
              </div>

              <div>
                <Label htmlFor="title">제목 *</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="제목을 입력해주세요"
                  required
                />
              </div>

              <div>
                <Label htmlFor="content">내용 *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="내용을 입력해주세요"
                  rows={15}
                  required
                />
              </div>

              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="isPinned"
                  checked={formData.isPinned}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, isPinned: checked as boolean })
                  }
                />
                <Label htmlFor="isPinned" className="text-sm font-normal cursor-pointer">
                  상단 고정
                </Label>
              </div>

              <div>
                <Label htmlFor="status">게시 상태 *</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                >
                  <option value="PUBLISHED">게시됨</option>
                  <option value="DRAFT">임시저장</option>
                  <option value="HIDDEN">숨김</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {isSubmitting ? '처리 중...' : isEdit ? '수정하기' : '작성하기'}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate('/notice')}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800"
                >
                  취소
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
