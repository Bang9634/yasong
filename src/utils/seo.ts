/**
 * SEO 유틸리티 함수들
 */

const SITE_NAME = 'YASONG';

/**
 * 페이지 제목 설정
 * @param pageTitle 페이지별 제목 (없으면 사이트 이름만 표시)
 * @param separator 구분자 (기본값: ' - ')
 */
export const setPageTitle = (pageTitle?: string, separator: string = ' - ') => {
  if (pageTitle) {
    document.title = `${pageTitle}${separator}${SITE_NAME}`;
  } else {
    document.title = SITE_NAME;
  }
};

/**
 * 메타 태그 업데이트
 * @param description 페이지 설명
 * @param keywords 키워드 (선택사항)
 */
export const updateMetaTags = (description?: string, keywords?: string) => {
  // description 메타 태그
  if (description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }

  // keywords 메타 태그
  if (keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);
  }
};

/**
 * Open Graph 메타 태그 업데이트
 * @param title 페이지 제목
 * @param description 페이지 설명
 * @param url 페이지 URL
 * @param image 대표 이미지 URL
 */
export const updateOGTags = (
  title: string,
  description?: string,
  url?: string,
  image?: string
) => {
  const ogTags = [
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: title },
    { property: 'og:type', content: 'website' },
    ...(description ? [{ property: 'og:description', content: description }] : []),
    ...(url ? [{ property: 'og:url', content: url }] : []),
    ...(image ? [{ property: 'og:image', content: image }] : []),
  ];

  ogTags.forEach(({ property, content }) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });
};

/**
 * 페이지 SEO 설정 (통합 함수)
 */
export const setPageSEO = (options: {
  title?: string;
  description?: string;
  keywords?: string;
  url?: string;
  image?: string;
}) => {
  const { title, description, keywords, url, image } = options;
  
  // 페이지 제목 설정
  setPageTitle(title);
  
  // 메타 태그 업데이트
  if (description || keywords) {
    updateMetaTags(description, keywords);
  }
  
  // OG 태그 업데이트
  updateOGTags(
    title || SITE_NAME,
    description,
    url || window.location.href,
    image
  );
  
  // 구조화된 데이터 업데이트
  updateStructuredData({
    title: title || SITE_NAME,
    description,
    url: url || window.location.href,
  });
};

/**
 * 구조화된 데이터 (JSON-LD) 업데이트
 * Google 검색 결과에서 사이트명을 표시하기 위함
 */
const updateStructuredData = (options: {
  title: string;
  description?: string;
  url: string;
}) => {
  const { title, description, url } = options;
  
  // 기존 structured data 제거
  const existingScript = document.querySelector('script[type="application/ld+json"][data-page]');
  if (existingScript) {
    existingScript.remove();
  }
  
  // 새로운 structured data 추가
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description || '',
    url: url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: window.location.origin,
    },
  };
  
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-page', 'true');
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};

export { SITE_NAME };
