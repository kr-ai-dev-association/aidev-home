import React, { useEffect, useState } from 'react';
import './MediationPage.css';
import { supabase } from '../lib/supabase';
import { useI18n } from '../i18n/I18nProvider';

// 관리자 대시보드 허브 — 각 관리 기능으로 이동하는 단일 진입점
const CARDS = [
  { key: 'admin', emoji: '👥', titleKey: 'admin.hubCardAdminTitle', descKey: 'admin.hubCardAdminDesc', countKey: 'pending', countLabelKey: 'admin.hubCardAdminCount' },
  { key: 'b2brequests', emoji: '🏢', titleKey: 'admin.hubCardB2bTitle', descKey: 'admin.hubCardB2bDesc', countKey: 'b2b', countLabelKey: 'admin.hubCardB2bCount' },
  { key: 'disputes', emoji: '🛡️', titleKey: 'admin.hubCardDisputesTitle', descKey: 'admin.hubCardDisputesDesc', countKey: 'disputes', countLabelKey: 'admin.hubCardDisputesCount' },
  { key: 'mediations-admin', emoji: '⚖️', titleKey: 'admin.hubCardMediationsTitle', descKey: 'admin.hubCardMediationsDesc', countKey: 'mediations', countLabelKey: 'admin.hubCardMediationsCount' },
  { key: 'coincharges', emoji: '🪙', titleKey: 'admin.hubCardCoinChargesTitle', descKey: 'admin.hubCardCoinChargesDesc' },
];

function AdminHubPage({ isAdmin, onNavigate }) {
  const { t } = useI18n();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    if (!isAdmin) return;
    let active = true;
    (async () => {
      const headCount = async (table, build) => {
        let q = supabase.from(table).select('id', { count: 'exact', head: true });
        q = build(q);
        const { count } = await q;
        return count || 0;
      };
      try {
        const [pending, b2b, disputes, mediations] = await Promise.all([
          headCount('profiles', (q) => q.eq('approval_status', 'pending')),
          headCount('b2b_requests', (q) => q.eq('status', 'new')),
          headCount('disputes', (q) => q.eq('status', 'open')),
          headCount('mediations', (q) => q.in('status', ['submitted', 'reviewing', 'assigned', 'in_progress'])),
        ]);
        if (active) setCounts({ pending, b2b, disputes, mediations });
      } catch { /* 카운트는 부가 정보 — 실패해도 카드는 표시 */ }
    })();
    return () => { active = false; };
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services"><h3>{t('admin.noAccessTitle')}</h3>
            <p className="section-lead">{t('admin.noAccessDesc')}</p></section>
        </div>
      </div>
    );
  }

  return (
    <div className="home-landing admin-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          <h3>{t('admin.hubTitle')}</h3>
          <p className="section-lead">{t('admin.hubLead')}</p>
          <div className="admin-hub-grid">
            {CARDS.map((c) => {
              const n = counts[c.countKey];
              return (
                <button type="button" className="admin-hub-card" key={c.key} onClick={() => onNavigate(c.key)}>
                  <span className="admin-hub-emoji" aria-hidden="true">{c.emoji}</span>
                  <div className="admin-hub-text">
                    <h4>{t(c.titleKey)}</h4>
                    <p>{t(c.descKey)}</p>
                  </div>
                  {n > 0 && <span className="admin-hub-badge">{t(c.countLabelKey)} {n}</span>}
                  <span className="admin-hub-arrow" aria-hidden="true">›</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminHubPage;
