import React, { useState, useEffect } from 'react';
import './EmploymentPage.css';
import '../App.css'; // 공통 스타일을 위해 App.css 임포트
import JobDetailPage from './JobDetailPage'; // JobDetailPage 임포트

// 회사 로고 이미지 임포트 (더 이상 사용하지 않으므로 주석 처리하거나 제거)
// import logoNozti from '../assets/logo-noztinc.png';
// import logoClinivex from '../assets/logo-clinivex.png';
// import logoIsoft from '../assets/logo-isoft.png';
// import logoMexmon from '../assets/logo-mexmon.png';
// import logoAstray from '../assets/logo-astray.png';

// 모든 로고에 적용할 플레이스홀더 이미지 임포트
import companyLogoPlaceholder from '../assets/company_logo_placeholder.png';

// 확장된 채용 공고 데이터
const jobListingsData = [
  {
    id: 1,
    logo: companyLogoPlaceholder, // 플레이스홀더 이미지 적용
    titleKo: '영업 및 고객 성공 관리자',
    titleEn: 'Sales & Customer Success Manager',
    locationKo: '4234 샤르도네 드라이브, 플로리다, 미국',
    locationEn: '4234 Chardonnay Drive, FL, USA',
    companyKo: '노즈티 주식회사',
    companyEn: 'Nozti Inc',
    agency: 'Marketing Agency',
    typeKo: '정규직',
    typeEn: 'Full Time',
    typeColor: '#e6ffe6', // Light green
    textColor: '#28a745', // Dark green
    datePosted: 'Posted 6 years ago',
    salary: '4,000/month',
    category: 'Finance, Marketing',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/1m8m4g8XlW8?si=zKLHha7nSYGEEQ', // Placeholder YouTube URL
    descriptionEn: `We are looking for a marketing analyst with a razor-sharp attention to detail, broad knowledge of statistics, mathematics and analytics, and an almost obsessive commitment to thoroughness. Marketing analysts can expect to work with vast amounts of written and numerical information about market trends, volume of sales, customer experience, and competitors’ activities. Their responsibilities include gathering data, writing detailed reports on findings, identifying new markets, and advising upper-management on tactics.
    Successful marketing analyst candidates should have at least two years’ experience in marketing, excellent mathematics and language skills, and outstanding insight. Ideal candidates will have a proven aptitude for interpreting data.`,
    responsibilitiesEn: [
      'Gathering and analyzing data.',
      'Reporting to marketing managers and coordinators.',
      'Monitoring customer bases and identifying new ones.',
      'Preparing detailed reports on consumer behavior, competitors’ activities, outcomes, and sales.',
      'Designing market surveys.',
      'Determining future trends.',
      'Communicating with customers, competitors and suppliers.',
      'Developing strategies to improve market reach.',
    ],
    requirementsEn: [
      'Bachelor’s degree in statistics, mathematics, social sciences, marketing etc.',
      '2+ years’ experience working in marketing.',
      'Additional related short courses beneficial.',
      'Proven data interpretation skills.',
    ],
  },
  {
    id: 2,
    logo: companyLogoPlaceholder, // 플레이스홀더 이미지 적용
    titleKo: '마케팅 데이터 강화 전문가',
    titleEn: 'Marketing Data Enrichment Specialist',
    locationKo: '3번가, 페름, 러시아',
    locationEn: '3rd street, Perm, Russia',
    companyKo: '클리니벡스 애널리틱스',
    companyEn: 'Clinivex Analytics',
    agency: 'Data Analytics Firm',
    typeKo: '정규직',
    typeEn: 'Full Time',
    typeColor: '#e6ffe6',
    textColor: '#28a745',
    datePosted: 'Posted 3 months ago',
    salary: '3,500/month',
    category: 'Data Science, Marketing',
    youtubeEmbedUrl: null, // No YouTube for this one
    descriptionEn: `We are seeking a Marketing Data Enrichment Specialist to enhance our data assets. This role involves collecting, cleaning, and enriching marketing data to improve targeting and personalization efforts. The ideal candidate will have strong analytical skills and experience with various data sources and tools.`,
    responsibilitiesEn: [
      'Identify and integrate new data sources.',
      'Perform data cleaning and transformation.',
      'Develop and maintain data enrichment processes.',
      'Collaborate with marketing and sales teams to understand data needs.',
      'Ensure data quality and compliance with privacy regulations.',
    ],
    requirementsEn: [
      'Bachelor’s degree in Marketing, Data Science, or related field.',
      '2+ years of experience in data enrichment or marketing analytics.',
      'Proficiency in SQL and Excel.',
      'Experience with CRM and marketing automation platforms.',
    ],
  },
  {
    id: 3,
    logo: companyLogoPlaceholder, // 플레이스홀더 이미지 적용
    titleKo: '소프트웨어 품질 보증 엔지니어',
    titleEn: 'Software Quality Assurance Engineer',
    locationKo: '4901 레이크랜드 드라이브 파크, 조지아, 미국',
    locationEn: '4901 Lakeland Drive Park, Georgia, USA',
    companyKo: '아이소프트 네이션즈',
    companyEn: 'Isoft Nations',
    agency: 'Software Development',
    typeKo: '정규직',
    typeEn: 'Full Time',
    typeColor: '#e6ffe6',
    textColor: '#28a745',
    datePosted: 'Posted 1 year ago',
    salary: '5,000/month',
    category: 'Software Development, QA',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=zKLHha7nSYGEEQ',
    descriptionEn: `Join our team as a Software Quality Assurance Engineer. You will be responsible for ensuring the quality of our software products through rigorous testing and defect tracking. A strong understanding of software development lifecycle and testing methodologies is essential.`,
    responsibilitiesEn: [
      'Design and execute test plans and test cases.',
      'Identify, document, and track software defects.',
      'Collaborate with development teams to resolve issues.',
      'Perform regression testing and performance testing.',
      'Participate in code reviews and design discussions.',
    ],
    requirementsEn: [
      'Bachelor’s degree in Computer Science or related field.',
      '3+ years of experience in software QA.',
      'Proficiency in automated testing tools (e.g., Selenium, JUnit).',
      'Experience with Agile development methodologies.',
    ],
  },
  {
    id: 4,
    logo: companyLogoPlaceholder, // 플레이스홀더 이미지 적용
    titleKo: 'iOS 및 안드로이드 개발자 모집',
    titleEn: 'iOS and Android Developer Recruitment',
    locationKo: '골든 혼, 블라디보스토크, 러시아',
    locationEn: 'Golden Horn, Vladivostok, Russia',
    companyKo: '멕스몬 팀',
    companyEn: 'Mexmon Team',
    agency: 'Mobile App Development',
    typeKo: '프리랜서',
    typeEn: 'Freelancer',
    typeColor: '#e7f3ff', // Light blue
    textColor: '#007bff', // Dark blue
    datePosted: 'Posted 2 weeks ago',
    salary: 'Negotiable',
    category: 'Mobile Development',
    youtubeEmbedUrl: null,
    descriptionEn: `We are looking for talented iOS and Android developers to join our growing team. You will work on exciting mobile projects, bringing innovative ideas to life. Strong experience with native mobile development frameworks is a must.`,
    responsibilitiesEn: [
      'Develop and maintain high-quality mobile applications for iOS and Android platforms.',
      'Collaborate with designers and product managers.',
      'Ensure optimal performance and user experience.',
      'Participate in code reviews and mentorship.',
    ],
    requirementsEn: [
      '3+ years of experience in iOS (Swift/Objective-C) and Android (Kotlin/Java) development.',
      'Strong understanding of mobile UI/UX principles.',
      'Experience with RESTful APIs and third-party libraries.',
      'Portfolio of published mobile applications.',
    ],
  },
  {
    id: 5,
    logo: companyLogoPlaceholder, // 플레이스홀더 이미지 적용
    titleKo: '글로벌 제품 개발 담당자',
    titleEn: 'Global Product Development Manager',
    locationKo: '3500 레이놀즈 앨리, 인디애나, 미국',
    locationEn: '3500 Reynolds Alley, Indiana, USA',
    companyKo: '애스트레이 데니슨',
    companyEn: 'Astray Denison',
    agency: 'Product Management',
    typeKo: '임시직',
    typeEn: 'Temporary',
    typeColor: '#ffe6e6', // Light red
    textColor: '#dc3545', // Dark red
    datePosted: 'Posted 4 months ago',
    salary: 'Contract-based',
    category: 'Product Management',
    youtubeEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=zKLHha7nSYGEEQ',
    descriptionEn: `We are seeking a Global Product Development Manager to lead our product initiatives. You will be responsible for the entire product lifecycle, from conception to launch, ensuring alignment with global market needs and business objectives.`,
    responsibilitiesEn: [
      'Define product vision, strategy, and roadmap.',
      'Conduct market research and competitive analysis.',
      'Collaborate with engineering, marketing, and sales teams.',
      'Manage product backlogs and prioritize features.',
      'Monitor product performance and gather user feedback.',
    ],
    requirementsEn: [
      'Bachelor’s degree in Business, Engineering, or related field.',
      '5+ years of experience in product management, with global experience.',
      'Strong leadership and communication skills.',
      'Proven track record of launching successful products.',
    ],
  },
  { // Additional job for related jobs section
    id: 6,
    logo: companyLogoPlaceholder, // 플레이스홀더 이미지 적용
    titleKo: '데이터 과학자',
    titleEn: 'Data Scientist',
    locationKo: '샌프란시스코, 캘리포니아, 미국',
    locationEn: 'San Francisco, CA, USA',
    companyKo: '노즈티 주식회사',
    companyEn: 'Nozti Inc',
    agency: 'AI & Data Solutions',
    typeKo: '정규직',
    typeEn: 'Full Time',
    typeColor: '#e6ffe6',
    textColor: '#28a745',
    datePosted: 'Posted 1 month ago',
    salary: '6,000/month',
    category: 'Data Science, AI',
    youtubeEmbedUrl: null,
    descriptionEn: `We are looking for an experienced Data Scientist to join our AI team. You will be responsible for developing and implementing machine learning models, analyzing complex datasets, and providing insights to drive business decisions.`,
    responsibilitiesEn: [
      'Develop, test, and deploy machine learning models.',
      'Analyze large, complex datasets to identify trends and patterns.',
      'Collaborate with engineering and product teams.',
      'Communicate findings to stakeholders.',
      'Stay up-to-date with the latest AI/ML research and technologies.',
    ],
    requirementsEn: [
      'Master’s or Ph.D. in Computer Science, Statistics, or related field.',
      '3+ years of experience in data science or machine learning.',
      'Proficiency in Python and relevant libraries (TensorFlow, PyTorch, scikit-learn).',
      'Strong statistical modeling and data visualization skills.',
    ],
  },
  { // Another additional job for related jobs section
    id: 7,
    logo: companyLogoPlaceholder, // 플레이스홀더 이미지 적용
    titleKo: '백엔드 개발자',
    titleEn: 'Backend Developer',
    locationKo: '뉴욕, 뉴욕, 미국',
    locationEn: 'New York, NY, USA',
    companyKo: '아이소프트 네이션즈',
    companyEn: 'Isoft Nations',
    agency: 'Software Development',
    typeKo: '정규직',
    typeEn: 'Full Time',
    typeColor: '#e6ffe6',
    textColor: '#28a745',
    datePosted: 'Posted 2 months ago',
    salary: '5,500/month',
    category: 'Software Development',
    youtubeEmbedUrl: null,
    descriptionEn: `We are seeking a skilled Backend Developer to build and maintain robust server-side applications. You will work on designing, developing, and deploying APIs and services that power our innovative products.`,
    responsibilitiesEn: [
      'Design, develop, and maintain APIs and backend services.',
      'Collaborate with frontend developers and product managers.',
      'Ensure scalability, security, and performance of applications.',
      'Participate in code reviews and system design discussions.',
      'Troubleshoot and debug production issues.',
    ],
    requirementsEn: [
      'Bachelor’s degree in Computer Science or related field.',
      '4+ years of experience in backend development (e.g., Node.js, Python, Java, Go).',
      'Proficiency with databases (SQL/NoSQL) and cloud platforms (AWS, Azure, GCP).',
      'Experience with microservices architecture and containerization (Docker, Kubernetes).',
    ],
  },
];

