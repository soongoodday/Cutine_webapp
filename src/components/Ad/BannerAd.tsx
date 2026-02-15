interface BannerAdProps {
  size?: 'small' | 'medium';
}

export default function BannerAd({ size = 'small' }: BannerAdProps) {
  const height = size === 'small' ? 50 : 100;

  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        background: 'linear-gradient(135deg, #6C63FF 0%, #8B83FF 50%, #A78BFA 100%)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: 'var(--space-md)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* 카카오 애드핏 SDK 연동 전 플레이스홀더 */}
      <span style={{ fontSize: size === 'medium' ? '20px' : '16px' }}>&#9986;</span>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: size === 'medium' ? 'var(--font-size-sm)' : 'var(--font-size-xs)',
          color: 'white',
          fontWeight: 700,
        }}>
          Cutine Premium
        </div>
        {size === 'medium' && (
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'rgba(255,255,255,0.8)',
            marginTop: 2,
          }}>
            광고 없는 프리미엄 경험
          </div>
        )}
      </div>
      <span style={{
        position: 'absolute',
        top: 4,
        right: 8,
        fontSize: '9px',
        color: 'rgba(255,255,255,0.6)',
        background: 'rgba(0,0,0,0.15)',
        padding: '1px 4px',
        borderRadius: '2px',
      }}>
        AD
      </span>
    </div>
  );
}
