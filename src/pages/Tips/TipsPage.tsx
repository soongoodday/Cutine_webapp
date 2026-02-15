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

  // 팁 3개마다 제품 추천 1개 삽입
  const renderList = () => {
    const items: React.JSX.Element[] = [];
    let productIndex = 0;

    filteredTips.forEach((tip, i) => {
      items.push(
        <div key={tip.id} className={styles.tipCard} onClick={() => handleTipClick(tip)}>
          <img className={styles.tipThumb} src={tip.thumbnail} alt={tip.title} />
          <div className={styles.tipInfo}>
            <div className={styles.tipTitle}>{tip.title}</div>
            <div className={styles.tipDuration}>{tip.duration}</div>
          </div>
        </div>
      );

      if ((i + 1) % 3 === 0 && productIndex < recommendedProducts.length) {
        const product = recommendedProducts[productIndex];
        items.push(
          <NativeAd key={`ad-${product.id}`} product={product} />
        );
        productIndex++;
      }
    });

    return items;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>&#128161; 헤어 팁</h1>

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

      <BannerAd />
    </div>
  );
}
