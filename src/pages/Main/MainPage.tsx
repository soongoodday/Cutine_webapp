import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCut } from '../../context/CutContext';
import { calculateDday, getDdayStatus, formatDate, toDateString } from '../../utils/date';
import { hairCycleData } from '../../data/hairCycle';
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

  // 커트한 지 N일 계산
  const daysSinceLastCut = (() => {
    if (!lastCutDate) return null;
    const last = new Date(lastCutDate);
    const now = new Date();
    last.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  })();

  const cycleInfo = hairCycleData[profile.hairLength];

  const handleOpenDateModal = () => {
    setSelectedDate(toDateString(new Date()));
    setShowDateModal(true);
  };

  const handleDateCut = () => {
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

  // 아직 커트 기록이 없는 경우
  if (!lastCutDate) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLabel}>나의 커트 주기</div>
          <h1 className={styles.headerTitle}>첫 커트를 기록해보세요!</h1>
        </div>

        {cycleInfo && (
          <div className={styles.tipBadge}>
            <span className={styles.tipIcon}>{cycleInfo.icon}</span>
            <span className={styles.tipText}>
              {cycleInfo.label} 커트는 {cycleInfo.minWeeks}~{cycleInfo.maxWeeks}주 간격이 적절해요
            </span>
          </div>
        )}

        <div className={styles.ddayCard}>
          <div className={styles.ddayMessage}>아래 버튼을 눌러 첫 기록을 남겨보세요!</div>
          <div className={styles.character}>
            <img src="/images/face.png" alt="캐릭터" />
          </div>
        </div>

        <button className={styles.cutButton} onClick={() => addRecord(toDateString(new Date()))}>
          오늘 커트했어요
        </button>
        <button className={styles.otherDateBtn} onClick={handleOpenDateModal}>
          다른 날짜에 했어요
        </button>

        <BannerAd />
        {dateModal}
      </div>
    );
  }

  const dday = calculateDday(lastCutDate, profile.cutCycleDays);
  const status = getDdayStatus(dday);

  // 상태에 따라 얼굴 이미지 선택
  const faceImage = dday <= 3 ? '/images/face.png' : '/images/face_smile.png';

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLabel}>나의 커트 주기</div>
        <h1 className={styles.headerTitle}>
          커트한 지 <span className={styles.dayHighlight}>{daysSinceLastCut}일</span> 지났어요!
        </h1>
      </div>

      {/* 추천 팁 뱃지 */}
      {cycleInfo && (
        <div className={styles.tipBadge}>
          <span className={styles.tipIcon}>{cycleInfo.icon}</span>
          <span className={styles.tipText}>
            {cycleInfo.label} 커트는 {cycleInfo.minWeeks}~{cycleInfo.maxWeeks}주 간격이 적절해요
          </span>
        </div>
      )}

      {/* D-Day 카드 */}
      <div className={styles.ddayCard}>
        <div className={styles.ddayNumber} style={{ color: status.color }}>
          {status.label}
        </div>
        <div className={styles.ddayMessage}>{status.message}</div>
        <div className={styles.character}>
          <img src={faceImage} alt="캐릭터" />
        </div>
      </div>

      {/* 정보 카드 그리드 */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <span className={styles.infoIcon}>&#128197;</span>
          <div className={styles.infoLabel}>마지막 커트</div>
          <div className={styles.infoValue}>{formatDate(lastCutDate).replace(/\d+년 /, '')}</div>
        </div>

        <div className={styles.infoCard}>
          <span className={styles.infoIcon}>&#128200;</span>
          <div className={styles.infoLabel}>평균 주기</div>
          <div className={styles.infoValue}>
            {averageCycle !== null && averageCycle > 0 ? `${averageCycle}일` : '-'}
          </div>
        </div>

        <div className={styles.infoCard}>
          <span className={styles.infoIcon}>{cycleInfo.icon}</span>
          <div className={styles.infoLabel}>권장 주기</div>
          <div className={styles.infoValue}>{cycleInfo.minWeeks}~{cycleInfo.maxWeeks}주</div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <button className={styles.cutButton} onClick={() => addRecord(toDateString(new Date()))}>
        오늘 커트했어요
      </button>
      <button className={styles.otherDateBtn} onClick={handleOpenDateModal}>
        다른 날짜에 했어요
      </button>

      <BannerAd />
      {dateModal}
    </div>
  );
}
