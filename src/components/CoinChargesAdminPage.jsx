import React, { useEffect, useState, useCallback, useMemo } from 'react';
import './MediationPage.css';
import { supabase } from '../lib/supabase';

function fmtDateTime(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function CoinChargesAdminPage({ isAdmin, onBack }) {
  const [orders, setOrders] = useState([]);
  const [profMap, setProfMap] = useState({});
  const [prodMap, setProdMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState('date'); // 'date' | 'email'
  const [sortDir, setSortDir] = useState('desc'); // 'asc' | 'desc'

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: ord }, { data: profs }, { data: prods }] = await Promise.all([
      supabase.from('coin_orders').select('order_id, user_id, variant_id, coins, created_at').order('created_at', { ascending: false }),
      supabase.from('profiles').select('id, name, email'),
      supabase.from('coin_products').select('variant_id, price_label, label'),
    ]);
    setOrders(ord || []);
    setProfMap(Object.fromEntries((profs || []).map((p) => [p.id, p])));
    setProdMap(Object.fromEntries((prods || []).map((p) => [p.variant_id, p])));
    setLoading(false);
  }, []);

  useEffect(() => { if (isAdmin) load(); }, [isAdmin, load]);

  const rows = useMemo(() => {
    const enriched = orders.map((o) => {
      const p = profMap[o.user_id] || {};
      const prod = prodMap[o.variant_id] || {};
      return { ...o, name: p.name || '-', email: p.email || '-', price: prod.price_label || '-' };
    });
    const query = q.trim().toLowerCase();
    const filtered = query
      ? enriched.filter((r) => r.name.toLowerCase().includes(query) || r.email.toLowerCase().includes(query))
      : enriched;
    const dir = sortDir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sortKey === 'email') return a.email.localeCompare(b.email) * dir;
      return (new Date(a.created_at) - new Date(b.created_at)) * dir;
    });
  }, [orders, profMap, prodMap, q, sortKey, sortDir]);

  const totalCoins = useMemo(() => rows.reduce((s, r) => s + Number(r.coins || 0), 0), [rows]);

  const toggleSort = (key) => {
    if (sortKey === key) { setSortDir((d) => (d === 'asc' ? 'desc' : 'asc')); }
    else { setSortKey(key); setSortDir(key === 'email' ? 'asc' : 'desc'); }
  };
  const arrow = (key) => (sortKey !== key ? ' ↕' : sortDir === 'asc' ? ' ▲' : ' ▼');

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
          {onBack && <button type="button" className="admin-back-btn" onClick={onBack}>← 관리자 대시보드</button>}
          <h3>코인 충전 내역</h3>
          <p className="section-lead">전체 회원의 코인 충전 결제 내역입니다. 총 {rows.length}건 · 누적 {totalCoins.toLocaleString()} coin</p>

          <div className="cca-toolbar">
            <input
              type="text"
              className="cca-search"
              placeholder="사용자명 또는 이메일로 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="cca-sort">
              <button type="button" className={`b2b-status-btn ${sortKey === 'date' ? 'active' : ''}`} onClick={() => toggleSort('date')}>날짜순{sortKey === 'date' ? arrow('date') : ''}</button>
              <button type="button" className={`b2b-status-btn ${sortKey === 'email' ? 'active' : ''}`} onClick={() => toggleSort('email')}>이메일순{sortKey === 'email' ? arrow('email') : ''}</button>
            </div>
          </div>

          {loading ? (
            <p className="admin-msg">불러오는 중...</p>
          ) : rows.length === 0 ? (
            <p className="admin-msg">{q.trim() ? '검색 결과가 없습니다.' : '코인 충전 내역이 없습니다.'}</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th className="cca-th" onClick={() => toggleSort('date')}>날짜{arrow('date')}</th>
                    <th>사용자명</th>
                    <th className="cca-th" onClick={() => toggleSort('email')}>이메일{arrow('email')}</th>
                    <th>충전 코인</th>
                    <th>결제 금액</th>
                    <th>주문번호</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.order_id}>
                      <td>{fmtDateTime(r.created_at)}</td>
                      <td>{r.name}</td>
                      <td>{r.email}</td>
                      <td className="cca-coins">+{Number(r.coins).toLocaleString()}</td>
                      <td>{r.price}</td>
                      <td className="cca-order">{r.order_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CoinChargesAdminPage;
