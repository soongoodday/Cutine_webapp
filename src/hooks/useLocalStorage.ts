import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T, sanitize?: (value: T) => T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return initialValue;
      let parsed = JSON.parse(item) as T;
      if (sanitize) {
        const sanitized = sanitize(parsed);
        if (JSON.stringify(sanitized) !== JSON.stringify(parsed)) {
          localStorage.setItem(key, JSON.stringify(sanitized));
          parsed = sanitized;
        }
      }
      return parsed;
    } catch {
      return initialValue;
    }
  });

  // localStorage 동기화를 useEffect로 분리 (state updater 안에서 side effect 방지)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue(prev => {
      const nextValue = value instanceof Function ? value(prev) : value;
      // 즉시 localStorage에도 반영 (탭 전환 시 데이터 유실 방지)
      try {
        localStorage.setItem(key, JSON.stringify(nextValue));
      } catch {
        // localStorage 쓰기 실패 시 무시 (useEffect에서 재시도)
      }
      return nextValue;
    });
  }, [key]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return [storedValue, setValue];
}
