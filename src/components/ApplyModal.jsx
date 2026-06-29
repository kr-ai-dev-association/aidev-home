import React, { useState } from 'react';
import './B2BRequestModal.css';
import { supabase } from '../lib/supabase';

// 조합 플랫폼 지원 모달 — 지원 내용 + 프로필 스냅샷을 공고 작성자에게 전달
function ApplyModal({ job, user, profile, onClose }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!message.trim() || submitting) return;
    setSubmitting(true);
    const snapshot = {
      name: profile?.name || null,
      main_title: profile?.main_title || null,
      about: profile?.about || null,
      skills: Array.isArray(profile?.skills) ? profile.skills : [],
      location: profile?.location || null,
      rate: profile?.rate || null,
      linkedin_url: profile?.linkedin_url || null,
      email: user?.email || null,
      phone: profile?.phone || null,
    };
    const { error } = await supabase.from('job_applications').insert({
      job_id: job.id,
      applicant_id: user.id,
      applicant_name: profile?.name || user?.email,
      message: message.trim(),
      profile: snapshot,
    });
    setSubmitting(false);
    if (error) {
      alert(/duplicate|unique/i.test(error.message) ? '이미 이 공고에 지원하셨습니다.' : `지원 오류: ${error.message}`);
      return;
    }
    setDone(true);
  };

  return (
    <div className="b2b-overlay" onClick={onClose}>
      <div className="b2b-modal" onClick={(e) => e.stopPropagation()}>
        <button className="b2b-close" onClick={onClose} aria-label="닫기">✕</button>
        {done ? (
          <div className="b2b-done">
            <div className="b2b-done-icon">✅</div>
            <h3>지원이 접수되었습니다</h3>
            <p>지원 내용과 프로필이 공고 작성자에게 전달되었습니다. 결과를 기다려 주세요.</p>
            <button className="nt-btn primary" onClick={onClose}>확인</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="b2b-head">
              <span className="b2b-badge">지원하기</span>
              <h3>{job.title}</h3>
              <p>지원 내용을 작성하면 <strong>내 프로필</strong>(이름·타이틀·기술·연락처 등)이 함께 전달됩니다.</p>
            </div>
            <div className="b2b-field">
              <label>지원 내용 / 자기소개 <span className="req">*</span></label>
              <textarea rows={7} value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="지원 동기, 관련 경험, 가능 일정 등을 적어주세요." />
            </div>
            <p className="apply-profile-note">
              👤 전달 프로필: <strong>{profile?.name || user?.email}</strong>
              {profile?.main_title ? ` · ${profile.main_title}` : ''}
              {Array.isArray(profile?.skills) && profile.skills.length ? ` · ${profile.skills.slice(0, 4).join(', ')}` : ''}
            </p>
            <div className="b2b-actions">
              <button type="button" className="nt-btn ghost" onClick={onClose} disabled={submitting}>취소</button>
              <button type="submit" className="nt-btn primary" disabled={!message.trim() || submitting}>
                {submitting ? '제출 중...' : '지원서 제출'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ApplyModal;
