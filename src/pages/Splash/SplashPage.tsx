import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import styles from './SplashPage.module.css';

// Pexels CC0 무료 배경 영상 (barber/haircut 관련)
const SPLASH_VIDEOS = [
  'https://videos.pexels.com/video-files/4178108/4178108-sd_640_360_25fps.mp4',
  'https://videos.pexels.com/video-files/4718402/4718402-sd_640_360_25fps.mp4',
  'https://videos.pexels.com/video-files/3998455/3998455-sd_640_360_25fps.mp4',
  'https://videos.pexels.com/video-files/7697539/7697539-sd_640_360_25fps.mp4',
  'https://videos.pexels.com/video-files/7697111/7697111-sd_640_360_25fps.mp4',
];

export default function SplashPage() {
  const navigate = useNavigate();
  const { isOnboarded } = useUser();
  const [fading, setFading] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const videoUrl = useMemo(
    () => SPLASH_VIDEOS[Math.floor(Math.random() * SPLASH_VIDEOS.length)],
    []
  );

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
      {!videoFailed && (
        <video
          className={styles.bgVideo}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
        />
      )}
      <div className={styles.overlay} />
      <div className={styles.logo}>
        <span className={styles.scissor}>&#9986;</span>
        <h1 className={styles.title}>Cutine</h1>
        <p className={styles.subtitle}>나만의 커트 주기 관리</p>
      </div>
    </div>
  );
}
