/**
 * SEO 테스트 도구
 * 브라우저 콘솔에서 실행하여 현재 페이지의 SEO 설정을 확인할 수 있습니다.
 */

// 브라우저 콘솔에서 사용할 수 있는 테스트 함수들
window.testSEO = {
  // 현재 페이지의 모든 SEO 정보 출력
  checkAll: () => {
    console.log('%c=== SEO 정보 확인 ===', 'color: #0d9488; font-size: 16px; font-weight: bold;');
    console.log('\n📄 페이지 제목:', document.title);
    
    // description
    const description = document.querySelector('meta[name="description"]');
    console.log('📝 Description:', description?.getAttribute('content') || '❌ 없음');
    
    // keywords
    const keywords = document.querySelector('meta[name="keywords"]');
    console.log('🏷️  Keywords:', keywords?.getAttribute('content') || '❌ 없음');
    
    // Open Graph 태그들
    console.log('\n🌐 Open Graph 태그:');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogSiteName = document.querySelector('meta[property="og:site_name"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    
    console.log('  • og:site_name:', ogSiteName?.getAttribute('content') || '❌ 없음');
    console.log('  • og:title:', ogTitle?.getAttribute('content') || '❌ 없음');
    console.log('  • og:description:', ogDescription?.getAttribute('content') || '❌ 없음');
    console.log('  • og:type:', ogType?.getAttribute('content') || '❌ 없음');
    console.log('  • og:url:', ogUrl?.getAttribute('content') || '❌ 없음');
    
    // 구조화된 데이터 (Structured Data)
    console.log('\n🏗️  구조화된 데이터 (Structured Data):');
    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
    if (structuredDataScripts.length > 0) {
      structuredDataScripts.forEach((script, index) => {
        try {
          const data = JSON.parse(script.textContent || '{}');
          console.log(`  • Schema ${index + 1}:`, data['@type'], '-', data.name || '이름 없음');
        } catch (e) {
          console.log(`  • Schema ${index + 1}: 파싱 실패`);
        }
      });
    } else {
      console.log('  ❌ 없음');
    }
    
    console.log('\n🔗 현재 URL:', window.location.href);
  },

  // title만 확인
  getTitle: () => {
    console.log('📄 현재 페이지 제목:', document.title);
    return document.title;
  },

  // description만 확인
  getDescription: () => {
    const description = document.querySelector('meta[name="description"]');
    const content = description?.getAttribute('content') || '없음';
    console.log('📝 Description:', content);
    return content;
  },

  // 모든 메타 태그 출력
  getAllMetaTags: () => {
    console.log('%c=== 모든 메타 태그 ===', 'color: #0d9488; font-size: 16px; font-weight: bold;');
    const metaTags = document.querySelectorAll('meta');
    metaTags.forEach((meta, index) => {
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      const content = meta.getAttribute('content');
      if (name && content) {
        console.log(`${index + 1}. ${name}: ${content}`);
      }
    });
  },

  // 페이지 이동 시 자동으로 SEO 정보 확인
  autoCheck: () => {
    console.log('✅ 자동 SEO 체크 활성화! 페이지 이동 시마다 SEO 정보가 출력됩니다.');
    
    // 초기 확인
    setTimeout(() => window.testSEO.checkAll(), 500);
    
    // MutationObserver로 title 변경 감지
    const observer = new MutationObserver(() => {
      console.log('\n🔄 페이지 변경 감지!');
      window.testSEO.checkAll();
    });
    
    const titleElement = document.querySelector('title');
    if (titleElement) {
      observer.observe(titleElement, { childList: true });
    }
    
    // URL 변경 감지 (SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(() => {
          console.log('\n🔄 URL 변경 감지!');
          window.testSEO.checkAll();
        }, 500);
      }
    }).observe(document.body, { childList: true, subtree: true });
  },

  // 검색 엔진 미리보기
  preview: () => {
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const url = window.location.href;
    
    const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
    const ogDescription = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
    const ogSiteName = document.querySelector('meta[property="og:site_name"]')?.getAttribute('content') || '';
    
    // 구조화된 데이터에서 사이트명 가져오기
    let structuredSiteName = '';
    const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
    structuredDataScripts.forEach(script => {
      try {
        const data = JSON.parse(script.textContent || '{}');
        if (data['@type'] === 'WebSite' && data.name) {
          structuredSiteName = data.name;
        } else if (data.isPartOf && data.isPartOf['@type'] === 'WebSite' && data.isPartOf.name) {
          structuredSiteName = data.isPartOf.name;
        }
      } catch (e) {
        // 무시
      }
    });
    
    console.log('%c=== 검색 엔진 vs 소셜 미디어 미리보기 ===', 'color: #0d9488; font-size: 18px; font-weight: bold;');
    
    // 검색 엔진 (Google, Naver)
    console.log('\n%c🔍 Google/Naver 검색 결과 (SEO 메타 태그 + Structured Data):', 'color: #1a73e8; font-size: 16px; font-weight: bold;');
    console.log(`%c${structuredSiteName || url.replace('http://', '').replace('https://', '').replace('localhost:5173', 'yasong.co.kr').split('/')[0]}`, 'color: #202124; font-size: 14px; font-weight: normal;');
    console.log(`%c${url.replace('http://', '').replace('https://', '').replace('localhost:5173', 'yasong.co.kr')}`, 'color: #006621; font-size: 12px;');
    console.log(`%c${title}`, 'color: #1a0dab; font-size: 20px; font-weight: normal; text-decoration: underline;');
    console.log(`%c${description}`, 'color: #545454; font-size: 14px; line-height: 1.5;');
    
    // 소셜 미디어
    console.log('\n%c📱 Facebook/Kakao 공유 미리보기 (Open Graph 태그 사용):', 'color: #1877f2; font-size: 16px; font-weight: bold;');
    console.log(`%c${ogSiteName}`, 'color: #65676b; font-size: 12px; text-transform: uppercase;');
    console.log(`%c${ogTitle}`, 'color: #050505; font-size: 16px; font-weight: bold;');
    console.log(`%c${ogDescription}`, 'color: #65676b; font-size: 14px;');
    
    console.log('\n%c💡 핵심 차이점:', 'color: #f59e0b; font-size: 14px; font-weight: bold;');
    console.log('  • 검색 엔진 최상단: Structured Data의 WebSite.name (없으면 도메인)');
    console.log('  • 검색 엔진 제목: <title> 태그 전체를 표시');
    console.log('  • 소셜 미디어: og:title만 표시, og:site_name은 별도 영역에 표시');
    
    if (!structuredSiteName) {
      console.log('\n%c⚠️  경고: Structured Data가 없어서 도메인명이 표시됩니다!', 'color: #f59e0b; font-weight: bold;');
      console.log('   → 각 페이지로 이동하면 자동으로 추가됩니다.');
    }
  },

  // 도움말
  help: () => {
    console.log('%c=== SEO 테스트 도구 사용법 ===', 'color: #0d9488; font-size: 16px; font-weight: bold;');
    console.log('\n사용 가능한 명령어:');
    console.log('  • testSEO.checkAll()      - 모든 SEO 정보 확인');
    console.log('  • testSEO.getTitle()      - 페이지 제목만 확인');
    console.log('  • testSEO.getDescription() - Description만 확인');
    console.log('  • testSEO.getAllMetaTags() - 모든 메타 태그 출력');
    console.log('  • testSEO.preview()       - 🔍 검색 엔진 vs 📱 소셜 미디어 미리보기 (추천!)');
    console.log('  • testSEO.autoCheck()     - 자동 체크 활성화 (페이지 이동 시마다 확인)');
    console.log('  • testSEO.help()          - 이 도움말 보기');
    console.log('\n💡 팁: 각 페이지로 이동한 후 testSEO.preview()를 실행하세요!');
    console.log('       검색 엔진과 소셜 미디어에서 어떻게 보이는지 확인할 수 있습니다.');
  }
};

// 스크립트 로드 시 안내 메시지
console.log('%c🎉 SEO 테스트 도구가 로드되었습니다!', 'color: #0d9488; font-size: 16px; font-weight: bold;');
console.log('사용법을 보려면: testSEO.help()');
console.log('전체 정보 확인: testSEO.checkAll()');
console.log('자동 체크: testSEO.autoCheck()');

export {};
