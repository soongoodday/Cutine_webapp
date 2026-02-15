# Cutine - 커트 주기 관리 웹앱 구현 계획서

> 마지막 업데이트: 2026-02-14

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 서비스명 | **Cutine** (커트 + 루틴) |
| 목적 | 커트 주기를 관리하고, 헤어 관련 부가 서비스로 수익을 창출하는 웹앱 |
| 타겟 사용자 | 정기적으로 미용실을 방문하는 20~40대 |
| 플랫폼 | 모바일 웹 (PWA) |

### 핵심 기능 요약

| 구분 | 기능 |
|------|------|
| **코어** | D-day 카운트다운, 커트 기록, 캘린더, 알림, 헤어 팁 |
| **수익화 #1** | 주변 미용실 연결 (제휴/커미션) |
| **수익화 #2** | 헤어 제품 추천 & 커머스 (제휴 링크) |
| **수익화 #3** | 배너 & 네이티브 광고 |

---

## 2. 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| **프레임워크** | React 18 + Vite | 빠른 빌드, PWA 플러그인 지원 |
| **언어** | TypeScript | 타입 안전성, 유지보수 용이 |
| **라우팅** | React Router v6 | SPA 네비게이션 |
| **스타일링** | CSS Modules + CSS Variables | 테마 지원, 스코프 격리 |
| **상태 관리** | React Context + useReducer | 앱 규모에 적합, 외부 의존성 최소화 |
| **백엔드/DB** | Firebase (Auth + Firestore + Hosting) | 서버리스, 실시간 동기화, 무료 티어 |
| **데이터 저장** | Firestore + LocalStorage (캐시) | 클라우드 동기화 + 오프라인 지원 |
| **지도/위치** | Kakao Maps API | 국내 미용실 검색에 최적화 |
| **광고** | Google AdSense / Kakao AdFit | 국내 트래픽 수익화 |
| **배포** | Firebase Hosting | Firebase 통합, HTTPS, CDN |
| **PWA** | vite-plugin-pwa | 오프라인 지원, 홈 화면 추가 |

---

## 3. 프로젝트 구조

```
cutine/
├── public/
│   ├── favicon.ico
│   ├── manifest.json              # PWA 매니페스트
│   └── icons/                     # PWA 아이콘 (192x192, 512x512)
│
├── src/
│   ├── main.tsx                   # 앱 진입점
│   ├── App.tsx                    # 라우터 설정
│   ├── vite-env.d.ts
│   │
│   ├── components/                # 공통 컴포넌트
│   │   ├── Layout/
│   │   │   ├── BottomNav.tsx      # 하단 네비게이션 바
│   │   │   ├── BottomNav.module.css
│   │   │   └── PageLayout.tsx     # 공통 페이지 레이아웃
│   │   ├── Calendar/
│   │   │   ├── Calendar.tsx       # 캘린더 컴포넌트
│   │   │   └── Calendar.module.css
│   │   ├── Ad/
│   │   │   ├── BannerAd.tsx       # 배너 광고 컴포넌트
│   │   │   └── NativeAd.tsx       # 네이티브 광고 컴포넌트
│   │   └── common/
│   │       ├── Button.tsx
│   │       └── Modal.tsx
│   │
│   ├── pages/                     # 페이지 컴포넌트
│   │   ├── Splash/
│   │   │   ├── SplashPage.tsx
│   │   │   └── SplashPage.module.css
│   │   ├── Main/
│   │   │   ├── MainPage.tsx       # D-day 메인 화면
│   │   │   ├── MainPage.module.css
│   │   │   └── DatePickerModal.tsx # 날짜 선택 모달
│   │   ├── Record/
│   │   │   ├── RecordPage.tsx     # 기록 캘린더
│   │   │   └── RecordPage.module.css
│   │   ├── Tips/
│   │   │   ├── TipsPage.tsx       # 헤어 팁 + 제품 추천
│   │   │   ├── TipsPage.module.css
│   │   │   ├── TipCard.tsx        # 팁 영상 카드
│   │   │   └── ProductCard.tsx    # 제품 추천 카드
│   │   ├── Salon/
│   │   │   ├── SalonPage.tsx      # 주변 미용실 지도
│   │   │   ├── SalonPage.module.css
│   │   │   ├── SalonCard.tsx      # 미용실 정보 카드
│   │   │   └── SalonMap.tsx       # 카카오맵 래퍼
│   │   └── Settings/
│   │       ├── SettingsPage.tsx   # 설정 화면
│   │       └── SettingsPage.module.css
│   │
│   ├── context/                   # 전역 상태
│   │   ├── CutContext.tsx         # 커트 기록 상태
│   │   └── UserContext.tsx        # 사용자 설정 상태
│   │
│   ├── hooks/                     # 커스텀 훅
│   │   ├── useDday.ts            # D-day 계산 로직
│   │   ├── useGeolocation.ts     # 위치 정보 훅
│   │   └── useLocalStorage.ts    # LocalStorage 래퍼
│   │
│   ├── firebase/                  # Firebase 설정
│   │   ├── config.ts             # Firebase 초기화
│   │   └── collections.ts       # Firestore 컬렉션 헬퍼
│   │
│   ├── services/                  # 외부 API 연동
│   │   ├── salonApi.ts           # 미용실 검색 API
│   │   ├── partnerApi.ts         # 제휴 신청 API (Firestore)
│   │   ├── productApi.ts         # 제품 추천 데이터
│   │   └── adService.ts          # 광고 로드/관리
│   │
│   ├── data/                      # 정적 데이터
│   │   ├── tips.ts               # 헤어 팁 콘텐츠
│   │   └── products.ts           # 추천 제품 목록
│   │
│   ├── types/                     # 타입 정의
│   │   └── index.ts
│   │
│   ├── utils/                     # 유틸리티
│   │   ├── date.ts               # 날짜 계산 유틸
│   │   └── format.ts             # 포맷팅 유틸
│   │
│   └── styles/                    # 글로벌 스타일
│       ├── global.css
│       └── variables.css          # CSS 변수 (컬러, 폰트 등)
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── .gitignore
```

