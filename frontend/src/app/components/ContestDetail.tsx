import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AttachmentList, Attachment } from './common/AttachmentList';
import { contestAPI } from '@/utils/api';
import { Calendar, MapPin, Edit2, Trash2, ChevronLeft, User, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isManagerOrAbove } from '@/utils/auth';
import { setPageSEO } from '@/utils/seo';

interface Contest {
  id: number;
  title: string;
  location: string;
  imageUrl: string;
  host: string;
  description: string;
  announcementUrl: string;
  startDate: string;
  endDate: string;
  status: 'ONGOING' | 'UPCOMING' | 'PAST';
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
}

export function ContestDetail() {
  const { id } = useParams<{ id: string }>();
  const [contest, setContest] = useState<Contest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user && isManagerOrAbove(user.role);

  useEffect(() => {
    if (id) {
      fetchContest();
    }
  }, [id]);

  const fetchContest = async () => {
    try {
      setIsLoading(true);
      const data = await contestAPI.getContestById(parseInt(id!));
      setContest(data);
      setPageSEO({
        title: data.title,
        description: data.description.substring(0, 160),
        keywords: `야송, 공모전, ${data.title}, ${data.host}`,
        image: getImageUrl(data.imageUrl),
      });
    } catch (error) {
      console.error('공모전 정보 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `${import.meta.env.VITE_API_BASE_URL || ''}${imageUrl}`;
  };

  const getStatusDisplayName = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'ONGOING': '진행 중',
      'UPCOMING': '진행 예정',
      'PAST': '종료됨',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'ONGOING': 'bg-green-600',
      'UPCOMING': 'bg-orange-500',
      'PAST': 'bg-gray-600',
    };
    return colorMap[status] || 'bg-gray-600';
  };

  const handleEdit = () => {
    navigate(`/contests/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 공모전을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await contestAPI.deleteContest(parseInt(id!));
      alert('공모전이 삭제되었습니다.');
      navigate('/contests');
    } catch (error) {
      console.error('공모전 삭제 실패:', error);
      alert('공모전 삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2C2C2C] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#F4F4F0]/60">로딩 중...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-[#2C2C2C] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-[#F4F4F0]/60">공모전을 찾을 수 없습니다.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2C2C2C] flex flex-col">
      <Header />
      
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 flex-1">
        {/* 뒤로 가기 버튼 */}
        <button
          onClick={() => navigate('/contests')}
          className="flex items-center gap-2 text-[#F4F4F0]/60 hover:text-[#C84630] transition-colors mb-8"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>공모전 목록으로</span>
        </button>

        <div className="grid md:grid-cols-2 gap-12">
          {/* 왼쪽: 이미지 */}
          <div className="space-y-6">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#F4F4F0]/10">
              <ImageWithFallback
                src={getImageUrl(contest.imageUrl)}
                alt={contest.title}
                className="w-full h-full object-cover"
              />
              
              {/* 관리자 버튼 - 좌측 상단 */}
              {canManage && (
                <div className="absolute top-4 left-4 flex gap-1 opacity-70 hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                    className="w-8 h-8 bg-[#F4F4F0] text-[#2C2C2C] rounded-full hover:bg-[#C84630] hover:text-[#F4F4F0] transition-colors flex items-center justify-center shadow-lg"
                    title="수정"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                    className="w-8 h-8 bg-[#F4F4F0]/90 text-[#2C2C2C] rounded-full hover:bg-red-600 hover:text-[#F4F4F0] transition-colors flex items-center justify-center shadow-lg"
                    title="삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {/* 상태 배지 - 우측 상단 */}
              <div className={`absolute top-4 right-4 ${getStatusColor(contest.status)} text-white px-3 py-1.5 rounded text-sm font-medium`}>
                {getStatusDisplayName(contest.status)}
              </div>
            </div>

            {/* 첨부파일 섹션 - 이미지 바로 아래 */}
            {contest.attachments && contest.attachments.length > 0 && (
              <AttachmentList 
                attachments={contest.attachments}
                title="첨부파일"
                theme="dark"
              />
            )}
          </div>

          {/* 오른쪽: 정보 */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#F4F4F0] mb-6 tracking-tight">
                {contest.title}
              </h1>

              {/* 메타 정보 */}
              <div className="space-y-4 border-t border-b border-[#F4F4F0]/10 py-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#F4F4F0]/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#F4F4F0]/60 mb-1">공모 기간</p>
                    <p className="text-[#F4F4F0] font-medium">
                      {new Date(contest.startDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                      {' ~ '}
                      {new Date(contest.endDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#F4F4F0]/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#F4F4F0]/60 mb-1">주최</p>
                    <p className="text-[#F4F4F0] font-medium">{contest.host}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-[#F4F4F0]/60 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#F4F4F0]/60 mb-1">공모 대상</p>
                    <p className="text-[#F4F4F0] font-medium">{contest.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 설명 */}
            <div>
              <h2 className="text-2xl font-bold text-[#F4F4F0] mb-4">공모전 소개</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-[#F4F4F0]/80 whitespace-pre-wrap leading-relaxed">
                  {contest.description}
                </p>
              </div>
            </div>

            {/* 공고 보기 버튼 */}
            {contest.announcementUrl && (
              <div>
                <a
                  href={contest.announcementUrl}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#C84630] hover:bg-[#A33520] text-[#F4F4F0] rounded-lg transition-colors font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  공고 자세히 보기
                </a>
              </div>
            )}

            {/* 추가 정보 */}
            <div className="bg-[#F4F4F0]/5 rounded-lg p-6 space-y-3">
              <h3 className="font-bold text-[#F4F4F0] mb-4">공모전 정보</h3>
              <div className="flex justify-between text-sm">
                <span className="text-[#F4F4F0]/60">공모전 상태</span>
                <span className="text-[#F4F4F0] font-medium">
                  {getStatusDisplayName(contest.status)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#F4F4F0]/60">등록일</span>
                <span className="text-[#F4F4F0] font-medium">
                  {new Date(contest.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
