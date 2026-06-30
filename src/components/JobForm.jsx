import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import RichTextEditor from './RichTextEditor';
import { isEmptyHtml } from '../lib/html';
import { BOARD_TYPES, CORP_ONLY, FIELD_DEFS } from '../lib/jobFields';
import { MarkdownEditor } from './MarkdownField';

const BUCKET = 'job-images';

// 타입 검증 정규식
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^[0-9+\-\s()]{7,20}$/;
const URLRE = /^https?:\/\/.+/i;

// 텍스트형 직렬화
const toEditable = (val, type) => {
  if (type === 'list') return Array.isArray(val) ? val.join('\n') : (val || '');
  if (type === 'tags') return Array.isArray(val) ? val.join(', ') : (val || '');
  if (type === 'features') return Array.isArray(val) ? val : [];
  if (type === 'images') return Array.isArray(val) ? val : [];
  if (type === 'attachments') return Array.isArray(val) ? val : [];
  return val || '';
};
const fromEditable = (raw, type) => {
  if (type === 'list') return String(raw || '').split('\n').map((s) => s.trim()).filter(Boolean);
  if (type === 'tags') return String(raw || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (type === 'features') return (raw || []).filter((f) => f && f.name && f.name.trim());
  if (type === 'images') return raw || [];
  if (type === 'attachments') return (raw || []).filter((a) => a && a.url);
  return String(raw || '').trim();
};

const MAX_ATTACH_BYTES = 10 * 1024 * 1024; // 통합 10MB 미만

function JobForm({ initial, canPostCorp, user, profile, onSaved, onCancel }) {
  const isEdit = !!initial;
  const allowedBoards = canPostCorp ? BOARD_TYPES : BOARD_TYPES.filter((b) => !CORP_ONLY.includes(b));

  const initBoard = initial?.board_type || allowedBoards[0];
  const [boardType, setBoardType] = useState(initBoard);
  const [title, setTitle] = useState(initial?.title || '');
  const [contact, setContact] = useState(initial?.contact || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [details, setDetails] = useState(() => {
    const d = initial?.details || {};
    const obj = {};
    (FIELD_DEFS[initBoard] || []).forEach((f) => { obj[f.key] = toEditable(d[f.key], f.type); });
    return obj;
  });
  const [platformApply, setPlatformApply] = useState(!!initial?.platform_apply);
  const [deadline, setDeadline] = useState(() => {
    if (!initial?.deadline) return '';
    const dt = new Date(initial.deadline);
    if (Number.isNaN(dt.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [touched, setTouched] = useState({});
  const [attempted, setAttempted] = useState(false);

  const fields = FIELD_DEFS[boardType] || [];
  const markTouched = (k) => setTouched((t) => ({ ...t, [k]: true }));

  // 필드 타입 검증
  const fieldError = (f) => {
    const v = String(details[f.key] || '').trim();
    if (!v) return f.required ? '필수 항목입니다.' : '';
    if (f.validate === 'email' && !EMAIL.test(v)) return '올바른 이메일 형식이 아닙니다.';
    if (f.validate === 'phone' && !PHONE.test(v)) return '숫자, +, -, 공백, () 만 사용해 입력하세요.';
    if (f.validate === 'url' && !URLRE.test(v)) return 'http(s):// 로 시작하는 URL을 입력하세요.';
    return '';
  };
  const errors = {};
  fields.forEach((f) => { const e = fieldError(f); if (e) errors[f.key] = e; });
  const titleError = !title.trim() ? '필수 항목입니다.' : '';
  const descError = isEmptyHtml(description) ? '필수 항목입니다.' : '';
  const contactError = (() => {
    const s = contact.trim();
    if (!s) return '';
    if (s.includes('@')) return EMAIL.test(s) ? '' : '올바른 이메일 형식이 아닙니다.';
    return URLRE.test(s) ? '' : '이메일 또는 http(s) 링크를 입력하세요.';
  })();
  const showErr = (k) => attempted || touched[k];
  // 외주 프로젝트는 상세한 기능 요구사항(이름+상세) 1개 이상 필수
  const validFeatures = (details.features || []).filter((f) => f && f.name && f.name.trim() && f.detail && f.detail.trim());
  const featuresRequired = boardType === '외주 프로젝트';
  const featuresError = featuresRequired && validFeatures.length < 1
    ? '외주 프로젝트는 상세한 기능 요구사항(기능 이름과 상세 설명)을 1개 이상 입력해야 합니다.'
    : '';
  const hasErrors = !!titleError || !!descError || !!contactError || !!featuresError || Object.keys(errors).length > 0;

  const changeBoard = (bt) => {
    setBoardType(bt);
    const obj = {};
    (FIELD_DEFS[bt] || []).forEach((f) => {
      const cur = details[f.key];
      obj[f.key] = cur !== undefined ? cur : (f.type === 'features' || f.type === 'images' ? [] : '');
    });
    setDetails(obj);
  };

  const setField = (key, value) => setDetails((d) => ({ ...d, [key]: value }));

  // 이미지 업로드 → 공개 URL 반환
  const uploadImage = async (file) => {
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
    if (error) { alert(`이미지 업로드 오류: ${error.message}`); return null; }
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  };

  const handleScreenshotsAdd = async (key, fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const f of files) {
      const u = await uploadImage(f);
      if (u) urls.push(u);
    }
    setUploading(false);
    setField(key, [...(details[key] || []), ...urls]);
  };

  const removeImage = (key, idx) => setField(key, (details[key] || []).filter((_, i) => i !== idx));

  // 첨부 (PDF/ZIP/GitHub) — 통합 10MB 미만
  const attachTotalBytes = (list) => (list || []).reduce((sum, a) => sum + (a.size || 0), 0);
  const addAttachmentFile = async (key, kind, file) => {
    if (!file) return;
    const okType = kind === 'pdf'
      ? (file.type === 'application/pdf' || /\.pdf$/i.test(file.name))
      : (/zip/i.test(file.type) || /\.zip$/i.test(file.name));
    if (!okType) { alert(kind === 'pdf' ? 'PDF 파일만 첨부할 수 있습니다.' : 'ZIP 파일만 첨부할 수 있습니다.'); return; }
    const cur = details[key] || [];
    if (attachTotalBytes(cur) + file.size >= MAX_ATTACH_BYTES) {
      alert('첨부 파일 통합 용량은 10MB 미만이어야 합니다.');
      return;
    }
    setUploading(true);
    const ext = kind === 'pdf' ? 'pdf' : 'zip';
    const path = `attachments/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type || (kind === 'pdf' ? 'application/pdf' : 'application/zip') });
    setUploading(false);
    if (error) { alert(`업로드 오류: ${error.message}`); return; }
    const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    setField(key, [...cur, { kind, name: file.name, url, size: file.size }]);
  };
  const addAttachmentLink = (key, url) => {
    const u = (url || '').trim();
    if (!URLRE.test(u)) { alert('http(s):// 로 시작하는 링크를 입력하세요. (예: GitHub 저장소)'); return; }
    setField(key, [...(details[key] || []), { kind: 'link', name: u, url: u, size: 0 }]);
  };
  const removeAttachment = (key, idx) => setField(key, (details[key] || []).filter((_, i) => i !== idx));

  // 기능 요구사항 (features)
  const addFeature = (key) => setField(key, [...(details[key] || []), { name: '', detail: '', image: '' }]);
  const updateFeature = (key, idx, prop, val) =>
    setField(key, (details[key] || []).map((f, i) => (i === idx ? { ...f, [prop]: val } : f)));
  const removeFeature = (key, idx) => setField(key, (details[key] || []).filter((_, i) => i !== idx));
  const featureImage = async (key, idx, file) => {
    if (!file) return;
    setUploading(true);
    const u = await uploadImage(file);
    setUploading(false);
    if (u) updateFeature(key, idx, 'image', u);
  };

  const authorName = profile?.name || user?.email?.split('@')[0] || '익명';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttempted(true);
    if (hasErrors || submitting || uploading) return;
    setSubmitting(true);
    const detailsOut = {};
    fields.forEach((f) => { detailsOut[f.key] = fromEditable(details[f.key], f.type); });

    const payload = {
      board_type: boardType, title: title.trim(), description, contact: contact.trim() || null,
      details: detailsOut, platform_apply: platformApply,
      deadline: boardType === '외주 프로젝트' && deadline ? new Date(deadline).toISOString() : null,
    };
    let error;
    if (isEdit) {
      ({ error } = await supabase.from('jobs').update(payload).eq('id', initial.id));
    } else {
      ({ error } = await supabase.from('jobs').insert({ ...payload, author_id: user.id, author_name: authorName }));
    }
    setSubmitting(false);
    if (error) { alert(`저장 오류: ${error.message}`); return; }
    onSaved?.();
  };

  return (
    <form className="job-form" onSubmit={handleSubmit}>
      <h2 className="job-form-title">{isEdit ? '공고 수정' : '공고 등록'}</h2>

      {boardType === '외주 프로젝트' && (
        <div className="jf-notice">
          <div className="jf-notice-title">📋 외주 프로젝트 검수·분쟁 처리 안내</div>
          <ul className="jf-notice-list">
            <li>프로젝트 완료 여부는 <strong>등록하신 ‘기능 요구사항’</strong>을 기준으로 판단합니다.</li>
            <li>의뢰자·수행자·조합원 간 분쟁이 발생하면, <strong>조합 평가팀</strong>이 완성 결과물의 <strong>소스 코드를 직접 구동</strong>하여 사용자와 동일한 환경에서 <strong>E2E(End-to-End) 테스트</strong>로 모든 기능을 검증합니다.</li>
            <li>공정한 검수를 위해 <strong>상세한 기능 요구사항·프로토타입·스크린샷</strong>을 반드시 업로드해 주세요.</li>
          </ul>
        </div>
      )}

      <div className="jf-field">
        <label>구분</label>
        <select value={boardType} onChange={(e) => changeBoard(e.target.value)} disabled={isEdit}>
          {allowedBoards.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        {!canPostCorp && <p className="jf-hint">채용공고·프로젝트 구인은 승인된 법인 회원만 등록할 수 있습니다.</p>}
      </div>

      <div className="jf-field">
        <label>제목<span className="jf-req"> *</span></label>
        <input
          className={attempted && titleError ? 'jf-invalid' : ''}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => markTouched('__title')}
          placeholder="제목을 입력하세요"
        />
        {(attempted || touched.__title) && titleError && <span className="jf-error">{titleError}</span>}
      </div>

      <div className="jf-field">
        <label>프로젝트/상세 설명<span className="jf-req"> *</span></label>
        <RichTextEditor value={description} onChange={setDescription} placeholder="설명을 입력하세요" />
        {attempted && descError && <span className="jf-error">{descError}</span>}
      </div>

      <div className="jf-grid">
        {fields.filter((f) => !['features', 'images', 'attachments'].includes(f.type)).map((f) => (
          <div className={`jf-field ${f.type === 'list' ? 'jf-wide' : ''}`} key={f.key}>
            <label>{f.label}{f.required && <span className="jf-req"> *</span>}</label>
            {f.type === 'select' ? (
              <select value={details[f.key] || ''} onChange={(e) => setField(f.key, e.target.value)} onBlur={() => markTouched(f.key)}>
                <option value="">선택하세요</option>
                {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === 'list' ? (
              <textarea rows={4} value={details[f.key] || ''} onChange={(e) => setField(f.key, e.target.value)} onBlur={() => markTouched(f.key)} placeholder="한 줄에 하나씩 입력" />
            ) : (
              <input
                className={showErr(f.key) && errors[f.key] ? 'jf-invalid' : ''}
                value={details[f.key] || ''}
                onChange={(e) => setField(f.key, e.target.value)}
                onBlur={() => markTouched(f.key)}
                inputMode={f.validate === 'phone' ? 'tel' : f.validate === 'email' ? 'email' : undefined}
                placeholder={f.type === 'tags' ? '쉼표로 구분 (예: React, Python)' : f.validate === 'email' ? 'name@example.com' : f.validate === 'phone' ? '010-0000-0000' : ''}
              />
            )}
            {showErr(f.key) && errors[f.key] && <span className="jf-error">{errors[f.key]}</span>}
          </div>
        ))}
      </div>

      {/* 기능 요구사항 */}
      {fields.filter((f) => f.type === 'features').map((f) => (
        <div className="jf-field" key={f.key}>
          <label>{f.label}{featuresRequired && <span className="jf-req"> *</span>}</label>
          {featuresRequired && (
            <p className="jf-hint">외주 프로젝트는 구체적인 기능 요구사항이 있어야 등록할 수 있습니다. (기능 이름 + 상세 설명 1개 이상)</p>
          )}
          {attempted && featuresError && <span className="jf-error">{featuresError}</span>}
          {(details[f.key] || []).map((feat, idx) => (
            <div className="jf-feature" key={idx}>
              <div className="jf-feature-head">
                <strong>기능 {idx + 1}</strong>
                <button type="button" className="nt-btn danger small" onClick={() => removeFeature(f.key, idx)}>삭제</button>
              </div>
              <input placeholder="기능 이름" value={feat.name} onChange={(e) => updateFeature(f.key, idx, 'name', e.target.value)} />
              <div className="jf-feature-md">
                <span className="jf-md-label">상세 설명 (Markdown)</span>
                <MarkdownEditor
                  value={feat.detail}
                  onChange={(v) => updateFeature(f.key, idx, 'detail', v)}
                  height={360}
                  placeholder={'## 개요\n- 목표:\n- 주요 기능:\n\n### 상세 요구사항\n1. ...\n2. ...\n\n### 완료 기준(AC)\n- [ ] ...'}
                />
              </div>
              <div className="jf-feature-img">
                {feat.image ? (
                  <div className="jf-thumb">
                    <img src={feat.image} alt="기능 이미지" />
                    <button type="button" onClick={() => updateFeature(f.key, idx, 'image', '')}>✕</button>
                  </div>
                ) : (
                  <label className="jf-upload">
                    이미지 첨부
                    <input type="file" accept="image/*" hidden onChange={(e) => featureImage(f.key, idx, e.target.files?.[0])} />
                  </label>
                )}
              </div>
            </div>
          ))}
          <button type="button" className="nt-btn small" onClick={() => addFeature(f.key)}>+ 기능 추가</button>
        </div>
      ))}

      {/* 문서·소스 첨부 (PDF / ZIP / GitHub) */}
      {fields.filter((f) => f.type === 'attachments').map((f) => {
        const list = details[f.key] || [];
        const usedMB = (attachTotalBytes(list) / (1024 * 1024)).toFixed(1);
        return (
          <div className="jf-field" key={f.key}>
            <label>{f.label}</label>
            <p className="jf-hint">기능 요구사항을 뒷받침할 기획서·명세서(PDF), 프로토타입 소스(ZIP), 또는 GitHub 저장소 링크를 첨부하세요. 통합 용량 10MB 미만.</p>
            {list.length > 0 && (
              <ul className="jf-attach-list">
                {list.map((a, idx) => (
                  <li className="jf-attach-item" key={idx}>
                    <span className="jf-attach-kind">{a.kind === 'pdf' ? '📄 PDF' : a.kind === 'zip' ? '🗜️ ZIP' : '🔗 LINK'}</span>
                    <a href={a.url} target="_blank" rel="noreferrer" className="jf-attach-name">{a.name}</a>
                    {a.size ? <span className="jf-attach-size">{(a.size / (1024 * 1024)).toFixed(1)}MB</span> : null}
                    <button type="button" className="jf-attach-del" onClick={() => removeAttachment(f.key, idx)}>✕</button>
                  </li>
                ))}
              </ul>
            )}
            <div className="jf-attach-actions">
              <label className="jf-upload">
                📄 문서(PDF) 추가
                <input type="file" accept="application/pdf,.pdf" hidden onChange={(e) => { addAttachmentFile(f.key, 'pdf', e.target.files?.[0]); e.target.value = ''; }} />
              </label>
              <label className="jf-upload">
                🗜️ 소스(ZIP) 추가
                <input type="file" accept=".zip,application/zip,application/x-zip-compressed" hidden onChange={(e) => { addAttachmentFile(f.key, 'zip', e.target.files?.[0]); e.target.value = ''; }} />
              </label>
              <button type="button" className="jf-upload" onClick={() => { const u = window.prompt('GitHub 저장소 또는 문서 링크 (https://...)'); if (u) addAttachmentLink(f.key, u); }}>
                🔗 GitHub/링크 추가
              </button>
              <span className="jf-attach-used">사용 {usedMB} / 10MB</span>
            </div>
          </div>
        );
      })}

      {/* 스크린샷 */}
      {fields.filter((f) => f.type === 'images').map((f) => (
        <div className="jf-field" key={f.key}>
          <label>{f.label}</label>
          <div className="jf-images">
            {(details[f.key] || []).map((url, idx) => (
              <div className="jf-thumb" key={idx}>
                <img src={url} alt={`스크린샷 ${idx + 1}`} />
                <button type="button" onClick={() => removeImage(f.key, idx)}>✕</button>
              </div>
            ))}
            <label className="jf-upload">
              + 이미지 추가
              <input type="file" accept="image/*" multiple hidden onChange={(e) => handleScreenshotsAdd(f.key, e.target.files)} />
            </label>
          </div>
        </div>
      ))}

      <div className="jf-field">
        <label>외부 지원/문의 링크 (이메일 또는 링크, 선택)</label>
        <input
          className={(attempted || touched.__contact) && contactError ? 'jf-invalid' : ''}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          onBlur={() => markTouched('__contact')}
          placeholder="예: hr@company.com 또는 https://..."
        />
        {(attempted || touched.__contact) && contactError && <span className="jf-error">{contactError}</span>}
      </div>

      <label className="jf-toggle">
        <input type="checkbox" checked={platformApply} onChange={(e) => setPlatformApply(e.target.checked)} />
        <span>
          <strong>조합 플랫폼으로 지원받기</strong>
          <em>켜면 공고에 ‘지원하기’ 버튼이 표시되고, 지원자의 지원 내용·프로필이 ‘내 공고 관리’에 정리됩니다. (문의하기는 항상 제공)</em>
        </span>
      </label>

      {boardType === '외주 프로젝트' && (
        <div className="jf-field">
          <label>마감 기한 (날짜·시간)</label>
          <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <p className="jf-hint">⚠️ 마감 기한이 지나면 공고가 <strong>자동 삭제</strong>됩니다. 마감은 <strong>지원자 중 계약자를 지정</strong>해야 가능하며(‘내 공고 관리’), 연장하려면 이 공고를 수정해 기한을 변경하세요.</p>
        </div>
      )}

      {!isEdit && (
        <p className="jf-coin-hint">💰 공고를 등록하면 <strong>10 coin</strong>이 차감됩니다. (보유: {Number(profile?.coins ?? 0).toLocaleString()} coin)</p>
      )}
      <div className="jf-actions">
        <button type="button" className="nt-btn ghost" onClick={onCancel} disabled={submitting}>취소</button>
        <button type="submit" className="nt-btn primary" disabled={hasErrors || submitting || uploading}>
          {uploading ? '업로드 중...' : submitting ? '저장 중...' : isEdit ? '수정 완료' : '등록'}
        </button>
      </div>
    </form>
  );
}

export default JobForm;
