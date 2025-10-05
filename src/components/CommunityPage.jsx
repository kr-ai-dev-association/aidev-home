import React, { useState } from 'react';
import './CommunityPage.css';
import '../App.css'; // 공통 스타일을 위해 App.css 임포트
import TopicDetailPage from './TopicDetailPage'; // TopicDetailPage 임포트

// Mock data (실제로는 API에서 가져옵니다)
const topicsData = [
  {
    id: 1,
    title: '벌집 테마에 대해 가장 좋아하는 점은 무엇인가요?',
    pages: [1, 2, 4, 5],
    startedBy: '세피로스',
    category: '벌집 테마',
    posts: 63,
    lastUpdated: '1주 5일 전', // ADDED: 최근 업데이트 날짜
    lastUpdatedBy: '앨리스', // ADDED: 최근 업데이트 작성자
  },
  {
    id: 2,
    title: '포럼 사용해보기...',
    pages: [1, 2],
    startedBy: '앨리스',
    category: '백패커스 클럽',
    posts: 24,
    lastUpdated: '2주 3일 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 3,
    title: '주제#123 주제를 만드는 방법',
    pages: [1, 2],
    startedBy: '앨리스',
    category: '백패커스 클럽',
    posts: 19,
    lastUpdated: '1개월 2주 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 4,
    title: '123',
    pages: [],
    startedBy: '앨리스',
    category: '일반 토론',
    posts: 1,
    lastUpdated: '5개월 3주 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 5,
    title: '독립 주택 2층 방 1개 $900에 임대',
    pages: [],
    startedBy: '앨리스',
    category: '일반 토론',
    posts: 1,
    lastUpdated: '5개월 3주 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 6,
    title: '오오오',
    pages: [],
    startedBy: '앨리스',
    category: '프로그래밍',
    posts: 17,
    lastUpdated: '6개월 2주 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 7,
    title: '전 여자친구 페이스북 계정을 어떻게 해킹하나요?',
    pages: [1, 2],
    startedBy: '세피로스',
    category: '프로그래밍',
    posts: 17,
    lastUpdated: '6개월 2주 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 8,
    title: '루나',
    pages: [1, 2],
    startedBy: '앨리스',
    category: '백패커스 클럽',
    posts: 2,
    lastUpdated: '6개월 2주 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 9,
    title: '테스트 중',
    pages: [1],
    startedBy: '앨리스',
    category: '벌집 테마',
    posts: 10,
    lastUpdated: '6개월 4주 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 10,
    title: '세상에서 가장 위험한 뱀은 무엇인가요?',
    pages: [1, 2],
    startedBy: '세피로스',
    category: '일반 토론',
    posts: 28,
    lastUpdated: '7개월 2주 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 11,
    title: 'ㅂㅅㅂㅅㅇㅅㅇ', // 원문: بسبسيسيسي (아랍어)
    pages: [],
    startedBy: '앨리스',
    category: '백패커스 클럽',
    posts: 1,
    lastUpdated: '8개월 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 12,
    title: '존경과 경의',
    pages: [],
    startedBy: '앨리스',
    category: '벌집 테마',
    posts: 4,
    lastUpdated: '9개월 2주 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 13,
    title: '안녕히 주무세요',
    pages: [],
    startedBy: '앨리스',
    category: '백패커스 클럽',
    posts: 2,
    lastUpdated: '9개월 2주 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 14,
    title: '마닐라가 가라앉고 있다',
    pages: [],
    startedBy: '앨리스',
    category: '기후 변화',
    posts: 1,
    lastUpdated: '9개월 2주 전',
    lastUpdatedBy: '앨리스',
  },
  {
    id: 15,
    title: '주제 테스트 중', // 원문: ceshiyigezhuti (중국어)
    pages: [],
    startedBy: '앨리스',
    category: '백패커스 클럽',
    posts: 1,
    lastUpdated: '10개월 2주 전',
    lastUpdatedBy: '앨리스',
  },
];

