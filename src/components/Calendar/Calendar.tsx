import { useState } from 'react';
import { getDaysInMonth, getFirstDayOfMonth, toDateString } from '../../utils/date';
import styles from './Calendar.module.css';

interface CalendarProps {
  cutDates: string[];
  selectedDate?: string | null;
  onDateSelect?: (date: string) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Calendar({ cutDates, selectedDate, onDateSelect }: CalendarProps) {
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
        <button className={styles.navBtn} onClick={goPrev}>&lt;</button>
        <span className={styles.monthTitle}>{year}년 {month + 1}월</span>
        <button className={styles.navBtn} onClick={goNext}>&gt;</button>
      </div>

      <div className={styles.weekdays}>
        {WEEKDAYS.map(d => (
          <span key={d} className={styles.weekday}>{d}</span>
        ))}
      </div>

      <div className={styles.days}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className={`${styles.day} ${styles.empty}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = dateStr === todayStr;
          const hasCut = cutDates.includes(dateStr);
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={day}
              className={`${styles.day} ${isToday ? styles.today : ''} ${hasCut ? styles.hasCut : ''} ${isSelected ? styles.selected : ''}`}
              onClick={() => onDateSelect?.(dateStr)}
            >
              {day}
              {hasCut && <span className={styles.cutMarker}>&#9986;</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
