import type { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface PageLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export default function PageLayout({ children, hideNav }: PageLayoutProps) {
  return (
    <div style={{ paddingBottom: hideNav ? 0 : 'var(--bottom-nav-height)' }}>
      {children}
      {!hideNav && <BottomNav />}
    </div>
  );
}
