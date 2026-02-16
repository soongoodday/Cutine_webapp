import { useLocation, useNavigate } from 'react-router-dom';
import styles from './BottomNav.module.css';

const tabs = [
  { path: '/main', label: '홈', icon: '/images/home.png' },
  { path: '/record', label: '기록', icon: '/images/calendar.png' },
  { path: '/tips', label: '팁', icon: '/images/tip.png' },
  { path: '/settings', label: '설정', icon: '/images/setting.png' },
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
          <img src={tab.icon} alt={tab.label} className={styles.navIcon} />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
