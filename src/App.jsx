import { useState, useEffect, useCallback } from 'react';
import { supabase } from './lib/supabase';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Header from './components/Header'; // Header 컴포넌트 임포트
import HomePage from './components/HomePage'; // HomePage 컴포넌트 임포트
import Footer from './components/Footer'; // Footer 컴포넌트 임포트
import AboutPage from './components/AboutPage'; // AboutPage 컴포넌트 임포트
import AgentEvalPage from './components/AgentEvalPage'; // 에이전트 평가(Prototypebench) 페이지
import HarnessPage from './components/HarnessPage'; // 에이전트 하네스(harness-collection) 페이지
import CoursesPage from './components/CoursesPage'; // 강의(바이브코딩대학 AX 챔피언 프로그램) 페이지
import ProfilePage from './components/ProfilePage'; // ProfilePage 컴포넌트 임포트
import AdminDashboardPage from './components/AdminDashboardPage'; // 관리자 대시보드
import EmploymentPage from './components/EmploymentPage'; // EmploymentPage 컴포넌트 임포트
import CommunityPage from './components/CommunityPage'; // CommunityPage 컴포넌트 임포트
import InboxPage from './components/InboxPage'; // 메시지함(알림/메시지)
import VotePage from './components/VotePage'; // 투표(의제)
import SearchOverlay from './components/SearchOverlay'; // 통합 검색
import { fetchUnreadCounts } from './lib/inbox';

import './App.css';

