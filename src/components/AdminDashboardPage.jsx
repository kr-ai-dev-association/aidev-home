import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const SUPER_ADMIN_EMAIL = 'tony@banya.ai';

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function AdminDashboardPage({ isAdmin, currentUserEmail }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [indexing, setIndexing] = useState(false);

  const reindexSearch = async () => {
    setIndexing(true);
    let total = 0;
    try {
      // 임베딩이 남지 않을 때까지 반복 색인
      for (let i = 0; i < 20; i++) {
        const { data, error } = await supabase.functions.invoke('search', { body: { action: 'index' } });
        if (error) throw error;
        total += data?.updated || 0;
        if (!data?.updated) break;
      }
      alert(`검색 색인 완료: ${total}건 임베딩`);
    } catch (e) {
      alert(`색인 오류: ${e.message || e}`);
    }
    setIndexing(false);
  };

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) fetchProfiles();
  }, [isAdmin, fetchProfiles]);

  const toggleAdmin = async (row) => {
    const next = !row.is_admin;
    setBusyId(row.id);
    const { error } = await supabase.rpc('set_admin', { target_id: row.id, value: next });
    setBusyId(null);
    if (error) {
      alert(`권한 변경 오류: ${error.message}`);
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_admin: next } : r)));
  };

  const approveMember = async (row) => {
    setBusyId(row.id);
    const { error } = await supabase.rpc('set_approval', { target_id: row.id, status: 'approved' });
    setBusyId(null);
    if (error) {
      alert(`승인 오류: ${error.message}`);
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, approval_status: 'approved' } : r)));
  };

  const toggleMember = async (row) => {
    const next = !row.is_member;
    setBusyId(row.id);
    const { error } = await supabase.rpc('set_member', { target_id: row.id, value: next });
    setBusyId(null);
    if (error) {
      alert(`정회원 변경 오류: ${error.message}`);
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_member: next } : r)));
  };

  if (!isAdmin) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services">
            <h3>접근 권한이 없습니다</h3>
            <p className="section-lead">이 페이지는 관리자만 열람할 수 있습니다.</p>
          </section>
        </div>
      </div>
    );
  }

  const total = rows.length;
  const individuals = rows.filter((r) => r.account_type === 'individual').length;
  const corporates = rows.filter((r) => r.account_type === 'corporate').length;
  const admins = rows.filter((r) => r.is_admin).length;
  const members = rows.filter((r) => r.is_member).length;

  const pending = rows.filter((r) => r.approval_status === 'pending').length;

  const stats = [
    { num: total, label: '전체 회원' },
    { num: individuals, label: '개인' },
    { num: corporates, label: '법인' },
    { num: members, label: '정회원' },
    { num: admins, label: '관리자' },
    { num: pending, label: '승인 대기' },
  ];

  return (
    <div className="home-landing admin-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          <h3>회원가입 현황 대시보드</h3>
          <p className="section-lead">전체 조합원 정보를 조회하고 관리자 권한을 부여할 수 있습니다.</p>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button className="admin-action-btn grant" onClick={reindexSearch} disabled={indexing}>
              {indexing ? '색인 중...' : '🧠 검색 의미색인 갱신'}
            </button>
          </div>

          {/* 통계 */}
          <div className="eval-stats admin-stats">
            {stats.map((s) => (
              <div className="eval-stat" key={s.label}>
                <strong className="eval-stat-num">{s.num}</strong>
                <span className="eval-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* 회원 테이블 */}
          {loading ? (
            <p className="admin-msg">불러오는 중...</p>
          ) : error ? (
            <p className="admin-msg admin-error">오류: {error}</p>
          ) : rows.length === 0 ? (
            <p className="admin-msg">등록된 회원이 없습니다.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>구분</th>
                    <th>소속 / 카테고리</th>
                    <th>이메일</th>
                    <th>전화번호</th>
                    <th>가입일</th>
                    <th>승인</th>
                    <th>정회원</th>
                    <th>권한</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => {
                    const isSuper = r.email === SUPER_ADMIN_EMAIL;
                    const affiliation =
                      r.account_type === 'corporate'
                        ? [r.company, r.position].filter(Boolean).join(' · ') || '-'
                        : r.category || '-';
                    return (
                      <tr key={r.id}>
                        <td className="cell-name">{r.name || '-'}</td>
                        <td>
                          <span className={`type-pill ${r.account_type}`}>
                            {r.account_type === 'corporate' ? '법인' : '개인'}
                          </span>
                        </td>
                        <td>{affiliation}</td>
                        <td className="cell-email">{r.email || '-'}</td>
                        <td>{r.phone || '-'}</td>
                        <td>{formatDate(r.created_at)}</td>
                        <td>
                          {r.approval_status === 'pending' ? (
                            <button
                              type="button"
                              className="admin-action-btn grant"
                              disabled={busyId === r.id}
                              onClick={() => approveMember(r)}
                            >
                              {busyId === r.id ? '처리 중' : '⏳ 승인하기'}
                            </button>
                          ) : (
                            <span className="role-badge approved">✅ 승인</span>
                          )}
                        </td>
                        <td>
                          {isSuper ? (
                            <span className="role-badge super">정회원</span>
                          ) : (
                            <button
                              type="button"
                              className={`admin-action-btn ${r.is_member ? 'revoke' : 'grant'}`}
                              disabled={busyId === r.id}
                              onClick={() => toggleMember(r)}
                            >
                              {busyId === r.id ? '처리 중' : r.is_member ? '정회원 해제' : '정회원 부여'}
                            </button>
                          )}
                        </td>
                        <td>
                          {isSuper ? (
                            <span className="role-badge super">슈퍼관리자</span>
                          ) : r.is_admin ? (
                            <span className="role-badge admin">관리자</span>
                          ) : (
                            <span className="role-badge member">일반</span>
                          )}
                        </td>
                        <td>
                          {isSuper ? (
                            <span className="admin-lock">—</span>
                          ) : (
                            <button
                              type="button"
                              className={`admin-action-btn ${r.is_admin ? 'revoke' : 'grant'}`}
                              disabled={busyId === r.id}
                              onClick={() => toggleAdmin(r)}
                            >
                              {busyId === r.id ? '처리 중' : r.is_admin ? '권한 해제' : '관리자 부여'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
