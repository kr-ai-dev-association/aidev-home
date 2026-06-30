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
import AgentBuildPage from './components/AgentBuildPage'; // 에이전트 구축(취업 매칭 기반 프로젝트 의뢰) 페이지
import CoursesPage from './components/CoursesPage'; // 강의(바이브코딩대학 AX 챔피언 프로그램) 페이지
import ProfilePage from './components/ProfilePage'; // ProfilePage 컴포넌트 임포트
import AdminDashboardPage from './components/AdminDashboardPage'; // 관리자 대시보드
import EmploymentPage from './components/EmploymentPage'; // EmploymentPage 컴포넌트 임포트
import CommunityPage from './components/CommunityPage'; // CommunityPage 컴포넌트 임포트
import FAQPage from './components/FAQPage'; // 자주 묻는 질문(FAQ) 페이지
import InboxPage from './components/InboxPage'; // 메시지함(알림/메시지)
import VotePage from './components/VotePage'; // 투표(의제)
import B2BRequestsPage from './components/B2BRequestsPage'; // 조합 B2B 의뢰 관리(관리자)
import MyJobsPage from './components/MyJobsPage'; // 내 공고 관리(지원 현황)
import MyApplicationsPage from './components/MyApplicationsPage'; // 내 지원 관리(스크랩·지원 현황)
import MediationPage from './components/MediationPage'; // 분쟁 조정 의뢰(조합원)
import MediationsAdminPage from './components/MediationsAdminPage'; // 분쟁 조정 의뢰 관리(관리자)
import DisputeServicePage from './components/DisputeServicePage'; // 분쟁 조정 소개(사업·서비스)
import DisputesPage from './components/DisputesPage'; // 분쟁 관리(관리자)
import B2BRequestModal from './components/B2BRequestModal'; // 조합 B2B 의뢰 입력 모달
import SearchOverlay from './components/SearchOverlay'; // 통합 검색
import { fetchUnreadCounts } from './lib/inbox';

import './App.css';

// 공유/딥링크용 URL 파싱: /community/topic/:id, /employment/job/:id
function parseRoute(pathname) {
  let m = pathname.match(/^\/community\/topic\/([0-9a-f-]{36})/i);
  if (m) return { page: 'community', topicId: m[1] };
  m = pathname.match(/^\/employment\/job\/([0-9a-f-]{36})/i);
  if (m) return { page: 'employment', jobId: m[1] };
  if (pathname.startsWith('/community')) return { page: 'community' };
  if (pathname.startsWith('/employment')) return { page: 'employment' };
  return {};
}

const initRoute = typeof window !== 'undefined' ? parseRoute(window.location.pathname) : {};

