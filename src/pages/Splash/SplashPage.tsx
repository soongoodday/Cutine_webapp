import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import styles from './SplashPage.module.css';

export default function SplashPage() {
  const navigate = useNavigate();
  const { isOnboarded } = useUser();
  const [fading, setFading] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 영상 로드 완료 시 재생 시도
  const handleCanPlay = () => {
    setVideoReady(true);
    videoRef.current?.play().catch(() => {});
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        navigate(isOnboarded ? '/main' : '/onboarding', { replace: true });
      }, 400);
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate, isOnboarded]);

  return (
    <div className={`${styles.container} ${fading ? styles.fadeOut : ''}`}>
      <video
        ref={videoRef}
        className={`${styles.bgVideo} ${videoReady ? styles.bgVideoReady : ''}`}
        src="/videos/splash.mp4"
        preload="auto"
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={handleCanPlay}
      />
      <div className={styles.overlay} />
      <div className={styles.logo}>
        <span className={styles.scissor}>&#9986;</span>
        <h1 className={styles.title}>Cutine</h1>
        <p className={styles.subtitle}>나만의 커트 주기 관리</p>
      </div>
    </div>
  );
}
