import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Salon } from '../../types';
import styles from './SalonPage.module.css';

declare global {
  interface Window {
    kakao: any;
  }
}

type LocationState = 'loading' | 'granted' | 'denied' | 'error';

function getDistanceFromLatLng(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function SalonPage() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const myMarkerRef = useRef<any>(null);

  const [salons, setSalons] = useState<Salon[]>([]);
  const [locationState, setLocationState] = useState<LocationState>('loading');
  const [myLat, setMyLat] = useState<number | null>(null);
  const [myLng, setMyLng] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const paginationRef = useRef<any>(null);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeKeyword, setActiveKeyword] = useState('미용실');

  const [bookingSalon, setBookingSalon] = useState<Salon | null>(null);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', date: '', time: '', memo: '' });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  // 카카오맵 초기화
  const initMap = useCallback((lat: number, lng: number) => {
    if (!mapRef.current || !window.kakao?.maps) return;

    const center = new window.kakao.maps.LatLng(lat, lng);
    const map = new window.kakao.maps.Map(mapRef.current, {
      center,
      level: 4,
    });
    mapInstanceRef.current = map;

    // 내 위치 마커
    const myMarkerImage = new window.kakao.maps.MarkerImage(
      'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
      new window.kakao.maps.Size(24, 35)
    );
    const myMarker = new window.kakao.maps.Marker({
      position: center,
      map,
      image: myMarkerImage,
      zIndex: 10,
    });
    myMarkerRef.current = myMarker;

    const myInfoContent = '<div style="padding:4px 8px;font-size:12px;white-space:nowrap;font-weight:700;color:#6C63FF;">내 위치</div>';
    const myInfoWindow = new window.kakao.maps.InfoWindow({ content: myInfoContent });
    myInfoWindow.open(map, myMarker);

    return map;
  }, []);

  // 미용실 검색
  const searchSalons = useCallback((map: any, lat: number, lng: number, keyword = '미용실') => {
    if (!window.kakao?.maps?.services) return;

    setIsSearching(true);
    setSalons([]);
    setHasMore(false);

    // 기존 마커 제거
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];

    const ps = new window.kakao.maps.services.Places();
    const location = new window.kakao.maps.LatLng(lat, lng);

    ps.keywordSearch(
      keyword,
      (data: any[], status: any, pagination: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const newSalons: Salon[] = data.map((place: any) => {
            const placeLat = parseFloat(place.y);
            const placeLng = parseFloat(place.x);
            const distance = getDistanceFromLatLng(lat, lng, placeLat, placeLng);

            return {
              id: place.id,
              name: place.place_name,
              address: place.road_address_name || place.address_name,
              phone: place.phone || '',
              lat: placeLat,
              lng: placeLng,
              distance,
              rating: undefined,
              isPartner: false,
            };
          });

          // 거리 순 정렬
          newSalons.sort((a, b) => (a.distance || 0) - (b.distance || 0));

          setSalons(prev => {
            const existingIds = new Set(prev.map(s => s.id));
            const unique = newSalons.filter(s => !existingIds.has(s.id));
            return [...prev, ...unique].sort((a, b) => (a.distance || 0) - (b.distance || 0));
          });

          // 마커 추가
          newSalons.forEach(salon => {
            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(salon.lat, salon.lng),
              map,
            });

            const infoContent = `<div style="padding:4px 8px;font-size:12px;white-space:nowrap;">${salon.name}</div>`;
            const infowindow = new window.kakao.maps.InfoWindow({ content: infoContent });

            window.kakao.maps.event.addListener(marker, 'click', () => {
              infowindow.open(map, marker);
            });

            markersRef.current.push(marker);
          });

          paginationRef.current = pagination;
          setHasMore(pagination.hasNextPage);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          setSalons([]);
        }
        setIsSearching(false);
      },
      {
        location,
        radius: 5000,
        sort: window.kakao.maps.services.SortBy.DISTANCE,
        size: 15,
      }
    );
  }, []);

  // 더보기
  const loadMore = useCallback(() => {
    if (!paginationRef.current?.hasNextPage) return;
    setIsSearching(true);
    paginationRef.current.nextPage();
  }, []);

  // 위치 가져오기
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationState('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyLat(pos.coords.latitude);
        setMyLng(pos.coords.longitude);
        setLocationState('granted');
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationState('denied');
        } else {
          setLocationState('error');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // 맵 + 검색 초기화
  useEffect(() => {
    if (locationState !== 'granted' || myLat === null || myLng === null) return;
    if (!mapRef.current) return;

    const startMap = () => {
      if (!window.kakao?.maps) return;
      window.kakao.maps.load(() => {
        const map = initMap(myLat, myLng);
        if (map) searchSalons(map, myLat, myLng);
      });
    };

    if (window.kakao?.maps) {
      startMap();
    } else {
      const checkKakao = setInterval(() => {
        if (window.kakao?.maps) {
          clearInterval(checkKakao);
          startMap();
        }
      }, 300);
      return () => clearInterval(checkKakao);
    }
  }, [locationState, myLat, myLng, initMap, searchSalons]);

  // 현재 위치로 재검색
  const handleRelocate = () => {
    if (!navigator.geolocation) return;

    setLocationState('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMyLat(lat);
        setMyLng(lng);
        setLocationState('granted');

        if (mapInstanceRef.current) {
          const newCenter = new window.kakao.maps.LatLng(lat, lng);
          mapInstanceRef.current.setCenter(newCenter);
          if (myMarkerRef.current) {
            myMarkerRef.current.setPosition(newCenter);
          }
          searchSalons(mapInstanceRef.current, lat, lng);
        }
      },
      () => setLocationState('error'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // 키워드 검색
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (myLat === null || myLng === null || !mapInstanceRef.current) return;

    const keyword = searchKeyword.trim();
    const finalKeyword = keyword ? `${keyword} 미용실` : '미용실';
    setActiveKeyword(finalKeyword);
    searchSalons(mapInstanceRef.current, myLat, myLng, finalKeyword);
  };

  const handleCall = (phone: string) => {
    if (!phone) return;
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
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <h1 className={styles.pageTitle}>주변 미용실</h1>
        <div className={styles.headerSpacer} />
      </div>

      <div className={styles.partnerBanner} onClick={() => navigate('/salon/partner')}>
        <span className={styles.partnerBannerText}>
          미용실 사장님이신가요? 제휴 신청하기
        </span>
        <span className={styles.partnerBannerArrow}>&rarr;</span>
      </div>

      {/* 위치 권한 거부 / 에러 안내 */}
      {(locationState === 'denied' || locationState === 'error') && (
        <div className={styles.locationNotice}>
          <div className={styles.locationNoticeIcon}>
            {locationState === 'denied' ? '\uD83D\uDCCD' : '\u26A0\uFE0F'}
          </div>
          <p className={styles.locationNoticeText}>
            {locationState === 'denied'
              ? '위치 권한이 필요합니다.\n브라우저 설정에서 위치 권한을 허용해주세요.'
              : '위치 정보를 가져올 수 없습니다.\n다시 시도해주세요.'}
          </p>
          <button className={styles.locationBtn} onClick={handleRelocate}>
            위치 다시 가져오기
          </button>
        </div>
      )}

      {/* 로딩 중 */}
      {locationState === 'loading' && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>현재 위치를 확인하고 있어요...</p>
        </div>
      )}

      {/* 지도 */}
      <div
        ref={mapRef}
        className={styles.mapContainer}
        style={{ display: locationState === 'granted' ? 'block' : 'none' }}
      />

      {/* 검색 + 내 위치 버튼 */}
      {locationState === 'granted' && (
        <div className={styles.searchArea}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="미용실 이름, 지역명으로 검색"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
            />
            {searchKeyword && (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => {
                  setSearchKeyword('');
                  if (myLat !== null && myLng !== null && mapInstanceRef.current) {
                    setActiveKeyword('미용실');
                    searchSalons(mapInstanceRef.current, myLat, myLng, '미용실');
                  }
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button type="submit" className={styles.searchBtn}>검색</button>
          </form>
          <button className={styles.relocateBtn} onClick={handleRelocate}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
            내 위치
          </button>
        </div>
      )}

      {/* 검색 중 */}
      {isSearching && salons.length === 0 && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>주변 미용실을 찾고 있어요...</p>
        </div>
      )}

      {/* 결과 없음 */}
      {locationState === 'granted' && !isSearching && salons.length === 0 && (
        <div className={styles.emptyState}>
          <p>주변에 미용실을 찾지 못했어요.</p>
          <button className={styles.locationBtn} onClick={handleRelocate}>
            다시 검색하기
          </button>
        </div>
      )}

      {/* 미용실 목록 */}
      {salons.length > 0 && (
        <div className={styles.salonList}>
          <div className={styles.salonCount}>
            {activeKeyword !== '미용실'
              ? <>&ldquo;{activeKeyword.replace(' 미용실', '')}&rdquo; 검색 결과 <strong>{salons.length}</strong>곳</>
              : <>주변 미용실 <strong>{salons.length}</strong>곳</>
            }
          </div>
          {salons.map(salon => (
            <div key={salon.id} className={styles.salonCard}>
              {salon.isPartner && <span className={styles.partnerBadge}>제휴</span>}
              <div className={styles.salonName}>{salon.name}</div>
              <div className={styles.salonAddress}>{salon.address}</div>
              <div className={styles.salonMeta}>
                {salon.distance != null && (
                  <span>
                    &#128205; {salon.distance >= 1000 ? `${(salon.distance / 1000).toFixed(1)}km` : `${salon.distance}m`}
                  </span>
                )}
                {salon.phone && <span>&#128222; {salon.phone}</span>}
              </div>
              <div className={styles.salonActions}>
                {salon.phone && (
                  <button className={styles.btnCall} onClick={() => handleCall(salon.phone)}>
                    &#128222; 전화
                  </button>
                )}
                <button className={styles.btnBook} onClick={() => handleBookClick(salon)}>
                  예약하기
                </button>
              </div>
            </div>
          ))}

          {hasMore && (
            <button className={styles.loadMoreBtn} onClick={loadMore} disabled={isSearching}>
              {isSearching ? '불러오는 중...' : '더 많은 미용실 보기'}
            </button>
          )}
        </div>
      )}

      {/* 예약 모달 */}
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
