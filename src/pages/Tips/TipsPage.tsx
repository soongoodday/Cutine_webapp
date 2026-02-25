import { useState, useMemo } from 'react';
import { tips } from '../../data/tips';
import type { Tip } from '../../types';
import styles from './TipsPage.module.css';

type Category = 'all' | Tip['category'];

const TIPS_PER_PAGE = 4;

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'dry', label: '드라이' },
  { value: 'style', label: '스타일링' },
  { value: 'care', label: '케어' },
];

const tipIconPaths: Record<string, JSX.Element> = {
  wind: (
    <>
      <path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </>
  ),
  arrowUp: (
    <>
      <polyline points="17 11 12 6 7 11" />
      <polyline points="17 18 12 13 7 18" />
    </>
  ),
  tube: (
    <>
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M7 6h10v12a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4V6z" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </>
  ),
  wave: (
    <>
      <path d="M2 7c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
      <path d="M2 17c2-4 4-4 6 0s4 4 6 0 4-4 6 0" />
    </>
  ),
  bubbles: (
    <>
      <circle cx="9" cy="13" r="5" />
      <circle cx="16" cy="7" r="3.5" />
      <circle cx="17" cy="16" r="2.5" />
    </>
  ),
  leaf: (
    <>
      <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 17 3.5s1.5 2.5-.5 6.3A7 7 0 0 1 11 20z" />
      <path d="M11 20V10" />
    </>
  ),
  droplet: (
    <>
      <path d="M12 2.7c-3.5 4.7-7 8.1-7 11.8a7 7 0 0 0 14 0c0-3.7-3.5-7.1-7-11.8z" />
    </>
  ),
};

export default function TipsPage() {
  const [filter, setFilter] = useState<Category>('all');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(TIPS_PER_PAGE);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTips = useMemo(() => {
    return tips.filter(t => {
      const matchCategory = filter === 'all' || t.category === filter;
      const matchSearch = search === '' || t.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [filter, search]);

  const visibleTips = filteredTips.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTips.length;

  const handleFilterChange = (cat: Category) => {
    setFilter(cat);
    setVisibleCount(TIPS_PER_PAGE);
  };

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
        <div className={`${styles.tipHeader} ${styles[`tipHeader_${tip.category}`]}`}>
          <div className={`${styles.tipIconBadge} ${styles[`tipIconBadge_${tip.category}`]}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              {tipIconPaths[tip.icon]}
            </svg>
          </div>
          <div className={styles.tipHeaderText}>
            <div className={styles.tipTitle}>{tip.title}</div>
            <div className={styles.tipSubtitle}>{tip.subtitle}</div>
          </div>
          <svg
            className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
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

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>헤어 관리 팁</h1>

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

      <div className={styles.list}>
        {visibleTips.map(tip => renderTipCard(tip))}
      </div>

      <div className={styles.loadMoreRow}>
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
        {visibleCount > TIPS_PER_PAGE && (
          <button
            className={styles.loadMoreBtn}
            onClick={() => setVisibleCount(TIPS_PER_PAGE)}
          >
            접기
            <svg className={styles.loadMoreIconFlip} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
