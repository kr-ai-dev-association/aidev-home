import { supabase } from './supabase';

// 내가 스크랩한 공고 id 목록
export async function fetchMyScrapIds(userId) {
  if (!userId) return [];
  const { data } = await supabase.from('job_scraps').select('job_id').eq('user_id', userId);
  return (data || []).map((r) => r.job_id);
}

export function addScrap(userId, jobId) {
  return supabase.from('job_scraps').insert({ user_id: userId, job_id: jobId });
}

export function removeScrap(userId, jobId) {
  return supabase.from('job_scraps').delete().eq('user_id', userId).eq('job_id', jobId);
}
