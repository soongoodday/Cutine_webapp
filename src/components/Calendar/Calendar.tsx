import { useState } from 'react';
import { getDaysInMonth, getFirstDayOfMonth, toDateString } from '../../utils/date';
import styles from './Calendar.module.css';

interface CalendarProps {
  cutDates: string[];
  latestCutDate?: string | null;
  selectedDate?: string | null;
  onDateSelect?: (date: string) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar({ cutDates, latestCutDate, selectedDate, onDateSelect }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = toDateString(today);

  const goPrev = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const goNext = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button className={styles.navBtn} onClick={goPrev}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 14L6 9L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className={styles.monthTitle}>{month + 1}월 {year}</span>
        <button className={styles.navBtn} onClick={goNext}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map((d, i) => (
          <span key={d} className={`${styles.weekday} ${i === 0 ? styles.sundayLabel : ''}`}>{d}</span>
        ))}
      </div>

      <div className={styles.days}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className={styles.dayCell} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const isLatestCut = dateStr === latestCutDate;
          const isPastCut = cutDates.includes(dateStr) && !isLatestCut;
          const isSelected = dateStr === selectedDate;
          const isSunday = (firstDay + i) % 7 === 0;

          const classes = [
            styles.dayCell,
            styles.dayBtn,
            isToday ? styles.today : '',
            isLatestCut ? styles.latestCut : '',
            isPastCut ? styles.pastCut : '',
            isSelected ? styles.selected : '',
            isSunday ? styles.sundayDay : '',
          ].filter(Boolean).join(' ');

          return (
            <button key={day} className={classes} onClick={() => onDateSelect?.(dateStr)}>
              <span className={styles.dayNum}>{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
