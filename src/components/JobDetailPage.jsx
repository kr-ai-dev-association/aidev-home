import React, { useState, useEffect } from 'react';
import './JobDetailPage.css';
import '../App.css';
import { sanitize } from '../lib/html';
import { startConversation } from '../lib/inbox';
import { FIELD_DEFS, badgeStyle, cardInfo } from '../lib/jobFields';
import ShareButton from './ShareButton';
import { MarkdownView } from './MarkdownField';
import ApplyModal from './ApplyModal';
import DisputeModal from './DisputeModal';

function RelatedJobCard({ job, onClick }) {
  const info = cardInfo(job);
  const st = badgeStyle(info.badge);
  return (
    <div className="related-job-card-item" onClick={() => onClick(job)}>
      <div className="related-job-details">
        <h4 className="related-job-title">{job.title}</h4>
        {info.location && <p className="related-job-location">{info.location}</p>}
        {info.company && <p className="related-job-company">{info.company}</p>}
      </div>
      <div className="related-job-type" style={{ backgroundColor: st.bg, color: st.color }}>{info.badge}</div>
    </div>
  );
}

function renderValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return (
      <ul className="job-detail-list">
        {value.map((v, i) => <li key={i}>{v}</li>)}
      </ul>
    );
  }
  return <p className="info-value">{value}</p>;
}

