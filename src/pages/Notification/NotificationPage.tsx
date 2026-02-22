import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCut } from '../../context/CutContext';
import { calculateDday, getDdayStatus } from '../../utils/date';
import styles from './NotificationPage.module.css';

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

export default function NotificationPage() {
  const navigate = useNavigate();
  const { profile, setProfile } = useUser();
  const { lastCutDate } = useCut();
  const [permission, setPermission] = useState<PermissionState>('default');

  useEffect(() => {
    if (!('Notification' in window)) {
      setPermission('unsupported');
    } else {
      setPermission(Notification.permission as PermissionState);
    }
  }, []);

  if (!profile) return null;

  const dday = lastCutDate ? calculateDday(lastCutDate, profile.cutCycleDays) : null;
  const status = dday !== null ? getDdayStatus(dday) : null;

  const requestPermission = async () => {
    if (!('Notification' in window)) return;
    const result = await Notification.requestPermission();
    setPermission(result as PermissionState);
    if (result === 'granted') {
      setProfile(prev => prev ? { ...prev, notificationEnabled: true } : prev);
      new Notification('Cutine 알림 설정 완료!', {
        body: '커트 주기 알림을 보내드릴게요.',
        icon: '/images/face_smile.png',
      });
    }
  };

  const toggleNotification = () => {
    setProfile(prev => prev ? { ...prev, notificationEnabled: !prev.notificationEnabled } : prev);
  };

  const toggleDay = (day: number) => {
    setProfile(prev => {
      if (!prev) return prev;
      const days = prev.notificationDays.includes(day)
        ? prev.notificationDays.filter(d => d !== day)
        : [...prev.notificationDays, day].sort((a, b) => b - a);
      return { ...prev, notificationDays: days };
    });
  };

  const notificationDayOptions = [
    { value: 7, label: 'D-7', desc: '일주일 전' },
    { value: 3, label: 'D-3', desc: '3일 전' },
    { value: 1, label: 'D-1', desc: '하루 전' },
    { value: 0, label: 'D-Day', desc: '당일' },
  ];

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className={styles.pageTitle}>알림</h1>
        <div className={styles.headerSpacer} />
      </div>

      {/* 현재 D-Day 상태 카드 */}
      {status && dday !== null && (
        <div className={styles.statusCard}>
          <div className={styles.statusIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={status.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className={styles.statusInfo}>
            <div className={styles.statusLabel} style={{ color: status.color }}>
              {status.label}
            </div>
            <div className={styles.statusMessage}>{status.message}</div>
          </div>
        </div>
      )}

      {/* 알림 권한 */}
      <div className={styles.sectionTitle}>알림 권한</div>
      <div className={styles.section}>
        {permission === 'unsupported' ? (
          <div className={styles.permissionCard}>
            <div className={styles.permissionIcon}>&#128683;</div>
            <div className={styles.permissionText}>
              이 브라우저는 알림을 지원하지 않아요
            </div>
          </div>
        ) : permission === 'granted' ? (
          <div className={styles.permissionCard}>
            <div className={styles.permissionIcon}>&#9989;</div>
            <div className={styles.permissionText}>
              알림이 허용되었어요
            </div>
          </div>
        ) : permission === 'denied' ? (
          <div className={styles.permissionCard}>
            <div className={styles.permissionIcon}>&#128683;</div>
            <div className={styles.permissionText}>
              알림이 차단되었어요
            </div>
            <div className={styles.permissionHint}>
              브라우저 설정에서 알림을 허용해주세요
            </div>
          </div>
        ) : (
          <button className={styles.permissionBtn} onClick={requestPermission}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            알림 허용하기
          </button>
        )}
      </div>

      {/* 알림 설정 */}
      <div className={styles.sectionTitle}>알림 설정</div>
      <div className={styles.section}>
        <div className={styles.settingItem}>
          <div className={styles.settingLeft}>
            <span className={styles.settingLabel}>커트 주기 알림</span>
            <span className={styles.settingDesc}>예정일에 맞춰 알려드려요</span>
          </div>
          <div
            className={`${styles.toggle} ${profile.notificationEnabled ? styles.active : ''}`}
            onClick={toggleNotification}
          >
            <div className={styles.toggleKnob} />
          </div>
        </div>
      </div>

      {/* 알림 타이밍 */}
      {profile.notificationEnabled && (
        <>
          <div className={styles.sectionTitle}>알림 타이밍</div>
          <div className={styles.section}>
            {notificationDayOptions.map(opt => (
              <div key={opt.value} className={styles.settingItem} onClick={() => toggleDay(opt.value)}>
                <div className={styles.settingLeft}>
                  <span className={styles.dayLabel}>{opt.label}</span>
                  <span className={styles.settingDesc}>{opt.desc}</span>
                </div>
                <div className={`${styles.checkbox} ${profile.notificationDays.includes(opt.value) ? styles.checked : ''}`}>
                  {profile.notificationDays.includes(opt.value) && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 안내 */}
      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>&#128161;</div>
        <div className={styles.infoText}>
          알림은 앱을 열어놓은 상태에서만 작동해요.
          PWA로 설치하면 백그라운드 알림도 가능해져요.
        </div>
      </div>
    </div>
  );
}
