import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import styles from './SplashPage.module.css';

// Pexels CC0 무료 배경 영상 (헤어 커트 / 바버샵 관련)
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
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrl = useMemo(
    () => SPLASH_VIDEOS[Math.floor(Math.random() * SPLASH_VIDEOS.length)],
    []
  );

  // 영상 로드 실패 시 타임아웃 (3초 안에 canplay 안 되면 포기)
  useEffect(() => {
    if (videoFailed || videoReady) return;
    const timeout = setTimeout(() => {
      if (!videoReady) setVideoFailed(true);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [videoFailed, videoReady]);

  // 영상 로드 완료 시 재생 시도
  const handleCanPlay = () => {
    setVideoReady(true);
    // 일부 브라우저에서 autoPlay가 실패할 수 있으므로 수동 재생 시도
    videoRef.current?.play().catch(() => {
      // play() 실패 시 무시 (이미 muted라서 대부분 성공)
    });
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
      {!videoFailed && (
        <video
          ref={videoRef}
          className={`${styles.bgVideo} ${videoReady ? styles.bgVideoReady : ''}`}
          src={videoUrl}
          preload="auto"
          autoPlay
          muted
          loop
          playsInline
          onCanPlay={handleCanPlay}
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
