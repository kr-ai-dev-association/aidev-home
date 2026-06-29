import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import RichTextEditor from './RichTextEditor';
import { isEmptyHtml } from '../lib/html';
import { BOARD_TYPES, CORP_ONLY, FIELD_DEFS } from '../lib/jobFields';

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
  return val || '';
};
const fromEditable = (raw, type) => {
  if (type === 'list') return String(raw || '').split('\n').map((s) => s.trim()).filter(Boolean);
  if (type === 'tags') return String(raw || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (type === 'features') return (raw || []).filter((f) => f && f.name && f.name.trim());
  if (type === 'images') return raw || [];
  return String(raw || '').trim();
};

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
  const hasErrors = !!titleError || !!descError || !!contactError || Object.keys(errors).length > 0;

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

    const payload = { board_type: boardType, title: title.trim(), description, contact: contact.trim() || null, details: detailsOut };
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
        {fields.filter((f) => f.type !== 'features' && f.type !== 'images').map((f) => (
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
          <label>{f.label}</label>
          {(details[f.key] || []).map((feat, idx) => (
            <div className="jf-feature" key={idx}>
              <div className="jf-feature-head">
                <strong>기능 {idx + 1}</strong>
                <button type="button" className="nt-btn danger small" onClick={() => removeFeature(f.key, idx)}>삭제</button>
              </div>
              <input placeholder="기능 이름" value={feat.name} onChange={(e) => updateFeature(f.key, idx, 'name', e.target.value)} />
              <textarea rows={2} placeholder="상세 설명" value={feat.detail} onChange={(e) => updateFeature(f.key, idx, 'detail', e.target.value)} />
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
        <label>지원/문의 (이메일 또는 링크)</label>
        <input
          className={(attempted || touched.__contact) && contactError ? 'jf-invalid' : ''}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          onBlur={() => markTouched('__contact')}
          placeholder="예: hr@company.com 또는 https://..."
        />
        {(attempted || touched.__contact) && contactError && <span className="jf-error">{contactError}</span>}
      </div>

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
