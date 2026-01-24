import { useState, useEffect } from 'react';
import { Trophy, FileText } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { websiteAPI } from '@/utils/api';

export function Contest() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [introLink, setIntroLink] = useState('');
  const [noticeLink, setNoticeLink] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 공모전 데이터 가져오기
  useEffect(() => {
    const fetchContestData = async () => {
      try {
        setIsLoading(true);
        
        const [titleData, subtitleData, contentData, imageData, activeData, introLinkData, noticeLinkData] = await Promise.all([
          websiteAPI.getTextSetting('contest_title'),
          websiteAPI.getTextSetting('contest_subtitle'),
          websiteAPI.getTextSetting('contest_content'),
          websiteAPI.getImage('contest_poster'),
          websiteAPI.getTextSetting('contest_active'),
          websiteAPI.getTextSetting('contest_intro_link'),
          websiteAPI.getTextSetting('contest_notice_link'),
        ]);
        
        setTitle(titleData.value || '');
        setSubtitle(subtitleData.value || '');
        setContent(contentData.value || '');
        setIsActive(activeData.value === 'true');
        setIntroLink(introLinkData.value || '');
        setNoticeLink(noticeLinkData.value || '');
        
        if (imageData.imageUrl) {
          const url = imageData.imageUrl.startsWith('http')
            ? imageData.imageUrl
            : `${import.meta.env.VITE_API_BASE_URL || ''}${imageData.imageUrl}`;
          setImageUrl(url);
        }
      } catch (err) {
        console.error('공모전 데이터 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContestData();
  }, []);

  if (isLoading || !isActive || !title) {
    return null;
  }

  return (
    <section id="contest" className="py-20 bg-gradient-to-b from-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl mb-4 text-teal-900">미술대전</h2>
          <div className="w-20 h-1 bg-amber-600 mx-auto"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-0 items-end">
          {/* 왼쪽: 포스터 이미지 */}
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden shadow-2xl">
              <ImageWithFallback
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          
          {/* 오른쪽: 텍스트 박스 */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-600 rounded-r-lg shadow-lg flex flex-col justify-between p-8 lg:p-12" style={{ minHeight: '75%' }}>
            {/* 큰 타이틀 */}
            <div className="mb-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xl text-amber-200 font-medium">
                  {subtitle}
                </p>
              )}
            </div>

            {/* 내용 텍스트 */}
            <div className="mb-8 space-y-3 flex-grow">
              {content.split('\n').map((line, index) => (
                <p key={index} className="text-white leading-relaxed">
                  {line}
                </p>
              ))}
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => introLink && window.open(introLink, '_blank', 'noopener,noreferrer')}
                disabled={!introLink}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-lg hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="미술대전 소개"
              >
                <Trophy className="w-5 h-5" />
                <span className="font-medium">미술대전 소개</span>
              </button>
              <button
                onClick={() => noticeLink && window.open(noticeLink, '_blank', 'noopener,noreferrer')}
                disabled={!noticeLink}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-lg hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="공지사항 보기"
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">공지사항 보기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}
