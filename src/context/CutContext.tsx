import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import type { CutRecord } from '../types';

interface CutContextType {
  records: CutRecord[];
  addRecord: (date: string, memo?: string, salonName?: string, cost?: number) => void;
  replaceLatestRecord: (newDate: string) => void;
  removeRecord: (id: string) => void;
  updateRecord: (id: string, updates: Partial<CutRecord>) => void;
  lastCutDate: string | null;
  averageCycle: number | null;
}

const CutContext = createContext<CutContextType | undefined>(undefined);

function deduplicateRecords(records: CutRecord[]): CutRecord[] {
  const seen = new Map<string, CutRecord>();
  for (const r of records) {
    if (!seen.has(r.date)) {
      seen.set(r.date, r);
    }
  }
  return Array.from(seen.values());
}

export function CutProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useLocalStorage<CutRecord[]>('cutine_records', [], deduplicateRecords);

  const addRecord = useCallback((date: string, memo?: string, salonName?: string, cost?: number) => {
    setRecords(prev => {
      const existing = prev.find(r => r.date === date);
      if (existing) {
        return prev.map(r =>
          r.id === existing.id
            ? { ...r, memo: memo ?? r.memo, salonName: salonName ?? r.salonName, cost: cost ?? r.cost }
            : r
        );
      }
      const newRecord: CutRecord = {
        id: uuidv4(),
        date,
        memo,
        salonName,
        cost,
        createdAt: new Date().toISOString(),
      };
      return [...prev, newRecord].sort((a, b) => b.date.localeCompare(a.date));
    });
  }, [setRecords]);

  const replaceLatestRecord = useCallback((newDate: string) => {
    setRecords(prev => {
      if (prev.length === 0) {
        const newRecord: CutRecord = {
          id: uuidv4(),
          date: newDate,
          createdAt: new Date().toISOString(),
        };
        return [newRecord];
      }
      const sorted = [...prev].sort((a, b) => b.date.localeCompare(a.date));
      const latestDate = sorted[0].date;
      // 최신 날짜의 중복 기록 중 첫 번째만 남기고 날짜 교체, 나머지 중복은 제거
      const latestRecord = sorted[0];
      const others = prev.filter(r => r.id !== latestRecord.id && r.date !== latestDate);
      return [{ ...latestRecord, date: newDate }, ...others]
        .sort((a, b) => b.date.localeCompare(a.date));
    });
  }, [setRecords]);

  const removeRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  }, [setRecords]);

  const updateRecord = useCallback((id: string, updates: Partial<CutRecord>) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, [setRecords]);

  const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const lastCutDate = sortedRecords.length > 0 ? sortedRecords[0].date : null;

  let averageCycle: number | null = null;
  if (sortedRecords.length >= 2) {
    let totalDays = 0;
    for (let i = 0; i < sortedRecords.length - 1; i++) {
      const d1 = new Date(sortedRecords[i].date);
      const d2 = new Date(sortedRecords[i + 1].date);
      totalDays += Math.abs((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
    }
    averageCycle = Math.round(totalDays / (sortedRecords.length - 1));
  }

  return (
    <CutContext.Provider value={{
      records: sortedRecords,
      addRecord,
      replaceLatestRecord,
      removeRecord,
      updateRecord,
      lastCutDate,
      averageCycle,
    }}>
      {children}
    </CutContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCut() {
  const context = useContext(CutContext);
  if (!context) throw new Error('useCut must be used within CutProvider');
  return context;
}
