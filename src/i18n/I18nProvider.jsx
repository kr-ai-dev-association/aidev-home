import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// 경량 i18n — 의존성 없이 React Context 로 동작.
// 사용: const { t, lang, setLang } = useI18n();  t('nav.community'), t('home.heroTitle', { name })
// 사전은 영역별 파일로 분리: src/i18n/ko/*.js, src/i18n/en/*.js (각 파일 default export = { 네임스페이스: {...} })
// 새 파일을 추가하면 import.meta.glob 이 자동 병합합니다(병렬 작업 시 파일 충돌 없음).
const koModules = import.meta.glob('./ko/*.js', { eager: true });
const enModules = import.meta.glob('./en/*.js', { eager: true });
function mergeDicts(modules) {
  const out = {};
  for (const p in modules) Object.assign(out, modules[p].default || {});
  return out;
}
const DICTS = { ko: mergeDicts(koModules), en: mergeDicts(enModules) };

const I18nContext = createContext({ lang: 'ko', setLang: () => {}, t: (k) => k });

function resolve(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function getInitialLang() {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('lang');
    if (saved === 'ko' || saved === 'en') return saved;
  }
  return 'ko';
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  useEffect(() => {
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l) => {
    const next = l === 'en' ? 'en' : 'ko';
    setLangState(next);
    try { localStorage.setItem('lang', next); } catch { /* noop */ }
  }, []);

  const t = useCallback((key, vars) => {
    let s = resolve(DICTS[lang], key);
    if (s == null) s = resolve(DICTS.ko, key); // 폴백: 한국어 원문
    if (s == null) return key;                 // 키 자체 반환(누락 표시)
    if (vars && typeof s === 'string') {
      for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
    }
    return s;
  }, [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
