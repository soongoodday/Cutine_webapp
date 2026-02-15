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

export function CutProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useLocalStorage<CutRecord[]>('cutine_records', []);

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
      const latestId = sorted[0].id;
      return prev
        .map(r => r.id === latestId ? { ...r, date: newDate } : r)
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
