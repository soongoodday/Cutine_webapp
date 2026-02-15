import { useState } from 'react';
import { useCut } from '../../context/CutContext';
import { formatDate } from '../../utils/date';
import Calendar from '../../components/Calendar/Calendar';
import BannerAd from '../../components/Ad/BannerAd';
import styles from './RecordPage.module.css';

export default function RecordPage() {
  const { records, removeRecord, averageCycle } = useCut();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const cutDates = records.map(r => r.date);
  const selectedRecord = selectedDate ? records.find(r => r.date === selectedDate) : null;

  const totalCost = records.reduce((sum, r) => sum + (r.cost || 0), 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>&#128197; 커트 기록</h1>

      <Calendar
        cutDates={cutDates}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{records.length}</div>
          <div className={styles.statLabel}>총 횟수</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{averageCycle || '-'}</div>
          <div className={styles.statLabel}>평균 주기(일)</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>
            {totalCost > 0 ? `${Math.round(totalCost / records.length / 1000)}K` : '-'}
          </div>
          <div className={styles.statLabel}>평균 비용</div>
        </div>
      </div>

      {selectedRecord ? (
        <div className={styles.recordDetail}>
          <div className={styles.recordDate}>{formatDate(selectedRecord.date)}</div>
          {selectedRecord.salonName && (
            <div className={styles.recordMeta}>&#128136; {selectedRecord.salonName}</div>
          )}
          {selectedRecord.cost && (
            <div className={styles.recordMeta}>&#128176; {selectedRecord.cost.toLocaleString()}원</div>
          )}
          {selectedRecord.memo && (
            <div className={styles.recordMeta}>&#128221; {selectedRecord.memo}</div>
          )}
          <div className={styles.recordActions}>
            <button className={styles.deleteBtn} onClick={() => {
              removeRecord(selectedRecord.id);
              setSelectedDate(null);
            }}>
              삭제
            </button>
          </div>
        </div>
      ) : selectedDate ? (
        <div className={styles.emptyState}>이 날짜에 기록이 없습니다</div>
      ) : (
        <div className={styles.emptyState}>날짜를 선택하여 기록을 확인하세요</div>
      )}

      <BannerAd size="medium" />
    </div>
  );
}
