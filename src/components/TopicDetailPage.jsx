import React from 'react';
import './TopicDetailPage.css';
import '../App.css'; // 공통 스타일을 위해 App.css 임포트
import sephirothAvatar from '../assets/sephiroth-avatar.png'; // 세피로스 아바타 이미지 임포트
import aliceAvatar from '../assets/alice-avatar.png'; // 앨리스 아바타 이미지 임포트

// Mock data for a specific topic (실제로는 API에서 topicId를 받아 상세 데이터를 가져옵니다)
const mockTopicDetail = {
  id: 1,
  category: '벌집 테마',
  title: '벌집 테마에 대해 가장 좋아하는 점은 무엇인가요?',
  tags: ['bbpress', '구조', '스레드'], // 태그 번역
  replies: 62,
  voices: 2,
  lastUpdated: '1주 5일 전',
  lastUpdatedBy: '앨리스',
  posts: [
    {
      id: 286,
      author: {
        name: '세피로스',
        role: '키마스터', // 역할 번역
        avatar: sephirothAvatar,
      },
      date: '2020년 1월 24일 오후 9:22', // 날짜 형식 유지, 필요시 한글화
      content: '진실로, 비난받을 만한 것들을 비난하고 고통을 피하려는 이들은 잘못 판단하는 것입니다. 쾌락을 얻으려 노력하는 사람들이나 고통을 겪는 사람들이 없기 때문입니다. 고통을 피하는 자는 아무도 없습니다.', // 내용 번역
    },
    {
      id: 899,
      author: {
        name: '앨리스',
        role: '참여자', // 역할 번역
        avatar: aliceAvatar,
      },
      date: '2020년 7월 26일 오후 9:52',
      content: '안녕하세요, 좋은 의견입니다.', // 내용 번역 (원문이 의미 없는 문자열이므로 임의 번역)
    },
    {
      id: 1174,
      author: {
        name: '앨리스',
        role: '참여자', // 역할 번역
        avatar: aliceAvatar,
      },
      date: '2020년 9월 12일 오전 6:06',
      content: '맞아요. 이 테마는 멋져요.', // 내용 번역
    },
    {
      id: 1287,
      author: {
        name: '앨리스',
        role: '참여자', // 역할 번역
        avatar: aliceAvatar,
      },
      date: '2020년 9월 30일 오전 11:55',
      content: '이것은 앨리스의 또 다른 답변입니다.', // 내용 번역
    },
  ],
};

const recentTopicsData = [
  '123',
  '독립 주택 2층 방 1개 $900에 임대',
  '오오오',
  '루나',
  'ㅂㅅㅂㅅㅇㅅㅇ',
];

function TopicDetailPage({ topicId, onBackToListings }) {
  // 실제 앱에서는 topicId를 사용하여 서버에서 상세 데이터를 가져옵니다.
  // 여기서는 mock data를 사용합니다.
  const topic = mockTopicDetail; // topicId에 따라 실제 데이터를 필터링할 수 있습니다.

  if (!topic) {
    return (
      <div className="topic-detail-page-container content-area-container">
        <p>토픽을 찾을 수 없습니다.</p>
        <button className="back-button" onClick={onBackToListings}>목록으로 돌아가기</button>
      </div>
    );
  }

  // 로그인 상태를 가정 (실제 앱에서는 isLoggedIn 상태를 prop으로 받거나 Context API 사용)
  const isLoggedIn = false; 

  return (
    <div className="topic-detail-page-container content-area-container">
      <div className="topic-detail-main-content">
        <nav className="topic-breadcrumbs">
          <span>홈 1</span> {/* 번역 */}
          <span>›</span>
          <span>포럼</span> {/* 번역 */}
          <span>›</span>
          <span className="current-category">{topic.category}</span>
          <span>›</span>
          <span className="current-topic">{topic.title}</span>
        </nav>

        <div className="topic-summary-card">
          <div className="topic-tags">
            태그: {/* 번역 */}
            {topic.tags.map((tag, index) => (
              <span key={index} className="topic-tag">{tag}</span>
            ))}
          </div>
          <p className="topic-stats">
            이 주제는 <strong>{topic.replies}</strong>개의 답변, <strong>{topic.voices}</strong>명의 참여자가 있으며, 마지막 업데이트는{' '} {/* 번역 */}
            <strong>{topic.lastUpdated}</strong>에 <span className="last-updated-author">{topic.lastUpdatedBy}</span>에 의해 이루어졌습니다. {/* 번역 */}
          </p>
        </div>

        <div className="topic-posts">
          {topic.posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-author-info">
                <img src={post.author.avatar} alt={`${post.author.name} 아바타`} className="author-avatar" />
                <p className="author-name">{post.author.name}</p>
                <p className="author-role">{post.author.role}</p>
              </div>
              <div className="post-content-area">
                <div className="post-header">
                  <span className="post-date">{post.date}</span>
                  <span className="post-number">#{post.id}</span>
                </div>
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="topic-post-pagination">
          <button className="pagination-button active">1</button>
          <button className="pagination-button">2</button>
          <button className="pagination-button">3</button>
          <button className="pagination-button">4</button>
          <button className="pagination-button">5</button>
          <button className="pagination-arrow">→</button>
        </div>

        {!isLoggedIn && (
          <div className="login-to-reply-section">
            <p className="login-message">이 주제에 답변하려면 로그인해야 합니다.</p> {/* 번역 */}
            <div className="login-form-card">
              <h3>로그인</h3> {/* 번역 */}
              <div className="form-group">
                <label htmlFor="username">사용자 이름:</label> {/* 번역 */}
                <input type="text" id="username" className="login-input" />
              </div>
              <div className="form-group">
                <label htmlFor="password">비밀번호:</label> {/* 번역 */}
                <input type="password" id="password" className="login-input" />
              </div>
              <div className="form-group-checkbox">
                <input type="checkbox" id="keep-signed-in" />
                <label htmlFor="keep-signed-in">로그인 유지</label> {/* 번역 */}
              </div>
              <button className="login-submit-button">로그인</button> {/* 번역 */}
            </div>
          </div>
        )}
      </div>

      <aside className="community-sidebar">
        <div className="recent-topics-section">
          <h3>최근 주제</h3>
          <ul className="recent-topics-list">
            {recentTopicsData.map((topicItem, index) => (
              <li key={index}>
                <span className="topic-bullet">💬</span> {topicItem}
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
      </aside>
    </div>
  );
}

export default TopicDetailPage;