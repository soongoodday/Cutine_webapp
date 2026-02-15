import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCut } from '../../context/CutContext';
import { toDateString } from '../../utils/date';
import { hairCycleData, getCycleRangeText } from '../../data/hairCycle';
import type { UserProfile } from '../../types';
import styles from './OnboardingPage.module.css';

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setProfile } = useUser();
  const { addRecord } = useCut();

  const [step, setStep] = useState(0);
  const [nickname, setNickname] = useState('');
  const [hairLength, setHairLength] = useState<'short' | 'medium' | 'long' | ''>('');
  const [lastCutDate, setLastCutDate] = useState(toDateString(new Date()));
  const [cycleDays, setCycleDays] = useState(30);

  const canNext = () => {
    switch (step) {
      case 0: return nickname.trim().length > 0;
      case 1: return hairLength !== '';
      case 2: return lastCutDate !== '';
      case 3: return cycleDays > 0;
      default: return false;
    }
  };

  const handleHairSelect = (value: 'short' | 'medium' | 'long') => {
    setHairLength(value);
    setCycleDays(hairCycleData[value].recommendedDays);
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      const profile: UserProfile = {
        nickname: nickname.trim(),
        hairLength: hairLength as 'short' | 'medium' | 'long',
        cutCycleDays: cycleDays,
        notificationEnabled: true,
        notificationDays: [3, 1, 0],
        createdAt: new Date().toISOString(),
      };
      setProfile(profile);
      addRecord(lastCutDate);
      navigate('/main', { replace: true });
    }
  };

  const hairOptions = [
    { value: 'short' as const, ...hairCycleData.short },
    { value: 'medium' as const, ...hairCycleData.medium },
    { value: 'long' as const, ...hairCycleData.long },
  ];

  const selectedCycleData = hairLength ? hairCycleData[hairLength] : null;

  return (
    <div className={styles.container}>
      <div className={styles.progress}>
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`${styles.progressDot} ${i <= step ? styles.active : ''}`} />
        ))}
      </div>

      <div className={styles.stepContent} key={step}>
        {step === 0 && (
          <>
            <h2 className={styles.stepTitle}>반갑습니다!</h2>
            <p className={styles.stepDesc}>닉네임을 알려주세요</p>
            <input
              className={styles.input}
              placeholder="닉네임 입력"
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              maxLength={10}
              autoFocus
            />
          </>
        )}

        {step === 1 && (
          <>
            <h2 className={styles.stepTitle}>머리 길이는?</h2>
            <p className={styles.stepDesc}>현재 머리 길이를 선택해주세요</p>
            <div className={styles.optionGroup}>
              {hairOptions.map(opt => (
                <button
                  key={opt.value}
                  className={`${styles.option} ${hairLength === opt.value ? styles.selected : ''}`}
                  onClick={() => handleHairSelect(opt.value)}
                >
                  <span className={styles.optionIcon}>{opt.icon}</span>
                  <div className={styles.optionText}>
                    <div className={styles.optionLabel}>{opt.label}</div>
                    <div className={styles.optionDesc}>{opt.desc}</div>
                    <div className={styles.optionCycle}>
                      권장 주기: {opt.minWeeks}~{opt.maxWeeks}주
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className={styles.stepTitle}>마지막 커트는 언제?</h2>
            <p className={styles.stepDesc}>가장 최근에 커트한 날짜를 선택해주세요</p>
            <input
              className={styles.input}
              type="date"
              value={lastCutDate}
              onChange={e => setLastCutDate(e.target.value)}
              max={toDateString(new Date())}
            />
          </>
        )}

        {step === 3 && (
          <>
            <h2 className={styles.stepTitle}>커트 주기는?</h2>
            <p className={styles.stepDesc}>보통 몇 일마다 커트하시나요?</p>
            {selectedCycleData && (
              <div className={styles.cycleRecommend}>
                <div className={styles.cycleRecommendHeader}>
                  <span>{selectedCycleData.icon}</span>
                  <span className={styles.cycleRecommendLabel}>
                    {selectedCycleData.label} 권장 주기
                  </span>
                </div>
                <div className={styles.cycleRecommendRange}>
                  {getCycleRangeText(hairLength as 'short' | 'medium' | 'long')}
                </div>
                <div className={styles.cycleRecommendTip}>
                  {selectedCycleData.tip}
                </div>
              </div>
            )}
            <div className={styles.cycleInput}>
              <input
                className={styles.input}
                type="number"
                value={cycleDays}
                onChange={e => setCycleDays(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={365}
              />
              <span className={styles.cycleLabel}>일마다</span>
            </div>
            {selectedCycleData && (
              <div className={styles.cyclePresets}>
                {[selectedCycleData.minWeeks, Math.round((selectedCycleData.minWeeks + selectedCycleData.maxWeeks) / 2), selectedCycleData.maxWeeks].map(weeks => (
                  <button
                    key={weeks}
                    className={`${styles.cyclePresetBtn} ${cycleDays === weeks * 7 ? styles.cyclePresetActive : ''}`}
                    onClick={() => setCycleDays(weeks * 7)}
                  >
                    {weeks}주 ({weeks * 7}일)
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.footer}>
        {step > 0 && (
          <button className={styles.btnBack} onClick={() => setStep(step - 1)}>
            이전
          </button>
        )}
        <button className={styles.btnNext} onClick={handleNext} disabled={!canNext()}>
          {step === TOTAL_STEPS - 1 ? '시작하기' : '다음'}
        </button>
      </div>
    </div>
  );
}
