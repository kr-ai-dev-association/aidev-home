import React, { useState, useEffect, useRef, useCallback } from 'react';
import './SearchOverlay.css';
import { supabase } from '../lib/supabase';

const SOURCE_LABEL = { job: '취업', topic: '커뮤니티', post: '커뮤니티' };
const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'job', label: '취업' },
  { key: 'community', label: '커뮤니티' },
];

function SearchOverlay({ open, initialKind = 'all', initialQuery = '', onClose, onOpenJob, onOpenTopic }) {
  const [q, setQ] = useState('');
  const [kind, setKind] = useState('all');
  const [semantic, setSemantic] = useState(false); // 의미(코사인) 검색 모드
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  const run = useCallback(async (term, k, sem) => {
    const t = (term ?? '').trim();
    if (!t) { setResults([]); setSearched(false); return; }
    setLoading(true); setSearched(true);
    const kindParam = k === 'all' ? null : k;
    if (sem) {
      // 의미 유사도 검색 (Edge Function + gte-small)
      const { data, error } = await supabase.functions.invoke('search', {
        body: { action: 'search', q: t, kind: kindParam },
      });
      setResults(error ? [] : (data?.results || []));
    } else {
      const { data, error } = await supabase.rpc('search_all', { q: t, kind: kindParam });
      setResults(error ? [] : (data || []));
    }
    setLoading(false);
  }, []);

  // 열릴 때 초기화 + (초기 검색어 있으면 자동 검색)
  useEffect(() => {
    if (open) {
      setQ(initialQuery || '');
      setKind(initialKind || 'all');
      setResults([]); setSearched(false);
      setTimeout(() => inputRef.current?.focus(), 50);
      if (initialQuery && initialQuery.trim()) run(initialQuery, initialKind || 'all', semantic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialQuery, initialKind, run]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const changeKind = (k) => { setKind(k); if (q.trim()) run(q, k, semantic); };
  const toggleSemantic = () => { const s = !semantic; setSemantic(s); if (q.trim()) run(q, kind, s); };

  const goto = (r) => {
    onClose();
    if (r.source === 'job') onOpenJob(r.ref_id);
    else onOpenTopic(r.ref_id);
  };

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-row">
          <span className="search-lead-icon">🔍</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') run(q, kind, semantic); }}
            placeholder="취업·커뮤니티 통합 검색"
          />
          <button className="search-go" onClick={() => run(q, kind, semantic)}>검색</button>
          <button className="search-close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        <div className="search-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`search-filter ${kind === f.key ? 'active' : ''}`}
              onClick={() => changeKind(f.key)}
            >
              {f.label}
            </button>
          ))}
          <button
            className={`search-filter semantic-toggle ${semantic ? 'active' : ''}`}
            onClick={toggleSemantic}
            title="의미 유사도(코사인) 기반 검색"
          >
            🧠 의미 검색
          </button>
        </div>

        <div className="search-results">
          {loading ? (
            <p className="search-msg">검색 중...</p>
          ) : results.length > 0 ? (
            results.map((r) => (
              <div className="search-result-item" key={`${r.source}-${r.id}`} onClick={() => goto(r)}>
                <span className={`result-badge ${r.source}`}>{SOURCE_LABEL[r.source] || r.source}</span>
                <div className="result-text">
                  <p className="result-title">{r.title}</p>
                  {r.snippet && <p className="result-snippet">{r.snippet}</p>}
                </div>
              </div>
            ))
          ) : searched ? (
            <p className="search-msg">검색 결과가 없습니다.</p>
          ) : (
            <p className="search-msg">키워드를 입력하고 Enter를 누르세요.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
