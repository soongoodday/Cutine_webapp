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
  { value: 'all', label: '\uC804\uCCB4' },
  { value: 'dry', label: '\uB4DC\uB77C\uC774' },
  { value: 'style', label: '\uC2A4\uD0C0\uC77C\uB9C1' },
  { value: 'care', label: '\uCF00\uC5B4' },
];

const sortOptions: { value: SortOrder; label: string }[] = [
  { value: 'latest', label: '\uCD5C\uC2E0\uC21C' },
  { value: 'popular', label: '\uC778\uAE30\uC21C' },
];

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
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  const handleFilterChange = (cat: Category) => {
    setFilter(cat);
    setVisibleCount(TIPS_PER_PAGE);
  };

  const recommendedProducts = useMemo(() => {
    if (!profile) return products;
    return products.filter(p => p.hairTypes.includes(profile.hairLength));
  }, [profile]);

  const handleTipClick = (tip: Tip) => {
    setExpandedId(prev => (prev === tip.id ? null : tip.id));
  };

  const renderTipCard = (tip: Tip) => {
    const isExpanded = expandedId === tip.id;

    return (
      <div
        key={tip.id}
        className={`${styles.tipCard} ${isExpanded ? styles.tipCardExpanded : ''}`}
        onClick={() => handleTipClick(tip)}
      >
        {/* Header */}
        <div
          className={styles.tipHeader}
          style={{ background: categoryColors[tip.category] || categoryColors.care }}
        >
          <span className={styles.tipIcon}>{tip.icon}</span>
          <div className={styles.tipHeaderText}>
            <div className={styles.tipTitle}>{tip.title}</div>
            <div className={styles.tipSubtitle}>{tip.subtitle}</div>
          </div>
          <svg
            className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        {/* Expandable body */}
        {isExpanded && (
          <div className={styles.tipBody} onClick={e => e.stopPropagation()}>
            {/* Steps */}
            <div className={styles.stepsSection}>
              {tip.steps.map((step, i) => (
                <div key={i} className={styles.stepRow}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <span className={styles.stepEmoji}>{step.emoji}</span>
                  <span className={styles.stepText}>{step.text}</span>
                </div>
              ))}
            </div>

            {/* Do / Don't */}
            {(tip.doList || tip.dontList) && (
              <div className={styles.doDontWrap}>
                {tip.doList && (
                  <div className={styles.doSection}>
                    <div className={styles.doLabel}>O 이렇게</div>
                    {tip.doList.map((item, i) => (
                      <div key={i} className={styles.doItem}>{item}</div>
                    ))}
                  </div>
                )}
                {tip.dontList && (
                  <div className={styles.dontSection}>
                    <div className={styles.dontLabel}>X 이건 금지</div>
                    {tip.dontList.map((item, i) => (
                      <div key={i} className={styles.dontItem}>{item}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

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
      <h1 className={styles.pageTitle}>{'\uD83D\uDCA1'} \uD5E4\uC5B4 \uAD00\uB9AC \uD301</h1>

      <div className={styles.searchBar}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="\uAC80\uC0C9\uC5B4\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694"
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
          \uB354\uBCF4\uAE30
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
