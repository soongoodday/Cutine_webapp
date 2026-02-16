import { createContext, useContext, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import type { CutRecord } from '../types';

interface CutContextType {
  records: CutRecord[];
  addRecord: (date: string, memo?: string, salonName?: string, cost?: number) => void;
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

  const removeRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  }, [setRecords]);

  const updateRecord = useCallback((id: string, updates: Partial<CutRecord>) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  }, [setRecords]);

  const sortedRecords = useMemo(
    () => [...records].sort((a, b) => b.date.localeCompare(a.date)),
    [records]
  );

  const lastCutDate = useMemo(
    () => sortedRecords.length > 0 ? sortedRecords[0].date : null,
    [sortedRecords]
  );

  const averageCycle = useMemo(() => {
    if (sortedRecords.length >= 2) {
      const first = new Date(sortedRecords[sortedRecords.length - 1].date);
      const last = new Date(sortedRecords[0].date);
      const totalDays = Math.abs((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
      return Math.round(totalDays / (sortedRecords.length - 1));
    }
    return null;
  }, [sortedRecords]);

  const contextValue = useMemo(() => ({
    records: sortedRecords,
    addRecord,
    removeRecord,
    updateRecord,
    lastCutDate,
    averageCycle,
  }), [sortedRecords, addRecord, removeRecord, updateRecord, lastCutDate, averageCycle]);

  return (
    <CutContext.Provider value={contextValue}>
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