---

## 4. 데이터 모델

### 4.1 사용자 설정 (UserProfile)

```typescript
interface UserProfile {
  nickname: string;            // 닉네임
  hairLength: 'short' | 'medium' | 'long';  // 머리 길이
  cutCycleDays: number;        // 선호 커트 주기 (일)
  notificationEnabled: boolean;
  notificationDays: number[];  // 알림 시점 (D-3, D-1 등)
  createdAt: string;           // ISO 날짜
}
```

### 4.2 커트 기록 (CutRecord)

```typescript
interface CutRecord {
  id: string;                  // UUID
  date: string;                // ISO 날짜 (YYYY-MM-DD)
  memo?: string;               // 메모 (선택)
  salonName?: string;          // 미용실 이름 (선택)
  cost?: number;               // 비용 (선택)
  createdAt: string;
}
```

### 4.3 미용실 (Salon)

```typescript
interface Salon {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  distance?: number;           // 현재 위치로부터 거리 (m)
  rating?: number;
  imageUrl?: string;
  bookingUrl?: string;         // 예약 링크 (제휴)
  isPartner: boolean;          // 제휴 미용실 여부
}
```

### 4.4 추천 제품 (Product)

```typescript
interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'essence' | 'wax' | 'shampoo' | 'dryer' | 'etc';
  imageUrl: string;
  price: number;
  affiliateUrl: string;        // 제휴 링크 (쿠팡/네이버)
  hairTypes: ('short' | 'medium' | 'long')[];  // 추천 머리 길이
  description: string;
}
```

### 4.5 헤어 팁 (Tip)

```typescript
interface Tip {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;            // 유튜브 링크
  category: 'dry' | 'style' | 'care' | 'etc';
  duration: string;            // 영상 길이 표시
}
```

### 4.6 제휴 신청 (PartnerApplication)

```typescript
interface PartnerApplication {
  id: string;                    // Firestore 문서 ID
  salonName: string;             // 미용실명
  ownerName: string;             // 대표자명
  phone: string;                 // 연락처
  address: string;               // 미용실 주소
  bookingUrl?: string;           // 네이버/카카오 예약 링크
  message?: string;              // 추가 메시지
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  reviewedAt?: Timestamp;
}
```

### 4.7 Firebase Firestore 컬렉션 구조

