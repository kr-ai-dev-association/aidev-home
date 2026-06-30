import React, { useState } from 'react';

// 자주 묻는 질문(FAQ) — 커뮤니티 공지 '한국인공지능개발자 협동조합 플랫폼 사용법' 기준으로 구성
const FAQ_GROUPS = [
  {
    group: '🚀 가입 · 계정',
    items: [
      {
        q: '협동조합 플랫폼은 어떻게 가입하나요?',
        a: 'Google 또는 GitHub 소셜 인증으로 가입합니다(별도 비밀번호 불필요). 이후 이름·연락처와 구분(개인/법인)을 입력하면 가입이 완료되고, 커뮤니티·취업·메시지 등 모든 기능을 이용할 수 있습니다.',
      },
      {
        q: '회원 등급은 어떻게 나뉘나요?',
        a: '일반 회원(기본 기능)·정회원(관리자 부여 — 투표 참여, 외주 프로젝트 상세 열람)·법인 회원(가입 시 법인 선택, 관리자 승인 후 채용공고·프로젝트 구인 등록 가능)·관리자(회원 승인·권한 부여, 공지 작성, B2B·분쟁 처리)로 구분됩니다.',
      },
    ],
  },
  {
    group: '🪙 코인(Coin) 제도',
    items: [
      {
        q: '코인은 어떻게 적립·차감되나요?',
        a: '활동에 따라 코인이 변동됩니다. 정회원 최초 승인 +1,000, 커뮤니티 글 작성 +1, 답글 작성 +0.1, 취업 공고 등록 −10. 보유 코인은 헤더의 🪙 아이콘과 내 프로필에서 확인할 수 있습니다.',
      },
    ],
  },
  {
    group: '💬 커뮤니티',
    items: [
      {
        q: '커뮤니티에 글은 어떻게 쓰나요?',
        a: '제목·카테고리·태그를 지정해 작성하며, 이미지·유튜브를 삽입할 수 있는 리치 에디터를 제공합니다. 답글로 토론할 수 있고, 도배 방지를 위해 글은 10분·답글은 15초 간격 제한이 있습니다. 작성자 본인과 관리자는 삭제할 수 있습니다.',
      },
    ],
  },
  {
    group: '📢 취업 — 공고 · 지원 · 관리',
    items: [
      {
        q: '어떤 유형의 공고를 올릴 수 있나요?',
        a: '채용공고·프로젝트 구인(법인 회원)·외주 프로젝트가 있습니다. 유형별로 구조화된 입력을 지원합니다 — 프로젝트 구인은 월 급여, 외주 프로젝트는 선금·잔금으로 보수를 표기하고, 문서·소스 첨부(PDF·ZIP·GitHub 링크)와 스크린샷을 함께 등록할 수 있습니다.',
      },
      {
        q: '공고에 지원하거나 문의하려면?',
        a: '공고에서 지원하기(지원서와 내 프로필 전달)와 문의하기(작성자에게 1:1 메시지)를 사용할 수 있습니다. 외부 링크 지원도 병행됩니다. 마음에 드는 공고는 스크랩(북마크)해 두고 내 지원 관리 → 스크랩 탭에서 모아볼 수 있습니다.',
      },
      {
        q: '내가 올린 공고와 지원 현황은 어디서 관리하나요?',
        a: '프로필 메뉴의 내 공고 관리에서 공고별 지원자·지원 내용·처리 상태(검토중/합격 등)를 관리합니다. 지원자 이름을 클릭하면 지원자 프로필 페이지로 바로 이동합니다. 내가 지원한 공고와 스크랩은 내 지원 관리에서 확인합니다.',
      },
      {
        q: '공고 마감은 어떻게 되나요?',
        a: '외주 프로젝트는 지원자 중 계약자를 지정하면 마감되며, 마감 기한이 지나도록 계약이 체결되지 않으면 자동 삭제됩니다. 채용공고·프로젝트 구인은 작성자가 직접 마감·재개시할 수 있고, 마감 1개월 경과 후 자동 삭제됩니다.',
      },
    ],
  },
  {
    group: '🛡️ 외주 거래 보호 · 분쟁 조정',
    items: [
      {
        q: '외주 프로젝트에서 분쟁이 생기면 어떻게 하나요?',
        a: '계약이 체결된 외주의 의뢰자 또는 수행자가 분쟁을 접수하면, 공고와 기능 요구사항 스냅샷이 함께 관리자에게 전달됩니다. 조합 평가팀이 결과물을 사용자와 동일한 환경에서 E2E 테스트로 검증해 조정합니다. 완료 여부는 공고의 기능 요구사항을 기준으로 판단합니다.',
      },
    ],
  },
  {
    group: '🗳️ 투표 (정회원)',
    items: [
      {
        q: '투표 기능은 누가, 어떻게 사용하나요?',
        a: '투표는 정회원 전용 메뉴입니다. 수퍼관리자가 안건을 등록하면 찬성/반대/기권을 1인 1표로 행사하며, 투표율·표수는 익명 인포그래픽으로 표시됩니다. 마감 시 결과가 자동으로 공지됩니다.',
      },
    ],
  },
  {
    group: '✉️ 메시지 · 알림 · 검색 · 공유',
    items: [
      {
        q: '메시지함과 알림은 어떻게 동작하나요?',
        a: '알림(답글·공지·지원·분쟁)과 1:1 메시지를 한곳에서 확인합니다. 안 읽은 항목은 배지로 표시되며, 알림은 개별 또는 전체 삭제할 수 있습니다.',
      },
      {
        q: '검색과 공유 기능은?',
        a: '취업·커뮤니티 통합 검색을 키워드 + 의미 기반으로 지원합니다. 글·공고는 X·Facebook·LinkedIn·Reddit으로 공유할 수 있고, 카카오톡·슬랙에 링크를 붙여넣으면 썸네일 미리보기가 표시됩니다.',
      },
    ],
  },
  {
    group: '🏢 사업 · 서비스 · B2B',
    items: [
      {
        q: '조합의 사업·서비스와 B2B 의뢰는 무엇인가요?',
        a: '에이전트 구축(검증된 조합원에게 프로젝트 의뢰)·에이전트 평가(Prototypebench)·에이전트 하네스를 제공합니다. 기업·조합원은 B2B 의뢰로 견적 문의·평가 신청을 접수할 수 있으며, 관리자가 처리 상태를 관리합니다.',
      },
    ],
  },
];

