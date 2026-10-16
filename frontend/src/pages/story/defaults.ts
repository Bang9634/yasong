import type { Story, BiographySection } from './types';

export function createDefaultStories(): Story[] {
  return [
    {
      id: 1,
      heading: '이원좌 화백',
      description: [
        '1939년 경북 청송에서 태어나 2019년 별세하신 이원좌 화백은',
        '한국 근현대 미술사에 큰 족적을 남긴 동양화의 거장입니다.',
        '',
        '청량산의 맑은 기운과 자연의 아름다움을 담아내며',
        '독자적인 화풍을 완성하였습니다.',
      ],
    },
    {
      id: 2,
      heading: '예술의 세계',
      description: [
        '청량대운도를 비롯한 수많은 작품들은',
        '자연과 인간의 조화를 표현한 걸작으로 평가받고 있습니다.',
        '',
        '전통 수묵화의 정수를 계승하면서도',
        '현대적 감각을 더한 그만의 독특한 예술 세계를 구축하였습니다.',
      ],
    },
    {
      id: 3,
      heading: '청송의 자랑',
      description: [
        '고향 청송을 사랑하고 한국 미술의 발전에 헌신한',
        '이원좌 화백의 예술 정신은 오늘날까지 이어지고 있습니다.',
        '',
        '그의 작품들은 많은 이들에게 감동과 영감을 주며',
        '한국 미술의 소중한 문화유산으로 자리매김하고 있습니다.',
      ],
    },
  ];
}

export function createDefaultSections(): BiographySection[] {
  return [
    {
      id: 1,
      title: 'BIOGRAPHY #1',
      heading: '생애 초기 (1939-1960)',
      description: [
        '1939년 경북 청송에서 태어난 이원좌 화백은',
        '어린 시절부터 청량산의 자연에서 영감을 받았습니다.',
        '',
        '전통 서화의 기초를 다지며',
        '예술가로서의 첫 발걸음을 내딛었습니다.',
      ],
      imageUrl: '/biography-1.webp',
      imagePosition: 'left',
    },
    {
      id: 2,
      title: 'BIOGRAPHY #2',
      heading: '작품 활동 (1961-1990)',
      description: [
        '본격적인 작품 활동을 시작하며',
        '한국 동양화의 새로운 지평을 열었습니다.',
        '',
        '전통과 현대의 조화를 추구하며',
        '독자적인 예술 세계를 구축해 나갔습니다.',
      ],
      imageUrl: '/biography-2.webp',
      imagePosition: 'right',
    },
    {
      id: 3,
      title: 'BIOGRAPHY #3',
      heading: '말년의 업적 (1991-2019)',
      description: [
        '노년까지 왕성한 작품 활동을 이어가며',
        '한국 미술계에 깊은 족적을 남겼습니다.',
        '',
        '2019년 별세할 때까지',
        '후학 양성과 예술의 대중화에 힘썼습니다.',
      ],
      imageUrl: '/biography-3.webp',
      imagePosition: 'left',
    },
  ];
}
