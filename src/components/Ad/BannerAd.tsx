import { useState } from 'react';

interface BannerAdProps {
  size?: 'small' | 'medium';
}

export default function BannerAd({ size = 'small' }: BannerAdProps) {
  const [loaded, setLoaded] = useState(true);
  const height = size === 'small' ? 50 : 100;

  if (!loaded) return null;

  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        background: 'linear-gradient(135deg, #f0f0f0, #e8e8e8)',
        borderRadius: 'var(--radius-sm)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'var(--space-md)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={() => setLoaded(true)}
    >
      {/* 실제 배포 시 카카오 애드핏 SDK 코드로 교체 */}
      <span style={{
        fontSize: 'var(--font-size-xs)',
        color: 'var(--color-text-tertiary)',
      }}>
        AD - 광고 영역
      </span>
      <span style={{
        position: 'absolute',
        top: 4,
        right: 8,
        fontSize: '10px',
        color: 'var(--color-text-tertiary)',
        background: 'rgba(255,255,255,0.8)',
        padding: '1px 4px',
        borderRadius: '2px',
      }}>
        광고
      </span>
    </div>
  );
}
