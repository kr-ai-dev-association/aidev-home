import { supabase } from './supabase';

// 안 읽은 알림 + 안 읽은 메시지 합계
export async function fetchUnreadCounts(userId) {
  if (!userId) return { notif: 0, dm: 0, total: 0 };
  const [{ count: notif }, { count: dm }] = await Promise.all([
    supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('read', false),
    supabase.from('messages').select('id', { count: 'exact', head: true }).is('read_at', null).neq('sender_id', userId),
  ]);
  const n = notif || 0;
  const d = dm || 0;
  return { notif: n, dm: d, total: n + d };
}

// 게시글/공고 작성자에게 메시지 시작 → 대화방 id 반환
export async function startConversation(otherUserId) {
  const { data, error } = await supabase.rpc('get_or_create_conversation', { other_user: otherUserId });
  if (error) throw error;
  return data; // conversation id
}
