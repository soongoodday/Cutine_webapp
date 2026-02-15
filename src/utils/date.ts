export function calculateDday(lastCutDate: string, cycleDays: number): number {
  const last = new Date(lastCutDate);
  const nextCut = new Date(last);
  nextCut.setDate(nextCut.getDate() + cycleDays);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextCut.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (nextCut.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diff;
}

export interface DdayStatus {
  color: string;
  label: string;
  message: string;
}

export function getDdayStatus(dday: number): DdayStatus {
  if (dday > 7) return { color: 'var(--color-safe)', label: `D-${dday}`, message: '아직 여유 있어요' };
  if (dday > 3) return { color: 'var(--color-info)', label: `D-${dday}`, message: '슬슬 준비하세요' };
  if (dday > 0) return { color: 'var(--color-warning)', label: `D-${dday}`, message: '커트할 때가 다가오고 있어요' };
  if (dday === 0) return { color: 'var(--color-danger)', label: 'D-Day', message: '오늘이 커트 날이에요!' };
  return { color: 'var(--color-danger-dark)', label: `D+${Math.abs(dday)}`, message: '커트 예정일이 지났어요' };
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
}

export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
