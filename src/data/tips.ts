import type { Tip } from '../types';

// YouTube 검색 URL 생성 헬퍼 (sp=EgIQAQ%253D%253D 는 '동영상' 필터)
function ytSearch(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%3D%3D`;
}

export const tips: Tip[] = [
  {
    id: '1',
    title: '남자 드라이 기초! 볼륨 살리는 드라이 방법',
    thumbnail: '',
    videoUrl: ytSearch('남자 머리 드라이 볼륨 넣는법 헤어 튜토리얼'),
    category: 'dry',
    duration: 'YouTube',
  },
  {
    id: '2',
    title: '헤어 에센스 제대로 바르는 법',
    thumbnail: '',
    videoUrl: ytSearch('남자 헤어 에센스 오일 바르는법 모발 관리'),
    category: 'care',
    duration: 'YouTube',
  },
  {
    id: '3',
    title: '왁스 스타일링 기초 가이드',
    thumbnail: '',
    videoUrl: ytSearch('남자 헤어왁스 바르는법 초보 스타일링 튜토리얼'),
    category: 'style',
    duration: 'YouTube',
  },
  {
    id: '4',
    title: '두피 케어 루틴 완벽 정리',
    thumbnail: '',
    videoUrl: ytSearch('남자 두피 관리 루틴 탈모 예방 스칼프 케어'),
    category: 'care',
    duration: 'YouTube',
  },
  {
    id: '5',
    title: '셀프 앞머리 커트 꿀팁',
    thumbnail: '',
    videoUrl: ytSearch('남자 셀프 앞머리 자르기 커트 방법 가위'),
    category: 'style',
    duration: 'YouTube',
  },
  {
    id: '6',
    title: '탈모 예방 드라이 방법',
    thumbnail: '',
    videoUrl: ytSearch('탈모 예방 머리 말리는법 드라이 두피 건강'),
    category: 'dry',
    duration: 'YouTube',
  },
  {
    id: '7',
    title: '여름철 모발 관리 필수 팁',
    thumbnail: '',
    videoUrl: ytSearch('여름 남자 머리 관리 자외선 모발 손상 케어'),
    category: 'care',
    duration: 'YouTube',
  },
  {
    id: '8',
    title: '내추럴 펌 스타일링 꿀팁',
    thumbnail: '',
    videoUrl: ytSearch('남자 내추럴 펌 셋팅 스타일링 드라이 방법'),
    category: 'style',
    duration: 'YouTube',
  },
  {
    id: '9',
    title: '올바른 샴푸 방법과 순서',
    thumbnail: '',
    videoUrl: ytSearch('올바른 샴푸 방법 순서 두피 세정 남자 머리감기'),
    category: 'care',
    duration: 'YouTube',
  },
];
