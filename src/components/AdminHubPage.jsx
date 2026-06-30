import React, { useEffect, useState } from 'react';
import './MediationPage.css';
import { supabase } from '../lib/supabase';

// 관리자 대시보드 허브 — 각 관리 기능으로 이동하는 단일 진입점
const CARDS = [
  { key: 'admin', emoji: '👥', title: '회원현황', desc: '회원 승인·정회원 부여 및 회원 관리', countKey: 'pending', countLabel: '승인 대기' },
  { key: 'b2brequests', emoji: '🏢', title: 'B2B 의뢰', desc: '기업·조합원의 견적·평가 의뢰 처리', countKey: 'b2b', countLabel: '신규' },
  { key: 'disputes', emoji: '🛡️', title: '외주 분쟁 관리', desc: '외주 계약 분쟁 접수·조정', countKey: 'disputes', countLabel: '접수' },
  { key: 'mediations-admin', emoji: '⚖️', title: '조정 의뢰 관리', desc: '노동·계약 분쟁 조정 의뢰 처리', countKey: 'mediations', countLabel: '진행 중' },
];

function AdminHubPage({ isAdmin, onNavigate }) {
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
          <section className="section-services"><h3>접근 권한이 없습니다</h3>
            <p className="section-lead">이 페이지는 관리자만 열람할 수 있습니다.</p></section>
        </div>
      </div>
    );
  }

  return (
    <div className="home-landing admin-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          <h3>관리자 대시보드</h3>
          <p className="section-lead">조합 운영에 필요한 관리 기능을 한 곳에서 이용합니다. 각 항목을 선택해 관리 페이지로 이동하세요.</p>
          <div className="admin-hub-grid">
            {CARDS.map((c) => {
              const n = counts[c.countKey];
              return (
                <button type="button" className="admin-hub-card" key={c.key} onClick={() => onNavigate(c.key)}>
                  <span className="admin-hub-emoji" aria-hidden="true">{c.emoji}</span>
                  <div className="admin-hub-text">
                    <h4>{c.title}</h4>
                    <p>{c.desc}</p>
                  </div>
                  {n > 0 && <span className="admin-hub-badge">{c.countLabel} {n}</span>}
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
