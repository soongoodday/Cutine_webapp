# Cutine Webapp - 업데이트 기록

## 2026-02-15 | 관리자 메모 기능 추가

### 변경 사항
- **관리자 메모 기능 신규 추가**: 관리자 페이지에 '메모' 탭을 추가하여 자유롭게 메모를 작성하고 관리할 수 있는 기능 구현
  - 메모 작성 (제목 + 내용)
  - 메모 목록 조회
  - 메모 삭제
  - localStorage 기반 데이터 저장
- **업데이트 기록 문서 생성**: 이 파일(`UPDATES.md`)을 생성하여 향후 모든 업데이트 내역을 이어서 기록

### 기술 스택
- React 19 + TypeScript + Vite
- Firebase (Firestore + Hosting)
- CSS Modules + CSS Variables

### 현재 페이지 구성
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | SplashPage | 스플래시 화면 |
| `/onboarding` | OnboardingPage | 사용자 설정 마법사 |
| `/main` | MainPage | D-day 대시보드 |
| `/record` | RecordPage | 커트 기록 캘린더 |
| `/tips` | TipsPage | 헤어 관리 팁 |
| `/salon` | SalonPage | 주변 미용실 찾기 |
| `/salon/partner` | PartnerPage | 제휴 신청 |
| `/settings` | SettingsPage | 설정 |
| `/admin` | AdminPage | 관리자 대시보드 (제휴/예약/메모) |

---

> 이후 업데이트 내용은 이 파일 상단에 이어서 추가됩니다.
