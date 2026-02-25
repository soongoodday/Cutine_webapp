import { useNavigate } from 'react-router-dom';
import styles from './PrivacyPage.module.css';

const sections = [
  {
    title: '1. 수집하는 개인정보 항목',
    content:
      'Cutine은 서비스 제공을 위해 아래의 정보를 기기 내(로컬 스토리지)에 저장합니다.\n' +
      '• 닉네임\n' +
      '• 머리 길이 설정\n' +
      '• 커트 주기 및 커트 기록\n' +
      '• 알림 설정 여부\n\n' +
      '별도의 서버 전송이나 외부 수집은 이루어지지 않습니다.',
  },
  {
    title: '2. 개인정보의 수집 및 이용 목적',
    content:
      '• 커트 주기 계산 및 D-Day 알림 제공\n' +
      '• 맞춤 헤어 관리 팁 추천\n' +
      '• 사용자 설정 유지 (닉네임, 머리 길이 등)',
  },
  {
    title: '3. 개인정보의 보관 및 파기',
    content:
      '모든 데이터는 사용자의 기기 내 로컬 스토리지에만 저장되며, ' +
      '외부 서버로 전송되지 않습니다.\n\n' +
      '사용자는 설정 > "데이터 초기화" 기능을 통해 언제든지 ' +
      '모든 데이터를 삭제할 수 있습니다.\n\n' +
      '앱 삭제 또는 브라우저 데이터 삭제 시 모든 정보가 자동으로 파기됩니다.',
  },
  {
    title: '4. 개인정보의 제3자 제공',
    content:
      'Cutine은 사용자의 개인정보를 외부 제3자에게 제공하지 않습니다.',
  },
  {
    title: '5. 미용실 제휴 신청 시 수집 정보',
    content:
      '미용실 제휴 신청 시 아래 정보를 수집합니다.\n' +
      '• 미용실명, 대표자명, 연락처, 주소\n' +
      '• 예약 링크 (선택), 추가 메시지 (선택)\n\n' +
      '해당 정보는 제휴 검토 목적으로만 사용되며, ' +
      '신청 처리 완료 후 별도 보관하지 않습니다.',
  },
  {
    title: '6. 이용자의 권리',
    content:
      '• 언제든지 설정에서 개인정보를 수정할 수 있습니다.\n' +
      '• "데이터 초기화"를 통해 모든 정보를 삭제할 수 있습니다.\n' +
      '• 문의사항은 설정 > 문의하기를 통해 연락해주세요.',
  },
  {
    title: '7. 개인정보처리방침의 변경',
    content:
      '본 방침은 2025년 1월 1일부터 적용됩니다.\n' +
      '방침이 변경될 경우 앱 내 공지를 통해 안내드립니다.',
  },
];

export default function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>&lt;</button>
        <h1 className={styles.headerTitle}>개인정보처리방침</h1>
      </div>

      <div className={styles.body}>
        <p className={styles.intro}>
          Cutine(이하 "서비스")은 이용자의 개인정보를 중요시하며,
          아래와 같이 개인정보처리방침을 공개합니다.
        </p>

        {sections.map((section, i) => (
          <div key={i} className={styles.section}>
            <h2 className={styles.sectionTitle}>{section.title}</h2>
            <p className={styles.sectionContent}>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
