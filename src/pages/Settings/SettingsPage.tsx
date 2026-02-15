import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import styles from './SettingsPage.module.css';

const hairLabels = { short: '숏컷', medium: '미디엄', long: '롱' } as const;

export default function SettingsPage() {
  const navigate = useNavigate();
  const { profile, setProfile } = useUser();
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  if (!profile) return null;

  const startEdit = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  const saveEdit = (field: string) => {
    setProfile(prev => {
      if (!prev) return prev;
      if (field === 'nickname') return { ...prev, nickname: tempValue };
      if (field === 'cutCycleDays') return { ...prev, cutCycleDays: Math.max(1, parseInt(tempValue) || 30) };
      return prev;
    });
    setEditingField(null);
  };

  const cycleHairLength = () => {
    const order: ('short' | 'medium' | 'long')[] = ['short', 'medium', 'long'];
    const current = order.indexOf(profile.hairLength);
    const next = order[(current + 1) % 3];
    setProfile(prev => prev ? { ...prev, hairLength: next } : prev);
  };

  const toggleNotification = () => {
    setProfile(prev => prev ? { ...prev, notificationEnabled: !prev.notificationEnabled } : prev);
  };

  const handleReset = () => {
    if (confirm('모든 데이터를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
      localStorage.clear();
      navigate('/', { replace: true });
      window.location.reload();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>&#9881; 설정</h1>

      <div className={styles.sectionTitle}>프로필</div>
      <div className={styles.section}>
        <button className={styles.item} onClick={() => editingField === 'nickname' ? saveEdit('nickname') : startEdit('nickname', profile.nickname)}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>&#128100;</span>
            <span className={styles.itemLabel}>닉네임</span>
          </div>
          {editingField === 'nickname' ? (
            <input
              className={styles.editInput}
              value={tempValue}
              onChange={e => setTempValue(e.target.value)}
              onBlur={() => saveEdit('nickname')}
              onKeyDown={e => e.key === 'Enter' && saveEdit('nickname')}
              autoFocus
              maxLength={10}
            />
          ) : (
            <span className={styles.itemValue}>{profile.nickname}</span>
          )}
        </button>

        <button className={styles.item} onClick={cycleHairLength}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>&#128135;</span>
            <span className={styles.itemLabel}>머리 길이</span>
          </div>
          <span className={styles.itemValue}>{hairLabels[profile.hairLength]}</span>
        </button>

        <button className={styles.item} onClick={() => editingField === 'cutCycleDays' ? saveEdit('cutCycleDays') : startEdit('cutCycleDays', String(profile.cutCycleDays))}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>&#128197;</span>
            <span className={styles.itemLabel}>커트 주기</span>
          </div>
          {editingField === 'cutCycleDays' ? (
            <input
              className={styles.editInput}
              type="number"
              value={tempValue}
              onChange={e => setTempValue(e.target.value)}
              onBlur={() => saveEdit('cutCycleDays')}
              onKeyDown={e => e.key === 'Enter' && saveEdit('cutCycleDays')}
              autoFocus
              min={1}
              max={365}
            />
          ) : (
            <span className={styles.itemValue}>{profile.cutCycleDays}일</span>
          )}
        </button>
      </div>

      <div className={styles.sectionTitle}>알림</div>
      <div className={styles.section}>
        <div className={styles.item}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>&#128276;</span>
            <span className={styles.itemLabel}>커트 알림</span>
          </div>
          <div className={`${styles.toggle} ${profile.notificationEnabled ? styles.active : ''}`} onClick={toggleNotification}>
            <div className={styles.toggleKnob} />
          </div>
        </div>
      </div>

      <div className={styles.sectionTitle}>서비스</div>
      <div className={styles.section}>
        <button className={styles.item} onClick={() => navigate('/salon/partner')}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>&#128136;</span>
            <span className={styles.itemLabel}>미용실 제휴 신청</span>
          </div>
          <span className={styles.itemArrow}>&gt;</span>
        </button>

        <button className={styles.item} onClick={() => navigate('/admin')}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>&#128736;</span>
            <span className={styles.itemLabel}>관리자 페이지</span>
          </div>
          <span className={styles.itemArrow}>&gt;</span>
        </button>

        <div className={styles.item}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>&#128172;</span>
            <span className={styles.itemLabel}>문의하기</span>
          </div>
          <span className={styles.itemArrow}>&gt;</span>
        </div>

        <div className={styles.item}>
          <div className={styles.itemLeft}>
            <span className={styles.itemIcon}>&#128196;</span>
            <span className={styles.itemLabel}>개인정보처리방침</span>
          </div>
          <span className={styles.itemArrow}>&gt;</span>
        </div>
      </div>

      <button className={styles.dangerBtn} onClick={handleReset}>
        데이터 초기화
      </button>

      <div className={styles.version}>Cutine v1.0.0</div>
    </div>
  );
}
