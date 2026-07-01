import React, { useState, useEffect } from 'react';
import CoinIcon from './CoinIcon';
import RichTextEditor from './RichTextEditor';
import BadgeIcon from './BadgeIcon';
import { sanitize } from '../lib/html';
import { TIER_BADGES, EXPERT_FIELDS, expertField, fetchExpertBadges } from '../lib/badges';
import { useI18n } from '../i18n/I18nProvider';
import './ProfilePage.css';
import { supabase } from '../lib/supabase';
import Avatar from './Avatar';
import youtubeIcon from '../assets/youtube_icon.png';
import linkedInIcon from '../assets/LinkedIn_icon.png';
import instagramIcon from '../assets/Instagram_icon.png';

// YouTube URL → 썸네일
const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url);
    let id = '';
    if (u.hostname === 'youtu.be') id = u.pathname.substring(1);
    else if (u.hostname.includes('youtube.com')) id = u.searchParams.get('v');
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  } catch { /* noop */ }
  return null;
};

const emptyProject = () => ({ title: '', description: '', skills: [], youtubeUrl: '', githubUrl: '' });

// viewUserId 가 주어지면 '다른 조합원 프로필' 읽기 전용 보기 모드로 동작한다.
// (지원자 프로필 페이지 — 본인 편집 UI는 모두 숨김)
function ProfilePage({ user, profile, onProfileUpdated, viewUserId = null, viewProfileFallback = null, onBack, onNavigate }) {
  const { t } = useI18n();
  const readOnly = !!viewUserId;
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [fetchedProfile, setFetchedProfile] = useState(null);
  const [loadingView, setLoadingView] = useState(readOnly);
  const [activeTab, setActiveTab] = useState('projects'); // 프로젝트 | 서비스 | badges
  const [editingService, setEditingService] = useState(false);
  const [serviceDraft, setServiceDraft] = useState('');
  const [savingService, setSavingService] = useState(false);
  const [expertBadges, setExpertBadges] = useState([]); // 전문가 배지(분야) 목록

  // 표시 대상의 전문가 배지 조회
  const subjectId = readOnly ? (fetchedProfile?.id || viewUserId) : profile?.id;
  useEffect(() => {
    if (!subjectId) { setExpertBadges([]); return; }
    let alive = true;
    fetchExpertBadges(subjectId).then((b) => { if (alive) setExpertBadges(b); });
    return () => { alive = false; };
  }, [subjectId]);

  // 읽기 전용 모드: 대상 조합원의 최신 프로필을 id로 조회 (RLS 차단 시 스냅샷으로 폴백)
  useEffect(() => {
    if (!viewUserId) return;
    let alive = true;
    setLoadingView(true);
    supabase.from('profiles').select('*').eq('id', viewUserId).maybeSingle()
      .then(({ data }) => { if (alive) { setFetchedProfile(data || null); setLoadingView(false); } })
      .catch(() => { if (alive) setLoadingView(false); });
    return () => { alive = false; };
  }, [viewUserId]);

  const [form, setForm] = useState(() => ({
    name: profile?.name || '',
    avatar_url: profile?.avatar_url || '',
    main_title: profile?.main_title || '',
    status: profile?.status || '',
    rate: profile?.rate || '',
    about: profile?.about || '',
    location: profile?.location || '',
    timezone: profile?.timezone || '',
    language: profile?.language || '',
    linkedin_url: profile?.linkedin_url || '',
    instagram_url: profile?.instagram_url || '',
    skills: Array.isArray(profile?.skills) ? profile.skills : [],
    projects: Array.isArray(profile?.projects) ? profile.projects : [],
  }));

  // 읽기 전용(타인 프로필) 모드 가드
  if (readOnly) {
    const subject = fetchedProfile || viewProfileFallback;
    if (loadingView && !subject) {
      return (
        <div className="profile-page-container content-area-container">
          <p style={{ color: '#94a3b8', padding: '2rem' }}>{t('profilePage.loadingProfile')}</p>
        </div>
      );
    }
    if (!subject) {
      return (
        <div className="profile-page-container content-area-container">
          {onBack && <button className="back-button back-top" onClick={onBack}>{t('profilePage.back')}</button>}
          <p style={{ color: '#94a3b8', padding: '2rem' }}>{t('profilePage.profileNotFound')}</p>
        </div>
      );
    }
  } else if (!profile) {
    return (
      <div className="profile-page-container content-area-container">
        <p style={{ color: '#94a3b8', padding: '2rem' }}>{t('profilePage.loginRequired')}</p>
      </div>
    );
  }

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const uploadAvatar = async (file) => {
    if (!file) return;
    setUploadingAvatar(true);
    const ext = (file.name.split('.').pop() || 'png').toLowerCase();
    const path = `avatars/${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('job-images').upload(path, file, { upsert: true });
    setUploadingAvatar(false);
    if (error) { alert(t('profilePage.imageUploadError', { message: error.message })); return; }
    const url = supabase.storage.from('job-images').getPublicUrl(path).data.publicUrl;
    update('avatar_url', url);
  };

  const updateProject = (i, k, v) =>
    setForm((f) => ({ ...f, projects: f.projects.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)) }));
  const addProject = () => setForm((f) => ({ ...f, projects: [...f.projects, emptyProject()] }));
  const removeProject = (i) => setForm((f) => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));

  const startEdit = () => {
    setForm({
      name: profile.name || '',
      avatar_url: profile.avatar_url || '',
      main_title: profile.main_title || '',
      status: profile.status || '',
      rate: profile.rate || '',
      about: profile.about || '',
      location: profile.location || '',
      timezone: profile.timezone || '',
      language: profile.language || '',
      linkedin_url: profile.linkedin_url || '',
      instagram_url: profile.instagram_url || '',
      skills: Array.isArray(profile.skills) ? profile.skills : [],
      projects: Array.isArray(profile.projects) ? profile.projects : [],
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = {
      name: form.name.trim(),
      avatar_url: form.avatar_url || null,
      main_title: form.main_title.trim() || null,
      status: form.status.trim() || null,
      rate: form.rate.trim() || null,
      about: form.about.trim() || null,
      location: form.location.trim() || null,
      timezone: form.timezone.trim() || null,
      language: form.language.trim() || null,
      linkedin_url: form.linkedin_url.trim() || null,
      instagram_url: form.instagram_url.trim() || null,
      skills: form.skills.filter(Boolean),
      projects: form.projects
        .filter((p) => p.title?.trim())
        .map((p) => ({
          title: p.title.trim(),
          description: p.description?.trim() || '',
          skills: Array.isArray(p.skills) ? p.skills.filter(Boolean) : [],
          youtubeUrl: p.youtubeUrl?.trim() || '',
          githubUrl: p.githubUrl?.trim() || '',
        })),
    };
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    setSaving(false);
    if (error) {
      alert(t('profilePage.saveError', { message: error.message }));
      return;
    }
    onProfileUpdated?.(data);
    setEditing(false);
  };

  // 서비스 탭: 자유 HTML 에디터로 제공 서비스 소개 작성
  const startServiceEdit = () => {
    setServiceDraft(profile?.services || '');
    setEditingService(true);
  };
  const saveService = async () => {
    setSavingService(true);
    const { data, error } = await supabase
      .from('profiles')
      .update({ services: serviceDraft || null })
      .eq('id', user.id)
      .select()
      .single();
    setSavingService(false);
    if (error) { alert(t('profilePage.saveError', { message: error.message })); return; }
    onProfileUpdated?.(data);
    setEditingService(false);
  };

  // 보기용 데이터 (읽기 전용이면 조회한 대상 프로필, 아니면 본인 프로필)
  const v = readOnly ? (fetchedProfile || viewProfileFallback || {}) : profile;
  // 대상의 수퍼관리자/관리자 여부 (수퍼관리자=왕관 아바타 강제, 관리자=왕관 오버레이)
  const subjIsSuper = (v?.email || (!readOnly && user?.email)) === 'tony@banya.ai';
  const subjIsAdmin = !!v?.is_admin;
  const skills = Array.isArray(v.skills) ? v.skills : [];
  const projects = (Array.isArray(v.projects) ? v.projects : []).map((p) => ({
    ...p,
    image: getYouTubeThumbnail(p.youtubeUrl),
  }));

  // ===== 편집 모드 =====
  if (editing) {
    return (
      <div className="profile-page-container content-area-container profile-edit">
        <main className="profile-edit-main">
          <div className="profile-edit-head">
            <h1 className="main-title">{t('profilePage.editTitle')}</h1>
            <div className="profile-edit-actions">
              <button className="pf-btn ghost" onClick={() => setEditing(false)} disabled={saving}>{t('profilePage.cancel')}</button>
              <button className="pf-btn primary" onClick={handleSave} disabled={saving || uploadingAvatar}>{saving ? t('profilePage.saving') : t('profilePage.save')}</button>
            </div>
          </div>

          <div className="pf-avatar-edit">
            <Avatar src={form.avatar_url} isSuperAdmin={subjIsSuper} isAdmin={subjIsAdmin} size={96} className="pf-avatar-preview" alt={t('profilePage.avatarAlt')} />
            <div className="pf-avatar-actions">
              <label className="pf-btn ghost">
                {uploadingAvatar ? t('profilePage.uploading') : t('profilePage.changeImage')}
                <input type="file" accept="image/*" hidden disabled={uploadingAvatar}
                  onChange={(e) => uploadAvatar(e.target.files?.[0])} />
              </label>
              {form.avatar_url && (
                <button type="button" className="pf-btn ghost" onClick={() => update('avatar_url', '')}>{t('profilePage.remove')}</button>
              )}
              <p className="pf-avatar-hint">{t('profilePage.avatarHint')}</p>
            </div>
          </div>

          <div className="pf-grid">
            <div className="pf-field"><label>{t('profilePage.name')}</label>
              <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder={t('profilePage.namePlaceholder')} /></div>
            <div className="pf-field"><label>{t('profilePage.mainTitle')}</label>
              <input value={form.main_title} onChange={(e) => update('main_title', e.target.value)} placeholder={t('profilePage.mainTitlePlaceholder')} /></div>
            <div className="pf-field"><label>{t('profilePage.status')}</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                <option value="">{t('profilePage.statusNone')}</option>
                <option value="재직중">{t('profilePage.statusEmployed')}</option>
                <option value="구직중">{t('profilePage.statusJobSeeking')}</option>
                <option value="프리랜서">{t('profilePage.statusFreelancer')}</option>
              </select></div>
            <div className="pf-field"><label>{t('profilePage.rate')}</label>
              <input value={form.rate} onChange={(e) => update('rate', e.target.value)} placeholder={t('profilePage.ratePlaceholder')} /></div>
            <div className="pf-field"><label>{t('profilePage.location')}</label>
              <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder={t('profilePage.locationPlaceholder')} /></div>
            <div className="pf-field"><label>{t('profilePage.timezone')}</label>
              <input value={form.timezone} onChange={(e) => update('timezone', e.target.value)} placeholder={t('profilePage.timezonePlaceholder')} /></div>
            <div className="pf-field"><label>{t('profilePage.language')}</label>
              <input value={form.language} onChange={(e) => update('language', e.target.value)} placeholder={t('profilePage.languagePlaceholder')} /></div>
          </div>

          <div className="pf-field"><label>{t('profilePage.about')}</label>
            <textarea rows={3} value={form.about} onChange={(e) => update('about', e.target.value)} placeholder={t('profilePage.aboutPlaceholder')} /></div>

          <div className="pf-grid">
            <div className="pf-field"><label>{t('profilePage.linkedinUrl')}</label>
              <input value={form.linkedin_url} onChange={(e) => update('linkedin_url', e.target.value)} placeholder="https://www.linkedin.com/in/..." /></div>
            <div className="pf-field"><label>{t('profilePage.instagramUrl')}</label>
              <input value={form.instagram_url} onChange={(e) => update('instagram_url', e.target.value)} placeholder="https://www.instagram.com/..." /></div>
          </div>

          <div className="pf-field"><label>{t('profilePage.skillsLabel')}</label>
            <input
              value={form.skills.join(', ')}
              onChange={(e) => update('skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder={t('profilePage.skillsPlaceholder')}
            /></div>

          <div className="pf-projects-edit">
            <div className="pf-projects-head">
              <h3>{t('profilePage.projects')}</h3>
              <button className="pf-btn small" onClick={addProject}>{t('profilePage.addProject')}</button>
            </div>
            {form.projects.length === 0 && <p className="pf-empty">{t('profilePage.noProjectsEdit')}</p>}
            {form.projects.map((p, i) => (
              <div className="pf-project-item" key={i}>
                <div className="pf-project-itemhead">
                  <strong>{t('profilePage.projectN', { n: i + 1 })}</strong>
                  <button className="pf-btn danger small" onClick={() => removeProject(i)}>{t('profilePage.delete')}</button>
                </div>
                <div className="pf-field"><label>{t('profilePage.projectTitle')}</label>
                  <input value={p.title} onChange={(e) => updateProject(i, 'title', e.target.value)} /></div>
                <div className="pf-field"><label>{t('profilePage.projectDescription')}</label>
                  <textarea rows={2} value={p.description} onChange={(e) => updateProject(i, 'description', e.target.value)} /></div>
                <div className="pf-field"><label>{t('profilePage.projectSkills')}</label>
                  <input
                    value={(Array.isArray(p.skills) ? p.skills : []).join(', ')}
                    onChange={(e) => updateProject(i, 'skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
                  /></div>
                <div className="pf-grid">
                  <div className="pf-field"><label>YouTube URL</label>
                    <input value={p.youtubeUrl} onChange={(e) => updateProject(i, 'youtubeUrl', e.target.value)} placeholder="https://youtu.be/..." /></div>
                  <div className="pf-field"><label>GitHub URL</label>
                    <input value={p.githubUrl} onChange={(e) => updateProject(i, 'githubUrl', e.target.value)} placeholder="https://github.com/..." /></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ===== 보기 모드 =====
  return (
    <div className="profile-page-container content-area-container">
      {readOnly && onBack && (
        <button className="back-button back-top profile-fullwidth-back" onClick={onBack}>{t('profilePage.backToApplicants')}</button>
      )}
      <aside className="profile-sidebar">
        {!readOnly && (
          <div className="profile-header-share">
            <button className="share-button" aria-label={t('profilePage.shareProfile')}><span className="share-icon"></span></button>
          </div>
        )}
        <div className="profile-avatar-wrapper">
          <Avatar src={v.avatar_url} isSuperAdmin={subjIsSuper} isAdmin={subjIsAdmin} size={120} className="profile-avatar" alt={t('profilePage.avatarWrapperAlt')} />
          {v.status && (
            <div className="profile-status"><span className="status-dot available"></span> {v.status}</div>
          )}
        </div>
        <h2 className="profile-name">{v.name || t('profilePage.nameUnset')}</h2>
        {!readOnly && (
          <button className="contact-button" onClick={startEdit}>
            <span className="send-icon"></span> {t('profilePage.editProfile')}
          </button>
        )}

        {/* 보유 코인 현황 (본인만) */}
        {!readOnly && (
          <div className="profile-coins" title={t('profilePage.coinTitle')}>
            <CoinIcon size={22} className="coin-icon" />
            <span className="coin-amount">{Number(profile.coins ?? 0).toLocaleString()}</span>
            <span className="coin-unit">coin</span>
            {onNavigate && (
              <button type="button" className="coin-charge-btn" onClick={() => onNavigate('coincharge')}>{t('profilePage.coinTopup')}</button>
            )}
          </div>
        )}

        {v.rate && (
          <div className="profile-section">
            <h3 className="section-title">{t('profilePage.sectionRate')}</h3>
            <div className="rate-info">{v.rate}</div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="profile-section">
            <h3 className="section-title">{t('profilePage.sectionSkills')}</h3>
            <div className="tags-container">
              {skills.map((s, i) => <span key={i} className="tag">{s}</span>)}
            </div>
          </div>
        )}

        <div className="profile-section">
          <h3 className="section-title">{t('profilePage.sectionAbout')}</h3>
          {v.about && <p className="about-text">{v.about}</p>}
          <ul className="about-details">
            {v.location && <li><span className="icon-location"></span> {v.location}</li>}
            {v.timezone && <li><span className="icon-time"></span> {v.timezone}</li>}
            {v.language && <li><span className="icon-language"></span> {v.language}</li>}
          </ul>
        </div>

        {(v.linkedin_url || v.instagram_url) && (
          <div className="profile-section">
            <h3 className="section-title">{t('profilePage.sectionLinks')}</h3>
            <div className="links-container">
              {v.linkedin_url && (
                <a href={v.linkedin_url} target="_blank" rel="noopener noreferrer" className="link-icon">
                  <img src={linkedInIcon} alt="LinkedIn" className="social-link-image" />
                </a>
              )}
              {v.instagram_url && (
                <a href={v.instagram_url} target="_blank" rel="noopener noreferrer" className="link-icon">
                  <img src={instagramIcon} alt="Instagram" className="social-link-image" />
                </a>
              )}
            </div>
          </div>
        )}
      </aside>

      <main className="profile-main-content">
        <h1 className="main-title">{v.main_title || v.name || (readOnly ? t('profilePage.applicantProfile') : t('profilePage.myInfo'))}</h1>

        <nav className="profile-tabs">
          <button className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>{t('profilePage.tabProjects')}</button>
          <button className={`tab-button ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>{t('profilePage.tabServices')}</button>
          <button className={`tab-button ${activeTab === 'badges' ? 'active' : ''}`} onClick={() => setActiveTab('badges')}>{t('profilePage.tabBadges')}</button>
        </nav>

        {/* ===== 추천 탭: 조합 관리자가 부여하는 배지 ===== */}
        {activeTab === 'badges' && (
          <div className="badge-tab">
            <p className="badge-tab-desc">{t('profilePage.badgeTabDesc')}</p>

            {/* 등급 배지 */}
            {v.tier_badge && TIER_BADGES[v.tier_badge] ? (
              <div className="badge-row tier">
                <BadgeIcon color={TIER_BADGES[v.tier_badge].color} emoji={TIER_BADGES[v.tier_badge].emoji} size={60} title={TIER_BADGES[v.tier_badge].label} />
                <div className="badge-row-text">
                  <h4 style={{ color: TIER_BADGES[v.tier_badge].color }}>{TIER_BADGES[v.tier_badge].label}</h4>
                  <p>{TIER_BADGES[v.tier_badge].desc}</p>
                </div>
              </div>
            ) : (
              <p className="pf-empty" style={{ color: '#94a3b8' }}>{t('profilePage.noTierBadge')}</p>
            )}

            {/* 전문가 배지 (복수) */}
            {expertBadges.length > 0 && (
              <div className="badge-section">
                <h4 className="badge-section-title">{t('profilePage.expertMember')}</h4>
                {expertBadges.map((b) => {
                  const f = expertField(b.field);
                  if (!f) return null;
                  return (
                    <div className="badge-row" key={b.field}>
                      <BadgeIcon color={f.color} emoji={f.emoji} size={56} title={f.label} />
                      <div className="badge-row-text">
                        <h4 style={{ color: f.color }}>{t('profilePage.expertFieldTitle', { field: f.label })}</h4>
                        <p>{t('profilePage.expertFieldDesc', { field: f.label })}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===== 서비스 탭: 프리랜서·자영업자 제공 서비스 안내 (자유 HTML) ===== */}
        {activeTab === 'services' && (
          <div className="service-tab">
            {!readOnly && !editingService && (
              <div className="service-edit-bar">
                <button className="pf-btn primary" onClick={startServiceEdit}>
                  {v.services ? t('profilePage.editService') : t('profilePage.writeService')}
                </button>
              </div>
            )}
            {!readOnly && editingService ? (
              <div className="service-editor">
                <p className="service-editor-hint">{t('profilePage.serviceEditorHint')}</p>
                <RichTextEditor
                  value={serviceDraft}
                  onChange={setServiceDraft}
                  placeholder={t('profilePage.servicePlaceholder')}
                />
                <div className="profile-edit-actions" style={{ marginTop: '1rem' }}>
                  <button className="pf-btn ghost" onClick={() => setEditingService(false)} disabled={savingService}>{t('profilePage.cancel')}</button>
                  <button className="pf-btn primary" onClick={saveService} disabled={savingService}>{savingService ? t('profilePage.saving') : t('profilePage.save')}</button>
                </div>
              </div>
            ) : v.services ? (
              <div className="service-content" dangerouslySetInnerHTML={{ __html: sanitize(v.services) }} />
            ) : (
              <p className="pf-empty" style={{ color: '#94a3b8' }}>
                {readOnly ? t('profilePage.noServiceReadOnly') : t('profilePage.noServiceOwner')}
              </p>
            )}
          </div>
        )}

        {/* ===== 프로젝트 탭 ===== */}
        {activeTab === 'projects' && (<>
        {!readOnly && (
          <div className="add-project-section">
            <div className="add-project-card" onClick={startEdit} role="button" tabIndex={0}>
              <div className="add-icon">+</div>
              <div className="add-text">
                <p><strong>{t('profilePage.addProjectTitle')}</strong></p>
                <p>{t('profilePage.addProjectDesc')}</p>
              </div>
            </div>
          </div>
        )}

        {readOnly && projects.length === 0 && (
          <p className="pf-empty" style={{ color: '#94a3b8' }}>{t('profilePage.noProjectsReadOnly')}</p>
        )}

        <div className="projects-list">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              {project.image && (
                <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}></div>
              )}
              <div className="project-details">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="tags-container">
                  {(project.skills || []).map((skill, si) => (
                    <span key={si} className="tag">{skill}</span>
                  ))}
                </div>
                <div className="project-links">
                  {project.youtubeUrl && (
                    <a href={project.youtubeUrl} target="_blank" rel="noreferrer">
                      <div className="project-link-icon"><img src={youtubeIcon} alt="YouTube" /></div>
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer">
                      <div className="project-link-icon">
                        <svg viewBox="0 0 16 16" width="22" height="22" fill="#ffffff" aria-label="GitHub" role="img">
                          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                        </svg>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        </>)}
      </main>
    </div>
  );
}

export default ProfilePage;