function CommunityPage({ isLoggedIn, onNavigate }) { // isLoggedIn, onNavigate prop 추가
  const [activeTab, setActiveTab] = useState('all-forums');
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 9; // Mock total pages
  const [selectedTopicId, setSelectedTopicId] = useState(null); // 선택된 토픽 ID 상태 추가

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleTopicClick = (topicId) => {
    if (!isLoggedIn) {
      alert('로그인해야 토픽 상세 정보를 볼 수 있습니다.');
      onNavigate('login'); // 로그인 페이지로 리다이렉트
      return;
    }
    setSelectedTopicId(topicId);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 상세 페이지로 이동 시 스크롤 맨 위로
  };

  const handleBackToListings = () => {
    setSelectedTopicId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 목록으로 돌아갈 때 스크롤 맨 위로
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5; // e.g., 1 2 3 ... 8 9
    const startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (startPage > 1) {
      buttons.push(<button key="first" onClick={() => handlePageChange(1)} className={`pagination-button ${1 === currentPage ? 'active' : ''}`}>1</button>);
      if (startPage > 2) {
        buttons.push(<span key="ellipsis-start" className="pagination-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis-end" className="pagination-ellipsis">...</span>);
      }
      buttons.push(<button key="last" onClick={() => handlePageChange(totalPages)} className={`pagination-button ${totalPages === currentPage ? 'active' : ''}`}>{totalPages}</button>);
    }

    return buttons;
  };

  // selectedTopicId가 있으면 TopicDetailPage를 렌더링
  if (selectedTopicId) {
    return <TopicDetailPage topicId={selectedTopicId} onBackToListings={handleBackToListings} />;
  }

  // 그렇지 않으면 기존 커뮤니티 목록 페이지를 렌더링
  return (
    <div className="community-page-container content-area-container">
      <div className="community-header">
        <div className="community-tabs">
          <button
            className={`tab-button ${activeTab === 'all-forums' ? 'active' : ''}`}
            onClick={() => setActiveTab('all-forums')}
          >
            모든 포럼
          </button>
          <button
            className={`tab-button ${activeTab === 'topics' ? 'active' : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            주제
          </button>
        </div>

        <div className="community-search-bar">
          <input type="text" placeholder="검색" className="search-input" />
          <button className="search-button" aria-label="검색">
            <span className="search-icon">🔍</span>
          </button>
        </div>
      </div>

      <div className="community-main-content">
        <div className="community-topics-list">
          <div className="topic-header">
            <div className="header-item topic-col">주제</div>
            <div className="header-item posts-col">게시글</div>
            <div className="header-item last-updated-col">최근 업데이트</div> {/* ADDED: 최근 업데이트 컬럼 헤더 */}
          </div>

          {topicsData.map(topic => (
            <div key={topic.id} className="topic-card" onClick={() => handleTopicClick(topic.id)}> {/* 클릭 핸들러 추가 */}
              <div className="topic-icon-col">
                <span className="topic-icon">💬</span>
              </div>
              <div className="topic-details-col">
                <h3 className="topic-title">{topic.title}</h3>
                {topic.pages.length > 0 && (
                  <div className="topic-pagination">
                    {topic.pages.map(page => (
                      <span key={page} className="page-number">{page}</span>
                    ))}
                  </div>
                )}
                <p className="topic-meta">
                  시작: <span className="topic-author">{topic.startedBy}</span>, 카테고리:{' '}
                  <span className="topic-category">{topic.category}</span>
                </p>
              </div>
              <div className="posts-col">{topic.posts}</div>
              {/* ADDED: 최근 업데이트 컬럼 내용 */}
              <div className="last-updated-col">
                <p className="last-updated-time">{topic.lastUpdated}</p>
                <p className="last-updated-author">{topic.lastUpdatedBy}</p>
              </div>
            </div>
          ))}

          <div className="community-pagination">
            <button
              className="pagination-arrow"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>
            {renderPaginationButtons()}
            <button
              className="pagination-arrow"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        </div>

        {/* Sidebar는 TopicDetailPage로 이동했으므로 여기서는 렌더링하지 않습니다. */}
        {/* <aside className="community-sidebar">
          <div className="recent-topics-section">
            <h3>최근 주제</h3>
            <ul className="recent-topics-list">
              {recentTopicsData.map((topic, index) => (
                <li key={index}>
                  <span className="topic-bullet">💬</span> {topic}
                </li>
              ))}
            </ul>
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
        </aside> */}
      </div>
    </div>
  );
}

export default CommunityPage;