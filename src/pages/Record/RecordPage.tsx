import { useState } from 'react';
import { useCut } from '../../context/CutContext';
import { useUser } from '../../context/UserContext';
import { toDateString } from '../../utils/date';
import { hairCycleData } from '../../data/hairCycle';
import Calendar from '../../components/Calendar/Calendar';
import styles from './RecordPage.module.css';

export default function RecordPage() {
  const { records, addRecord, removeRecord, lastCutDate } = useCut();
  const { profile } = useUser();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const cutDates = records.map(r => r.date);
  const selectedRecord = selectedDate ? records.find(r => r.date === selectedDate) : null;
  const today = toDateString(new Date());
  const isFutureDate = selectedDate ? selectedDate > today : false;

  // 커트한 지 N일 계산
  const daysSinceLastCut = (() => {
    if (!lastCutDate) return null;
    const last = new Date(lastCutDate);
    const now = new Date();
    last.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  })();

  // 머리 길이별 추천 주기 팁
  const cycleInfo = profile ? hairCycleData[profile.hairLength] : null;

  const handleAddRecord = () => {
    if (selectedDate && !isFutureDate) {
      addRecord(selectedDate);
    }
  };

  return (
    <div className={styles.container}>
      {/* 헤더 영역 */}
      <div className={styles.header}>
        <div className={styles.headerLabel}>나의 커트 캘린더</div>
        {daysSinceLastCut !== null ? (
          <h1 className={styles.headerTitle}>
            커트한 지 <span className={styles.dayHighlight}>{daysSinceLastCut}일</span> 지났어요!
          </h1>
        ) : (
          <h1 className={styles.headerTitle}>첫 커트를 기록해보세요!</h1>
        )}
      </div>

      {/* 추천 팁 뱃지 */}
      {cycleInfo && (
        <div className={styles.tipBadge}>
          <span className={styles.tipIcon}>{cycleInfo.icon}</span>
          <span className={styles.tipText}>
            {cycleInfo.label} 커트는 최소 {cycleInfo.minWeeks}주 ~ 최대 {cycleInfo.maxWeeks}주 사이가 적절해요
          </span>
        </div>
      )}

      {/* 범례 */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendPast}`} />
          <span className={styles.legendLabel}>지난 커트일</span>
        </div>
        <div className={styles.legendItem}>
          <span className={`${styles.legendDot} ${styles.legendLatest}`} />
          <span className={styles.legendLabel}>최근 커트일</span>
        </div>
      </div>

      {/* 캘린더 */}
      <Calendar
        cutDates={cutDates}
        latestCutDate={lastCutDate}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      {/* 선택된 날짜 상세 / 액션 */}
      {selectedRecord ? (
        <div className={styles.selectedCard}>
          <div className={styles.selectedHeader}>
            <span className={styles.selectedIcon}>&#9986;</span>
            <span className={styles.selectedDate}>
              {new Date(selectedRecord.date + 'T00:00:00').toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          {selectedRecord.salonName && (
            <div className={styles.selectedMeta}>&#128136; {selectedRecord.salonName}</div>
          )}
          {selectedRecord.cost != null && selectedRecord.cost > 0 && (
            <div className={styles.selectedMeta}>&#128176; {selectedRecord.cost.toLocaleString()}원</div>
          )}
          {selectedRecord.memo && (
            <div className={styles.selectedMeta}>&#128221; {selectedRecord.memo}</div>
          )}
          <button className={styles.deleteBtn} onClick={() => {
            removeRecord(selectedRecord.id);
            setSelectedDate(null);
          }}>
            기록 삭제
          </button>
        </div>
      ) : selectedDate && !isFutureDate ? (
        <button className={styles.saveBtn} onClick={handleAddRecord}>
          저장하기
        </button>
      ) : selectedDate && isFutureDate ? (
        <div className={styles.futureMsg}>미래 날짜는 기록할 수 없어요</div>
      ) : null}
    </div>
  );
}