function App() {
  const [session, setSession] = useState(null); // Supabase 세션
  const [profile, setProfile] = useState(null); // 조합원 프로필(추가 정보)
  const [needsProfile, setNeedsProfile] = useState(false); // 신규 인증 후 정보입력 필요 여부
  const [pendingNotice, setPendingNotice] = useState(false); // 법인 승인 대기 안내
  const [currentPage, setCurrentPage] = useState('home'); // 현재 페이지 상태 관리
  const [scrollToSection, setScrollToSection] = useState(null); // 스크롤할 섹션 ID 상태
  const [unread, setUnread] = useState(0); // 메시지함 안 읽음 합계(배지)
  const [inboxConvId, setInboxConvId] = useState(null); // 메시지함에서 열 대화 id
  const [communityTopicId, setCommunityTopicId] = useState(null); // 알림 클릭 시 열 주제 id
  const [employmentJobId, setEmploymentJobId] = useState(null); // 검색에서 열 공고 id
  const [searchOpen, setSearchOpen] = useState(false); // 통합 검색 오버레이
  const [searchKind, setSearchKind] = useState('all'); // 'all' | 'job' | 'community'
  const [searchQuery, setSearchQuery] = useState(''); // 초기 검색어

  const isLoggedIn = !!profile; // 프로필까지 완성되어야 로그인 완료로 간주
  const isSuperAdmin = session?.user?.email === 'tony@banya.ai'; // 슈퍼관리자
  // 관리자: 프로필의 is_admin 또는 슈퍼관리자
  const isAdmin = !!profile?.is_admin || isSuperAdmin;
  // 정회원: is_member 또는 슈퍼관리자(투표 메뉴/열람용)
  const isMember = !!profile?.is_member || isSuperAdmin;

  // 인증된 사용자의 프로필 조회 → 없으면 정보입력 단계로 유도
  const loadProfile = useCallback(async (user) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    if (error) {
      console.error('[profiles] 조회 오류:', error.message);
      return;
    }
    if (data) {
      // 법인 회원은 관리자 승인 전까지 로그인 차단
      if (data.account_type === 'corporate' && data.approval_status !== 'approved') {
        await supabase.auth.signOut();
        setProfile(null);
        setNeedsProfile(false);
        setPendingNotice(true);
        return;
      }
      setProfile(data);
      setNeedsProfile(false);
      setPendingNotice(false);
    } else {
      setProfile(null);
      setNeedsProfile(true); // 신규 회원 → 추가 정보 입력
    }
  }, []);

  // 세션 초기화 + 변경 구독 (OAuth 리디렉션 복귀 시 자동 감지)
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        loadProfile(newSession.user);
      } else {
        setProfile(null);
        setNeedsProfile(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  // 메시지함 안 읽음 카운트 폴링 (30초 + 포커스/로그인 시)
  const refreshUnread = useCallback(async () => {
    const uid = session?.user?.id;
    if (!uid || !profile) { setUnread(0); return; }
    try { const c = await fetchUnreadCounts(uid); setUnread(c.total); } catch { /* noop */ }
  }, [session, profile]);

  useEffect(() => {
    if (!isLoggedIn) { setUnread(0); return; }
    refreshUnread();
    const iv = setInterval(refreshUnread, 30000);
    const onFocus = () => refreshUnread();
    window.addEventListener('focus', onFocus);
    return () => { clearInterval(iv); window.removeEventListener('focus', onFocus); };
  }, [isLoggedIn, refreshUnread]);

  // 메시지함 열기 (특정 대화 선택 가능)
  const openInbox = (convId = null) => {
    setInboxConvId(convId);
    setCurrentPage('inbox');
    setScrollToSection(null);
  };
  // 알림/검색에서 주제 열기
  const openTopic = (topicId) => {
    setCommunityTopicId(topicId);
    setCurrentPage('community');
    setScrollToSection(null);
  };
  // 검색에서 공고 열기
  const openJob = (jobId) => {
    setEmploymentJobId(jobId);
    setCurrentPage('employment');
    setScrollToSection(null);
  };
  // 통합 검색 열기 (소스 필터 + 초기 검색어)
  const openSearch = (kind = 'all', query = '') => {
    setSearchKind(kind);
    setSearchQuery(query);
    setSearchOpen(true);
  };

  // handleNavigate 함수: sectionId를 선택적으로 받음
  const handleNavigate = (page, sectionId = null) => {
    if (page === 'services') {
      setCurrentPage('home');
      setScrollToSection('services-section');
    } else if (page === 'about' && sectionId) {
      setCurrentPage('about');
      setScrollToSection(sectionId);
    } else {
      setCurrentPage(page);
      setScrollToSection(null);
    }
  };

  const handleScrollComplete = () => setScrollToSection(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentPage('home');
    setScrollToSection(null);
  };

  // 신규 회원 정보 저장 완료
  const handleProfileSaved = async (savedProfile) => {
    // 법인 회원: 관리자 승인 대기 → 로그아웃 + 안내
    if (savedProfile?.account_type === 'corporate') {
      await supabase.auth.signOut();
      setPendingNotice(true);
      setCurrentPage('home');
      return;
    }
    if (session) await loadProfile(session.user);
    setCurrentPage('home');
    alert('회원가입이 완료되었습니다. 환영합니다!');
  };

  let content;

  // 법인 승인 대기 안내 (최우선)
  if (pendingNotice) {
    content = (
      <div className="auth-form-container">
        <h2>승인 대기 중</h2>
        <p className="auth-stage-desc">
          법인 회원은 관리자 승인 후 로그인할 수 있습니다.<br />
          승인이 완료되면 다시 로그인해주세요.
        </p>
        <button
          className="auth-submit-button"
          onClick={() => { setPendingNotice(false); setCurrentPage('home'); }}
        >
          홈으로
        </button>
      </div>
    );
  } else if (session && needsProfile) {
    content = (
      <SignupPage
        detailsMode
        user={session.user}
        onProfileSaved={handleProfileSaved}
      />
    );
  } else {
    switch (currentPage) {
      case 'login':
        content = <LoginPage onTogglePage={() => handleNavigate('signup')} />;
        break;
      case 'signup':
        content = <SignupPage onTogglePage={() => handleNavigate('login')} />;
        break;
      case 'about':
        content = (
          <AboutPage
            scrollToSectionId={scrollToSection}
            onScrollComplete={handleScrollComplete}
          />
        );
        break;
      case 'agenteval':
        content = <AgentEvalPage onNavigate={handleNavigate} />;
        break;
      case 'harness':
        content = <HarnessPage onNavigate={handleNavigate} />;
        break;
      case 'courses':
        content = <CoursesPage onNavigate={handleNavigate} />;
        break;
      case 'profile':
        content = <ProfilePage user={session?.user} profile={profile} onProfileUpdated={setProfile} />;
        break;
      case 'admin':
        content = <AdminDashboardPage isAdmin={isAdmin} currentUserEmail={session?.user?.email} />;
        break;
      case 'vote':
        content = (
          <VotePage
            user={session?.user}
            profile={profile}
            isMember={isMember}
            isSuperAdmin={isSuperAdmin}
            onOpenTopic={openTopic}
          />
        );
        break;
      case 'inbox':
        content = (
          <InboxPage
            user={session?.user}
            initialConversationId={inboxConvId}
            onUnreadChange={refreshUnread}
            onOpenTopic={openTopic}
          />
        );
        break;
      case 'employment':
        content = (
          <EmploymentPage
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            onNavigate={handleNavigate}
            user={session?.user}
            profile={profile}
            onOpenConversation={openInbox}
            initialJobId={employmentJobId}
            onJobConsumed={() => setEmploymentJobId(null)}
            onOpenSearch={openSearch}
          />
        );
        break;
      case 'community':
        content = (
          <CommunityPage
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            onNavigate={handleNavigate}
            user={session?.user}
            profile={profile}
            initialTopicId={communityTopicId}
            onTopicConsumed={() => setCommunityTopicId(null)}
            onOpenConversation={openInbox}
            onOpenSearch={openSearch}
          />
        );
        break;
      case 'home':
      default:
        content = (
          <HomePage
            onSignupClick={() => handleNavigate('signup')}
            scrollToSectionId={scrollToSection}
            onScrollComplete={handleScrollComplete}
            onNavigate={handleNavigate}
          />
        );
        break;
    }
  }

  return (
    <div className="app-container">
      <Header
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        isMember={isMember}
        unreadCount={unread}
        onInboxClick={() => openInbox(null)}
        onSearchClick={() => openSearch('all')}
        onLoginClick={() => handleNavigate('login')}
        onSignupClick={() => handleNavigate('signup')}
        onLogoutClick={handleLogout}
        onNavigate={handleNavigate}
      />
      <main className="main-content">
        {content}
      </main>
      <Footer />
      <SearchOverlay
        open={searchOpen}
        initialKind={searchKind}
        initialQuery={searchQuery}
        onClose={() => setSearchOpen(false)}
        onOpenJob={openJob}
        onOpenTopic={openTopic}
      />
    </div>
  );
}

export default App;
