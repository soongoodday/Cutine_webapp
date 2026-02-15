export interface HairCycleInfo {
  label: string;
  icon: string;
  desc: string;
  recommendedDays: number;
  minWeeks: number;
  maxWeeks: number;
  tip: string;
}

export const hairCycleData: Record<'short' | 'medium' | 'long', HairCycleInfo> = {
  short: {
    label: '숏컷',
    icon: '💇‍♂️',
    desc: '귀 위 길이',
    recommendedDays: 28,
    minWeeks: 3,
    maxWeeks: 5,
    tip: '숏컷은 자란 게 금방 티가 나요. 3~5주 간격으로 다듬어주면 깔끔함을 유지할 수 있어요.',
  },
  medium: {
    label: '미디엄',
    icon: '💇',
    desc: '귀~턱 사이 길이',
    recommendedDays: 49,
    minWeeks: 6,
    maxWeeks: 8,
    tip: '미디엄 길이는 스타일 유지가 핵심이에요. 6~8주마다 커트하면 볼륨과 라인을 살릴 수 있어요.',
  },
  long: {
    label: '롱',
    icon: '💇‍♀️',
    desc: '턱 아래 길이',
    recommendedDays: 70,
    minWeeks: 8,
    maxWeeks: 12,
    tip: '롱헤어는 끝이 갈라지기 쉬워요. 8~12주마다 끝을 정리하면 건강한 모발을 유지할 수 있어요.',
  },
};

export function getCycleRangeText(length: 'short' | 'medium' | 'long'): string {
  const data = hairCycleData[length];
  return `${data.minWeeks}~${data.maxWeeks}주 (${data.minWeeks * 7}~${data.maxWeeks * 7}일)`;
}
