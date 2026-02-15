import type { Product } from '../../types';

interface NativeAdProps {
  product: Product;
}

export default function NativeAd({ product }: NativeAdProps) {
  const handleClick = () => {
    // 제휴 링크 트래킹
    const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
    clicks.push({
      type: 'product',
      itemId: product.id,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));

    if (product.affiliateUrl && product.affiliateUrl !== '#') {
      window.open(product.affiliateUrl, '_blank', 'noopener');
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: 'var(--space-md)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <img
        src={product.imageUrl}
        alt={product.name}
        style={{
          width: 72,
          height: 72,
          borderRadius: 'var(--radius-sm)',
          objectFit: 'cover',
          background: 'var(--color-bg)',
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: 700,
          marginBottom: 2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {product.name}
        </div>
        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>
          {product.brand}
        </div>
        <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 700, marginTop: 4 }}>
          {product.price.toLocaleString()}원
        </div>
      </div>
      <div style={{
        padding: '6px 12px',
        background: 'var(--color-primary)',
        color: 'white',
        borderRadius: 'var(--radius-full)',
        fontSize: 'var(--font-size-xs)',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}>
        구매
      </div>
      <span style={{
        position: 'absolute',
        top: 4,
        right: 8,
        fontSize: '9px',
        color: 'var(--color-text-tertiary)',
      }}>
        광고
      </span>
    </div>
  );
}
