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

// 데이터에서 고유 태그 자동 추출
const allTags = Array.from(new Set(tips.flatMap(t => t.tags)));

export default function TipsPage() {
  const [filter, setFilter] = useState<Category>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(TIPS_PER_PAGE);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTips = useMemo(() => {
    return tips.filter(t => {
      const matchCategory = filter === 'all' || t.category === filter;
      const matchTag = !activeTag || t.tags.includes(activeTag);
      const matchSearch = search === '' || t.title.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchTag && matchSearch;
    });
  }, [filter, activeTag, search]);

  const visibleTips = filteredTips.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTips.length;

  // 현재 카테고리 필터에 해당하는 태그만 표시
  const visibleTags = useMemo(() => {
    if (filter === 'all') return allTags;
    const filtered = tips.filter(t => t.category === filter);
    return Array.from(new Set(filtered.flatMap(t => t.tags)));
  }, [filter]);

  const handleFilterChange = (cat: Category) => {
    setFilter(cat);
    setActiveTag(null);
    setVisibleCount(TIPS_PER_PAGE);
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(prev => (prev === tag ? null : tag));
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
          <span className={styles.tipIcon}>{tip.icon}</span>
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
      <h1 className={styles.pageTitle}>{'💡'} 헤어 관리 팁</h1>

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
      </div>

      {/* 해시태그 */}
      <div className={styles.tagRow}>
        {visibleTags.map(tag => (
          <button
            key={tag}
            className={`${styles.tagBtn} ${activeTag === tag ? styles.tagActive : ''}`}
            onClick={() => handleTagClick(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {visibleTips.map(tip => renderTipCard(tip))}
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
    </div>
  );
}
