import React, { useState, useMemo } from 'react';
import { tips } from '../../data/tips';
import { products } from '../../data/products';
import { useUser } from '../../context/UserContext';
import NativeAd from '../../components/Ad/NativeAd';
import BannerAd from '../../components/Ad/BannerAd';
import type { Tip } from '../../types';
import styles from './TipsPage.module.css';

type Category = 'all' | Tip['category'];
type SortOrder = 'latest' | 'popular';

const TIPS_PER_PAGE = 4;

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'dry', label: '드라이' },
  { value: 'style', label: '스타일링' },
  { value: 'care', label: '케어' },
];

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
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
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOrder>('latest');
  const [visibleCount, setVisibleCount] = useState(TIPS_PER_PAGE);
  const { profile } = useUser();

  const filteredTips = useMemo(() => {
    const filtered = tips.filter(t => {
      const matchCategory = filter === 'all' || t.category === filter;
      const matchSearch = search === '' || t.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
    const sorted = [...filtered];
    if (sort === 'latest') {
      sorted.sort((a, b) => Number(b.id) - Number(a.id));
    }
    return sorted;
  }, [filter, search, sort]);

  const visibleTips = filteredTips.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTips.length;

  // 필터/검색 변경 시 보이는 개수 리셋
  const handleFilterChange = (cat: Category) => {
    setFilter(cat);
    setVisibleCount(TIPS_PER_PAGE);
  };

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

    visibleTips.forEach((tip, i) => {
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
      <h1 className={styles.pageTitle}>{'\uD83D\uDCA1'} 헤어 관련 팁 영상</h1>

      <div className={styles.searchBar}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="검색어를 입력해주세요"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className={styles.searchClear} onClick={() => setSearch('')}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12 5.7 16.89a1 1 0 101.41 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z" />
            </svg>
          </button>
        )}
      </div>

      <div className={styles.filterRow}>
        <div className={styles.filters}>
          {categories.map(cat => (
            <button
              key={cat.value}
              className={`${styles.filterBtn} ${filter === cat.value ? styles.active : ''}`}
              onClick={() => handleFilterChange(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className={styles.sortWrap}>
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              className={`${styles.sortBtn} ${sort === opt.value ? styles.sortActive : ''}`}
              onClick={() => setSort(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {renderList()}
      </div>

      {hasMore && (
        <button
          className={styles.loadMoreBtn}
          onClick={() => setVisibleCount(prev => prev + TIPS_PER_PAGE)}
        >
          더보기
          <svg className={styles.loadMoreIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}

      <div className={styles.bannerWrap}>
        <BannerAd />
      </div>
    </div>
  );
}