function FAQPage({ onNavigate }) {
  const [openKey, setOpenKey] = useState('0-0'); // 첫 항목 기본 열림
  const toggle = (key) => setOpenKey((cur) => (cur === key ? null : key));

  return (
    <div className="home-landing faq-page">
      <div className="home-page-container content-area-container">
        <section className="section-faq faq-page-section">
          <div className="faq-page-head">
            <span className="hero-eyebrow">PLATFORM FAQ · 자주 묻는 질문</span>
            <h2>플랫폼 사용법, 한눈에</h2>
            <p className="section-lead">
              한국인공지능개발자 협동조합 플랫폼의 가입·코인·커뮤니티·취업·투표·분쟁 조정 등
              주요 기능을 질문과 답변으로 정리했습니다.
            </p>
          </div>

          {FAQ_GROUPS.map((grp, gi) => (
            <div className="faq-group" key={grp.group}>
              <h3 className="faq-group-title">{grp.group}</h3>
              <ul className="faq-list">
                {grp.items.map((item, ii) => {
                  const key = `${gi}-${ii}`;
                  const open = openKey === key;
                  return (
                    <li key={key} className="faq-item">
                      <button
                        className="faq-question"
                        onClick={() => toggle(key)}
                        aria-expanded={open}
                      >
                        Q. {item.q}
                        <span className="toggle-icon">{open ? '▲' : '▼'}</span>
                      </button>
                      <div
                        className={`faq-answer ${open ? 'faq-answer-visible' : 'faq-answer-hidden'}`}
                        aria-hidden={!open}
                      >
                        <p>A. {item.a}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="faq-page-cta">
            <p className="section-lead">더 궁금한 점이 있으신가요?</p>
            <div className="hero-actions">
              <button className="cta-button" onClick={() => onNavigate('community', null, '공지사항')}>공지사항 보기</button>
              <button className="ghost-button" onClick={() => onNavigate('community')}>커뮤니티 질문하기</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default FAQPage;
