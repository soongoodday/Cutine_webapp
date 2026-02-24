import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCut } from '../../context/CutContext';
import { calculateDday, getDdayStatus, formatDate, toDateString } from '../../utils/date';
import { hairCycleData } from '../../data/hairCycle';
import Calendar from '../../components/Calendar/Calendar';
import styles from './MainPage.module.css';

export default function MainPage() {
  const navigate = useNavigate();
  const { profile, isOnboarded } = useUser();
  const { lastCutDate, addRecord, removeRecord, averageCycle, records } = useCut();
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));
  const [justCut, setJustCut] = useState(false);
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * 6));

  useEffect(() => {
    if (!isOnboarded) {
      navigate('/onboarding', { replace: true });
    }
  }, [isOnboarded, navigate]);

  // 10초마다 팁 회전
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex(prev => {
        const tipsLength = profile ? hairCycleData[profile.hairLength].tips.length : 6;
        return (prev + 1) % tipsLength;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [profile]);

  if (!profile) return null;

  const currentTip = hairCycleData[profile.hairLength].tips[tipIndex % hairCycleData[profile.hairLength].tips.length];

  const daysSinceLastCut = (() => {
    if (!lastCutDate) return null;
    const last = new Date(lastCutDate);
    const now = new Date();
    last.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  })();

  const cycleInfo = hairCycleData[profile.hairLength];

  // 머리 길이별 캐릭터 이미지
  const characterImg = `/images/${profile.hairLength}.png`;
  const characterSmileImg = `/images/${profile.hairLength}_smile.png`;

  const todayStr = toDateString(new Date());
  const cutDates = records.map(r => r.date);

  const handleOpenDateModal = () => {
    setSelectedDate('');
    setShowDateModal(true);
  };

  const handleDateCut = () => {
    if (!selectedDate) return;
    if (selectedDate !== todayStr) {
      const todayRecord = records.find(r => r.date === todayStr);
      if (todayRecord && !todayRecord.memo && !todayRecord.salonName && !todayRecord.cost) {
        removeRecord(todayRecord.id);
      }
    }
    addRecord(selectedDate);
    setShowDateModal(false);
  };

  const formatSelectedDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const dateModal = showDateModal && (
    <div className={styles.modal} onClick={() => setShowDateModal(false)}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={() => setShowDateModal(false)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14 4L4 14M4 4l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>닫기</span>
        </button>

        <h3 className={styles.modalTitle}>커트하신 날짜를 선택해주세요</h3>

        <div className={styles.modalDateDisplay}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span className={selectedDate ? styles.dateText : styles.datePlaceholder}>
            {selectedDate ? formatSelectedDate(selectedDate) : '날짜를 선택해주세요...'}
          </span>
          {selectedDate && (
            <button className={styles.dateClear} onClick={() => setSelectedDate('')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#ddd"/>
                <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        <Calendar
          cutDates={cutDates}
          latestCutDate={lastCutDate}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          maxDate={todayStr}
        />

        <button
          className={`${styles.modalConfirm} ${!selectedDate ? styles.modalConfirmDisabled : ''}`}
          onClick={handleDateCut}
          disabled={!selectedDate}
        >
          커트하셨군요!
        </button>
      </div>
    </div>
  );

  const headerIcons = (
    <div className={styles.headerIcons}>
      <button className={styles.iconBtn} onClick={() => navigate('/salon')} aria-label="주변 미용실">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </button>
      <button className={styles.iconBtn} onClick={() => navigate('/notifications')} aria-label="알림">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      </button>
    </div>
  );

  // 아직 커트 기록이 없는 경우
  if (!lastCutDate) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerLabel}>나의 커트 주기</div>
            {headerIcons}
          </div>
          <h1 className={styles.headerTitle}>첫 커트를 기록해보세요!</h1>
        </div>

        {cycleInfo && (
          <div className={styles.tipBadge} key={tipIndex}>
            <span className={styles.tipIcon}>{cycleInfo.icon}</span>
            <span className={styles.tipText}>{currentTip}</span>
          </div>
        )}

        <div className={styles.ddaySection}>
          <div className={styles.ddayMessage}>아래 버튼을 눌러 첫 기록을 남겨보세요!</div>
          <div className={styles.character}>
            <img src={characterImg} alt="캐릭터" className={`${styles.faceImg} ${justCut ? styles.faceHidden : ''}`} />
            <img src={characterSmileImg} alt="커트 완료" className={`${styles.faceImg} ${styles.faceSmile} ${justCut ? styles.faceVisible : ''}`} />
          </div>
        </div>

        <button className={styles.cutButton} onClick={() => { setJustCut(true); addRecord(toDateString(new Date())); }}>
          오늘 커트했어요
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

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.headerLabel}>나의 커트 주기</div>
          {headerIcons}
        </div>
        <h1 className={styles.headerTitle}>
          커트한 지 <span className={styles.dayHighlight}>{daysSinceLastCut}일</span> 지났어요!
        </h1>
      </div>

      {/* 추천 팁 뱃지 */}
      {cycleInfo && (
        <div className={styles.tipBadge} key={tipIndex}>
          <span className={styles.tipIcon}>{cycleInfo.icon}</span>
          <span className={styles.tipText}>{currentTip}</span>
        </div>
      )}

      {/* D-Day 섹션 */}
      <div className={styles.ddaySection}>
        <div className={styles.ddayNumber} style={{ color: status.color }}>
          {status.label}
        </div>
        <div className={styles.ddayMessage}>{status.message}</div>
        <div className={styles.character}>
          <img src={characterImg} alt="캐릭터" className={`${styles.faceImg} ${justCut ? styles.faceHidden : ''}`} />
          <img src={characterSmileImg} alt="커트 완료" className={`${styles.faceImg} ${styles.faceSmile} ${justCut ? styles.faceVisible : ''}`} />
        </div>
      </div>

      {/* 정보 카드 그리드 */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>마지막 커트</div>
          <div className={styles.infoValue}>{formatDate(lastCutDate).replace(/\d+년 /, '')}</div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>평균 주기</div>
          <div className={styles.infoValue}>
            {averageCycle !== null && averageCycle > 0 ? `${averageCycle}일` : '-'}
          </div>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoLabel}>권장 주기</div>
          <div className={styles.infoValue}>{cycleInfo.minWeeks}~{cycleInfo.maxWeeks}주</div>
        </div>
      </div>

      {/* 액션 버튼 */}
      <button className={styles.cutButton} onClick={() => { setJustCut(true); addRecord(toDateString(new Date())); }}>
        오늘 커트했어요
      </button>
      <button className={styles.otherDateBtn} onClick={handleOpenDateModal}>
        다른 날짜에 했어요
      </button>

      {dateModal}
    </div>
  );
}
