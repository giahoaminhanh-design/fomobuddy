(function(){
  // Config toàn cục: đặt trước khi load file này
  const CFG = window.FOMO_CHAT || {};
  const ENDPOINT = CFG.proxy || 'https://<YOUR-PROJECT>.vercel.app/api/chat';
  const TITLE = CFG.title || 'FoMO Buddy';

  function el(tag, props={}, children=[]) {
    const d = document.createElement(tag);
    Object.assign(d, props);
    children.forEach(c => d.appendChild(c));
    return d;
  }

  const btn = el('button', { className: 'fomo-chat-btn', id: 'fomoChatBtn', textContent: '💬 Chat FoMO' });
  const panel = el('div', { className: 'fomo-chat-panel', id: 'fomoChatPanel' }, [
    el('div', { className: 'fomo-chat-header' }, [
      el('span', { textContent: TITLE }),
      el('button', { id: 'fomoClose', textContent: '✕', style: 'background:transparent;border:none;color:#fff;cursor:pointer' })
    ]),
    el('div', { className: 'fomo-chat-body', id: 'fomoChatBody' }),
    el('div', { className: 'fomo-chat-input' }, [
      el('input', { id: 'fomoInput', placeholder: 'Nhập câu hỏi…', style: 'flex:1;padding:10px;border:1px solid #e5e7eb;border-radius:10px' }),
      el('button', { id: 'fomoSend', textContent: 'Gửi', style: 'padding:10px 14px;border:none;background:#111;color:#fff;border-radius:10px;cursor:pointer' })
    ])
  ]);

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild(btn);
    document.body.appendChild(panel);
    const $body = panel.querySelector('#fomoChatBody');
    const $input = panel.querySelector('#fomoInput');
    const $send = panel.querySelector('#fomoSend');
    const $close = panel.querySelector('#fomoClose');

    let open = false;
    let history = [];

    function addMsg(text, who='bot') {
      const div = document.createElement('div');
      div.className = 'fomo-msg ' + (who === 'user' ? 'fomo-user' : 'fomo-bot');
      div.textContent = text;
      $body.appendChild(div);
      $body.scrollTop = $body.scrollHeight;
    }

    async function ask(text){
      addMsg(text, 'user'); $input.value = '';
      addMsg('Đang gõ…', 'bot');
      try {
        const r = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ message: text, history })
        });
        const data = await r.json();
        $body.lastChild.remove();
        addMsg(data.reply || 'Mình chưa rõ ý, bạn nói cụ thể hơn nhé!', 'bot');
        history.push({ role: 'user', content: text });
        history.push({ role: 'assistant', content: data.reply || '' });
      } catch (e) {
        $body.lastChild.remove();
        addMsg('Có lỗi kết nối, thử lại sau nhé!', 'bot');
        console.error(e);
      }
    }

    btn.onclick = () => {
      open = !open;
      panel.style.display = open ? 'block' : 'none';
      if (open && !$body.dataset.inited) {
        addMsg('Chào bạn! Mình là FoMO Buddy. Bạn muốn tìm hiểu hay cần mẹo giảm FoMO không?', 'bot');
        $body.dataset.inited = '1';
      }
    };
    $close.onclick = () => { open = false; panel.style.display = 'none'; };
    $send.onclick = () => { const t = $input.value.trim(); if (t) ask(t); };
    $input.addEventListener('keydown', e => { if (e.key === 'Enter') { const t = $input.value.trim(); if (t) ask(t); } });
  });
})();