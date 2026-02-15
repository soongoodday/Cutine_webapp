import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BottomNav.module.css';

const tabs = [
  {
    path: '/main',
    label: '홈',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    path: '/record',
    label: '기록',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    path: '/salon',
    label: '미용실',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
  {
    path: '/tips',
    label: '팁',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M9 18h6M12 2a7 7 0 015 11.9V17a1 1 0 01-1 1H8a1 1 0 01-1-1v-3.1A7 7 0 0112 2z" />
      </svg>
    ),
  },
  {
    path: '/settings',
    label: '설정',
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      {tabs.map(tab => (
        <button
          key={tab.path}
          className={`${styles.navItem} ${location.pathname.startsWith(tab.path) ? styles.active : ''}`}
          onClick={() => navigate(tab.path)}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
