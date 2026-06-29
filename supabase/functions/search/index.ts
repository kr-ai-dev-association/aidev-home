// Supabase Edge Function: 의미 유사도 검색 + 임베딩 색인
// 모델: 내장 gte-small (384차원), 외부 API 키 불필요
// 배포: supabase functions deploy search   (또는 대시보드 Edge Functions에 붙여넣기)
import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'jsr:@supabase/supabase-js@2';

// gte-small 모델 세션 (Edge Runtime 내장)
const model = new Supabase.ai.Session('gte-small');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const { action = 'search', q = '', kind = null, count = 20 } = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // 색인: 임베딩이 없는 문서들을 임베딩하여 저장 (백필 + 신규)
    if (action === 'index') {
      const { data: pending } = await supabase
        .from('search_documents')
        .select('id, content')
        .is('embedding', null)
        .limit(300);
      let updated = 0;
      for (const row of pending ?? []) {
        const embedding = await model.run((row.content ?? '').slice(0, 2000), {
          mean_pool: true,
          normalize: true,
        });
        await supabase.from('search_documents').update({ embedding }).eq('id', row.id);
        updated++;
      }
      return json({ updated, remaining: (pending?.length ?? 0) - updated });
    }

    // 검색: 질의를 임베딩 → 코사인 유사도 매칭
    if (!String(q).trim()) return json({ results: [] });
    const queryEmbedding = await model.run(String(q), { mean_pool: true, normalize: true });
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_kind: kind,
      match_count: count,
    });
    if (error) throw error;
    return json({ results: data });
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 400);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
