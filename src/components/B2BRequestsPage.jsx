import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useI18n } from '../i18n/I18nProvider';

const STATUS = {
  new: { labelKey: 'admin.b2bStatusNew', color: '#67e8f9' },
  in_progress: { labelKey: 'admin.b2bStatusInProgress', color: '#fcd34d' },
  done: { labelKey: 'admin.b2bStatusDone', color: '#4ade80' },
};

function fmt(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function B2BRequestsPage({ isAdmin, onBack }) {
  const { t } = useI18n();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('b2b_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { if (isAdmin) fetchRows(); }, [isAdmin, fetchRows]);

  const setStatus = async (row, status) => {
    setBusyId(row.id);
    const { error } = await supabase.from('b2b_requests').update({ status }).eq('id', row.id);
    setBusyId(null);
    if (error) { alert(t('admin.statusChangeError', { msg: error.message })); return; }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));
  };

  if (!isAdmin) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services">
            <h3>{t('admin.noAccessTitle')}</h3>
            <p className="section-lead">{t('admin.noAccessDesc')}</p>
          </section>
        </div>
      </div>
    );
  }

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.type === filter);
  const counts = {
    all: rows.length,
    '조합 B2B 평가 신청': rows.filter((r) => r.type === '조합 B2B 평가 신청').length,
    '조합 B2B 견적 문의': rows.filter((r) => r.type === '조합 B2B 견적 문의').length,
  };

  return (
    <div className="home-landing admin-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          {onBack && <button type="button" className="admin-back-btn" onClick={onBack}>{t('admin.backToHub')}</button>}
          <h3>{t('admin.b2bTitle')}</h3>
          <p className="section-lead">{t('admin.b2bLead')}</p>

          <div className="b2b-filter">
            {[
              { k: 'all', label: t('admin.b2bFilterAll', { count: counts.all }) },
              { k: '조합 B2B 평가 신청', label: t('admin.b2bFilterEval', { count: counts['조합 B2B 평가 신청'] }) },
              { k: '조합 B2B 견적 문의', label: t('admin.b2bFilterQuote', { count: counts['조합 B2B 견적 문의'] }) },
            ].map((f) => (
              <button key={f.k} className={`b2b-filter-btn ${filter === f.k ? 'active' : ''}`} onClick={() => setFilter(f.k)}>
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="admin-msg">{t('admin.loading')}</p>
          ) : error ? (
            <p className="admin-msg admin-error">{t('admin.error', { msg: error })}</p>
          ) : filtered.length === 0 ? (
            <p className="admin-msg">{t('admin.b2bNoRequests')}</p>
          ) : (
            <div className="b2b-list">
              {filtered.map((r) => {
                const st = STATUS[r.status] || STATUS.new;
                return (
                  <div className="b2b-card" key={r.id}>
                    <div className="b2b-card-top">
                      <span className="b2b-type-pill">{r.type}</span>
                      <span className="b2b-status" style={{ color: st.color, borderColor: st.color }}>{t(st.labelKey)}</span>
                      <span className="b2b-date">{fmt(r.created_at)}</span>
                    </div>
                    <div className="b2b-card-body">
                      <h4>{r.company}</h4>
                      <p className="b2b-contact">
                        {r.contact_name} · <a href={`mailto:${r.email}`}>{r.email}</a>{r.phone ? ` · ${r.phone}` : ''}
                      </p>
                      <p className="b2b-message">{r.message}</p>
                      <p className="b2b-requester">{t('admin.b2bRequester', { name: r.requester_name || '-' })}</p>
                    </div>
                    <div className="b2b-card-actions">
                      {Object.entries(STATUS).map(([k, v]) => (
                        <button key={k} className={`b2b-status-btn ${r.status === k ? 'active' : ''}`}
                          disabled={busyId === r.id || r.status === k} onClick={() => setStatus(r, k)}>
                          {t(v.labelKey)}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default B2BRequestsPage;
