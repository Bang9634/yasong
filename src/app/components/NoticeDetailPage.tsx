import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Eye, User, Download, FileText } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { noticeAPI, getFullImageUrl } from '@/utils/api';

interface NoticeAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  downloadUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt: string;
}

interface NoticeDetail {
  id: number;
  title: string;
  content: string;
  category: string;
  isPinned: boolean;
  viewCount: number;
  status: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  attachments?: NoticeAttachment[];
}

export function NoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notice, setNotice] = useState<NoticeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canManage = user && isManagerOrAbove(user.role);

  useEffect(() => {
    const fetchNotice = async () => {
      if (!id) {
        setError('잘못된 접근입니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = canManage
                    ? await noticeAPI.getNoticeById(id) 
                    : await noticeAPI.getVisibleNoticeById(id);
        setNotice(data);
      } catch (err) {
        console.error('공지사항 조회 실패:', err);
        setError('공지사항을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  const getCategoryDisplayName = (category: string): string => {
    const categoryMap: { [key: string]: string } = {
      'GENERAL': '일반',
      'EXHIBITION': '전시',
      'CONTEST': '공모전',
      'MAINTENANCE': '시스템'
    };
    return categoryMap[category] || category;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Markdown을 HTML로 변환
  const convertMarkdownToHtml = (text: string): string => {
    let html = text;
    
    // 이미지: ![alt](url) -> <img>
    html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />');
    
    // 링크: [text](url) -> <a>
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-teal-600 hover:underline">$1</a>');
    
    // 줄바꿈을 <br>로 변환
    html = html.replace(/\n/g, '<br />');
    
    return html;
  };

  const handleDelete = async () => {
    if (!notice) return;
    
    const confirmed = window.confirm(`"${notice.title}" 공지사항을 삭제하시겠습니까?`);
    if (!confirmed) return;

    try {
      await noticeAPI.deleteNotice(notice.id.toString());
      alert('공지사항이 삭제되었습니다.');
      navigate('/notice');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '삭제에 실패했습니다.';
      alert(`실패\n\n${errorMessage}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500">로딩 중...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-red-600 mb-4">{error || '공지사항을 찾을 수 없습니다.'}</p>
              <Button onClick={() => navigate('/notice')} className="bg-teal-700 hover:bg-teal-800">
                목록으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 상단 네비게이션 */}
          <div className="mb-6">
            <Link 
              to="/notice" 
              className="inline-flex items-center text-gray-600 hover:text-teal-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              목록으로
            </Link>
          </div>

          {/* 공지사항 상세 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* 헤더 */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-teal-50 to-white p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded">
                  {getCategoryDisplayName(notice.category)}
                </span>
                {notice.isPinned && (
                  <span className="bg-red-500 text-white text-sm px-3 py-1 rounded">
                    고정
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {notice.title}
              </h1>
              
              {/* 메타 정보 */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{notice.authorName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>조회 {notice.viewCount}</span>
                </div>
              </div>
            </div>

            {/* 본문 */}
            <div className="p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(notice.content) }}
              />
            </div>

            {/* 첨부파일 섹션 */}
            {notice.attachments && notice.attachments.length > 0 && (
              <div className="px-8 pb-8">
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    첨부파일 ({notice.attachments.length})
                  </h3>
                  <div className="space-y-2">
                    {notice.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.downloadUrl}
                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {attachment.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-teal-600 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 하단 버튼 */}
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => navigate('/notice')}
                  variant="outline"
                  className="border-gray-300"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  목록으로
                </Button>
                
                {canManage && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/notice/write?id=${notice.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      수정
                    </Button>
                    <Button
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
