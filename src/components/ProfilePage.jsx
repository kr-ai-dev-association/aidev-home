import React, { useState } from 'react';
import CoinIcon from './CoinIcon';
import './ProfilePage.css';
import { supabase } from '../lib/supabase';
import profilePlaceholder from '../assets/profile-placeholder.png';
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

function ProfilePage({ user, profile, onProfileUpdated }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    name: profile?.name || '',
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

  if (!profile) {
    return (
      <div className="profile-page-container content-area-container">
        <p style={{ color: '#94a3b8', padding: '2rem' }}>로그인 후 이용할 수 있습니다.</p>
      </div>
    );
  }

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const updateProject = (i, k, v) =>
    setForm((f) => ({ ...f, projects: f.projects.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)) }));
  const addProject = () => setForm((f) => ({ ...f, projects: [...f.projects, emptyProject()] }));
  const removeProject = (i) => setForm((f) => ({ ...f, projects: f.projects.filter((_, idx) => idx !== i) }));

  const startEdit = () => {
    setForm({
      name: profile.name || '',
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
      alert(`저장 오류: ${error.message}`);
      return;
    }
    onProfileUpdated?.(data);
    setEditing(false);
  };

  // 보기용 데이터 (저장된 프로필 기준)
  const v = profile;
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
            <h1 className="main-title">프로필 편집</h1>
            <div className="profile-edit-actions">
              <button className="pf-btn ghost" onClick={() => setEditing(false)} disabled={saving}>취소</button>
              <button className="pf-btn primary" onClick={handleSave} disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
            </div>
          </div>

          <div className="pf-grid">
            <div className="pf-field"><label>이름</label>
              <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="이름" /></div>
            <div className="pf-field"><label>대표 타이틀</label>
              <input value={form.main_title} onChange={(e) => update('main_title', e.target.value)} placeholder="예: NLP/NLU 전문 에이전트 개발자" /></div>
            <div className="pf-field"><label>상태</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)}>
                <option value="">선택 안 함</option>
                <option value="재직중">재직중</option>
                <option value="구직중">구직중</option>
                <option value="프리랜서">프리랜서</option>
              </select></div>
            <div className="pf-field"><label>요율</label>
              <input value={form.rate} onChange={(e) => update('rate', e.target.value)} placeholder="예: 시간당 $100 - $150" /></div>
            <div className="pf-field"><label>위치</label>
              <input value={form.location} onChange={(e) => update('location', e.target.value)} placeholder="예: 서울, 대한민국" /></div>
            <div className="pf-field"><label>타임존</label>
              <input value={form.timezone} onChange={(e) => update('timezone', e.target.value)} placeholder="예: (GMT+9) 한국 표준시" /></div>
            <div className="pf-field"><label>언어</label>
              <input value={form.language} onChange={(e) => update('language', e.target.value)} placeholder="예: 한국어" /></div>
          </div>

          <div className="pf-field"><label>소개</label>
            <textarea rows={3} value={form.about} onChange={(e) => update('about', e.target.value)} placeholder="자기소개" /></div>

          <div className="pf-grid">
            <div className="pf-field"><label>LinkedIn URL</label>
              <input value={form.linkedin_url} onChange={(e) => update('linkedin_url', e.target.value)} placeholder="https://www.linkedin.com/in/..." /></div>
            <div className="pf-field"><label>Instagram URL</label>
              <input value={form.instagram_url} onChange={(e) => update('instagram_url', e.target.value)} placeholder="https://www.instagram.com/..." /></div>
          </div>

          <div className="pf-field"><label>기술 및 도구 (쉼표로 구분)</label>
            <input
              value={form.skills.join(', ')}
              onChange={(e) => update('skills', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
              placeholder="예: React, Python, LLM"
            /></div>

          <div className="pf-projects-edit">
            <div className="pf-projects-head">
              <h3>프로젝트</h3>
              <button className="pf-btn small" onClick={addProject}>+ 프로젝트 추가</button>
            </div>
            {form.projects.length === 0 && <p className="pf-empty">아직 등록된 프로젝트가 없습니다.</p>}
            {form.projects.map((p, i) => (
              <div className="pf-project-item" key={i}>
                <div className="pf-project-itemhead">
                  <strong>프로젝트 {i + 1}</strong>
                  <button className="pf-btn danger small" onClick={() => removeProject(i)}>삭제</button>
                </div>
                <div className="pf-field"><label>제목</label>
                  <input value={p.title} onChange={(e) => updateProject(i, 'title', e.target.value)} /></div>
                <div className="pf-field"><label>설명</label>
                  <textarea rows={2} value={p.description} onChange={(e) => updateProject(i, 'description', e.target.value)} /></div>
                <div className="pf-field"><label>기술 (쉼표 구분)</label>
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
      <aside className="profile-sidebar">
        <div className="profile-header-share">
          <button className="share-button" aria-label="프로필 공유"><span className="share-icon"></span></button>
        </div>
        <div className="profile-avatar-wrapper">
          <img src={profilePlaceholder} alt="프로필 아바타" className="profile-avatar" />
          {v.status && (
            <div className="profile-status"><span className="status-dot available"></span> {v.status}</div>
          )}
        </div>
        <h2 className="profile-name">{v.name || '이름 미설정'}</h2>
        <button className="contact-button" onClick={startEdit}>
          <span className="send-icon"></span> 프로필 편집
        </button>

        {/* 보유 코인 현황 */}
        <div className="profile-coins" title="보유 coin">
          <CoinIcon size={22} className="coin-icon" />
          <span className="coin-amount">{Number(profile.coins ?? 0).toLocaleString()}</span>
          <span className="coin-unit">coin</span>
        </div>

        {v.rate && (
          <div className="profile-section">
            <h3 className="section-title">요율</h3>
            <div className="rate-info">{v.rate}</div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="profile-section">
            <h3 className="section-title">기술 및 도구</h3>
            <div className="tags-container">
              {skills.map((s, i) => <span key={i} className="tag">{s}</span>)}
            </div>
          </div>
        )}

        <div className="profile-section">
          <h3 className="section-title">소개</h3>
          {v.about && <p className="about-text">{v.about}</p>}
          <ul className="about-details">
            {v.location && <li><span className="icon-location"></span> {v.location}</li>}
            {v.timezone && <li><span className="icon-time"></span> {v.timezone}</li>}
            {v.language && <li><span className="icon-language"></span> {v.language}</li>}
          </ul>
        </div>

        {(v.linkedin_url || v.instagram_url) && (
          <div className="profile-section">
            <h3 className="section-title">링크</h3>
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
        <h1 className="main-title">{v.main_title || v.name || '나의 정보'}</h1>

        <nav className="profile-tabs">
          <button className="tab-button active">프로젝트</button>
          <button className="tab-button">서비스</button>
          <button className="tab-button">추천</button>
        </nav>

        <div className="add-project-section">
          <div className="add-project-card" onClick={startEdit} role="button" tabIndex={0}>
            <div className="add-icon">+</div>
            <div className="add-text">
              <p><strong>프로젝트 추가</strong></p>
              <p>프로필을 편집해 최고의 기술과 경험을 보여주세요.</p>
            </div>
          </div>
        </div>

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
      </main>
    </div>
  );
}

export default ProfilePage;
