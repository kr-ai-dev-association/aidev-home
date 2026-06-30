import React, { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';

// 자주 묻는 질문(FAQ) — 커뮤니티 공지 '한국인공지능개발자 협동조합 플랫폼 사용법' 기준으로 구성
// 정적 콘텐츠는 faqPage 네임스페이스 키로 번역합니다.
const FAQ_GROUPS = [
  {
    groupKey: 'groupAccount',
    items: [
      { qKey: 'accountQ1', aKey: 'accountA1' },
      { qKey: 'accountQ2', aKey: 'accountA2' },
    ],
  },
  {
    groupKey: 'groupCoin',
    items: [
      { qKey: 'coinQ1', aKey: 'coinA1' },
      { qKey: 'coinQ2', aKey: 'coinA2' },
    ],
  },
  {
    groupKey: 'groupCommunity',
    items: [
      { qKey: 'communityQ1', aKey: 'communityA1' },
    ],
  },
  {
    groupKey: 'groupJobs',
    items: [
      { qKey: 'jobsQ1', aKey: 'jobsA1' },
      { qKey: 'jobsQ2', aKey: 'jobsA2' },
      { qKey: 'jobsQ3', aKey: 'jobsA3' },
      { qKey: 'jobsQ4', aKey: 'jobsA4' },
    ],
  },
  {
    groupKey: 'groupDispute',
    items: [
      { qKey: 'disputeQ1', aKey: 'disputeA1' },
      { qKey: 'disputeQ2', aKey: 'disputeA2' },
      { qKey: 'disputeQ3', aKey: 'disputeA3' },
      { qKey: 'disputeQ4', aKey: 'disputeA4' },
    ],
  },
  {
    groupKey: 'groupVote',
    items: [
      { qKey: 'voteQ1', aKey: 'voteA1' },
    ],
  },
  {
    groupKey: 'groupMessaging',
    items: [
      { qKey: 'messagingQ1', aKey: 'messagingA1' },
      { qKey: 'messagingQ2', aKey: 'messagingA2' },
    ],
  },
  {
    groupKey: 'groupBiz',
    items: [
      { qKey: 'bizQ1', aKey: 'bizA1' },
    ],
  },
];

function FAQPage({ onNavigate }) {
  const { t } = useI18n();
  // 기본적으로 모든 항목을 펼쳐서 표시 (개별 접기/펼치기 가능)
  const [openKeys, setOpenKeys] = useState(() => {
    const all = new Set();
    FAQ_GROUPS.forEach((g, gi) => g.items.forEach((_, ii) => all.add(`${gi}-${ii}`)));
    return all;
  });
  const toggle = (key) =>
    setOpenKeys((cur) => {
      const next = new Set(cur);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <div className="home-landing faq-page">
      <div className="home-page-container content-area-container">
        <section className="section-faq faq-page-section">
          <div className="faq-page-head">
            <span className="hero-eyebrow">{t('faqPage.eyebrow')}</span>
            <h2>{t('faqPage.heading')}</h2>
            <p className="section-lead">
              {t('faqPage.lead')}
            </p>
          </div>

          {FAQ_GROUPS.map((grp, gi) => (
            <div className="faq-group" key={grp.groupKey}>
              <h3 className="faq-group-title">{t(`faqPage.${grp.groupKey}`)}</h3>
              <ul className="faq-list">
                {grp.items.map((item, ii) => {
                  const key = `${gi}-${ii}`;
                  const open = openKeys.has(key);
                  return (
                    <li key={key} className="faq-item">
                      <button
                        className="faq-question"
                        onClick={() => toggle(key)}
                        aria-expanded={open}
                      >
                        {t('faqPage.qPrefix')}{t(`faqPage.${item.qKey}`)}
                        <span className="toggle-icon">{open ? '▲' : '▼'}</span>
                      </button>
                      <div
                        className={`faq-answer ${open ? 'faq-answer-visible' : 'faq-answer-hidden'}`}
                        aria-hidden={!open}
                      >
                        <p>{t('faqPage.aPrefix')}{t(`faqPage.${item.aKey}`)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <div className="faq-page-cta">
            <p className="section-lead">{t('faqPage.ctaLead')}</p>
            <div className="hero-actions">
              <button className="cta-button" onClick={() => onNavigate('community', null, '공지사항')}>{t('faqPage.ctaNotice')}</button>
              <button className="ghost-button" onClick={() => onNavigate('community')}>{t('faqPage.ctaCommunity')}</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default FAQPage;
