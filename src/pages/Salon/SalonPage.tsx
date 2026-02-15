import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerAd from '../../components/Ad/BannerAd';
import type { Salon } from '../../types';
import styles from './SalonPage.module.css';

declare global {
  interface Window {
    kakao: any;
  }
}

// 데모 데이터 (실제 배포 시 카카오 로컬 API + Firestore 제휴 데이터로 교체)
const demoSalons: Salon[] = [
  {
    id: 's1',
    name: '블루클럽 강남점',
    address: '서울 강남구 역삼동 123-45',
    phone: '02-1234-5678',
    lat: 37.4979,
    lng: 127.0276,
    distance: 350,
    rating: 4.5,
    isPartner: true,
  },
  {
    id: 's2',
    name: '리안헤어 선릉점',
    address: '서울 강남구 선릉로 67길 12',
    phone: '02-9876-5432',
    lat: 37.5045,
    lng: 127.0489,
    distance: 820,
    rating: 4.2,
    isPartner: false,
  },
  {
    id: 's3',
    name: '준오헤어 역삼점',
    address: '서울 강남구 테헤란로 152',
    phone: '02-5555-1234',
    lat: 37.5012,
    lng: 127.0396,
    distance: 1200,
    rating: 4.7,
    isPartner: true,
  },
  {
    id: 's4',
    name: '이철헤어커커 삼성점',
    address: '서울 강남구 삼성로 321',
    phone: '02-3333-4444',
    lat: 37.5089,
    lng: 127.0620,
    distance: 1500,
    rating: 4.0,
    isPartner: false,
  },
];

