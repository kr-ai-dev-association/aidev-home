import { supabase } from './supabase';

// 티어 배지 (성실 → 모범 → 우등). 상호배타·자동 수여. rank 로 정렬/비교.
export const TIER_BADGES = {
  '성실': { label: '성실 조합원', emoji: '🌱', color: '#cd7f32', rank: 1, desc: '정회원 전환 후 프로필 작성을 완료한 조합원·법인' },
  '모범': { label: '모범 조합원', emoji: '⭐', color: '#c0c7d0', rank: 2, desc: '성실 조합원 획득 후 3개월 이상 커뮤니티 활동이 우수한 조합원·법인' },
  '우등': { label: '우등 조합원', emoji: '👑', color: '#ffd24a', rank: 3, desc: '모범 조합원 획득 후 조합원에게 서비스를 1회 이상 제공한 조합원·법인' },
};

// 전문가 조합원 분야 (관리자 수여, 복수 가능). key 는 DB 저장값.
export const EXPERT_FIELDS = [
  { key: 'ai-research',   label: 'AI 리서치',        emoji: '🔬', color: '#6366f1' },
  { key: 'ai-eng',        label: 'AI 엔지니어링',     emoji: '⚙️', color: '#3b82f6' },
  { key: 'ai-agent',      label: 'AI 에이전트 구축',  emoji: '🤖', color: '#22d3ee' },
  { key: 'cs',            label: '컴퓨터사이언스',    emoji: '💻', color: '#64748b' },
  { key: 'system-sw',     label: '시스템 소프트웨어', emoji: '🖥️', color: '#14b8a6' },
  { key: 'embedded-sw',   label: '임베디드 소프트웨어', emoji: '🔌', color: '#22c55e' },
  { key: 'electronics',   label: '전자제어',          emoji: '🎛️', color: '#84cc16' },
  { key: 'mechanical',    label: '기계공학',          emoji: '🛠️', color: '#f59e0b' },
  { key: 'management',    label: '경영',              emoji: '📈', color: '#fb923c' },
  { key: 'music',         label: '음악',              emoji: '🎵', color: '#ec4899' },
  { key: 'art',           label: '미술',              emoji: '🎨', color: '#d946ef' },
  { key: 'video',         label: '영상',              emoji: '🎬', color: '#a855f7' },
  { key: 'it-instructor', label: 'IT 강사',           emoji: '👨‍🏫', color: '#0ea5e9' },
  { key: 'sports',        label: '체육',              emoji: '🏅', color: '#ef4444' },
  { key: 'food',          label: '음식',              emoji: '🍳', color: '#eab308' },
  { key: 'finance',       label: '금융',              emoji: '💰', color: '#10b981' },
];

export const expertField = (key) => EXPERT_FIELDS.find((f) => f.key === key);

// 특정 사용자의 전문가 배지 목록 조회
export async function fetchExpertBadges(userId) {
  if (!userId) return [];
  const { data } = await supabase
    .from('expert_badges')
    .select('field, awarded_at')
    .eq('user_id', userId)
    .order('awarded_at', { ascending: true });
  return data || [];
}

// 본인 티어 자동 재평가 (프로필 로드 시 호출)
export async function evaluateMyTier(userId) {
  if (!userId) return null;
  const { data, error } = await supabase.rpc('evaluate_member_tier', { target: userId });
  if (error) return null;
  return data;
}