function JobDetailPage({ job, allJobs = [], onBack, onSelect, canManage, onEdit, onDelete, onToggleClose, canMessage, onOpenConversation, scrapped, onToggleScrap, isMember, isAdmin, user, profile }) {
  const [lightbox, setLightbox] = useState(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const messageAuthor = async () => {
    try {
      const cid = await startConversation(job.author_id);
      onOpenConversation && onOpenConversation(cid);
    } catch (e) {
      alert(`메시지 시작 오류: ${e.message}`);
    }
  };
  if (!job) {
    return (
      <div className="job-detail-page-container content-area-container">
        <p>채용 정보를 찾을 수 없습니다.</p>
        <button className="back-button" onClick={onBack}>목록으로 돌아가기</button>
      </div>
    );
  }

  const d = job.details || {};
  const fields = FIELD_DEFS[job.board_type] || [];
  const info = cardInfo(job);
  const st = badgeStyle(info.badge);
  const related = allJobs.filter((j) => j.id !== job.id && j.board_type === job.board_type).slice(0, 2);

  // 외주 프로젝트 상세는 정회원·관리자만 열람
  const restricted = job.board_type === '외주 프로젝트' && !(isMember || isAdmin);
  if (restricted) {
    return (
      <div className="job-detail-page-container content-area-container">
        <button className="back-button back-top" onClick={onBack}>← 목록으로 돌아가기</button>
        <div className="job-detail-main-content">
          <div className="detail-badge-row">
            <span className="job-board-badge" style={{ backgroundColor: st.bg, color: st.color }}>{job.board_type}</span>
          </div>
          <h1 className="detail-job-title">{job.title}</h1>
          <div className="job-restricted">
            <div className="job-restricted-icon">🔒</div>
            <h3>정회원 전용 공고</h3>
            <p>외주 프로젝트의 상세 내용은 <strong>정회원·관리자</strong>만 열람할 수 있습니다.<br />정회원 권한은 관리자가 부여합니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page-container content-area-container">
      <button className="back-button back-top" onClick={onBack}>← 목록으로 돌아가기</button>
      <div className="job-detail-main-content">
        <div className="job-detail-header">
          <div className="job-detail-text-info">
            <div className="detail-badge-row">
              <span className="job-board-badge" style={{ backgroundColor: st.bg, color: st.color }}>{job.board_type}</span>
              {/* 외주는 OPEN/CLOSED, 채용·프로젝트 구인은 마감 시에만 '마감' 배지 */}
              {job.board_type === '외주 프로젝트' ? (
                <span className={`job-status ${job.closed ? 'closed' : 'open'}`}>{job.closed ? '🔒 CLOSED' : '🟢 OPEN'}</span>
              ) : job.closed ? (
                <span className="job-status closed">🔒 마감</span>
              ) : null}
            </div>
            <h1 className="detail-job-title">{job.title}</h1>
            {info.company && <p className="detail-company-name">{info.company}</p>}
            <p className="detail-agency-name">작성: {job.author_name}</p>
            {job.board_type === '외주 프로젝트' && job.deadline && (
              <p className="detail-deadline">⏳ 마감 기한: {new Date(job.deadline).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })}{!job.closed && new Date(job.deadline) < new Date() ? ' (기한 경과)' : ''}</p>
            )}
          </div>
          <div className="job-detail-manage">
            {onToggleScrap && (
              <button className={`nt-btn ghost${scrapped ? ' scrap-on' : ''}`} onClick={() => onToggleScrap(job)}>
                {scrapped ? '🔖 스크랩됨' : '🏷️ 스크랩'}
              </button>
            )}
            <ShareButton
              url={`${typeof window !== 'undefined' ? window.location.origin : ''}/employment/job/${job.id}`}
              title={job.title}
              text={`[${job.board_type}] ${job.title}`}
            />
            {canMessage && (
              <button className="nt-btn ghost" onClick={messageAuthor}>✉️ 작성자에게 메시지</button>
            )}
            {canManage && (
              <>
                {/* 외주는 계약자 지정으로 마감, 채용·프로젝트 구인은 직접 마감/재개시 */}
                {job.board_type === '외주 프로젝트' ? (
                  <button className="nt-btn ghost" onClick={() => onToggleClose(job)}>
                    {job.closed ? '🔓 마감 취소' : '🏆 마감(계약자 지정)'}
                  </button>
                ) : (
                  <button className="nt-btn ghost" onClick={() => onToggleClose(job)}>
                    {job.closed ? '🔓 마감 취소(재개시)' : '🔒 마감'}
                  </button>
                )}
                <button className="nt-btn ghost" onClick={() => onEdit(job)}>수정</button>
                <button className="nt-btn danger" onClick={() => onDelete(job)}>삭제</button>
              </>
            )}
          </div>
        </div>

        {job.board_type === '외주 프로젝트' && (
          <div className="jf-notice detail-notice">
            <div className="jf-notice-title">📋 검수·분쟁 처리 안내</div>
            <ul className="jf-notice-list">
              <li>완료 여부는 <strong>아래 ‘기능 요구사항’</strong>을 기준으로 판단합니다.</li>
              <li>분쟁 시 <strong>조합 평가팀</strong>이 결과물 소스 코드를 직접 구동해 사용자와 동일한 환경에서 <strong>E2E 테스트</strong>로 모든 기능을 검증합니다.</li>
            </ul>
          </div>
        )}

        {/* 보드별 핵심 정보 (단문 필드) */}
        <div className="job-info-card">
          {fields.filter((f) => ['text', 'select', 'tags'].includes(f.type)).map((f) => {
            const val = d[f.key];
            if (!val || (Array.isArray(val) && val.length === 0)) return null;
            return (
              <div className="info-item" key={f.key}>
                <div className="info-text">
                  <p className="info-label">{f.label}</p>
                  <p className="info-value">{Array.isArray(val) ? val.join(', ') : val}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 상세 설명 (리치 텍스트) */}
        {job.description && (
          <div className="job-section">
            <h2 className="section-title">상세 설명</h2>
            <div className="job-description-rich" dangerouslySetInnerHTML={{ __html: sanitize(job.description) }} />
          </div>
        )}

        {/* 리스트형 필드 (주요 업무/자격 요건/모집 분야 등) */}
        {fields.filter((f) => f.type === 'list').map((f) => {
          const val = d[f.key];
          if (!Array.isArray(val) || val.length === 0) return null;
          return (
            <div className="job-section" key={f.key}>
              <h2 className="section-title">{f.label}</h2>
              {renderValue(val)}
            </div>
          );
        })}

        {/* 기능 요구사항 */}
        {fields.filter((f) => f.type === 'features').map((f) => {
          const arr = d[f.key];
          if (!Array.isArray(arr) || arr.length === 0) return null;
          return (
            <div className="job-section" key={f.key}>
              <h2 className="section-title">{f.label}</h2>
              <div className="feature-list">
                {arr.map((feat, i) => (
                  <div className="feature-item" key={i}>
                    <div className="feature-text">
                      <h4 className="feature-name">{i + 1}. {feat.name}</h4>
                      {feat.detail && <div className="feature-detail"><MarkdownView source={feat.detail} /></div>}
                    </div>
                    {feat.image && (
                      <button type="button" className="feature-image" onClick={() => setLightbox(feat.image)} aria-label="이미지 크게 보기">
                        <img src={feat.image} alt={feat.name} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* 문서·소스 첨부 */}
        {fields.filter((f) => f.type === 'attachments').map((f) => {
          const arr = d[f.key];
          if (!Array.isArray(arr) || arr.length === 0) return null;
          return (
            <div className="job-section" key={f.key}>
              <h2 className="section-title">{f.label}</h2>
              <ul className="detail-attach-list">
                {arr.map((a, i) => (
                  <li className="detail-attach-item" key={i}>
                    <span className="jf-attach-kind">{a.kind === 'pdf' ? '📄 PDF' : a.kind === 'zip' ? '🗜️ ZIP' : '🔗 LINK'}</span>
                    <a href={a.url} target="_blank" rel="noreferrer">{a.name}</a>
                    {a.size ? <span className="jf-attach-size">{(a.size / (1024 * 1024)).toFixed(1)}MB</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* 스크린샷 */}
        {fields.filter((f) => f.type === 'images').map((f) => {
          const arr = d[f.key];
          if (!Array.isArray(arr) || arr.length === 0) return null;
          return (
            <div className="job-section" key={f.key}>
              <h2 className="section-title">{f.label}</h2>
              <div className="screenshot-gallery">
                {arr.map((url, i) => (
                  <button type="button" key={i} className="screenshot-thumb" onClick={() => setLightbox(url)} aria-label="이미지 크게 보기">
                    <img src={url} alt={`스크린샷 ${i + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        <div className="apply-actions">
          {job.platform_apply && canMessage && (
            <button type="button" className="apply-button" onClick={() => setApplyOpen(true)}>📝 지원하기</button>
          )}
          {canMessage && (
            <button type="button" className="apply-button ghost" onClick={messageAuthor}>✉️ 문의하기 (작성자에게 메시지)</button>
          )}
          {job.contact && (
            <a className="apply-button ghost" href={job.contact.includes('@') ? `mailto:${job.contact}` : job.contact} target="_blank" rel="noreferrer">
              🔗 외부 지원/문의
            </a>
          )}
        </div>

        {job.board_type === '외주 프로젝트' && job.closed && (user?.id === job.author_id || user?.id === job.contractor_id) && (
          <div className="dispute-bar">
            <div>
              <strong>분쟁이 있으신가요?</strong>
              <p>계약이 체결된 외주 프로젝트입니다. 분쟁 발생 시 아래 버튼으로 조합 분쟁조정위원회에 조정을 요청할 수 있습니다.</p>
            </div>
            <button type="button" className="nt-btn danger" onClick={() => setDisputeOpen(true)}>⚖️ 분쟁 해결 요청</button>
          </div>
        )}

        {related.length > 0 && (
          <div className="job-section related-jobs-section">
            <h2 className="section-title">같은 카테고리의 다른 공고</h2>
            <div className="related-jobs-list">
              {related.map((r) => <RelatedJobCard key={r.id} job={r} onClick={onSelect} />)}
            </div>
          </div>
        )}
      </div>

      <aside className="job-detail-sidebar">
        <div className="job-overview-card">
          <h3>개요</h3>
          <div className="overview-item">
            <span className="overview-icon">🏷️</span>
            <div className="overview-text">
              <p className="overview-label">구분</p>
              <p className="overview-value">{job.board_type}</p>
            </div>
          </div>
          {info.company && (
            <div className="overview-item">
              <span className="overview-icon">🏢</span>
              <div className="overview-text">
                <p className="overview-label">{job.board_type === '채용공고' ? '회사' : '주체'}</p>
                <p className="overview-value">{info.company}</p>
              </div>
            </div>
          )}
          {info.location && (
            <div className="overview-item">
              <span className="overview-icon">📍</span>
              <div className="overview-text">
                <p className="overview-label">정보</p>
                <p className="overview-value">{info.location}</p>
              </div>
            </div>
          )}
        </div>
        <button className="back-button" onClick={onBack}>← 목록으로 돌아가기</button>
      </aside>

      {applyOpen && (
        <ApplyModal job={job} user={user} profile={profile} onClose={() => setApplyOpen(false)} />
      )}

      {disputeOpen && (
        <DisputeModal
          job={job}
          user={user}
          profile={profile}
          role={user?.id === job.author_id ? '의뢰자' : '수행자'}
          onClose={() => setDisputeOpen(false)}
        />
      )}

      {lightbox && (
        <div className="img-lightbox" onClick={() => setLightbox(null)}>
          <button type="button" className="img-lightbox-close" aria-label="닫기" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="원본 이미지" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export default JobDetailPage;
