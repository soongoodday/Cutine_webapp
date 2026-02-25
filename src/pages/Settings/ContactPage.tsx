import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    category: '',
    email: '',
    content: '',
  });

  const isValid = form.category && form.content.trim().length > 0;

  const handleSubmit = () => {
    if (!isValid) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>&lt;</button>
          <h1 className={styles.headerTitle}>문의하기</h1>
        </div>
        <div className={styles.successWrap}>
          <div className={styles.successIcon}>✅</div>
          <h2 className={styles.successTitle}>문의가 접수되었습니다</h2>
          <p className={styles.successDesc}>
            빠른 시일 내에 답변드리겠습니다.<br />
            이메일을 입력하셨다면 해당 주소로 회신됩니다.
          </p>
          <button className={styles.backToSettings} onClick={() => navigate(-1)}>
            설정으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>&lt;</button>
        <h1 className={styles.headerTitle}>문의하기</h1>
      </div>

      <div className={styles.body}>
        <div className={styles.field}>
          <div className={styles.fieldLabel}>문의 유형 <span className={styles.required}>*</span></div>
          <div className={styles.categoryRow}>
            {['버그 신고', '기능 제안', '이용 문의', '기타'].map(cat => (
              <button
                key={cat}
                className={`${styles.categoryBtn} ${form.category === cat ? styles.categoryActive : ''}`}
                onClick={() => setForm(prev => ({ ...prev, category: cat }))}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <div className={styles.fieldLabel}>이메일 (선택)</div>
          <input
            className={styles.input}
            type="email"
            placeholder="답변 받을 이메일"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className={styles.field}>
          <div className={styles.fieldLabel}>문의 내용 <span className={styles.required}>*</span></div>
          <textarea
            className={styles.textarea}
            placeholder="문의 내용을 입력해주세요"
            value={form.content}
            onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
          />
        </div>

        <button className={styles.submitBtn} onClick={handleSubmit} disabled={!isValid}>
          문의 보내기
        </button>
      </div>
    </div>
  );
}
