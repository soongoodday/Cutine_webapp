export interface HairCycleInfo {
  label: string;
  icon: string;
  desc: string;
  recommendedDays: number;
  minWeeks: number;
  maxWeeks: number;
  tips: string[];
}

export const hairCycleData: Record<'short' | 'medium' | 'long', HairCycleInfo> = {
  short: {
    label: '숏컷',
    icon: '💇‍♂️',
    desc: '귀 위 길이',
    recommendedDays: 28,
    minWeeks: 3,
    maxWeeks: 5,
    tips: [
      '숏컷은 자란 게 금방 티나요! 3~5주 간격이 적절해요',
      '숏컷은 드라이만 잘해도 스타일이 확 달라져요',
      '사이드와 뒷머리가 먼저 자라니 정리 주기를 체크하세요',
      '숏컷은 왁스보다 매트 클레이가 자연스러워요',
      '두피 마사지를 하면 건강한 모발 유지에 도움돼요',
      '숏컷에 볼륨을 주려면 뿌리 쪽부터 드라이하세요',
    ],
  },
  medium: {
    label: '미디엄',
    icon: '💇',
    desc: '귀~턱 사이 길이',
    recommendedDays: 49,
    minWeeks: 6,
    maxWeeks: 8,
    tips: [
      '미디엄은 스타일 유지가 핵심! 6~8주 간격 추천해요',
      '볼륨이 줄었다면 커트 시기를 앞당겨보세요',
      '미디엄은 드라이 방향이 스타일의 80%를 결정해요',
      '펌을 했다면 에센스로 컬 유지가 중요해요',
      '미디엄은 앞머리 관리만으로도 인상이 달라져요',
      '미디엄 길이는 헤어 오일로 윤기를 더해보세요',
    ],
  },
  long: {
    label: '롱',
    icon: '💇‍♀️',
    desc: '턱 아래 길이',
    recommendedDays: 70,
    minWeeks: 8,
    maxWeeks: 12,
    tips: [
      '롱헤어는 끝이 갈라지기 쉬워요. 8~12주마다 정리하세요',
      '긴 머리는 주 2~3회 트리트먼트가 필수예요',
      '자기 전에 느슨하게 묶으면 엉킴이 줄어요',
      '끝이 상했다면 바로 정리하는 게 건강한 모발에 좋아요',
      '롱헤어는 열 보호 스프레이를 꼭 사용하세요',
      '빗질은 끝부터 천천히! 뿌리부터 하면 손상돼요',
    ],
  },
};

export function getCycleRangeText(length: 'short' | 'medium' | 'long'): string {
  const data = hairCycleData[length];
  return `${data.minWeeks}~${data.maxWeeks}주 (${data.minWeeks * 7}~${data.maxWeeks * 7}일)`;
}