export default function SalonPage() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [salons] = useState<Salon[]>(
    [...demoSalons].sort((a, b) => {
      if (a.isPartner && !b.isPartner) return -1;
      if (!a.isPartner && b.isPartner) return 1;
      return (a.distance || 0) - (b.distance || 0);
    })
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      if (!mapRef.current) return;
      const center = new window.kakao.maps.LatLng(37.5012, 127.0396);
      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 5,
      });

      salons.forEach((salon) => {
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(salon.lat, salon.lng),
          map,
        });

        const infoContent = `<div style="padding:4px 8px;font-size:12px;white-space:nowrap;">${salon.name}${salon.isPartner ? ' <span style="color:#6C63FF;font-weight:700;">[제휴]</span>' : ''}</div>`;
        const infowindow = new window.kakao.maps.InfoWindow({ content: infoContent });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          infowindow.open(map, marker);
        });
      });
    };

    // SDK가 이미 로드된 경우
    if (window.kakao?.maps) {
      window.kakao.maps.load(initMap);
      return;
    }

    // SDK가 아직 로드되지 않은 경우 대기
    const checkKakao = setInterval(() => {
      if (window.kakao?.maps) {
        clearInterval(checkKakao);
        window.kakao.maps.load(initMap);
      }
    }, 300);

    return () => clearInterval(checkKakao);
  }, [salons]);

  const [bookingSalon, setBookingSalon] = useState<Salon | null>(null);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', date: '', time: '', memo: '' });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleBookClick = (salon: Salon) => {
    const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
    clicks.push({ type: 'salon', itemId: salon.id, timestamp: new Date().toISOString() });
    localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));
    setBookingSalon(salon);
    setBookingForm({ name: '', phone: '', date: '', time: '', memo: '' });
    setBookingSubmitted(false);
  };

  const handleBookingSubmit = () => {
    if (!bookingSalon) return;
    const reservations = JSON.parse(localStorage.getItem('cutine_reservations') || '[]');
    reservations.push({
      id: `res_${Date.now()}`,
      salonId: bookingSalon.id,
      salonName: bookingSalon.name,
      ...bookingForm,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('cutine_reservations', JSON.stringify(reservations));
    setBookingSubmitted(true);
  };

  const isBookingValid = bookingForm.name && bookingForm.phone && bookingForm.date && bookingForm.time;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>&#128136; 주변 미용실</h1>
      </div>

      <div className={styles.partnerBanner} onClick={() => navigate('/salon/partner')}>
        <span className={styles.partnerBannerText}>
          미용실 사장님이신가요? 제휴 신청하기
        </span>
        <span className={styles.partnerBannerArrow}>&rarr;</span>
      </div>

      <div ref={mapRef} className={styles.mapContainer} />

      <BannerAd />

      <div className={styles.salonList}>
        {salons.map(salon => (
          <div key={salon.id} className={styles.salonCard}>
            {salon.isPartner && <span className={styles.partnerBadge}>제휴</span>}
            <div className={styles.salonName}>{salon.name}</div>
            <div className={styles.salonAddress}>{salon.address}</div>
            <div className={styles.salonMeta}>
              {salon.distance && <span>&#128205; {salon.distance >= 1000 ? `${(salon.distance / 1000).toFixed(1)}km` : `${salon.distance}m`}</span>}
              {salon.rating && <span>&#11088; {salon.rating}</span>}
            </div>
            <div className={styles.salonActions}>
              <button className={styles.btnCall} onClick={() => handleCall(salon.phone)}>
                &#128222; 전화
              </button>
              <button className={styles.btnBook} onClick={() => handleBookClick(salon)}>
                예약하기
              </button>
            </div>
          </div>
        ))}
      </div>

      {bookingSalon && (
        <div className={styles.bookingModal} onClick={() => setBookingSalon(null)}>
          <div className={styles.bookingModalContent} onClick={e => e.stopPropagation()}>
            {bookingSubmitted ? (
              <div className={styles.bookingSuccess}>
                <div className={styles.bookingSuccessIcon}>&#9989;</div>
                <h3 className={styles.bookingSuccessTitle}>예약 신청 완료!</h3>
                <p className={styles.bookingSuccessDesc}>
                  <strong>{bookingSalon.name}</strong>에<br />
                  예약 신청이 접수되었습니다.<br />
                  미용실에서 확인 후 연락드립니다.
                </p>
                <button className={styles.bookingCloseBtn} onClick={() => setBookingSalon(null)}>
                  닫기
                </button>
              </div>
            ) : (
              <>
                <h3 className={styles.bookingModalTitle}>
                  {bookingSalon.name} 예약
                </h3>
                <div className={styles.bookingField}>
                  <label className={styles.bookingLabel}>이름 <span className={styles.bookingRequired}>*</span></label>
                  <input
                    className={styles.bookingInput}
                    placeholder="홍길동"
                    value={bookingForm.name}
                    onChange={e => setBookingForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className={styles.bookingField}>
                  <label className={styles.bookingLabel}>연락처 <span className={styles.bookingRequired}>*</span></label>
                  <input
                    className={styles.bookingInput}
                    type="tel"
                    placeholder="010-0000-0000"
                    value={bookingForm.phone}
                    onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))}
                  />
                </div>
                <div className={styles.bookingField}>
                  <label className={styles.bookingLabel}>날짜 <span className={styles.bookingRequired}>*</span></label>
                  <input
                    className={styles.bookingInput}
                    type="date"
                    value={bookingForm.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))}
                  />
                </div>
                <div className={styles.bookingField}>
                  <label className={styles.bookingLabel}>시간 <span className={styles.bookingRequired}>*</span></label>
                  <input
                    className={styles.bookingInput}
                    type="time"
                    value={bookingForm.time}
                    onChange={e => setBookingForm(p => ({ ...p, time: e.target.value }))}
                  />
                </div>
                <div className={styles.bookingField}>
                  <label className={styles.bookingLabel}>요청사항 (선택)</label>
                  <textarea
                    className={styles.bookingTextarea}
                    placeholder="원하는 스타일, 담당 디자이너 등"
                    value={bookingForm.memo}
                    onChange={e => setBookingForm(p => ({ ...p, memo: e.target.value }))}
                  />
                </div>
                <div className={styles.bookingActions}>
                  <button className={styles.bookingCancelBtn} onClick={() => setBookingSalon(null)}>취소</button>
                  <button
                    className={styles.bookingSubmitBtn}
                    disabled={!isBookingValid}
                    onClick={handleBookingSubmit}
                  >
                    예약 신청
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
