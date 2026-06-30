import React, { useEffect, useState, useCallback } from 'react';
import './MediationPage.css';
import './CoinChargePage.css';
import { supabase } from '../lib/supabase';
import CoinIcon from './CoinIcon';
import { useI18n } from '../i18n/I18nProvider';

function CoinChargePage({ user, isLoggedIn, profile, onProfileChanged }) {
  const { t } = useI18n();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('coin_products')
      .select('*')
      .eq('active', true)
      .order('sort', { ascending: true });
    setProducts(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // 결제 후 탭으로 돌아오면 코인 잔액 새로고침
  useEffect(() => {
    const onFocus = () => onProfileChanged && onProfileChanged();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [onProfileChanged]);

  const buy = (p) => {
    if (!user?.id) { alert(t('coin.loginToCharge')); return; }
    let url;
    try { url = new URL(p.checkout_url); } catch { alert(t('coin.invalidCheckoutUrl')); return; }
    // 웹훅이 사용자/이메일을 식별하도록 커스텀 데이터 전달
    url.searchParams.set('checkout[custom][user_id]', user.id);
    if (user.email) url.searchParams.set('checkout[email]', user.email);
    window.open(url.toString(), '_blank', 'noopener');
  };

  if (!isLoggedIn) {
    return (
      <div className="home-landing admin-page">
        <div className="home-page-container content-area-container">
          <section className="section-services"><h3>{t('coin.loginRequiredTitle')}</h3>
            <p className="section-lead">{t('coin.loginRequiredLead')}</p>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="home-landing admin-page coincharge-page">
      <div className="home-page-container content-area-container">
        <section className="section-services">
          <h3>{t('coin.title')}</h3>
          <p className="section-lead">{t('coin.lead')}</p>

          <div className="cc-balance">
            <CoinIcon size={22} className="coin-icon" />
            <span>{t('coin.balancePrefix')} <strong>{Number(profile?.coins ?? 0).toLocaleString()}</strong> {t('coin.coinUnit')}</span>
          </div>

          {loading ? (
            <p className="admin-msg">{t('coin.loading')}</p>
          ) : products.length === 0 ? (
            <p className="admin-msg">{t('coin.noProducts')}</p>
          ) : (
            <div className="cc-grid">
              {products.map((p) => (
                <div className="cc-card" key={p.id}>
                  <div className="cc-coins"><CoinIcon size={20} /> {Number(p.coins).toLocaleString()} <span>{t('coin.coinUnit')}</span></div>
                  <div className="cc-label">{p.label}</div>
                  {p.price_label && <div className="cc-price">{p.price_label}</div>}
                  <button type="button" className="cc-buy" onClick={() => buy(p)}>{t('coin.buyBtn')}</button>
                </div>
              ))}
            </div>
          )}

          <ul className="cc-notes">
            <li dangerouslySetInnerHTML={{ __html: t('coin.noteAutoApply') }} />
            <li>{t('coin.noteReceipt')}</li>
            <li dangerouslySetInnerHTML={{ __html: t('coin.noteUnitPrice') }} />
          </ul>
        </section>
      </div>
    </div>
  );
}

export default CoinChargePage;
