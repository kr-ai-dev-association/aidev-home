// Lemon Squeezy 결제 웹훅 → 코인 적립 (Supabase Edge Function)
//   배포: supabase functions deploy lemonsqueezy-webhook --no-verify-jwt
//   시크릿: supabase secrets set LEMONSQUEEZY_WEBHOOK_SECRET=...
//   Lemon Squeezy → Settings → Webhooks 에 이 함수 URL 등록, 'order_created' 이벤트 구독
//   ※ JWT 검증 비활성(외부 웹훅) — 대신 HMAC 서명(X-Signature)으로 진위 검증

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const SECRET = Deno.env.get('LEMONSQUEEZY_WEBHOOK_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    if (!SECRET) return new Response('webhook secret not set', { status: 500 });

    const raw = await req.text();

    // HMAC-SHA256 서명 검증
    const sigHeader = req.headers.get('X-Signature') || '';
    const key = await crypto.subtle.importKey('raw', enc.encode(SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const mac = await crypto.subtle.sign('HMAC', key, enc.encode(raw));
    const expected = toHex(mac);
    if (sigHeader.length !== expected.length || sigHeader.toLowerCase() !== expected) {
      return new Response('invalid signature', { status: 401 });
    }

    const body = JSON.parse(raw);
    const event = body?.meta?.event_name;
    // 결제 완료 주문만 처리
    if (event !== 'order_created') {
      return new Response(JSON.stringify({ ok: true, skipped: event }), { headers: { 'content-type': 'application/json' } });
    }

    const attr = body?.data?.attributes || {};
    const status = attr.status; // 'paid'
    const orderId = String(body?.data?.id ?? '');
    const variantId = String(attr?.first_order_item?.variant_id ?? '');
    const userId = body?.meta?.custom_data?.user_id || null;

    if (status !== 'paid') {
      return new Response(JSON.stringify({ ok: true, skipped: `status=${status}` }), { headers: { 'content-type': 'application/json' } });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

    // variant → 코인 (서버 권위)
    const { data: prod } = await admin.from('coin_products').select('coins').eq('variant_id', variantId).maybeSingle();
    const coins = prod?.coins;
    if (!coins) {
      return new Response(JSON.stringify({ ok: false, reason: 'unknown variant', variantId }), { headers: { 'content-type': 'application/json' } });
    }
    if (!userId) {
      return new Response(JSON.stringify({ ok: false, reason: 'no user_id in custom_data', orderId }), { headers: { 'content-type': 'application/json' } });
    }

    // 멱등 적립
    const { data: credited, error } = await admin.rpc('credit_lemonsqueezy_order', {
      p_order_id: orderId, p_user_id: userId, p_variant_id: variantId, p_coins: coins,
    });
    if (error) return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500, headers: { 'content-type': 'application/json' } });

    return new Response(JSON.stringify({ ok: true, credited, coins, orderId }), { headers: { 'content-type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { 'content-type': 'application/json' } });
  }
});