function App() {
  const [session, setSession] = useState(null); // Supabase 세션
  const [profile, setProfile] = useState(null); // 조합원 프로필(추가 정보)
  const [needsProfile, setNeedsProfile] = useState(false); // 신규 인증 후 정보입력 필요 여부
  const [pendingNotice, setPendingNotice] = useState(false); // 법인 승인 대기 안내
  const [currentPage, setCurrentPage] = useState(initRoute.page || 'home'); // 현재 페이지 상태 관리
  const [scrollToSection, setScrollToSection] = useState(null); // 스크롤할 섹션 ID 상태
  const [unread, setUnread] = useState(0); // 메시지함 안 읽음 합계(배지)
  const [inboxConvId, setInboxConvId] = useState(null); // 메시지함에서 열 대화 id
  const [communityTopicId, setCommunityTopicId] = useState(initRoute.topicId || null); // 알림/딥링크로 열 주제 id
  const [communityCategory, setCommunityCategory] = useState(null); // 커뮤니티 진입 시 초기 카테고리 필터(예: 공지사항)
  const [employmentJobId, setEmploymentJobId] = useState(initRoute.jobId || null); // 검색/딥링크로 열 공고 id
  const [viewUserId, setViewUserId] = useState(null); // 조회할 타인(지원자) 프로필 user id
  const [viewUserFallback, setViewUserFallback] = useState(null); // 프로필 RLS 차단 시 폴백 스냅샷
  const [searchOpen, setSearchOpen] = useState(false); // 통합 검색 오버레이
  const [searchKind, setSearchKind] = useState('all'); // 'all' | 'job' | 'community'
  const [searchQuery, setSearchQuery] = useState(''); // 초기 검색어
  const [b2bType, setB2bType] = useState(null); // 조합 B2B 의뢰 모달 유형(null이면 닫힘)

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

  // 코인 등 프로필 변동 후 최신화(취업/커뮤니티 작성 시 코인 반영)
  const refreshProfile = useCallback(async () => {
    if (session?.user) await loadProfile(session.user);
  }, [session, loadProfile]);

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
  // 지원자 등 타인 프로필 페이지 열기 (fallback: 지원 스냅샷)
  const openUserProfile = (userId, fallback = null) => {
    if (!userId) return;
    setViewUserId(userId);
    setViewUserFallback(fallback);
    setCurrentPage('userprofile');
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

  // 조합 B2B 의뢰 모달 열기 (가입된 조합원이면 누구나 — 정회원 아니어도 가능)
  const openB2B = (type) => {
    if (!isLoggedIn) {
      alert('의뢰는 로그인(조합원) 후 이용할 수 있습니다.');
      handleNavigate('login');
      return;
    }
    setB2bType(type);
  };

  // handleNavigate 함수: sectionId(스크롤) / community 진입 시 categoryFilter 를 선택적으로 받음
  const handleNavigate = (page, sectionId = null, categoryFilter = null) => {
    // 커뮤니티로 이동할 때 카테고리 필터(예: '공지사항') 지정
    setCommunityCategory(page === 'community' ? categoryFilter : null);
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
    // URL 베이스 경로 동기화(상세 경로는 각 페이지가 관리)
    const finalPage = page === 'services' ? 'home' : page;
    const base = finalPage === 'community' ? '/community' : finalPage === 'employment' ? '/employment' : '/';
    if (typeof window !== 'undefined' && window.location.pathname !== base) {
      window.history.replaceState(null, '', base);
    }
  };

  // 뒤로/앞으로(딥링크) 시 URL 재해석
  useEffect(() => {
    const onPop = () => {
      const r = parseRoute(window.location.pathname);
      setCurrentPage(r.page || 'home');
      setCommunityTopicId(r.topicId || null);
      setEmploymentJobId(r.jobId || null);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

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
        content = <AgentEvalPage onNavigate={handleNavigate} onB2BRequest={openB2B} />;
        break;
      case 'harness':
        content = <HarnessPage onNavigate={handleNavigate} />;
        break;
      case 'agentbuild':
        content = <AgentBuildPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
        break;
      case 'courses':
        content = <CoursesPage onNavigate={handleNavigate} onB2BRequest={openB2B} />;
        break;
      case 'profile':
        content = <ProfilePage user={session?.user} profile={profile} onProfileUpdated={setProfile} />;
        break;
      case 'admin':
        content = <AdminDashboardPage isAdmin={isAdmin} currentUserEmail={session?.user?.email} />;
        break;
      case 'b2brequests':
        content = <B2BRequestsPage isAdmin={isAdmin} />;
        break;
      case 'myjobs':
        content = (
          <MyJobsPage
            user={session?.user}
            isLoggedIn={isLoggedIn}
            onOpenConversation={openInbox}
            onNavigate={handleNavigate}
            onViewProfile={openUserProfile}
          />
        );
        break;
      case 'myapplications':
        content = (
          <MyApplicationsPage
            user={session?.user}
            isLoggedIn={isLoggedIn}
            onOpenJob={openJob}
          />
        );
        break;
      case 'userprofile':
        content = (
          <ProfilePage
            viewUserId={viewUserId}
            viewProfileFallback={viewUserFallback}
            onBack={() => handleNavigate('myjobs')}
          />
        );
        break;
      case 'disputes':
        content = <DisputesPage isAdmin={isAdmin} onOpenConversation={openInbox} />;
        break;
      case 'mediation':
        content = (
          <MediationPage
            user={session?.user}
            isLoggedIn={isLoggedIn}
            profile={profile}
            initialTab={scrollToSection}
          />
        );
        break;
      case 'mediations-admin':
        content = <MediationsAdminPage isAdmin={isAdmin} onOpenConversation={openInbox} />;
        break;
      case 'disputeservice':
        content = <DisputeServicePage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />;
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
            onNavigate={handleNavigate}
          />
        );
        break;
      case 'employment':
        content = (
          <EmploymentPage
            isLoggedIn={isLoggedIn}
            isAdmin={isAdmin}
            isMember={isMember}
            onNavigate={handleNavigate}
            user={session?.user}
            profile={profile}
            onOpenConversation={openInbox}
            initialJobId={employmentJobId}
            onJobConsumed={() => setEmploymentJobId(null)}
            onOpenSearch={openSearch}
            onProfileChanged={refreshProfile}
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
            initialCategory={communityCategory}
            onCategoryConsumed={() => setCommunityCategory(null)}
            onOpenConversation={openInbox}
            onOpenSearch={openSearch}
            onProfileChanged={refreshProfile}
          />
        );
        break;
      case 'faq':
        content = <FAQPage onNavigate={handleNavigate} />;
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
        coins={profile?.coins ?? 0}
        avatarUrl={profile?.avatar_url}
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
      {b2bType && (
        <B2BRequestModal
          type={b2bType}
          user={session?.user}
          profile={profile}
          onClose={() => setB2bType(null)}
        />
      )}
    </div>
  );
}

export default App;
