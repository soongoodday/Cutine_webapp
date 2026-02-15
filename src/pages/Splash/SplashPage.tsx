import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import styles from './SplashPage.module.css';

export default function SplashPage() {
  const navigate = useNavigate();
  const { isOnboarded } = useUser();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        navigate(isOnboarded ? '/main' : '/onboarding', { replace: true });
      }, 400);
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate, isOnboarded]);

  return (
    <div className={`${styles.container} ${fading ? styles.fadeOut : ''}`}>
      <div className={styles.logo}>
        <span className={styles.scissor}>&#9986;</span>
        <h1 className={styles.title}>Cutine</h1>
        <p className={styles.subtitle}>나만의 커트 주기 관리</p>
      </div>
    </div>
  );
}
