import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronUp, ChevronDown, Calendar, Eye, User, Download, FileText, Edit2, Trash2 } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { noticeAPI, getFullImageUrl } from '@/utils/api';
import { setPageSEO } from '@/utils/seo';

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
  const [prevNotice, setPrevNotice] = useState<{ id: number; title: string } | null>(null);
  const [nextNotice, setNextNotice] = useState<{ id: number; title: string } | null>(null);

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

        // 전체 공지사항 목록 가져와서 이전/다음 글 찾기
        const allNotices = await noticeAPI.getNotices({ page: 1, limit: 1000 });
        const noticesList = allNotices.content || [];
        const currentIndex = noticesList.findIndex((n: any) => n.id === parseInt(id));
        
        if (currentIndex > 0) {
          setNextNotice({ id: noticesList[currentIndex - 1].id, title: noticesList[currentIndex - 1].title });
        }
        if (currentIndex < noticesList.length - 1) {
          setPrevNotice({ id: noticesList[currentIndex + 1].id, title: noticesList[currentIndex + 1].title });
        }
      } catch (err) {
        console.error('공지사항 조회 실패:', err);
        setError('공지사항을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [id, canManage]);

  // SEO 설정 (공지사항이 로드되면 실행)
  useEffect(() => {
    if (notice) {
      // 본문에서 첫 100자 추출 (HTML 태그 제거)
      const plainText = notice.content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ');
      const description = plainText.length > 100 
        ? plainText.substring(0, 100) + '...' 
        : plainText;

      setPageSEO({
        title: notice.title,
        description: description,
        keywords: `야송, 공지사항, ${getCategoryDisplayName(notice.category)}`,
      });
    }
  }, [notice]);

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
    
    // 이미지: ![alt](url) -> <img> (최대 높이 800px 제한)
    html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" style="max-height: 800px; object-fit: contain;" />');
    
    // 링크: [text](url) -> <a>
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#C84630] hover:underline">$1</a>');
    
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
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-[#2C2C2C] text-xl">로딩 중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#2C2C2C]">
          <h2 className="text-2xl font-bold mb-4">{error || '공지사항을 찾을 수 없습니다.'}</h2>
          <button
            onClick={() => navigate('/notice')}
            className="px-6 py-3 bg-[#C84630] hover:bg-[#A33520] transition-colors rounded-lg flex items-center gap-2 text-[#F4F4F0]"
          >
            <ChevronLeft className="w-5 h-5" />
            목록으로 돌아가기
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Header />
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate('/notice')}
          className="mb-8 flex items-center gap-2 text-[#2C2C2C] hover:text-[#C84630] transition-colors text-lg font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>목록으로 돌아가기</span>
        </button>

        {/* 컨텐츠 영역 */}
        <div className="w-full space-y-8 relative">
          {/* 관리자 버튼 - 우측 상단 고정 */}
          {canManage && (
            <div className="absolute top-0 right-0 flex gap-2 z-10 hidden sm:flex">
              <button
                onClick={() => navigate(`/notice/write?id=${notice.id}`)}
                className="px-4 py-2 bg-[#2C2C2C] text-[#F4F4F0] rounded-lg hover:bg-[#2C2C2C]/90 transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <Edit2 className="w-4 h-4" />
                수정
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors flex items-center gap-2 font-medium text-sm"
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </button>
            </div>
          )}

          {/* 카테고리 & 고정 배지 */}
          <div className="w-full flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-[#2C2C2C]/10 text-[#2C2C2C]/70 text-sm rounded font-medium">
              {getCategoryDisplayName(notice.category)}
            </span>
            {notice.isPinned && (
              <span className="px-3 py-1 bg-[#C84630] text-[#F4F4F0] text-sm rounded font-medium">
                고정
              </span>
            )}
            {/* 모바일용 관리자 버튼 */}
            {canManage && (
              <div className="flex gap-2 sm:hidden ml-auto">
                <button
                  onClick={() => navigate(`/notice/write?id=${notice.id}`)}
                  className="px-3 py-1.5 bg-[#2C2C2C] text-[#F4F4F0] rounded-lg hover:bg-[#2C2C2C]/90 transition-colors flex items-center gap-1.5 font-medium text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-[#C84630] text-[#F4F4F0] rounded-lg hover:bg-[#A83820] transition-colors flex items-center gap-1.5 font-medium text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  삭제
                </button>
              </div>
            )}
          </div>

          {/* 제목 */}
          <h1 className="w-full text-4xl md:text-5xl font-bold text-[#2C2C2C] leading-tight">
            {notice.title}
          </h1>

          {/* 메타 정보 */}
          <div className="w-full space-y-4 border-t border-[#2C2C2C]/20 pt-6">
            <div className="flex items-start gap-4">
              <span className="text-[#2C2C2C]/60 font-semibold min-w-[100px]">작성자</span>
              <span className="text-[#2C2C2C]">{notice.authorName}</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#2C2C2C]/60 font-semibold min-w-[100px]">작성일</span>
              <span className="text-[#2C2C2C]">{new Date(notice.createdAt).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-[#2C2C2C]/60 font-semibold min-w-[100px]">조회수</span>
              <span className="text-[#2C2C2C]">{notice.viewCount}</span>
            </div>
          </div>

          {/* 본문 */}
          <div className="border-t border-[#2C2C2C]/20 pt-6 w-full">
            <div 
              className="prose prose-lg w-full max-w-none text-[#2C2C2C]/80 leading-relaxed"
              style={{
                lineHeight: '1.8'
              }}
              dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(notice.content) }}
            />
          </div>

          {/* 첨부파일 섹션 */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="border-t border-[#2C2C2C]/20 pt-6">
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                첨부파일 ({notice.attachments.length})
              </h3>
              <div className="space-y-2">
                {notice.attachments.map((attachment) => (
                  <a
                    key={attachment.id}
                    href={getFullImageUrl(attachment.downloadUrl)}
                    download={attachment.fileName}
                    className="w-full flex items-center justify-between p-3 bg-[#2C2C2C]/5 hover:bg-[#2C2C2C]/10 border border-[#2C2C2C]/10 rounded-lg transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-5 h-5 text-[#2C2C2C]/60 flex-shrink-0" />
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-[#2C2C2C] truncate">
                          {attachment.fileName}
                        </p>
                        <p className="text-xs text-[#2C2C2C]/50">
                          {formatFileSize(attachment.fileSize)}
                        </p>
                      </div>
                    </div>
                    <Download className="w-5 h-5 text-[#2C2C2C]/60 group-hover:text-[#C84630] flex-shrink-0 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 이전글/다음글 */}
          {(prevNotice || nextNotice) && (
            <div className="border-t border-[#2C2C2C]/20 pt-6 space-y-2">
              {nextNotice && (
                <button
                  onClick={() => {
                    navigate(`/notice/${nextNotice.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-[#2C2C2C]/5 border border-[#2C2C2C]/10 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                    <ChevronUp className="w-5 h-5 text-[#2C2C2C]/40 group-hover:text-[#C84630] transition-colors flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#2C2C2C]/50 mb-1">다음 글</div>
                      <div className="text-sm font-medium text-[#2C2C2C] group-hover:text-[#C84630] transition-colors truncate">
                        {nextNotice.title}
                      </div>
                    </div>
                  </div>
                </button>
              )}
              {prevNotice && (
                <button
                  onClick={() => {
                    navigate(`/notice/${prevNotice.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-[#2C2C2C]/5 border border-[#2C2C2C]/10 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 text-left">
                    <ChevronDown className="w-5 h-5 text-[#2C2C2C]/40 group-hover:text-[#C84630] transition-colors flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-[#2C2C2C]/50 mb-1">이전 글</div>
                      <div className="text-sm font-medium text-[#2C2C2C] group-hover:text-[#C84630] transition-colors truncate">
                        {prevNotice.title}
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
