import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import type { PartnerApplication, AdminMemo } from '../../types';
import styles from './AdminPage.module.css';

const ADMIN_CODE = 'cutine2024';
const MEMO_STORAGE_KEY = 'cutine_admin_memos';

interface Reservation {
  id: string;
  salonId: string;
  salonName: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  memo: string;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [activeTab, setActiveTab] = useState<'partners' | 'reservations' | 'memos'>('partners');
  const [applications, setApplications] = useState<PartnerApplication[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [memos, setMemos] = useState<AdminMemo[]>([]);
  const [memoTitle, setMemoTitle] = useState('');
  const [memoContent, setMemoContent] = useState('');
  const [expandedMemoId, setExpandedMemoId] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated]);

  const loadData = () => {
    const apps = JSON.parse(localStorage.getItem('cutine_partner_applications') || '[]');
    setApplications(apps);
    const res = JSON.parse(localStorage.getItem('cutine_reservations') || '[]');
    setReservations(res);
    const savedMemos = JSON.parse(localStorage.getItem(MEMO_STORAGE_KEY) || '[]');
    setMemos(savedMemos);
  };

  const handleLogin = () => {
    if (codeInput === ADMIN_CODE) {
      setAuthenticated(true);
    } else {
      alert('관리자 코드가 올바르지 않습니다.');
    }
  };

  const updateAppStatus = (id: string, status: 'approved' | 'rejected') => {
    const updated = applications.map(app =>
      app.id === id ? { ...app, status } : app
    );
    setApplications(updated);
    localStorage.setItem('cutine_partner_applications', JSON.stringify(updated));
  };

  const updateResStatus = (id: string, status: string) => {
    const updated = reservations.map(r =>
      r.id === id ? { ...r, status } : r
    );
    setReservations(updated);
    localStorage.setItem('cutine_reservations', JSON.stringify(updated));
  };

  const addMemo = () => {
    if (!memoTitle.trim() && !memoContent.trim()) return;
    const newMemo: AdminMemo = {
      id: uuidv4(),
      title: memoTitle.trim() || '제목 없음',
      content: memoContent.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newMemo, ...memos];
    setMemos(updated);
    localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(updated));
    setMemoTitle('');
    setMemoContent('');
  };

  const deleteMemo = (id: string) => {
    const updated = memos.filter(m => m.id !== id);
    setMemos(updated);
    localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(updated));
    if (expandedMemoId === id) setExpandedMemoId(null);
  };

  const toggleMemo = (id: string) => {
    setExpandedMemoId(prev => (prev === id ? null : id));
  };

  const statusLabel = (status: string) => {
    if (status === 'pending') return '대기중';
    if (status === 'approved') return '승인됨';
    if (status === 'rejected') return '거절됨';
    if (status === 'confirmed') return '확정';
    return status;
  };

  const statusClass = (status: string) => {
    if (status === 'pending') return styles.statusPending;
    if (status === 'approved' || status === 'confirmed') return styles.statusApproved;
    if (status === 'rejected') return styles.statusRejected;
    return '';
  };

  if (!authenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/settings')}>&lt;</button>
          <h1 className={styles.headerTitle}>관리자 페이지</h1>
        </div>
        <div className={styles.loginSection}>
          <div className={styles.loginIcon}>&#128274;</div>
          <h2 className={styles.loginTitle}>관리자 인증</h2>
          <p className={styles.loginDesc}>관리자 코드를 입력해주세요</p>
          <input
            className={styles.loginInput}
            type="password"
            placeholder="관리자 코드"
            value={codeInput}
            onChange={e => setCodeInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
          <button className={styles.loginBtn} onClick={handleLogin}>
            로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/settings')}>&lt;</button>
        <h1 className={styles.headerTitle}>관리자 페이지</h1>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{applications.length}</div>
          <div className={styles.statLabel}>제휴 신청</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{reservations.length}</div>
          <div className={styles.statLabel}>예약 건수</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{memos.length}</div>
          <div className={styles.statLabel}>메모</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>
            {applications.filter(a => a.status === 'pending').length}
          </div>
          <div className={styles.statLabel}>대기중</div>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'partners' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('partners')}
        >
          제휴 ({applications.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'reservations' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          예약 ({reservations.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'memos' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('memos')}
        >
          메모 ({memos.length})
        </button>
      </div>

      {activeTab === 'partners' && (
        <div className={styles.list}>
          {applications.length === 0 ? (
            <div className={styles.emptyState}>아직 제휴 신청이 없습니다.</div>
          ) : (
            applications.map(app => (
              <div key={app.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{app.salonName}</span>
                  <span className={`${styles.statusBadge} ${statusClass(app.status)}`}>
                    {statusLabel(app.status)}
                  </span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>대표자</span>
                  <span>{app.ownerName}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>연락처</span>
                  <span>{app.phone}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>주소</span>
                  <span>{app.address}</span>
                </div>
                {app.bookingUrl && (
                  <div className={styles.cardRow}>
                    <span className={styles.cardLabel}>예약링크</span>
                    <span className={styles.cardLink}>{app.bookingUrl}</span>
                  </div>
                )}
                {app.message && (
                  <div className={styles.cardMessage}>{app.message}</div>
                )}
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>신청일</span>
                  <span>{app.createdAt ? new Date(app.createdAt).toLocaleDateString('ko-KR') : '-'}</span>
                </div>
                {app.status === 'pending' && (
                  <div className={styles.cardActions}>
                    <button
                      className={styles.approveBtn}
                      onClick={() => updateAppStatus(app.id!, 'approved')}
                    >
                      승인
                    </button>
                    <button
                      className={styles.rejectBtn}
                      onClick={() => updateAppStatus(app.id!, 'rejected')}
                    >
                      거절
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className={styles.list}>
          {reservations.length === 0 ? (
            <div className={styles.emptyState}>아직 예약 내역이 없습니다.</div>
          ) : (
            reservations.map(res => (
              <div key={res.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{res.salonName}</span>
                  <span className={`${styles.statusBadge} ${statusClass(res.status)}`}>
                    {statusLabel(res.status)}
                  </span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>예약자</span>
                  <span>{res.name}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>연락처</span>
                  <span>{res.phone}</span>
                </div>
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>날짜/시간</span>
                  <span>{res.date} {res.time}</span>
                </div>
                {res.memo && (
                  <div className={styles.cardMessage}>{res.memo}</div>
                )}
                <div className={styles.cardRow}>
                  <span className={styles.cardLabel}>신청일</span>
                  <span>{new Date(res.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
                {res.status === 'pending' && (
                  <div className={styles.cardActions}>
                    <button
                      className={styles.approveBtn}
                      onClick={() => updateResStatus(res.id, 'confirmed')}
                    >
                      확정
                    </button>
                    <button
                      className={styles.rejectBtn}
                      onClick={() => updateResStatus(res.id, 'rejected')}
                    >
                      거절
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'memos' && (
        <div className={styles.list}>
          <div className={styles.memoForm}>
            <input
              className={styles.memoTitleInput}
              type="text"
              placeholder="메모 제목"
              value={memoTitle}
              onChange={e => setMemoTitle(e.target.value)}
            />
            <textarea
              className={styles.memoTextarea}
              placeholder="메모 내용을 입력하세요..."
              value={memoContent}
              onChange={e => setMemoContent(e.target.value)}
              rows={4}
            />
            <button
              className={styles.memoAddBtn}
              onClick={addMemo}
              disabled={!memoTitle.trim() && !memoContent.trim()}
            >
              메모 저장
            </button>
          </div>

          {memos.length === 0 ? (
            <div className={styles.emptyState}>작성된 메모가 없습니다.</div>
          ) : (
            memos.map(memo => (
              <div
                key={memo.id}
                className={`${styles.card} ${styles.memoCard}`}
                onClick={() => toggleMemo(memo.id)}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardTitle}>{memo.title}</span>
                  <span className={styles.memoDate}>
                    {new Date(memo.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                {expandedMemoId === memo.id ? (
                  <>
                    <div className={styles.memoContent}>{memo.content}</div>
                    <div className={styles.memoActions}>
                      <button
                        className={styles.memoDeleteBtn}
                        onClick={e => {
                          e.stopPropagation();
                          deleteMemo(memo.id);
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </>
                ) : (
                  memo.content && (
                    <div className={styles.memoPreview}>
                      {memo.content.length > 50
                        ? memo.content.slice(0, 50) + '...'
                        : memo.content}
                    </div>
                  )
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
