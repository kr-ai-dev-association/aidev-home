import React, { useState } from 'react';
import '../App.css'; // 공통 스타일
import './AuthPage.css'; // 인증 페이지 스타일
import OAuthButtons from './OAuthButtons';
import { supabase } from '../lib/supabase';

const INDIVIDUAL_CATEGORIES = ['학생', '취업준비생', '프리랜서', '직장인', '자영업'];

const PRIVACY_TEXT = `[개인정보 수집·이용 동의]

한국인공지능개발자 협동조합(이하 "조합")은 「개인정보 보호법」 제15조 및 「정보통신망 이용촉진 및 정보보호 등에 관한 법률」에 따라 아래와 같이 개인정보를 수집·이용합니다.

1. 수집·이용 목적
 - 조합원 가입 및 자격 확인, 본인 식별
 - 조합 서비스 제공 및 가입 관련 안내·고지사항 전달
 - 문의 응대 및 민원 처리

2. 수집 항목
 - (공통) 구분, 이름, 이메일, 전화번호
 - (개인) 세부 카테고리 / (법인) 회사명, 직책

3. 보유 및 이용 기간
 - 회원 탈퇴 시 또는 수집·이용 목적 달성 시까지 보유하며, 이후 지체 없이 파기합니다.
 - 다만 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.

4. 제3자 제공 및 마케팅 이용 금지
 - 조합은 정보주체의 별도 동의 없이 개인정보를 제3자에게 제공하지 않으며, 광고성 정보 전송 등 마케팅 목적으로 이용하지 않습니다.

5. 안전성 확보 조치
 - 수집된 개인정보는 암호화하여 저장·관리하며, 관계 법령이 정한 기술적·관리적 보호조치를 적용합니다.

6. 동의 거부 권리 및 불이익
 - 귀하는 본 동의를 거부할 권리가 있습니다. 다만 필수 항목 수집에 동의하지 않으실 경우 조합원 가입이 제한될 수 있습니다.

그 밖의 사항은 「개인정보 보호법」 및 「정보통신망법」 등 관련 법령과 조합의 개인정보 처리방침에 따릅니다.`;

// detailsMode: 소셜 인증을 마친 신규 회원의 추가 정보 입력 단계 (App이 제어)
function SignupPage({ onTogglePage, detailsMode = false, user = null, onProfileSaved }) {
  const [form, setForm] = useState({
    accountType: 'individual',
    name: '',
    company: '',
    position: '',
    category: '',
    email: user?.email || '',
    phone: '',
    agreed: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.agreed &&
    (form.accountType === 'corporate'
      ? form.company.trim() && form.position.trim()
      : form.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    const { data, error } = await supabase.from('profiles').insert({
      id: user.id,
      account_type: form.accountType,
      name: form.name.trim(),
      company: form.accountType === 'corporate' ? form.company.trim() : null,
      position: form.accountType === 'corporate' ? form.position.trim() : null,
      category: form.accountType === 'individual' ? form.category : null,
      email: form.email.trim(),
      phone: form.phone.trim(),
      privacy_agreed: form.agreed,
    }).select().single();
    setSubmitting(false);
    if (error) {
      alert(`가입 정보 저장 오류: ${error.message}`);
      return;
    }
    onProfileSaved?.(data);
  };

  // 1단계: 소셜 인증 (App에서 detailsMode가 아닐 때)
  if (!detailsMode) {
    return (
      <div className="auth-form-container">
        <h2>회원가입</h2>
        <p className="auth-stage-desc">먼저 소셜 계정으로 인증해주세요.</p>
        <OAuthButtons verb="회원가입" />
        <p>
          이미 계정이 있으신가요?{' '}
          <button type="button" onClick={onTogglePage} className="toggle-button">로그인</button>
        </p>
      </div>
    );
  }

  // 2단계: 추가 정보 입력 (인증 완료 후)
  return (
    <div className="auth-form-container signup-details">
      <h2>정보 입력</h2>
      <p className="auth-stage-desc">조합원 가입을 위해 아래 정보를 입력해주세요.</p>
      <form className="signup-form" onSubmit={handleSubmit}>
        {/* 구분 */}
        <div className="form-field">
          <label>구분</label>
          <div className="type-toggle">
            <button
              type="button"
              className={form.accountType === 'individual' ? 'active' : ''}
              onClick={() => update('accountType', 'individual')}
            >
              개인
            </button>
            <button
              type="button"
              className={form.accountType === 'corporate' ? 'active' : ''}
              onClick={() => update('accountType', 'corporate')}
            >
              법인
            </button>
          </div>
        </div>

        {/* 이름 (공통) */}
        <div className="form-field">
          <label htmlFor="su-name">이름</label>
          <input
            id="su-name"
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </div>

        {/* 개인: 세부 카테고리 */}
        {form.accountType === 'individual' && (
          <div className="form-field">
            <label htmlFor="su-category">세부 카테고리</label>
            <select
              id="su-category"
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
            >
              <option value="">선택하세요</option>
              {INDIVIDUAL_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        {/* 법인: 회사명 + 직책 */}
        {form.accountType === 'corporate' && (
          <>
            <div className="form-field">
              <label htmlFor="su-company">회사명</label>
              <input
                id="su-company"
                type="text"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                placeholder="회사명을 입력하세요"
              />
            </div>
            <div className="form-field">
              <label htmlFor="su-position">직책</label>
              <input
                id="su-position"
                type="text"
                value={form.position}
                onChange={(e) => update('position', e.target.value)}
                placeholder="예: 대표, 팀장, 매니저"
              />
            </div>
          </>
        )}

        {/* 이메일 */}
        <div className="form-field">
          <label htmlFor="su-email">이메일</label>
          <input
            id="su-email"
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="example@email.com"
          />
        </div>

        {/* 전화번호 */}
        <div className="form-field">
          <label htmlFor="su-phone">전화번호</label>
          <input
            id="su-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="010-0000-0000"
          />
        </div>

        {/* 개인정보 보호 안내 */}
        <div className="form-field">
          <label htmlFor="su-privacy">개인정보 수집·이용 안내</label>
          <textarea id="su-privacy" className="privacy-textarea" value={PRIVACY_TEXT} readOnly rows={12} />
        </div>

        {/* 동의 체크박스 */}
        <label className="consent-row">
          <input
            type="checkbox"
            checked={form.agreed}
            onChange={(e) => update('agreed', e.target.checked)}
          />
          <span>위 개인정보 수집·이용에 동의합니다.</span>
        </label>

        <button type="submit" className="auth-submit-button" disabled={!isValid || submitting}>
          {submitting ? '처리 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