```
firestore/
├── users/{uid}/                  # 사용자별 데이터
│   ├── profile                   # UserProfile
│   └── cutRecords/{recordId}     # CutRecord (서브컬렉션)
│
├── partnerApplications/{id}      # 제휴 신청 목록
│
├── partnerSalons/{id}            # 승인된 제휴 미용실
│
├── products/{id}                 # 추천 제품 목록
│
└── tips/{id}                     # 헤어 팁 콘텐츠
```

---

## 5. 화면별 상세 설계

### 5.1 스플래시 화면 (`/`)

- 2초간 로고 애니메이션 표시 후 자동 전환
- 첫 방문 사용자 → 온보딩으로 이동
- 기존 사용자 → 메인으로 이동
- 배경: CSS 그라디언트 애니메이션 (영상 대신 경량화)

### 5.2 온보딩 화면 (`/onboarding`) — 신규 추가

디자인에는 없지만 첫 사용자 경험을 위해 추가합니다.

```
[Step 1] 닉네임 입력
[Step 2] 머리 길이 선택 (숏 / 미디엄 / 롱)
[Step 3] 마지막 커트 날짜 선택
[Step 4] 선호 커트 주기 입력 (기본값: 30일)
```

- 프로그레스 바로 단계 표시
- 완료 시 LocalStorage에 저장 후 메인으로 이동

### 5.3 메인 화면 (`/main`)

**핵심 요소:**
- D-day 카운트다운 (큰 숫자, 중앙 배치)
  - D-N: 커트까지 N일 남음 (초록/파랑 톤)
  - D-Day: 오늘이 커트 날 (강조 색상)
  - D+N: 커트일 N일 경과 (주황/빨강 톤으로 변화)
- 캐릭터 일러스트 (머리 길이에 따라 변화)
- **"오늘 커트했어요"** 버튼 → 탭하면 날짜 확인 후 기록 저장
- **"다른 날짜에 했어요"** → 캘린더 모달 오픈
- 하단에 머리 길이 유지 상태 텍스트

**수익화 요소:**
- 하단 배너 광고 (하단 네비게이션 위)
- D-day 당일: "주변 미용실 보기" CTA 버튼 노출

### 5.4 기록 화면 (`/record`)

**핵심 요소:**
- 월별 캘린더 뷰 (좌우 스와이프로 월 이동)
- 커트한 날짜에 가위 마커 표시
- 날짜 탭 시 상세 정보 (미용실, 비용, 메모)
- 커트 기록 추가/수정/삭제
- 통계 요약: 평균 주기, 총 횟수, 월 평균 비용

**수익화 요소:**
- 캘린더 하단 배너 광고

### 5.5 팁 화면 (`/tips`)

**핵심 요소:**
- 카테고리 필터 탭 (전체 / 드라이 / 스타일링 / 케어)
- 팁 영상 카드 리스트 (썸네일 + 제목 + 시간)
- 탭 시 유튜브로 이동 (외부 링크)

**수익화 요소 — 제품 추천 섹션:**
- 팁 카드 사이에 **"추천 제품"** 네이티브 광고 카드 삽입
- 사용자 머리 길이에 맞는 제품 자동 필터링
- 제품 카드 구성: 이미지 + 제품명 + 가격 + "구매하기" 버튼
- "구매하기" 탭 → 쿠팡/네이버 제휴 링크로 이동
- 팁 3개마다 제품 추천 1개 비율로 배치

### 5.6 미용실 화면 (`/salon`) — 신규 추가

하단 네비게이션에 직접 추가하거나, 메인 화면 D-day CTA에서 진입합니다.

**핵심 요소:**
- 상단: 카카오맵 (현재 위치 중심)
- 미용실 마커 표시 (제휴 미용실은 별도 색상)
- 하단: 미용실 리스트 (바텀시트 스와이프)
  - 미용실 이름, 거리, 평점, 전화번호
  - "예약하기" 버튼 (제휴 링크)
  - "전화하기" 버튼
- 검색 & 필터 (거리순, 평점순)

**수익화 구조:**
- 제휴 미용실 상단 노출 (광고 라벨 표시)
- 예약 링크 클릭 시 제휴 트래킹
- 비제휴 미용실도 기본 정보 표시 (카카오 로컬 API)

### 5.7 미용실 제휴 신청 화면 (`/salon/partner`) — 신규 추가

미용실 사장님이 Cutine에 제휴를 신청할 수 있는 폼 화면입니다.

