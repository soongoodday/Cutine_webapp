import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCut } from '../../context/CutContext';
import { calculateDday, getDdayStatus, formatDate, toDateString } from '../../utils/date';
import { hairCycleData, getCycleRangeText } from '../../data/hairCycle';
import BannerAd from '../../components/Ad/BannerAd';
import styles from './MainPage.module.css';

export default function MainPage() {
  const navigate = useNavigate();
  const { profile, isOnboarded } = useUser();
  const { lastCutDate, addRecord, removeRecord, averageCycle, records } = useCut();
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));

  useEffect(() => {
    if (!isOnboarded) {
      navigate('/onboarding', { replace: true });
    }
  }, [isOnboarded, navigate]);

  if (!profile) return null;

  const handleOpenDateModal = () => {
    setSelectedDate(toDateString(new Date()));
    setShowDateModal(true);
  };

  const handleDateCut = () => {
    // "다른 날짜에 했어요" → 오늘 날짜의 빈 기록(memo/salon/cost 없는)이 있으면 교체
    const todayStr = toDateString(new Date());
    if (selectedDate !== todayStr) {
      const todayRecord = records.find(r => r.date === todayStr);
      if (todayRecord && !todayRecord.memo && !todayRecord.salonName && !todayRecord.cost) {
        removeRecord(todayRecord.id);
      }
    }
    addRecord(selectedDate);
    setShowDateModal(false);
  };

  const dateModal = showDateModal && (
    <div className={styles.modal} onClick={() => setShowDateModal(false)}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>커트한 날짜 선택</h3>
        <input
          className={styles.modalDateInput}
          type="date"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          max={toDateString(new Date())}
        />
        <div className={styles.modalActions}>
          <button className={styles.modalCancel} onClick={() => setShowDateModal(false)}>취소</button>
          <button className={styles.modalConfirm} onClick={handleDateCut}>기록하기</button>
        </div>
      </div>
    </div>
  );

  // 아직 커트 기록이 없는 경우 첫 기록 유도
  if (!lastCutDate) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <div className={styles.greeting}>{profile.nickname}님</div>
            <div className={styles.greetingSub}>오늘도 좋은 하루 되세요</div>
          </div>
        </div>
        <div className={styles.ddayCard}>
          <div className={styles.character}>&#9986;</div>
          <div className={styles.ddayMessage}>첫 커트 기록을 남겨보세요!</div>
        </div>
        <button className={styles.cutButton} onClick={() => addRecord(toDateString(new Date()))}>
          &#9986; 오늘 커트했어요
        </button>
        <button className={styles.otherDateBtn} onClick={handleOpenDateModal}>
          다른 날짜에 했어요
        </button>
        {dateModal}
      </div>
    );
  }

  const dday = calculateDday(lastCutDate, profile.cutCycleDays);
  const status = getDdayStatus(dday);

  const characterMap = {
    short: '🧑',
    medium: '🧑‍🦱',
    long: '👩‍🦱',
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.greeting}>{profile.nickname}님</div>
          <div className={styles.greetingSub}>오늘도 좋은 하루 되세요</div>
        </div>
      </div>

      <div className={styles.ddayCard}>
        <div className={styles.ddayNumber} style={{ color: status.color }}>
          {status.label}
        </div>
        <div className={styles.ddayMessage}>{status.message}</div>
        <div className={styles.character}>{characterMap[profile.hairLength]}</div>
      </div>

      {dday <= 0 && (
        <button className={styles.salonCta} onClick={() => navigate('/salon')}>
          &#128136; 주변 미용실 찾기
        </button>
      )}

      <button className={styles.cutButton} onClick={() => addRecord(toDateString(new Date()))}>
        &#9986; 오늘 커트했어요
      </button>

      <button className={styles.otherDateBtn} onClick={handleOpenDateModal}>
        다른 날짜에 했어요
      </button>

      <div className={styles.infoCard}>
        <span className={styles.infoIcon}>&#128197;</span>
        <div>
          <div className={styles.infoText}>마지막 커트</div>
          <div className={styles.infoValue}>{formatDate(lastCutDate)}</div>
        </div>
      </div>

      {averageCycle !== null && averageCycle > 0 && (
        <div className={styles.infoCard}>
          <span className={styles.infoIcon}>&#128200;</span>
          <div>
            <div className={styles.infoText}>평균 커트 주기</div>
            <div className={styles.infoValue}>{averageCycle}일 (총 {records.length}회)</div>
          </div>
        </div>
      )}

      <div className={styles.infoCard}>
        <span className={styles.infoIcon}>{hairCycleData[profile.hairLength].icon}</span>
        <div>
          <div className={styles.infoText}>{hairCycleData[profile.hairLength].label} 권장 주기</div>
          <div className={styles.infoValue}>{getCycleRangeText(profile.hairLength)}</div>
        </div>
      </div>

      <BannerAd />

      {dateModal}
    </div>
  );
}
