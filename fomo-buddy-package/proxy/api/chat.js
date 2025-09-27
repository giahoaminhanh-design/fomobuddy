export const config = { runtime: 'edge' };

const ALLOWED_ORIGINS = [
  // TODO: đổi thành domain của bạn, ví dụ:
  // 'https://fomoguardgiahoaminhanh.site',
  // 'https://giaoaminhanh-design.github.io',
  '*', // tạm thời cho phép tất cả, nên thu hẹp sau khi test
];

function corsHeaders(req) {
  const origin = req.headers.get('origin') || '*';
  const allow = ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin) ? origin : 'null';
  return {
    'access-control-allow-origin': allow,
    'access-control-allow-headers': 'content-type',
    'access-control-allow-methods': 'POST, OPTIONS',
    'content-type': 'application/json; charset=utf-8'
  };
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders(req) });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders(req) });
  }

  try {
    const { message, history = [] } = await req.json();
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message required' }), { status: 400, headers: corsHeaders(req) });
    }

    // Gọi OpenAI Chat Completions
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.6,
        messages: [
          {
            role: 'system',
            content:
              'Bạn là “FoMO Buddy” – trợ lý thân thiện, nói chuyện gần gũi nhưng chuẩn mực. Nhiệm vụ: giúp học sinh/giới trẻ hiểu về FoMO, quản lý hành vi số, gợi ý bài tập thực hành ngắn, tôn trọng và không phán xét.'
          },
          ...history,
          { role: 'user', content: message }
        ]
      })
    });

    const data = await r.json();
    if (!r.ok) {
      const msg = data?.error?.message || 'OpenAI error';
      return new Response(JSON.stringify({ error: msg }), { status: 500, headers: corsHeaders(req) });
    }

    const reply = data?.choices?.[0]?.message?.content || 'Mình chưa rõ ý bạn, mô tả thêm một chút nhé!';
    return new Response(JSON.stringify({ reply }), { status: 200, headers: corsHeaders(req) });
  } catch (e) {
    return new Response(JSON.stringify({ error: e?.message || 'Server error' }), { status: 500, headers: corsHeaders(req) });
  }
}