**진입점:**
- 미용실 화면 상단 배너: "미용실 사장님이신가요? 제휴 신청하기"
- 설정 화면: "미용실 제휴 신청" 메뉴

**폼 구성:**
```
[미용실명]          필수 텍스트
[대표자명]          필수 텍스트
[연락처]            필수 전화번호
[미용실 주소]       필수 텍스트 (주소 검색)
[예약 링크]         선택 URL (네이버/카카오 예약)
[추가 메시지]       선택 텍스트
[제출하기] 버튼
```

**처리 흐름:**
```
미용실 사장님 → 폼 작성 → Firestore에 저장 (status: pending)
       ↓
관리자 → Firebase Console에서 확인 → 승인/거절
       ↓
승인 시 → partnerSalons 컬렉션에 추가 → 앱에 자동 반영
```

### 5.8 설정 화면 (`/settings`)

- **프로필 설정**: 닉네임, 머리 길이, 커트 주기
- **알림 설정**: 알림 ON/OFF, 알림 시점 (D-3, D-1, D-Day)
- **앱 정보**: 버전, 이용약관, 개인정보처리방침
- **문의하기**: 이메일 또는 구글 폼 링크
- **데이터 관리**: 내보내기/가져오기, 초기화

---

## 6. 수익화 기능 상세 설계

### 6.1 주변 미용실 연결

```
┌─────────────────────────────────────────┐
│              수익 흐름                    │
│                                         │
│  사용자 → 미용실 검색 → 예약 클릭        │
│                ↓                         │
│         제휴 링크 트래킹                  │
│                ↓                         │
│     예약 완료 시 커미션 발생              │
│         (건당 1,000~3,000원)             │
└─────────────────────────────────────────┘
```

**구현 방식:**
- **카카오 로컬 API** → 키워드 "미용실"로 주변 검색
- 제휴 미용실 데이터는 Firestore `partnerSalons` 컬렉션으로 관리
- 예약 링크에 UTM 파라미터 추가하여 트래킹
- 초기엔 네이버 예약 링크로 연결, 이후 자체 제휴 확대

**API 연동:**
```
GET https://dapi.kakao.com/v2/local/search/keyword.json
  ?query=미용실
  &x={longitude}
  &y={latitude}
  &radius=3000
  &sort=distance
```

### 6.2 헤어 제품 추천 & 커머스

**구현 방식:**
- 초기: 정적 제품 목록 (`data/products.ts`)에 제휴 링크 포함
- 머리 길이별 추천 로직으로 개인화
- 쿠팡 파트너스 API 또는 직접 제휴 링크 사용

**제품 카드 레이아웃:**
```
┌──────────────────────────────┐
│  [이미지]  제품명             │
│           브랜드              │
│           ₩15,900            │
│           ⭐ 4.5             │
│           [구매하기 →]       │
│                    AD 라벨   │
└──────────────────────────────┘
```

**노출 위치:**
- 팁 페이지: 팁 카드 3개마다 1개 삽입
- 메인 페이지: D+0 이후 "커트 후 추천 제품" 섹션
- 기록 페이지: 하단 배너

### 6.3 배너 & 네이티브 광고

**광고 배치 전략:**

| 화면 | 광고 유형 | 위치 | 크기 |
|------|----------|------|------|
| 메인 | 배너 | 하단 (네비 위) | 320x50 |
| 기록 | 배너 | 캘린더 하단 | 320x100 |
| 팁 | 네이티브 | 콘텐츠 사이 | 카드형 |
| 미용실 | 배너 | 리스트 상단 | 320x50 |
| 설정 | 없음 | - | - |

**구현 방식:**
- 카카오 애드핏 SDK 연동 (국내 트래픽 최적화)
- `<BannerAd>` 공통 컴포넌트로 재사용
- `<NativeAd>` 컴포넌트는 주변 콘텐츠와 동일한 스타일
- 광고 로드 실패 시 빈 영역 표시하지 않음 (graceful fallback)
- "광고" 라벨 필수 표시 (법적 요구사항)

---

## 7. 하단 네비게이션 구조

기존 4탭에서 미용실 탭을 추가하여 5탭으로 확장합니다.

