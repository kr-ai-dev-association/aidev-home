import React, { useState } from 'react';
import './B2BRequestModal.css';
import { supabase } from '../lib/supabase';

// 분쟁 내용 작성 — 공고+기능요구사항이 자동 링크되어 관리자에게 전달
function DisputeModal({ job, user, profile, role, onClose }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const features = Array.isArray(job.details?.features) ? job.details.features : [];

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;
    setSubmitting(true);
    const snapshot = {
      title: job.title,
      board_type: job.board_type,
      description: job.description,
      details: job.details || {},
    };
    const { error } = await supabase.from('disputes').insert({
      job_id: job.id,
      job_title: job.title,
      job_snapshot: snapshot,
      reporter_id: user.id,
      reporter_name: profile?.name || user?.email,
      reporter_role: role,
      client_id: job.author_id,
      contractor_id: job.contractor_id,
      content: content.trim(),
    });
    setSubmitting(false);
    if (error) { alert(`분쟁 접수 오류: ${error.message}`); return; }
    setDone(true);
  };

  return (
    <div className="b2b-overlay" onClick={onClose}>
      <div className="b2b-modal" onClick={(e) => e.stopPropagation()}>
        <button className="b2b-close" onClick={onClose} aria-label="닫기">✕</button>
        {done ? (
          <div className="b2b-done">
            <div className="b2b-done-icon">📨</div>
            <h3>분쟁이 접수되었습니다</h3>
            <p>공고와 기능 요구사항이 함께 조합 관리자에게 전달되었습니다. 검토 후 조정 절차를 안내드립니다.</p>
            <button className="nt-btn primary" onClick={onClose}>확인</button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="b2b-head">
              <span className="b2b-badge">분쟁 해결</span>
              <h3>{job.title}</h3>
              <p>분쟁 내용을 작성하면 아래 <strong>공고와 기능 요구사항</strong>이 자동으로 링크되어 조합 관리자에게 전달됩니다. (귀하: <strong>{role}</strong>)</p>
            </div>
            <div className="dispute-linked">
              🔗 연동: <strong>{job.title}</strong> · 기능 요구사항 {features.length}건
            </div>
            <div className="b2b-field">
              <label>분쟁 내용 <span className="req">*</span></label>
              <textarea rows={8} value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="발생한 분쟁의 경위, 쟁점이 되는 기능/요구사항, 요청사항 등을 구체적으로 작성해 주세요." />
            </div>
            <p className="apply-profile-note">
              ⚖️ 분쟁은 공고의 내용·기능 요구사항·당사자 간 계약서에 근거하여 조정됩니다.
            </p>
            <div className="b2b-actions">
              <button type="button" className="nt-btn ghost" onClick={onClose} disabled={submitting}>취소</button>
              <button type="submit" className="nt-btn primary" disabled={!content.trim() || submitting}>
                {submitting ? '접수 중...' : '분쟁 접수'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default DisputeModal;
