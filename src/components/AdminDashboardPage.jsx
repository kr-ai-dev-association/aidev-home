import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import BadgeIcon from './BadgeIcon';
import { EXPERT_FIELDS, expertField, fetchExpertBadges } from '../lib/badges';
import { useI18n } from '../i18n/I18nProvider';

const SUPER_ADMIN_EMAIL = 'tony@banya.ai';

function formatDate(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function AdminDashboardPage({ isAdmin, currentUserEmail, onBack }) {
  const { t } = useI18n();
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
    if (error) { alert(t('admin.reevalError', { msg: error.message })); return; }
    alert(t('admin.reevalDone'));
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
    if (error) { alert(t('admin.awardError', { msg: error.message })); return; }
    setBadgeList(await fetchExpertBadges(badgeMember.id));
  };
  const revokeBadge = async (field) => {
    if (!badgeMember) return;
    setBadgeBusy(true);
    const { error } = await supabase.from('expert_badges').delete().eq('user_id', badgeMember.id).eq('field', field);
    setBadgeBusy(false);
    if (error) { alert(t('admin.revokeError', { msg: error.message })); return; }
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
      alert(t('admin.indexDone', { total }));
    } catch (e) {
      const msg = String(e?.message || e);
      if (/Failed to send a request|NOT_FOUND|not be found|Failed to fetch/i.test(msg)) {
        alert(t('admin.searchFnNotDeployed'));
      } else {
        alert(t('admin.indexError', { msg }));
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
      alert(t('admin.roleChangeError', { msg: error.message }));
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_admin: next } : r)));
  };

  const approveMember = async (row) => {
    setBusyId(row.id);
    const { error } = await supabase.rpc('set_approval', { target_id: row.id, status: 'approved' });
    setBusyId(null);
    if (error) {
      alert(t('admin.approveError', { msg: error.message }));
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
      alert(t('admin.memberChangeError', { msg: error.message }));
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, is_member: next } : r)));
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

  const total = rows.length;
  const individuals = rows.filter((r) => r.account_type === 'individual').length;
  const corporates = rows.filter((r) => r.account_type === 'corporate').length;
  const admins = rows.filter((r) => r.is_admin).length;
  const members = rows.filter((r) => r.is_member).length;

  const pending = rows.filter((r) => r.approval_status === 'pending').length;

  const stats = [
    { num: total, label: t('admin.statTotal') },
    { num: individuals, label: t('admin.statIndividual') },
    { num: corporates, label: t('admin.statCorporate') },
    { num: members, label: t('admin.statMember') },
    { num: admins, label: t('admin.statAdmin') },
    { num: pending, label: t('admin.statPending') },
  ];

  return (
    <div className="home-landing admin-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          {onBack && <button type="button" className="admin-back-btn" onClick={onBack}>{t('admin.backToHub')}</button>}
          <h3>{t('admin.dashTitle')}</h3>
          <p className="section-lead">{t('admin.dashLead')}</p>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="admin-action-btn grant" onClick={reindexSearch} disabled={indexing}>
              {indexing ? t('admin.reindexing') : t('admin.reindexBtn')}
            </button>
            <button className="admin-action-btn grant" onClick={reevaluateTiers} disabled={reeval}>
              {reeval ? t('admin.reevaluating') : t('admin.reevalBtn')}
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
            <p className="admin-msg">{t('admin.loading')}</p>
          ) : error ? (
            <p className="admin-msg admin-error">{t('admin.error', { msg: error })}</p>
          ) : rows.length === 0 ? (
            <p className="admin-msg">{t('admin.noMembers')}</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.colName')}</th>
                    <th>{t('admin.colType')}</th>
                    <th>{t('admin.colAffiliation')}</th>
                    <th>{t('admin.colEmail')}</th>
                    <th>{t('admin.colPhone')}</th>
                    <th>{t('admin.colJoined')}</th>
                    <th>{t('admin.colApproval')}</th>
                    <th>{t('admin.colMember')}</th>
                    <th>{t('admin.colRole')}</th>
                    <th>{t('admin.colBadge')}</th>
                    <th>{t('admin.colManage')}</th>
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
                            {r.account_type === 'corporate' ? t('admin.typeCorporate') : t('admin.typeIndividual')}
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
                              {busyId === r.id ? t('admin.processing') : t('admin.approveBtn')}
                            </button>
                          ) : (
                            <span className="role-badge approved">{t('admin.approvedBadge')}</span>
                          )}
                        </td>
                        <td>
                          {isSuper ? (
                            <span className="role-badge super">{t('admin.memberBadge')}</span>
                          ) : (
                            <button
                              type="button"
                              className={`admin-action-btn ${r.is_member ? 'revoke' : 'grant'}`}
                              disabled={busyId === r.id}
                              onClick={() => toggleMember(r)}
                            >
                              {busyId === r.id ? t('admin.processing') : r.is_member ? t('admin.revokeMember') : t('admin.grantMember')}
                            </button>
                          )}
                        </td>
                        <td>
                          {isSuper ? (
                            <span className="role-badge super">{t('admin.superAdminBadge')}</span>
                          ) : r.is_admin ? (
                            <span className="role-badge admin">{t('admin.adminBadge')}</span>
                          ) : (
                            <span className="role-badge member">{t('admin.generalBadge')}</span>
                          )}
                        </td>
                        <td>
                          <button type="button" className="admin-action-btn grant" onClick={() => openBadgeModal(r)}>
                            {t('admin.badgeBtn')}
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
                              {busyId === r.id ? t('admin.processing') : r.is_admin ? t('admin.revokeAdmin') : t('admin.grantAdmin')}
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
            <button className="b2b-close" onClick={() => setBadgeMember(null)} aria-label={t('admin.closeAria')}>✕</button>
            <div className="b2b-head">
              <span className="b2b-badge">{t('admin.badgeModalTitle')}</span>
              <h3>{badgeMember.name || t('admin.badgeModalMemberFallback')}</h3>
              <p>{t('admin.badgeModalDesc')}</p>
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
                    title={owned ? t('admin.badgeRevokeHint') : t('admin.badgeAwardHint')}
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