```
┌────────┬────────┬────────┬────────┬────────┐
│  홈    │  기록   │ 미용실  │   팁   │  설정   │
│  🏠   │  📅    │  💈    │  💡   │  ⚙️   │
└────────┴────────┴────────┴────────┴────────┘
```

---

## 8. 구현 단계 (Phase)

### Phase 1 — 코어 MVP (1~2주)

> 핵심 기능만으로 동작하는 최소 제품

| 순서 | 작업 | 상세 |
|------|------|------|
| 1-1 | 프로젝트 초기 설정 | Vite + React + TS + PWA 설정 |
| 1-2 | 글로벌 스타일 & 테마 | CSS Variables, 폰트, 컬러 팔레트 |
| 1-3 | 하단 네비게이션 | BottomNav 컴포넌트 + 라우팅 |
| 1-4 | 스플래시 화면 | 로고 애니메이션 + 자동 전환 |
| 1-5 | 온보딩 화면 | 4단계 사용자 정보 입력 |
| 1-6 | 메인 화면 | D-day 카운트다운 + "오늘 커트했어요" 버튼 |
| 1-7 | 기록 화면 | 캘린더 뷰 + 커트 이력 표시 |
| 1-8 | 설정 화면 | 프로필 수정 + 알림 설정 |
| 1-9 | 데이터 저장 | LocalStorage Context 구현 |
| 1-10 | PWA 설정 | manifest.json + 서비스 워커 |

### Phase 2 — 콘텐츠 & 수익화 기반 (1~2주)

> 팁 콘텐츠와 광고 인프라 추가

| 순서 | 작업 | 상세 |
|------|------|------|
| 2-1 | 팁 화면 | 카테고리 필터 + 영상 카드 리스트 |
| 2-2 | 팁 정적 데이터 | 10~15개 유튜브 영상 큐레이션 |
| 2-3 | 배너 광고 컴포넌트 | 카카오 애드핏 연동 |
| 2-4 | 광고 배치 | 메인/기록/팁 화면에 배너 삽입 |
| 2-5 | 제품 추천 카드 | ProductCard 컴포넌트 구현 |
| 2-6 | 제품 정적 데이터 | 10~20개 제품 + 제휴 링크 등록 |
| 2-7 | 네이티브 광고 삽입 | 팁 리스트 사이에 제품 카드 배치 |

### Phase 3 — 미용실 연결 (1~2주)

> 위치 기반 미용실 검색과 제휴 구조

| 순서 | 작업 | 상세 |
|------|------|------|
| 3-1 | 카카오맵 연동 | API 키 발급 + SDK 초기화 |
| 3-2 | 위치 정보 훅 | useGeolocation 구현 |
| 3-3 | 미용실 검색 API | 카카오 로컬 API 연동 |
| 3-4 | 미용실 화면 | 지도 + 리스트 UI |
| 3-5 | 미용실 카드 | 정보 표시 + 예약/전화 버튼 |
| 3-6 | 제휴 미용실 구분 | 파트너 라벨 + 상단 노출 |
| 3-7 | 메인 화면 CTA | D-day에 "주변 미용실 보기" 버튼 |
| 3-8 | 하단 네비 업데이트 | 미용실 탭 추가 (5탭) |

### Phase 4 — 완성도 & 배포 (1주)

> 최종 다듬기와 출시

| 순서 | 작업 | 상세 |
|------|------|------|
| 4-1 | 반응형 점검 | 다양한 모바일 해상도 대응 |
| 4-2 | 애니메이션 | 페이지 전환, 버튼 인터랙션 |
| 4-3 | 에러 처리 | 위치 거부, 네트워크 오류 등 |
| 4-4 | SEO & 메타 | Open Graph, 파비콘, 앱 아이콘 |
| 4-5 | 성능 최적화 | 이미지 최적화, 코드 스플리팅 |
| 4-6 | Vercel 배포 | 도메인 연결 + 환경 변수 설정 |
| 4-7 | 테스트 | 주요 흐름 수동 테스트 + 버그 수정 |

---

## 9. 핵심 로직 설계

### 9.1 D-day 계산

```typescript
function calculateDday(lastCutDate: string, cycleDays: number): number {
  const last = new Date(lastCutDate);
  const nextCut = new Date(last);
  nextCut.setDate(nextCut.getDate() + cycleDays);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextCut.setHours(0, 0, 0, 0);

  const diff = Math.ceil(
    (nextCut.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return diff; // 양수: D-N, 0: D-Day, 음수: D+N
}
```

