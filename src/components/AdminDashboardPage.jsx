import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import BadgeIcon from './BadgeIcon';
import { EXPERT_FIELDS, expertField, fetchExpertBadges } from '../lib/badges';

const SUPER_ADMIN_EMAIL = 'tony@banya.ai';

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function AdminDashboardPage({ isAdmin, currentUserEmail, onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [indexing, setIndexing] = useState(false);
  const [reeval, setReeval] = useState(false);
  const [badgeMember, setBadgeMember] = useState(null); // 배지 수여 모달 대상
  const [badgeList, setBadgeList] = useState([]);        // 대상의 전문가 배지
  const [badgeBusy, setBadgeBusy] = useState(false);

  // 등급 배지 전체 재평가 (성실/모범/우등 자동 수여)
  const reevaluateTiers = async () => {
    setReeval(true);
    const { error } = await supabase.rpc('evaluate_all_member_tiers');
    setReeval(false);
    if (error) { alert(`재평가 오류: ${error.message}`); return; }
    alert('등급 배지 재평가가 완료되었습니다.');
  };

  // 전문가 배지 수여 모달 열기
  const openBadgeModal = async (row) => {
    setBadgeMember(row);
    setBadgeList(await fetchExpertBadges(row.id));
  };
  const awardBadge = async (field) => {
    if (!badgeMember || badgeList.some((b) => b.field === field)) return;
    setBadgeBusy(true);
    const { error } = await supabase.from('expert_badges').insert({ user_id: badgeMember.id, field });
    setBadgeBusy(false);
    if (error) { alert(`수여 오류: ${error.message}`); return; }
    setBadgeList(await fetchExpertBadges(badgeMember.id));
  };
  const revokeBadge = async (field) => {
    if (!badgeMember) return;
    setBadgeBusy(true);
    const { error } = await supabase.from('expert_badges').delete().eq('user_id', badgeMember.id).eq('field', field);
    setBadgeBusy(false);
    if (error) { alert(`회수 오류: ${error.message}`); return; }
    setBadgeList(await fetchExpertBadges(badgeMember.id));
  };

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
      const msg = String(e?.message || e);
      if (/Failed to send a request|NOT_FOUND|not be found|Failed to fetch/i.test(msg)) {
        alert("검색 함수(search Edge Function)가 배포되지 않았습니다.\n\n터미널에서 다음으로 배포한 뒤 다시 시도하세요:\nsupabase functions deploy search --project-ref <프로젝트>");
      } else {
        alert(`색인 오류: ${msg}`);
      }
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
          {onBack && <button type="button" className="admin-back-btn" onClick={onBack}>← 관리자 대시보드</button>}
          <h3>회원가입 현황 대시보드</h3>
          <p className="section-lead">전체 조합원 정보를 조회하고 관리자 권한을 부여할 수 있습니다.</p>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="admin-action-btn grant" onClick={reindexSearch} disabled={indexing}>
              {indexing ? '색인 중...' : '🧠 검색 의미색인 갱신'}
            </button>
            <button className="admin-action-btn grant" onClick={reevaluateTiers} disabled={reeval}>
              {reeval ? '재평가 중...' : '🏅 등급 배지 재평가'}
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
                    <th>배지</th>
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
                          <button type="button" className="admin-action-btn grant" onClick={() => openBadgeModal(r)}>
                            🎖️ 배지
                          </button>
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

      {/* 전문가 배지 수여 모달 */}
      {badgeMember && (
        <div className="b2b-overlay" onClick={() => setBadgeMember(null)}>
          <div className="b2b-modal badge-modal" onClick={(e) => e.stopPropagation()}>
            <button className="b2b-close" onClick={() => setBadgeMember(null)} aria-label="닫기">✕</button>
            <div className="b2b-head">
              <span className="b2b-badge">전문가 배지 수여</span>
              <h3>{badgeMember.name || '회원'}</h3>
              <p>분야를 클릭해 배지를 수여하거나, 수여된 배지를 다시 클릭해 회수합니다. (복수 수여 가능)</p>
            </div>
            <div className="badge-grid">
              {EXPERT_FIELDS.map((f) => {
                const owned = badgeList.some((b) => b.field === f.key);
                return (
                  <button
                    key={f.key}
                    type="button"
                    className={`badge-pick ${owned ? 'owned' : ''}`}
                    disabled={badgeBusy}
                    onClick={() => (owned ? revokeBadge(f.key) : awardBadge(f.key))}
                    title={owned ? '클릭해 회수' : '클릭해 수여'}
                  >
                    <BadgeIcon color={f.color} emoji={f.emoji} size={40} title={f.label} />
                    <span className="badge-pick-label">{f.label}</span>
                    {owned && <span className="badge-pick-check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboardPage;
