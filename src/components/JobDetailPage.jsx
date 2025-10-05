import React from 'react';
import './JobDetailPage.css';
import '../App.css'; // 공통 스타일을 위해 App.css 임포트
// 회사 로고 이미지 임포트는 EmploymentPage에서 전달받으므로 여기서는 불필요

// Social icons (placeholder for now)
const TwitterIcon = () => <span className="social-icon-text">𝕏</span>;
const PinterestIcon = () => <span className="social-icon-text">📌</span>;

// Related Job Card for JobDetailPage (simplified version of JobCard)
function RelatedJobCard({ job, onJobClick }) {
  return (
    <div className="related-job-card-item" onClick={() => onJobClick(job)}>
      <div className="related-job-logo-wrapper">
        <img src={job.logo} alt={`${job.companyKo} 로고`} className="related-job-logo" />
      </div>
      <div className="related-job-details">
        <h4 className="related-job-title">{job.titleKo}</h4>
        <p className="related-job-location">{job.locationKo}</p>
        <p className="related-job-company">{job.companyKo}</p>
      </div>
      <div className="related-job-type" style={{ backgroundColor: job.typeColor, color: job.textColor }}>
        {job.typeKo}
      </div>
    </div>
  );
}


function JobDetailPage({ job, onBackToListings, onSelectJob }) {
  if (!job) {
    return (
      <div className="job-detail-page-container content-area-container">
        <p>채용 정보를 찾을 수 없습니다.</p>
        <button className="back-button" onClick={onBackToListings}>목록으로 돌아가기</button>
      </div>
    );
  }

  // Related jobs (excluding the current job)
  const allJobs = JSON.parse(localStorage.getItem('jobListings')) || []; // EmploymentPage에서 저장된 전체 목록 사용
  const relatedJobs = allJobs
    .filter(j => j.id !== job.id)
    .slice(0, 2); // Show up to 2 related jobs

  return (
    <div className="job-detail-page-container content-area-container">
      <div className="job-detail-main-content">
        <div className="job-detail-header">
          <div className="job-detail-company-info">
            <img src={job.logo} alt={`${job.companyEn} 로고`} className="detail-company-logo" />
            <div className="job-detail-text-info">
              <h1 className="detail-job-title">{job.titleEn}</h1>
              <p className="detail-company-name">{job.companyEn}</p>
              <p className="detail-agency-name">{job.agency}</p>
            </div>
          </div>
          <div className="job-detail-social-share">
            <button className="social-share-button"><PinterestIcon /></button>
            <button className="social-share-button"><TwitterIcon /></button>
          </div>
        </div>

        <div className="job-info-card">
          <div className="info-item">
            <span className="info-icon">💼</span>
            <div className="info-text">
              <p className="info-label">직무 유형</p>
              <p className="info-value">{job.typeEn}</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">📍</span>
            <div className="info-text">
              <p className="info-label">위치</p>
              <p className="info-value">{job.locationEn}</p>
            </div>
          </div>
        </div>

        {job.youtubeEmbedUrl && (
          <div className="youtube-embed-container">
            <iframe
              width="100%"
              height="315"
              src={job.youtubeEmbedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="job-section">
          <h2 className="section-title">직무 설명:</h2>
          {job.descriptionEn.split('\n').map((paragraph, index) => (
            <p key={index} className="job-description-paragraph">{paragraph}</p>
          ))}
        </div>

        <div className="job-section">
          <h2 className="section-title">책임:</h2>
          <ul className="job-responsibilities-list">
            {job.responsibilitiesEn.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>

        <div className="job-section">
          <h2 className="section-title">요구 사항:</h2>
          <ul className="job-requirements-list">
            {job.requirementsEn.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>

        <button className="apply-button">지원하기</button>

        <div className="job-section related-jobs-section">
          <h2 className="section-title">관련 채용 공고</h2>
          <div className="related-jobs-list">
            {relatedJobs.length > 0 ? (
              relatedJobs.map(relatedJob => (
                <RelatedJobCard key={relatedJob.id} job={relatedJob} onJobClick={onSelectJob} />
              ))
            ) : (
              <p>관련 채용 공고가 없습니다.</p>
            )}
          </div>
        </div>
      </div>

      <aside className="job-detail-sidebar">
        <div className="job-overview-card">
          <h3>채용 개요</h3>
          <div className="overview-item">
            <span className="overview-icon">📅</span>
            <div className="overview-text">
              <p className="overview-label">등록일</p>
              <p className="overview-value">{job.datePosted}</p>
            </div>
          </div>
          <div className="overview-item">
            <span className="overview-icon">📍</span>
            <div className="overview-text">
              <p className="overview-label">위치</p>
              <p className="overview-value">{job.locationEn}</p>
            </div>
          </div>
          <div className="overview-item">
            <span className="overview-icon">💼</span>
            <div className="overview-text">
              <p className="overview-label">직무 유형</p>
              <p className="overview-value">{job.typeEn}</p>
            </div>
          </div>
          <div className="overview-item">
            <span className="overview-icon">💰</span>
            <div className="overview-text">
              <p className="overview-label">급여</p>
              <p className="overview-value">{job.salary}</p>
            </div>
          </div>
          <div className="overview-item">
            <span className="overview-icon">🏷️</span>
            <div className="overview-text">
              <p className="overview-label">카테고리</p>
              <p className="overview-value">{job.category}</p>
            </div>
          </div>
        </div>
        <button className="back-button" onClick={onBackToListings}>← 목록으로 돌아가기</button>
      </aside>
    </div>
  );
}

export default JobDetailPage;