import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { startConversation } from '../lib/inbox';
import { sanitize } from '../lib/html';
import { MarkdownView } from './MarkdownField';
import './JobDetailPage.css'; // 스크린샷 썸네일·라이트박스 스타일 재사용

const STATUS = {
  open: { label: '접수', color: '#fca5a5' },
  mediating: { label: '조정 중', color: '#fcd34d' },
  resolved: { label: '해결', color: '#4ade80' },
};

function fmt(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function DisputesPage({ isAdmin, onOpenConversation, onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [busy, setBusy] = useState(null);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('disputes').select('*').order('created_at', { ascending: false });
    setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const mediate = async (d) => {
    if (!window.confirm('분쟁 조정을 개시하시겠습니까?\n의뢰자·수행자에게 조정단 파견 안내(알림·이메일)가 발송됩니다.')) return;
    setBusy(d.id);
    const { error } = await supabase.rpc('mediate_dispute', { p_dispute_id: d.id });
    // 이메일 발송(Edge Function) — 배포되어 있으면 함께 발송, 없으면 알림만
    try { await supabase.functions.invoke('dispute-email', { body: { dispute_id: d.id } }); } catch { /* noop */ }
    setBusy(null);
    if (error) { alert(`조정 개시 오류: ${error.message}`); return; }
    setRows((prev) => prev.map((x) => (x.id === d.id ? { ...x, status: 'mediating' } : x)));
    alert('분쟁 조정이 개시되었습니다. 당사자에게 알림이 발송되었습니다.');
  };

  const setResolved = async (d) => {
    setBusy(d.id);
    const { error } = await supabase.from('disputes').update({ status: 'resolved' }).eq('id', d.id);
    setBusy(null);
    if (error) { alert(`상태 변경 오류: ${error.message}`); return; }
    setRows((prev) => prev.map((x) => (x.id === d.id ? { ...x, status: 'resolved' } : x)));
  };

  const dm = async (uid) => {
    if (!uid) return;
    try { const cid = await startConversation(uid); onOpenConversation && onOpenConversation(cid); } catch (e) { alert(e.message); }
  };

  if (!isAdmin) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services"><h3>접근 권한이 없습니다</h3>
            <p className="section-lead">이 페이지는 관리자만 열람할 수 있습니다.</p></section>
        </div>
      </div>
    );
  }

  const counts = { all: rows.length, open: rows.filter((r) => r.status === 'open').length, mediating: rows.filter((r) => r.status === 'mediating').length };

  return (
    <div className="home-landing admin-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          {onBack && <button type="button" className="admin-back-btn" onClick={onBack}>← 관리자 대시보드</button>}
          <h3>외주 분쟁 관리</h3>
          <p className="section-lead">외주 프로젝트 분쟁을 확인하고 조정 절차를 개시합니다. 접수 {counts.open}건 · 조정 중 {counts.mediating}건</p>

          {loading ? (
            <p className="admin-msg">불러오는 중...</p>
          ) : rows.length === 0 ? (
            <p className="admin-msg">접수된 분쟁이 없습니다.</p>
          ) : (
            <div className="myjobs-list">
              {rows.map((d) => {
                const st = STATUS[d.status] || STATUS.open;
                const open = openId === d.id;
                const snap = d.job_snapshot || {};
                const det = snap.details || {};
                const features = Array.isArray(det.features) ? det.features : [];
                const screenshots = Array.isArray(det.screenshots) ? det.screenshots : [];
                const attachments = Array.isArray(det.attachments) ? det.attachments : [];
                return (
                  <div className="myjob-card" key={d.id}>
                    <div className="myjob-head" onClick={() => setOpenId(open ? null : d.id)}>
                      <div>
                        <span className="b2b-status" style={{ color: st.color, borderColor: st.color }}>{st.label}</span>
                        <h4>{d.job_title || '외주 프로젝트'}</h4>
                        <span className="myjob-deadline">신고: {d.reporter_name} ({d.reporter_role}) · {fmt(d.created_at)}</span>
                      </div>
                      <div className="myjob-count"><span className="myjob-caret">{open ? '▴' : '▾'}</span></div>
                    </div>

                    {open && (
                      <div className="myjob-apps">
                        <div className="dispute-detail-block">
                          <h5>분쟁 내용</h5>
                          <p className="apply-msg">{d.content}</p>
                        </div>
                        {snap.description && (
                          <div className="dispute-detail-block">
                            <h5>공고 내용</h5>
                            <div className="post-content" dangerouslySetInnerHTML={{ __html: sanitize(snap.description) }} />
                          </div>
                        )}
                        {features.length > 0 && (
                          <div className="dispute-detail-block">
                            <h5>기능 요구사항 ({features.length})</h5>
                            {features.map((f, i) => (
                              <div className="dispute-feature" key={i}>
                                <strong>{i + 1}. {f.name}</strong>
                                {f.detail && <MarkdownView source={f.detail} />}
                                {f.image && (
                                  <button type="button" className="feature-image" onClick={() => setLightbox(f.image)} aria-label="이미지 크게 보기">
                                    <img src={f.image} alt={f.name} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {screenshots.length > 0 && (
                          <div className="dispute-detail-block">
                            <h5>스크린샷 ({screenshots.length})</h5>
                            <div className="screenshot-gallery">
                              {screenshots.map((url, i) => (
                                <button type="button" key={i} className="screenshot-thumb" onClick={() => setLightbox(url)} aria-label="이미지 크게 보기">
                                  <img src={url} alt={`스크린샷 ${i + 1}`} />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {attachments.length > 0 && (
                          <div className="dispute-detail-block">
                            <h5>문서·소스 첨부 ({attachments.length})</h5>
                            <ul className="detail-attach-list">
                              {attachments.map((a, i) => (
                                <li className="detail-attach-item" key={i}>
                                  <span className="jf-attach-kind">{a.kind === 'pdf' ? '📄 PDF' : a.kind === 'zip' ? '🗜️ ZIP' : '🔗 LINK'}</span>
                                  <a href={a.url} target="_blank" rel="noreferrer">{a.name}</a>
                                  {a.size ? <span className="jf-attach-size">{(a.size / (1024 * 1024)).toFixed(1)}MB</span> : null}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="apply-actions-row">
                          <button className="b2b-status-btn" onClick={() => dm(d.client_id)}>✉️ 의뢰자</button>
                          <button className="b2b-status-btn" onClick={() => dm(d.contractor_id)}>✉️ 수행자</button>
                          {d.status !== 'resolved' && (
                            <button className="b2b-status-btn contract" disabled={busy === d.id} onClick={() => mediate(d)}>⚖️ 분쟁 조정 개시</button>
                          )}
                          {d.status === 'mediating' && (
                            <button className="b2b-status-btn" disabled={busy === d.id} onClick={() => setResolved(d)}>✅ 해결 완료</button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {lightbox && (
        <div className="img-lightbox" onClick={() => setLightbox(null)}>
          <button type="button" className="img-lightbox-close" aria-label="닫기" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="원본 이미지" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export default DisputesPage;
