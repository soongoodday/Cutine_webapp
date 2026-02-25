import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitPartnerApplication } from '../../services/partnerApi';
import styles from './PartnerPage.module.css';

export default function PartnerPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    salonName: '',
    ownerName: '',
    phone: '',
    address: '',
    bookingUrl: '',
    message: '',
  });

  const isValid = form.salonName && form.ownerName && form.phone && form.address;

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    try {
      await submitPartnerApplication(form);
      setSubmitted(true);
    } catch {
      alert('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>&lt;</button>
          <h1 className={styles.headerTitle}>제휴 신청</h1>
        </div>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>&#9989;</div>
          <h2 className={styles.successTitle}>신청이 완료되었습니다!</h2>
          <p className={styles.successDesc}>
            검토 후 연락드리겠습니다.<br />
            보통 1~3 영업일 내에 답변을 드립니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>&lt;</button>
        <h1 className={styles.headerTitle}>미용실 제휴 신청</h1>
      </div>

      <div className={styles.heroSection}>
        <h2 className={styles.heroTitle}>Cutine 파트너가 되어보세요</h2>
        <p className={styles.heroDesc}>
          매달 수천 명의 사용자에게<br />
          우리 미용실을 홍보할 수 있습니다
        </p>
      </div>

      <div className={styles.benefits}>
        <div className={styles.benefitCard}>
          <div className={styles.benefitIcon}>&#128200;</div>
          <div className={styles.benefitTitle}>노출 증가</div>
          <div className={styles.benefitDesc}>검색 결과 상단 노출</div>
        </div>
        <div className={styles.benefitCard}>
          <div className={styles.benefitIcon}>&#128197;</div>
          <div className={styles.benefitTitle}>예약 연결</div>
          <div className={styles.benefitDesc}>원클릭 예약 버튼</div>
        </div>
        <div className={styles.benefitCard}>
          <div className={styles.benefitIcon}>&#127775;</div>
          <div className={styles.benefitTitle}>제휴 배지</div>
          <div className={styles.benefitDesc}>신뢰도 UP</div>
        </div>
      </div>

      <div className={styles.form}>
        <h3 className={styles.formTitle}>신청 정보</h3>

        <div>
          <div className={styles.fieldLabel}>미용실명 <span className={styles.fieldRequired}>*</span></div>
          <input className={styles.fieldInput} placeholder="미용실 이름" value={form.salonName} onChange={e => updateField('salonName', e.target.value)} />
        </div>

        <div>
          <div className={styles.fieldLabel}>대표자명 <span className={styles.fieldRequired}>*</span></div>
          <input className={styles.fieldInput} placeholder="이름" value={form.ownerName} onChange={e => updateField('ownerName', e.target.value)} />
        </div>

        <div>
          <div className={styles.fieldLabel}>연락처 <span className={styles.fieldRequired}>*</span></div>
          <input className={styles.fieldInput} type="tel" placeholder="010-0000-0000" value={form.phone} onChange={e => updateField('phone', e.target.value)} />
        </div>

        <div>
          <div className={styles.fieldLabel}>미용실 주소 <span className={styles.fieldRequired}>*</span></div>
          <input className={styles.fieldInput} placeholder="주소 입력" value={form.address} onChange={e => updateField('address', e.target.value)} />
        </div>

        <div>
          <div className={styles.fieldLabel}>예약 링크 (선택)</div>
          <input className={styles.fieldInput} type="url" placeholder="네이버/카카오 예약 URL" value={form.bookingUrl} onChange={e => updateField('bookingUrl', e.target.value)} />
        </div>

        <div>
          <div className={styles.fieldLabel}>추가 메시지 (선택)</div>
          <textarea className={styles.fieldTextarea} placeholder="하고 싶은 말을 적어주세요" value={form.message} onChange={e => updateField('message', e.target.value)} />
        </div>

        <button className={styles.submitBtn} onClick={handleSubmit} disabled={!isValid || loading}>
          {loading ? '제출 중...' : '제휴 신청하기'}
        </button>
      </div>
    </div>
  );
}