### 9.2 D-day 상태별 UI

```typescript
function getDdayStatus(dday: number) {
  if (dday > 7)  return { color: 'green',  label: `D-${dday}`,     message: '아직 여유 있어요' };
  if (dday > 3)  return { color: 'blue',   label: `D-${dday}`,     message: '슬슬 준비하세요' };
  if (dday > 0)  return { color: 'orange', label: `D-${dday}`,     message: '커트할 때가 다가오고 있어요' };
  if (dday === 0) return { color: 'red',   label: 'D-Day',          message: '오늘이 커트 날이에요!' };
  return           { color: 'darkred',     label: `D+${Math.abs(dday)}`, message: '커트 예정일이 지났어요' };
}
```

### 9.3 제휴 링크 트래킹

```typescript
function trackAffiliateClick(type: 'salon' | 'product', itemId: string) {
  // 로컬 기록 저장 (분석용)
  const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
  clicks.push({
    type,
    itemId,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));

  // Firebase Analytics로 전송
  logEvent(analytics, 'affiliate_click', { type, itemId });
}
```

### 9.4 미용실 제휴 신청 (Firestore)

```typescript
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

async function submitPartnerApplication(data: {
  salonName: string;
  ownerName: string;
  phone: string;
  address: string;
  bookingUrl?: string;
  message?: string;
}) {
  const docRef = await addDoc(collection(db, 'partnerApplications'), {
    ...data,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}
```

---

## 10. API 키 & 외부 서비스

| 서비스 | 용도 | 발급처 |
|--------|------|--------|
| Kakao Maps JavaScript API | 미용실 지도 | developers.kakao.com |
| Kakao Local API | 미용실 검색 | developers.kakao.com |
| Kakao AdFit | 배너 광고 | adfit.kakao.com |
| 쿠팡 파트너스 | 제품 제휴 링크 | partners.coupang.com |
| Firebase | Auth + Firestore + Hosting | firebase.google.com |

---

## 11. 주의 사항 & 법적 요구사항

- **광고 라벨**: 모든 광고/제휴 콘텐츠에 "광고" 또는 "AD" 라벨 필수
- **위치 정보**: 위치 수집 전 사용자 동의 필요 (브라우저 기본 제공)
- **개인정보처리방침**: LocalStorage에 저장하는 데이터 항목 명시
- **제휴 링크 고지**: 쿠팡 파트너스 등 제휴 관계 표시 의무
- **쿠키 동의**: 광고 SDK 사용 시 쿠키 동의 배너 필요할 수 있음

---

## 12. 시뮬레이션 필수 규칙

> **모든 구현은 반드시 시뮬레이션(검증)을 거친 후에 커밋한다.**

### 12.1 시뮬레이션 체크리스트

모든 기능 구현 또는 수정 후, 아래 항목을 **반드시 순서대로 실행**한다:

| 순서 | 항목 | 명령어 | 통과 기준 |
|------|------|--------|----------|
| 1 | **TypeScript 타입 체크** | `npx tsc --noEmit` | 에러 0건 |
| 2 | **ESLint 검사** | `npx eslint src/` | 에러 0건 |
| 3 | **프로덕션 빌드** | `npx vite build` | 빌드 성공 |
| 4 | **라우트 접근 테스트** | 모든 라우트 HTTP 200 확인 | 전체 통과 |
| 5 | **컴포넌트 포함 검증** | JS 번들에 주요 텍스트 포함 확인 | 전체 통과 |
| 6 | **CSS 변수 참조 검증** | 사용된 var() 변수가 variables.css에 정의되어 있는지 확인 | 미정의 0건 |

### 12.2 시뮬레이션 실행 시점

- **새 페이지/컴포넌트 추가** 후
- **기존 코드 수정** 후
- **의존성(패키지) 추가/변경** 후
- **CSS 변수 추가/변경** 후
- **커밋 직전** (최종 검증)

### 12.3 시뮬레이션 실패 시 대응

1. 에러 내용을 확인하고 즉시 수정
2. 수정 후 체크리스트를 **처음부터 다시 실행**
3. 전체 통과 확인 후에만 커밋 진행
4. 해결 불가능한 경우 이슈로 기록하고 담당자에게 공유
