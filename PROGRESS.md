# Cutine PWA 개발 진행 사항

## 프로젝트 개요
- **앱 이름**: Cutine (커타인) - 남성 커트 주기 관리 PWA
- **기술 스택**: React 19 + TypeScript + Vite + Firebase Hosting
- **브랜치**: `claude/github-setup-admin-notes-LkXyr`

---

## 작업 이력

### 1차 작업 - 초기 구축 (`5bfa92d`)
- 프로젝트 초기 셋업 (React + TypeScript + Vite)
- 온보딩, 메인, 기록, 팁, 설정 페이지 기본 구조
- CutContext / UserContext 상태 관리
- useLocalStorage 커스텀 훅
- CSS 변수 디자인 시스템 (variables.css)

### 2차 작업 - 관리자 기능 (`36bff50`)
- 관리자 페이지 메모 기능 추가
- 업데이트 기록 문서 생성

### 3차 작업 - 빌드 설정 (`d6d2b8f`)
- 루트 심볼릭 링크 추가 (빌드 설정 파일)

### 4차 작업 - 권장 주기 데이터 (`b83ce84`)
- 머리 길이별 권장 커트 주기 데이터 구조 (`hairCycle.ts`)
  - 숏컷: 3~5주 / 미디엄: 6~8주 / 롱: 8~12주
- `getCycleRangeText()` 헬퍼 함수

### 5차 작업 - 기록 중복 방지 (`7593735`)
- 커트 기록 중복 방지 로직
- "다른 날짜 선택" 시 D-day 반영

### 6차 작업 - localStorage 정리 (`7452e5b`)
- localStorage 중복 기록 정리
- `replaceLatestRecord` 개선

### 7차 작업 - 전면 개선 (`07bd8ee`)
- D-Day 반영 로직 수정
- 평균 주기 계산 로직
- 팁 탭 썸네일 개선
- 광고 배너 컴포넌트
- 스플래시 화면 전면 개선

### 8차 작업 - YouTube 팁 개선 (`381e832`)
- **문제**: 팁 탭 YouTube 링크가 관련 없는 영상으로 연결
- **해결**:
  - `ytSearch()` 헬퍼 함수 추가 (검색 쿼리 + `sp=EgIQAQ%3D%3D` 비디오 필터)
  - 한국어 헤어 관련 구체적 검색 쿼리로 변경
  - 썸네일에 빨간 "▶ YouTube" 배지 표시
  - "YouTube에서 검색 >" 텍스트로 UI 명확화

### 9차 작업 - D-Day 동기화 버그 수정 (`fab499a`)
- **문제**: 기록 탭에서 추가한 기록이 홈 화면 D-Day에 반영되지 않음
- **원인 분석**:
  1. `useLocalStorage` 훅에서 state updater 내 side effect 문제
  2. CutContext의 derived value (sortedRecords, lastCutDate, averageCycle) 미메모이제이션
  3. "다른 날짜에 했어요"가 오늘 기록을 교체하지 않고 추가만 함
- **해결**:
  - `useLocalStorage.ts`: `useEffect` + `useRef`로 localStorage 동기화 백업
  - `CutContext.tsx`: `useMemo`로 모든 derived value 래핑
  - `MainPage.tsx`: 오늘 빈 기록 제거 후 선택 날짜 추가 로직

### 10차 작업 - 기록 탭 전면 리디자인 (`f472ab9`)
- **디자인 변경 사항**:
  - "나의 커트 캘린더" 헤더 + "커트한 지 N일 지났어요!" 표시
  - iOS 스타일 캘린더 (원형 날짜 마커, SVG 화살표 네비게이션)
  - 이중 마커: 지난 커트일 (회색 #B0BEC5) / 최근 커트일 (코랄 #FF8C42)
  - 머리 길이별 추천 팁 뱃지 (hairCycleData 연동)
  - 과거/최근 커트 범례
  - "저장하기" 코랄 버튼
  - 하단 네비게이션 상단 라운드 처리 (border-radius: 24px)
- **수정 파일**:
  - `Calendar.tsx` / `Calendar.module.css`
  - `RecordPage.tsx` / `RecordPage.module.css`
  - `BottomNav.module.css`

### 11차 작업 - 홈 화면 리디자인 + BottomNav 업데이트 (현재)
- **홈 화면 (MainPage) 전면 리디자인**:
  - "나의 커트 주기" 코랄 헤더 라벨
  - "커트한 지 N일 지났어요!" 타이틀 (N일 하이라이트)
  - D-Day 카드: 큰 D-Day 숫자 + 상태 메시지 + 얼굴 일러스트
    - 여유 있을 때: `face_smile.png` / 급할 때: `face.png`
  - 정보 카드 3열 그리드 (마지막 커트 / 평균 주기 / 권장 주기)
  - "오늘 커트했어요" 코랄 버튼
  - "다른 날짜에 했어요" 텍스트 링크
  - 날짜 선택 바텀시트 모달
- **BottomNav 업데이트**:
  - 5탭 → 4탭으로 변경 (미용실 탭 제거)
  - SVG 아이콘 → 이미지 아이콘으로 변경
    - `home.png`, `calendar.png`, `tip.png`, `setting.png`
  - 활성 탭: 코랄(#FF8C42) 색상 + 아이콘 불투명도 100%
  - 비활성 탭: 회색 + 아이콘 불투명도 45%
- **이미지 파일 배포**:
  - `images/` → `public/images/`로 복사 (Vite 정적 자산 서빙)

---

## 디자인 시스템

### 주요 색상
| 용도 | 색상 코드 |
|------|-----------|
| 메인 액센트 (코랄) | `#FF8C42` |
| 브랜드 기본 | `#6C63FF` |
| 안전 (D-day 여유) | `#4CAF50` |
| 경고 (D-day 가까움) | `#FF9800` |
| 위험 (D-Day) | `#F44336` |
| 배경 | `#F5F5FA` |
| 텍스트 | `#1A1A2E` |
| 팁 뱃지 배경 | `#FFF5ED` |
| 팁 뱃지 테두리 | `#FFE0C2` |
| 과거 커트 마커 | `#B0BEC5` |

### 폰트
- 기본: Pretendard
- 헤더: 22px / 800 weight
- 소제목: 18px / 700 weight
- 본문: 15px / 400 weight

---

## 파일 구조 (주요)
```
src/
├── components/
│   ├── Ad/BannerAd.tsx
│   ├── Calendar/Calendar.tsx, Calendar.module.css
│   └── Layout/
│       ├── BottomNav.tsx, BottomNav.module.css
│       └── PageLayout.tsx
├── context/
│   ├── CutContext.tsx
│   └── UserContext.tsx
├── data/
│   ├── hairCycle.ts
│   └── tips.ts
├── hooks/
│   └── useLocalStorage.ts
├── pages/
│   ├── Main/MainPage.tsx, MainPage.module.css
│   ├── Record/RecordPage.tsx, RecordPage.module.css
│   ├── Tips/TipsPage.tsx, TipsPage.module.css
│   ├── Settings/SettingsPage.tsx
│   ├── Salon/SalonPage.tsx, PartnerPage.tsx
│   ├── Onboarding/OnboardingPage.tsx
│   ├── Splash/SplashPage.tsx
│   └── Admin/AdminPage.tsx
├── styles/variables.css
├── utils/date.ts
└── App.tsx
public/
└── images/
    ├── face.png, face_smile.png
    ├── logo.png, alarm.png
    ├── home.png, calendar.png, tip.png, setting.png
```

---

## 배포 방법
```bash
git pull origin claude/github-setup-admin-notes-LkXyr
npm run build
firebase deploy
```
