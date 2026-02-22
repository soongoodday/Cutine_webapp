import React, { useState, useMemo } from 'react';
import { tips } from '../../data/tips';
import { products } from '../../data/products';
import { useUser } from '../../context/UserContext';
import NativeAd from '../../components/Ad/NativeAd';
import BannerAd from '../../components/Ad/BannerAd';
import type { Tip } from '../../types';
import styles from './TipsPage.module.css';

type Category = 'all' | Tip['category'];

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'dry', label: '드라이' },
  { value: 'style', label: '스타일링' },
  { value: 'care', label: '케어' },
];

const categoryIcons: Record<string, string> = {
  dry: '\uD83D\uDCA8',
  style: '\u2702\uFE0F',
  care: '\uD83E\uDDF4',
};

const categoryColors: Record<string, string> = {
  dry: 'linear-gradient(135deg, #667eea, #764ba2)',
  style: 'linear-gradient(135deg, #f093fb, #f5576c)',
  care: 'linear-gradient(135deg, #4facfe, #00f2fe)',
};

export default function TipsPage() {
  const [filter, setFilter] = useState<Category>('all');
  const { profile } = useUser();

  const filteredTips = filter === 'all' ? tips : tips.filter(t => t.category === filter);

  const recommendedProducts = useMemo(() => {
    if (!profile) return products;
    return products.filter(p => p.hairTypes.includes(profile.hairLength));
  }, [profile]);

  const handleTipClick = (tip: Tip) => {
    window.open(tip.videoUrl, '_blank', 'noopener');
  };

  const renderTipCard = (tip: Tip) => (
    <div key={tip.id} className={styles.tipCard} onClick={() => handleTipClick(tip)}>
      <div className={styles.tipThumbWrap}>
        {tip.thumbnail ? (
          <img className={styles.thumbImg} src={tip.thumbnail} alt={tip.title} />
        ) : (
          <div
            className={styles.thumbPlaceholder}
            style={{ background: categoryColors[tip.category] || categoryColors.care }}
          />
        )}
        <span className={styles.categoryIcon}>
          {categoryIcons[tip.category] || ''}
        </span>
        <div className={styles.playBtn}>
          <svg className={styles.playSvg} viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      <div className={styles.tipInfo}>
        <div className={styles.tipTitle}>{tip.title}</div>
      </div>
    </div>
  );

  // 팁 4개마다 제품 추천 1개 삽입 (2열 그리드 → 2행 후 광고)
  const renderList = () => {
    const items: React.JSX.Element[] = [];
    let productIndex = 0;

    filteredTips.forEach((tip, i) => {
      items.push(renderTipCard(tip));

      if ((i + 1) % 4 === 0 && productIndex < recommendedProducts.length) {
        const product = recommendedProducts[productIndex];
        items.push(
          <div key={`ad-${product.id}`} className={styles.adWrapper}>
            <NativeAd product={product} />
          </div>
        );
        productIndex++;
      }
    });

    return items;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{'\uD83D\uDCA1'} 헤어 팁</h1>

      <div className={styles.filters}>
        {categories.map(cat => (
          <button
            key={cat.value}
            className={`${styles.filterBtn} ${filter === cat.value ? styles.active : ''}`}
            onClick={() => setFilter(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {renderList()}
      </div>

      <div className={styles.bannerWrap}>
        <BannerAd />
      </div>
    </div>
  );
}
