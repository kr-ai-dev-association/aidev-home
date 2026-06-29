import React, { useState } from 'react';
import './B2BRequestModal.css';
import { supabase } from '../lib/supabase';

// 조합 B2B 의뢰(견적 문의 / 평가 신청) 입력 모달 — 로그인한 조합원이면 누구나 의뢰 가능
function B2BRequestModal({ type, user, profile, onClose }) {
  const [form, setForm] = useState({
    company: profile?.company || '',
    contact_name: profile?.name || '',
    email: user?.email || '',
    phone: profile?.phone || '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const valid = form.company.trim() && form.contact_name.trim() && form.email.trim() && form.message.trim();

  const submit = async (e) => {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    const { error } = await supabase.from('b2b_requests').insert({
      type,
      company: form.company.trim(),
      contact_name: form.contact_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      message: form.message.trim(),
      requester_id: user.id,
      requester_name: profile?.name || user.email,
    });
    setSubmitting(false);
    if (error) { alert(`의뢰 접수 오류: ${error.message}`); return; }
    setDone(true);
  };

  return (
    <div className="b2b-overlay" onClick={onClose}>
      <div className="b2b-modal" onClick={(e) => e.stopPropagation()}>
        <button className="b2b-close" onClick={onClose} aria-label="닫기">✕</button>
        {done ? (
          <div className="b2b-done">
            <div className="b2b-done-icon">✅</div>
            <h3>의뢰가 접수되었습니다</h3>
            <p>담당자가 검토 후 입력하신 연락처로 회신드리겠습니다. 감사합니다.</p>
            <button className="nt-btn primary" onClick={onClose}>확인</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="b2b-head">
              <span className="b2b-badge">조합 B2B</span>
              <h3>{type}</h3>
              <p>회사·기관 정보를 남겨주시면 담당자가 검토 후 빠르게 회신드립니다.</p>
            </div>
            <div className="b2b-field">
              <label>회사 / 기관명 <span className="req">*</span></label>
              <input value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="예: 바냐 주식회사" />
            </div>
            <div className="b2b-row">
              <div className="b2b-field">
                <label>담당자명 <span className="req">*</span></label>
                <input value={form.contact_name} onChange={(e) => update('contact_name', e.target.value)} placeholder="홍길동" />
              </div>
              <div className="b2b-field">
                <label>연락처 (전화)</label>
                <input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="010-0000-0000" />
              </div>
            </div>
            <div className="b2b-field">
              <label>이메일 <span className="req">*</span></label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="contact@company.com" />
            </div>
            <div className="b2b-field">
              <label>의뢰 내용 <span className="req">*</span></label>
              <textarea rows={5} value={form.message} onChange={(e) => update('message', e.target.value)}
                placeholder={type === '조합 B2B 평가 신청'
                  ? '평가 대상 에이전트/모델, 평가 목적, 일정 등을 적어주세요.'
                  : '교육 대상·인원·기간·예산 등 요청사항을 적어주세요.'} />
            </div>
            <div className="b2b-actions">
              <button type="button" className="nt-btn ghost" onClick={onClose} disabled={submitting}>취소</button>
              <button type="submit" className="nt-btn primary" disabled={!valid || submitting}>
                {submitting ? '접수 중...' : '의뢰 보내기'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default B2BRequestModal;