function JobCard({ job, onJobClick }) {
  return (
    <div className="job-card" onClick={() => onJobClick(job)}>
      <div className="job-logo-wrapper">
        <img src={job.logo} alt={`${job.companyKo} 로고`} className="job-logo" />
      </div>
      <div className="job-details">
        <h3 className="job-title">{job.titleKo}</h3>
        <p className="job-location">{job.locationKo}</p>
        <p className="job-company">{job.companyKo}</p>
      </div>
      <div className="job-type" style={{ backgroundColor: job.typeColor, color: job.textColor }}>
        {job.typeKo}
      </div>
    </div>
  );
}

function FeaturedJobCard({ job }) {
  return (
    <div className="featured-job-card">
      <img src={job.logo} alt={`${job.companyKo} 로고`} className="featured-job-logo" />
      <div className="featured-job-details">
        <h4 className="featured-job-title">{job.titleKo}</h4>
        <div className="featured-job-type" style={{ backgroundColor: job.typeColor, color: job.textColor }}>
          {job.typeKo}
        </div>
      </div>
    </div>
  );
}

function EmploymentPage({ isLoggedIn, onNavigate }) { // isLoggedIn, onNavigate prop 추가
  const [activeTab, setActiveTab] = useState('all-jobs'); // 'all-jobs', 'categories', 'manage', 'submit'
  const [selectedJob, setSelectedJob] = useState(null); // 선택된 채용 공고 상태

  useEffect(() => {
    // jobListingsData를 localStorage에 저장하여 JobDetailPage에서 접근할 수 있도록 함
    localStorage.setItem('jobListings', JSON.stringify(jobListingsData));
  }, []);

  const handleJobClick = (job) => {
    if (!isLoggedIn) {
      alert('로그인해야 채용 상세 정보를 볼 수 있습니다.');
      onNavigate('login'); // 로그인 페이지로 리다이렉트
      return;
    }
    setSelectedJob(job);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 상세 페이지로 이동 시 스크롤 맨 위로
  };

  const handleBackToListings = () => {
    setSelectedJob(null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 목록으로 돌아갈 때 스크롤 맨 위로
  };

  if (selectedJob) {
    return <JobDetailPage job={selectedJob} onBackToListings={handleBackToListings} onSelectJob={handleJobClick} />;
  }

  return (
    <div className="employment-page-container content-area-container">
      <div className="employment-header">
        <div className="employment-tabs">
          <button
            className={`tab-button ${activeTab === 'all-jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-jobs')}
          >
            모든 채용
          </button>
          <button
            className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            카테고리
          </button>
          <button
            className={`tab-button ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            관리
          </button>
          <button
            className={`tab-button ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            등록
          </button>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="키워드" className="search-input" />
          <input type="text" placeholder="위치" className="search-input" />
          <button className="search-button" aria-label="검색">
            <span className="search-icon">🔍</span>
          </button>
          <button className="filter-button" aria-label="필터">
            <span className="filter-icon"></span> 필터
          </button>
        </div>
      </div>

      <div className="employment-main-content">
        <div className="job-listings">
          {jobListingsData.map(job => (
            <JobCard key={job.id} job={job} onJobClick={handleJobClick} />
          ))}
        </div>

        <aside className="employment-sidebar">
          <div className="featured-jobs-section">
            <h3>주요 채용 공고</h3>
            <div className="featured-jobs-list">
              {jobListingsData.slice(0, 5).map(job => ( // 5개만 예시로 표시
                <FeaturedJobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
          <div className="sidebar-footer">
            <nav>
              <ul>
                <li>홈</li>
                <li>협회소개</li>
                <li>자주 묻는 질문</li>
                <li>블로그</li>
                <li>문의</li>
              </ul>
            </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default EmploymentPage;