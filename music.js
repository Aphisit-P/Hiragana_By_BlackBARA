/* =====================================================================
   music.js — เครื่องเล่นเพลง YouTube สำหรับ ひらがな Lab
   วิธีใช้: ใส่ <script src="music.js"></script> ก่อน </body> ของทุกหน้า
   ===================================================================== */
(() => {
  'use strict';
  if (window.__hlMusic) return;
  window.__hlMusic = true;

  /* ---------- ตั้งค่า ---------- */
  // YouTube Data API v3 key (ใช้สำหรับ "ค้นหาเพลง" เท่านั้น — เล่นเพลงไม่ต้องใช้ key)
  // ปล่อยว่างได้ แล้วผู้ใช้วาง key ในช่องค้นหาแทนได้
  const YT_API_KEY = '';

  const LS_KEY = 'hlm_state_v1';
  const LS_OWNER = 'hlm_owner';
  const TAB = Math.random().toString(36).slice(2);

  /* ---------- helpers ---------- */
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const decode = s => { const t = document.createElement('textarea'); t.innerHTML = s; return t.value; };
  const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

  /* ---------- state (เก็บใน localStorage เพื่อให้ข้ามหน้าได้) ---------- */
  const DEFAULTS = { queue: [], index: -1, time: 0, savedAt: 0, playing: false, volume: 70, muted: false, repeat: 'off', shuffle: false, playlists: {}, apiKey: '' };
  let S;
  try { S = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(LS_KEY) || '{}') }; } catch { S = { ...DEFAULTS }; }
  if (S.playing && Date.now() - S.savedAt > 30000) S.playing = false;   // ไม่เล่นเองถ้าปิดเว็บไปนาน
  if (S.index >= S.queue.length) S.index = S.queue.length ? 0 : -1;

  let player = null, ready = false, yielded = false, unloading = false;
  let dragging = false, errStreak = 0, tab = 'search', panelOpen = false;
  let results = [], lastQ = '', openList = null, menuTrack = null, tickN = 0, lastMetaId = null;

  function save() {
    try {
      if (yielded) { // แท็บที่ถูกแย่งการเล่น: เขียนเฉพาะข้อมูลที่ไม่ขัดกับแท็บที่กำลังเล่น
        const cur = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
        cur.playlists = S.playlists; cur.apiKey = S.apiKey;
        localStorage.setItem(LS_KEY, JSON.stringify(cur));
      } else localStorage.setItem(LS_KEY, JSON.stringify(S));
    } catch { }
  }
  const claim = () => { try { localStorage.setItem(LS_OWNER, TAB); } catch { } };
  const startAt = () => {
    let t = S.time || 0;
    if (S.playing && S.savedAt) t += Math.min(3, (Date.now() - S.savedAt) / 1000);
    return Math.floor(t);
  };

  /* ---------- UI ---------- */
  const CSS = `
  body.hlm-on{padding-bottom:calc(78px + env(safe-area-inset-bottom))!important}
  #hlm{--bg:rgba(24,26,36,.97);--fg:#f2f4f8;--mut:#9aa3b5;--ac:#5aa9ff;--line:rgba(255,255,255,.1);
    position:fixed;left:0;right:0;bottom:0;z-index:99999;pointer-events:none;color:var(--fg);
    font:14px/1.4 'Kanit','Poppins',system-ui,sans-serif;padding-bottom:env(safe-area-inset-bottom)}
  #hlm *{box-sizing:border-box}
  #hlm button{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent}
  #hlm input{font:inherit}
  #hlm input[type=range]{width:100%;accent-color:var(--ac);margin:0}
  #hlm .hlm-bar,#hlm .hlm-panel,#hlm .hlm-menu{pointer-events:auto;background:var(--bg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border:1px solid var(--line);box-shadow:0 8px 30px rgba(0,0,0,.35)}
  .hlm-bar{position:relative;display:flex;align-items:center;gap:4px;width:min(720px,calc(100% - 16px));margin:0 auto 8px;padding:6px 10px 8px;border-radius:16px}
  .hlm-bar .ic{width:38px;height:38px;border-radius:50%;font-size:18px;display:grid;place-items:center;flex:none}
  .hlm-bar .ic:hover,.hlm-ctrl button:hover{background:rgba(255,255,255,.08)}
  .hlm-bar .main{background:var(--ac);color:#0b1220}
  .hlm-mt{flex:1;min-width:0;padding:0 6px;cursor:pointer}
  .hlm-mt b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500}
  .hlm-mt small{color:var(--mut);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .hlm-prog{position:absolute;left:14px;right:14px;bottom:3px;height:2px;background:var(--line);border-radius:2px;overflow:hidden}
  .hlm-prog i{display:block;height:100%;width:0;background:var(--ac)}
  .hlm-panel,.hlm-menu{position:absolute;right:max(8px,calc((100% - 720px)/2));width:min(420px,calc(100% - 16px));border-radius:16px}
  .hlm-panel{bottom:calc(72px + env(safe-area-inset-bottom));max-height:calc(100vh - 96px);overflow-y:auto;padding:12px;transition:transform .22s,opacity .22s}
  .hlm-panel:not(.open){transform:translateY(24px);opacity:0;pointer-events:none!important}
  .hlm-video{height:min(210px,25vh);aspect-ratio:16/9;margin:0 auto 10px;border-radius:12px;overflow:hidden;background:#000;max-width:100%}
  .hlm-video iframe{width:100%;height:100%;border:0;display:block}
  .hlm-now .t{font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .hlm-now .c{color:var(--mut);font-size:12px;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .hlm-seek{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--mut)}
  .hlm-ctrl{display:flex;justify-content:space-between;align-items:center;margin:6px 0}
  .hlm-ctrl button{width:44px;height:44px;border-radius:50%;font-size:20px;opacity:.9}
  .hlm-ctrl button.main{background:var(--ac);color:#0b1220;opacity:1}
  .hlm-ctrl button.on{color:var(--ac);opacity:1}
  .hlm-ctrl button.dim{opacity:.4}
  .hlm-vol{display:flex;align-items:center;gap:8px}
  .hlm-vol button{font-size:18px;width:32px}
  .hlm-tabs{display:flex;gap:6px;margin:12px 0 8px;border-top:1px solid var(--line);padding-top:10px}
  .hlm-tabs button{flex:1;padding:7px 0;border-radius:10px;background:rgba(255,255,255,.06);color:var(--mut)}
  .hlm-tabs button.on{background:var(--ac);color:#0b1220;font-weight:600}
  .hlm-body{min-height:120px}
  .hlm-sr{display:flex;gap:6px;margin-bottom:8px}
  .hlm-sr input,.hlm-note input,.hlm-new input{flex:1;min-width:0;padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:rgba(255,255,255,.07);color:var(--fg);outline:none}
  .hlm-sr input:focus,.hlm-note input:focus,.hlm-new input:focus{border-color:var(--ac)}
  .hlm-sr>button,.hlm-note button,.hlm-new button,.hlm-tools button{padding:7px 12px;border-radius:10px;background:rgba(255,255,255,.1)}
  .hlm-tools{display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap}
  .hlm-note{font-size:12px;color:var(--mut);background:rgba(255,255,255,.05);padding:8px;border-radius:10px;margin-bottom:8px;display:flex;flex-direction:column;gap:6px}
  .hlm-note div{display:flex;gap:6px}
  .hlm-row{display:flex;align-items:center;gap:4px;padding:4px;border-radius:10px}
  .hlm-row:hover{background:rgba(255,255,255,.06)}
  .hlm-row.cur{background:rgba(90,169,255,.18)}
  .hlm-row img{width:56px;height:42px;object-fit:cover;border-radius:6px;flex:none;background:#000}
  .hlm-rt{flex:1;min-width:0;display:flex;align-items:center;gap:8px;cursor:pointer}
  .hlm-rt span{min-width:0}
  .hlm-rt b,.hlm-rt small{display:block;overflow:hidden;text-overflow:ellipsis}
  .hlm-rt b{font-weight:500;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-size:13px}
  .hlm-rt small{color:var(--mut);font-size:11px;white-space:nowrap}
  .hlm-row>button,.hlm-plh>button{width:32px;height:32px;border-radius:8px;flex:none;color:var(--mut)}
  .hlm-row>button:hover,.hlm-plh>button:hover{background:rgba(255,255,255,.1);color:var(--fg)}
  .hlm-pl{border:1px solid var(--line);border-radius:12px;margin-bottom:8px;padding:4px}
  .hlm-plh{display:flex;align-items:center;gap:4px;padding:4px}
  .hlm-plh .hlm-rt{display:block}
  .hlm-plh .hlm-rt b{display:block;font-size:14px}
  .hlm-empty{color:var(--mut);text-align:center;padding:18px 8px;font-size:13px}
  .hlm-menu{bottom:calc(72px + env(safe-area-inset-bottom));padding:10px;z-index:2;display:flex;flex-direction:column;gap:4px;max-height:50vh;overflow:auto}
  .hlm-menu .mh{display:flex;justify-content:space-between;font-weight:600;margin-bottom:4px}
  .hlm-menu>button{text-align:left;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,.07)}
  .hlm-new{display:flex;gap:6px;margin-top:4px}
  .hlm-toast{position:absolute;left:50%;bottom:calc(74px + env(safe-area-inset-bottom));transform:translateX(-50%);background:#000c;color:#fff;padding:7px 14px;border-radius:20px;font-size:13px;opacity:0;transition:opacity .2s;pointer-events:none;white-space:nowrap;max-width:92vw;overflow:hidden;text-overflow:ellipsis}
  .hlm-toast.show{opacity:1}
  @media (max-width:480px){.hlm-panel,.hlm-menu{right:8px}}
  `;

  const root = document.createElement('div');
  root.id = 'hlm';
  root.innerHTML = `
  <div class="hlm-panel" data-r="panel">
    <div class="hlm-video"><div id="hlm-yt"></div></div>
    <div class="hlm-now">
      <div class="t" data-r="title">ยังไม่ได้เลือกเพลง</div>
      <div class="c" data-r="ch">&nbsp;</div>
      <div class="hlm-seek"><span data-r="cur">0:00</span><input type="range" min="0" max="1000" value="0" step="1" data-r="seek" aria-label="เลื่อนเวลา"><span data-r="dur">0:00</span></div>
      <div class="hlm-ctrl">
        <button data-act="shuffle" data-r="shuffle" title="สุ่มเพลง">🔀</button>
        <button data-act="prev" title="เพลงก่อนหน้า">⏮</button>
        <button data-act="play" class="main" data-r="playBtn" title="เล่น/หยุด">▶</button>
        <button data-act="next" title="เพลงถัดไป">⏭</button>
        <button data-act="repeat" data-r="repeat" title="เล่นวนซ้ำ">🔁</button>
      </div>
      <div class="hlm-vol"><button data-act="mute" data-r="mute" title="ปิด/เปิดเสียง">🔊</button><input type="range" min="0" max="100" value="70" data-r="vol" aria-label="ระดับเสียง"></div>
    </div>
    <div class="hlm-tabs">
      <button data-act="tab" data-t="search">🔍 ค้นหา</button>
      <button data-act="tab" data-t="lists">📁 เพลย์ลิสต์</button>
      <button data-act="tab" data-t="queue">📃 คิว</button>
    </div>
    <div class="hlm-body" data-r="body"></div>
  </div>
  <div data-r="menuHost"></div>
  <div class="hlm-toast" data-r="toast"></div>
  <div class="hlm-bar">
    <button class="ic" data-act="prev" title="ก่อนหน้า">⏮</button>
    <button class="ic main" data-act="play" data-r="playBtn" title="เล่น/หยุด">▶</button>
    <button class="ic" data-act="next" title="ถัดไป">⏭</button>
    <div class="hlm-mt" data-act="panel"><b data-r="title">ยังไม่ได้เลือกเพลง</b><small data-r="ch">แตะเพื่อเปิดเครื่องเล่น</small></div>
    <button class="ic" data-act="panel" data-r="panelBtn" title="เปิด/ปิดเครื่องเล่น">▲</button>
    <div class="hlm-prog"><i data-r="prog"></i></div>
  </div>`;

  const r = name => root.querySelector(`[data-r="${name}"]`);
  const ra = name => root.querySelectorAll(`[data-r="${name}"]`);
  const setText = (name, v) => ra(name).forEach(el => { el.textContent = v; });

  /* ---------- YouTube IFrame API ---------- */
  function loadYT() {
    if (window.YT && YT.Player) return initPlayer();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { if (prev) prev(); initPlayer(); };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(s);
  }
  function initPlayer() {
    const vars = { playsinline: 1, rel: 0, controls: 0, disablekb: 1, modestbranding: 1, iv_load_policy: 3 };
    if (/^https?:$/.test(location.protocol)) vars.origin = location.origin;
    player = new YT.Player('hlm-yt', {
      width: '100%', height: '100%', playerVars: vars,
      events: { onReady, onStateChange, onError }
    });
  }
  function onReady() {
    ready = true;
    applyVolume();
    const cur = S.queue[S.index];
    if (cur) {
      if (S.playing) { player.loadVideoById({ videoId: cur.id, startSeconds: startAt() }); armGesture(); }
      else player.cueVideoById({ videoId: cur.id, startSeconds: S.time || 0 });
    }
    renderNow();
  }
  function onStateChange(e) {
    if (unloading) return;
    const st = e.data;
    if (st === 1) {                       // PLAYING
      if (yielded) return;
      S.playing = true; errStreak = 0; claim(); fillTitle(); disarmGesture();
    } else if (st === 2) {                // PAUSED
      if (yielded) return;
      S.playing = false; S.time = player.getCurrentTime(); S.savedAt = Date.now();
    } else if (st === 0) {                // ENDED
      if (!yielded) onEnded();
    }
    save(); renderNow();
  }
  function onError() {
    errStreak++;
    toast('เล่นเพลงนี้ไม่ได้ (เจ้าของปิดการฝัง) — ข้ามไปเพลงถัดไป');
    if (S.queue.length > 1 && errStreak < S.queue.length) setTimeout(() => next(true), 900);
    else { S.playing = false; changed(); }
  }
  function fillTitle() {
    const c = S.queue[S.index]; if (!c || !player.getVideoData) return;
    const d = player.getVideoData();
    if (d && d.video_id === c.id && d.title && /^YouTube /.test(c.title)) {
      c.title = d.title; c.ch = d.author || c.ch; save(); renderNow();
      if (tab === 'queue') renderBody();
    }
  }
  function applyVolume() {
    if (!ready) return;
    player.setVolume(S.volume);
    S.muted ? player.mute() : player.unMute();
  }

  /* ---------- autoplay ถูกบล็อกตอนโหลดหน้าใหม่ → เล่นต่อเมื่อผู้ใช้แตะ/กดอะไรก็ได้ครั้งแรก ---------- */
  function gestureResume(e) {
    if (!ready || !S.playing || yielded) return;
    if (e.target.closest && e.target.closest('[data-act="play"]')) return;
    const st = player.getPlayerState();
    if (st !== 1 && st !== 3) player.playVideo(); else disarmGesture();
  }
  const armGesture = () => { document.addEventListener('pointerdown', gestureResume, true); document.addEventListener('keydown', gestureResume, true); };
  const disarmGesture = () => { document.removeEventListener('pointerdown', gestureResume, true); document.removeEventListener('keydown', gestureResume, true); };

  /* ---------- การควบคุมเพลง ---------- */
  function playIndex(i, start = 0) {
    if (i < 0 || i >= S.queue.length) return;
    yielded = false;
    S.index = i; S.time = start; S.savedAt = Date.now(); S.playing = true;
    claim(); changed();
    if (ready) { player.loadVideoById({ videoId: S.queue[i].id, startSeconds: start }); applyVolume(); }
    armGesture();
  }
  function toggle() {
    const cur = S.queue[S.index];
    if (!cur) { setPanel(true); setTab('search'); return; }
    if (!ready) return;
    if (yielded) { const t = startAt(); yielded = false; claim(); S.playing = true; player.loadVideoById({ videoId: cur.id, startSeconds: t }); return; }
    const st = player.getPlayerState();
    if (st === 1 || st === 3) player.pauseVideo();
    else { claim(); S.playing = true; player.playVideo(); }
  }
  function next(auto) {
    const n = S.queue.length; if (!n) return;
    let i;
    if (S.shuffle && n > 1) { do { i = Math.floor(Math.random() * n); } while (i === S.index); }
    else {
      i = S.index + 1;
      if (i >= n) {
        if (auto && S.repeat === 'off') { S.playing = false; S.time = 0; if (ready) { player.seekTo(0, true); player.pauseVideo(); } changed(); return; }
        i = 0;
      }
    }
    playIndex(i);
  }
  function prev() {
    if (ready && player.getCurrentTime() > 3) { player.seekTo(0, true); return; }
    const n = S.queue.length; if (!n) return;
    let i = S.index - 1;
    if (i < 0) i = S.repeat === 'all' ? n - 1 : 0;
    playIndex(i);
  }
  function onEnded() {
    if (S.repeat === 'one') { player.seekTo(0, true); player.playVideo(); return; }
    next(true);
  }
  function addTrack(t, play) {
    let i = S.queue.findIndex(x => x.id === t.id);
    if (i < 0) { S.queue.push({ id: t.id, title: t.title, ch: t.ch || '' }); i = S.queue.length - 1; }
    if (play) playIndex(i); else { changed(); toast('เพิ่มในคิวแล้ว'); }
  }
  function removeAt(i) {
    const wasCur = i === S.index;
    S.queue.splice(i, 1);
    if (i < S.index) S.index--;
    if (wasCur) {
      if (!S.queue.length) { S.index = -1; S.playing = false; if (ready) player.stopVideo(); }
      else {
        S.index = Math.min(i, S.queue.length - 1);
        if (S.playing) { playIndex(S.index); return; }
        if (ready) player.cueVideoById(S.queue[S.index].id);
      }
    }
    changed();
  }
  function loadList(name, i) {
    const L = S.playlists[name]; if (!L || !L.length) return;
    S.queue = L.map(t => ({ ...t }));
    playIndex(i);
  }

  /* ---------- ค้นหา / เพิ่มจากลิงก์ ---------- */
  const parseId = s => { if (!/youtu/i.test(s)) return null; const m = s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/); return m ? m[1] : null; };
  async function meta(id) {
    try {
      const res = await fetch('https://www.youtube.com/oembed?format=json&url=' + encodeURIComponent('https://www.youtube.com/watch?v=' + id));
      const j = await res.json();
      return { id, title: j.title, ch: j.author_name };
    } catch { return { id, title: 'YouTube ' + id, ch: '' }; }
  }
  async function doSearch() {
    const inp = r('body').querySelector('[data-r="q"]'); const q = (inp ? inp.value : lastQ).trim();
    lastQ = q; if (!q) return;
    const id = parseId(q);
    if (id) { toast('กำลังเพิ่มเพลง…'); addTrack(await meta(id), true); return; }
    const key = YT_API_KEY || S.apiKey;
    if (!key) { toast('ยังไม่มี API key — วางลิงก์ YouTube แทนได้'); return; }
    const box = r('body').querySelector('[data-r="results"]');
    if (box) box.innerHTML = '<div class="hlm-empty">กำลังค้นหา…</div>';
    try {
      const url = 'https://www.googleapis.com/youtube/v3/search?' + new URLSearchParams({ part: 'snippet', type: 'video', videoEmbeddable: 'true', maxResults: '15', q, key });
      const j = await (await fetch(url)).json();
      if (j.error) throw new Error(j.error.message);
      results = (j.items || []).map(it => ({ id: it.id.videoId, title: decode(it.snippet.title), ch: decode(it.snippet.channelTitle) }));
      renderResults(results.length ? '' : 'ไม่พบผลลัพธ์');
    } catch (err) { results = []; renderResults('ค้นหาไม่ได้: ' + err.message); }
  }

  /* ---------- render ---------- */
  const row = (t, main, btns, cls = '') =>
    `<div class="hlm-row ${cls}"><div class="hlm-rt" ${main}><img loading="lazy" alt="" src="https://i.ytimg.com/vi/${esc(t.id)}/default.jpg"><span><b>${esc(t.title)}</b><small>${esc(t.ch || '')}</small></span></div>${btns}</div>`;
  const btn = (act, attrs, label, title) => `<button data-act="${act}" ${attrs} title="${title}">${label}</button>`;

  function renderNow() {
    const c = S.queue[S.index];
    setText('title', c ? c.title : 'ยังไม่ได้เลือกเพลง');
    ra('ch').forEach(el => { el.textContent = c ? (c.ch || '') : (el.closest('.hlm-bar') ? 'แตะเพื่อเปิดเครื่องเล่น' : ''); });
    ra('playBtn').forEach(el => { el.textContent = S.playing ? '⏸' : '▶'; });
    r('shuffle').classList.toggle('on', S.shuffle); r('shuffle').classList.toggle('dim', !S.shuffle);
    const rp = r('repeat'); rp.textContent = S.repeat === 'one' ? '🔂' : '🔁';
    rp.classList.toggle('on', S.repeat !== 'off'); rp.classList.toggle('dim', S.repeat === 'off');
    r('mute').textContent = (S.muted || S.volume === 0) ? '🔇' : '🔊';
    r('vol').value = S.volume;
    r('panelBtn').textContent = panelOpen ? '▼' : '▲';
    if (c && c.id !== lastMetaId && 'mediaSession' in navigator && window.MediaMetadata) {
      lastMetaId = c.id;
      navigator.mediaSession.metadata = new MediaMetadata({ title: c.title, artist: c.ch || '', artwork: [{ src: `https://i.ytimg.com/vi/${c.id}/hqdefault.jpg`, sizes: '480x360', type: 'image/jpeg' }] });
    }
  }
  function renderResults(msg) {
    const box = r('body').querySelector('[data-r="results"]'); if (!box) return;
    if (msg) { box.innerHTML = `<div class="hlm-empty">${esc(msg)}</div>`; return; }
    box.innerHTML = results.map((t, i) => row(t, `data-act="res-play" data-i="${i}"`,
      btn('res-q', `data-i="${i}"`, '＋', 'เพิ่มในคิว') + btn('res-pl', `data-i="${i}"`, '☰', 'เพิ่มลงเพลย์ลิสต์'))).join('');
  }
  function renderSearch() {
    const noKey = !(YT_API_KEY || S.apiKey);
    r('body').innerHTML =
      `<div class="hlm-sr"><input data-r="q" placeholder="ค้นหาเพลง หรือวางลิงก์ YouTube" value="${esc(lastQ)}" autocomplete="off"><button data-act="search-go">ค้นหา</button></div>` +
      (noKey ? `<div class="hlm-note">ยังไม่ได้ตั้งค่า YouTube API key จึงค้นหาด้วยชื่อไม่ได้ (แต่วางลิงก์วิดีโอ YouTube เพื่อเพิ่มเพลงได้เลย)<div><input data-r="key" placeholder="วาง API key ที่นี่" autocomplete="off"><button data-act="key-save">บันทึก</button></div></div>` : '') +
      `<div data-r="results"></div>`;
    renderResults(results.length ? '' : (noKey ? '' : 'พิมพ์ชื่อเพลงแล้วกด Enter'));
  }
  function queueHTML() {
    if (!S.queue.length) return '<div class="hlm-empty">คิวว่างอยู่ — ค้นหาเพลงแล้วกด ＋ เพื่อเพิ่ม</div>';
    return '<div class="hlm-tools"><button data-act="q-save">💾 บันทึกเป็นเพลย์ลิสต์</button><button data-act="q-clear">ล้างคิว</button></div>' +
      S.queue.map((t, i) => row(t, `data-act="q-play" data-i="${i}"`,
        btn('q-pl', `data-i="${i}"`, '☰', 'เพิ่มลงเพลย์ลิสต์') + btn('q-rm', `data-i="${i}"`, '✕', 'เอาออก'), i === S.index ? 'cur' : '')).join('');
  }
  function listsHTML() {
    const names = Object.keys(S.playlists);
    let h = '<div class="hlm-sr"><input data-r="newName" placeholder="ชื่อเพลย์ลิสต์ใหม่" maxlength="40" autocomplete="off"><button data-act="pl-new">สร้าง</button></div>';
    if (!names.length) h += '<div class="hlm-empty">ยังไม่มีเพลย์ลิสต์ — สร้างแล้วกด ☰ ที่เพลงเพื่อเพิ่ม</div>';
    names.forEach(n => {
      const L = S.playlists[n], open = openList === n, a = `data-n="${esc(n)}"`;
      h += `<div class="hlm-pl"><div class="hlm-plh"><div class="hlm-rt" data-act="pl-open" ${a}><span><b>${open ? '▾' : '▸'} ${esc(n)}</b><small>${L.length} เพลง</small></span></div>` +
        btn('pl-play', a, '▶', 'เล่นทั้งหมด') + btn('pl-del', a, '🗑', 'ลบเพลย์ลิสต์') + '</div>';
      if (open) h += L.length ? L.map((t, i) => row(t, `data-act="pl-track" ${a} data-i="${i}"`, btn('pl-rm', `${a} data-i="${i}"`, '✕', 'เอาออก'))).join('') : '<div class="hlm-empty">ว่างเปล่า</div>';
      h += '</div>';
    });
    return h;
  }
  function renderBody() {
    root.querySelectorAll('[data-t]').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
    if (tab === 'search') return renderSearch();
    r('body').innerHTML = tab === 'queue' ? queueHTML() : listsHTML();
  }
  function renderMenu() {
    const host = r('menuHost');
    if (!menuTrack) { host.innerHTML = ''; return; }
    const names = Object.keys(S.playlists);
    host.innerHTML = `<div class="hlm-menu"><div class="mh"><span>เพิ่มลงเพลย์ลิสต์</span><button data-act="menu-x">✕</button></div>` +
      names.map(n => `<button data-act="menu-add" data-n="${esc(n)}">📁 ${esc(n)} <small>(${S.playlists[n].length})</small></button>`).join('') +
      `<div class="hlm-new"><input data-r="menuName" placeholder="สร้างเพลย์ลิสต์ใหม่" maxlength="40" autocomplete="off"><button data-act="menu-new">สร้าง+เพิ่ม</button></div></div>`;
  }
  function changed() { save(); renderNow(); if (tab !== 'search') renderBody(); }
  function setTab(t) { tab = t; renderBody(); }
  function setPanel(v) { panelOpen = v; r('panel').classList.toggle('open', v); renderNow(); if (v) renderBody(); }
  let toastT;
  function toast(msg) { const el = r('toast'); el.textContent = msg; el.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2200); }

  /* ---------- playlists ---------- */
  function createList(name) {
    name = (name || '').trim(); if (!name) return null;
    if (!S.playlists[name]) S.playlists[name] = [];
    return name;
  }
  function addToList(name, t) {
    const L = S.playlists[name]; if (!L) return;
    if (L.some(x => x.id === t.id)) { toast('มีเพลงนี้ในเพลย์ลิสต์แล้ว'); return; }
    L.push({ id: t.id, title: t.title, ch: t.ch || '' });
    toast(`เพิ่มใน "${name}" แล้ว`);
  }

  /* ---------- events ---------- */
  // ไม่ให้ปุ่มของเครื่องเล่นแย่งโฟกัสจากช่องพิมพ์ในเกม (เช่น Mode 3)
  root.addEventListener('mousedown', e => { if (e.target.closest('button,[data-act]') && !e.target.closest('input')) e.preventDefault(); });
  // ไม่ให้แป้นพิมพ์ในเครื่องเล่นไปชนกับ shortcut ของเว็บ (Space / Enter ฯลฯ)
  ['keydown', 'keyup', 'keypress'].forEach(t => root.addEventListener(t, e => e.stopPropagation()));

  root.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const d = e.target.dataset ? e.target.dataset.r : '';
    if (d === 'q') doSearch();
    else if (d === 'newName') root.querySelector('[data-act="pl-new"]').click();
    else if (d === 'menuName') root.querySelector('[data-act="menu-new"]').click();
    else if (d === 'key') root.querySelector('[data-act="key-save"]').click();
  });

  root.addEventListener('input', e => {
    const d = e.target.dataset.r;
    if (d === 'q') lastQ = e.target.value;
    else if (d === 'vol') { S.volume = +e.target.value; if (S.volume > 0) S.muted = false; applyVolume(); renderNow(); save(); }
    else if (d === 'seek') { dragging = true; const dur = ready ? player.getDuration() : 0; setText('cur', fmt(e.target.value / 1000 * dur)); }
  });
  root.addEventListener('change', e => {
    if (e.target.dataset.r === 'seek') {
      if (ready) { const t = e.target.value / 1000 * player.getDuration(); player.seekTo(t, true); S.time = t; S.savedAt = Date.now(); save(); }
      dragging = false;
    }
  });

  root.addEventListener('click', e => {
    const b = e.target.closest('[data-act]'); if (!b || !root.contains(b)) return;
    const a = b.dataset.act, i = +b.dataset.i, n = b.dataset.n;
    switch (a) {
      case 'panel': setPanel(!panelOpen); break;
      case 'play': toggle(); break;
      case 'prev': prev(); break;
      case 'next': next(false); break;
      case 'shuffle': S.shuffle = !S.shuffle; changed(); break;
      case 'repeat': S.repeat = { off: 'all', all: 'one', one: 'off' }[S.repeat]; changed(); toast({ off: 'ไม่เล่นซ้ำ', all: 'เล่นวนทั้งคิว', one: 'เล่นซ้ำเพลงนี้' }[S.repeat]); break;
      case 'mute': S.muted = !S.muted; applyVolume(); changed(); break;
      case 'tab': setTab(b.dataset.t); break;
      case 'search-go': doSearch(); break;
      case 'key-save': { const v = r('body').querySelector('[data-r="key"]').value.trim(); if (v) { S.apiKey = v; save(); renderSearch(); toast('บันทึก API key แล้ว'); } break; }
      case 'res-play': addTrack(results[i], true); break;
      case 'res-q': addTrack(results[i], false); break;
      case 'res-pl': menuTrack = results[i]; renderMenu(); break;
      case 'q-play': playIndex(i); break;
      case 'q-rm': removeAt(i); break;
      case 'q-pl': menuTrack = S.queue[i]; renderMenu(); break;
      case 'q-clear': S.queue = []; S.index = -1; S.playing = false; if (ready) player.stopVideo(); changed(); break;
      case 'q-save': { const nm = createList(prompt('ตั้งชื่อเพลย์ลิสต์')); if (nm) { S.playlists[nm] = S.queue.map(t => ({ ...t })); changed(); toast('บันทึกแล้ว'); } break; }
      case 'pl-new': { const inp = r('body').querySelector('[data-r="newName"]'); const nm = createList(inp.value); if (nm) { openList = nm; changed(); } break; }
      case 'pl-open': openList = openList === n ? null : n; renderBody(); break;
      case 'pl-play': loadList(n, 0); break;
      case 'pl-del': if (confirm(`ลบเพลย์ลิสต์ "${n}" ?`)) { delete S.playlists[n]; if (openList === n) openList = null; changed(); } break;
      case 'pl-track': loadList(n, i); break;
      case 'pl-rm': S.playlists[n].splice(i, 1); changed(); break;
      case 'menu-x': menuTrack = null; renderMenu(); break;
      case 'menu-add': addToList(n, menuTrack); menuTrack = null; renderMenu(); changed(); break;
      case 'menu-new': { const nm = createList(r('menuHost').querySelector('[data-r="menuName"]').value); if (nm) { addToList(nm, menuTrack); menuTrack = null; renderMenu(); changed(); } break; }
    }
  });

  /* ---------- ข้ามหน้า / หลายแท็บ ---------- */
  function snapshot() {
    if (!ready || yielded) return;
    try {
      const st = player.getPlayerState();
      S.playing = (st === 1 || st === 3);
      S.time = player.getCurrentTime() || S.time; S.savedAt = Date.now();
    } catch { }
  }
  window.addEventListener('pagehide', () => { snapshot(); unloading = true; save(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { snapshot(); save(); } });

  window.addEventListener('storage', e => {
    if (e.key === LS_OWNER && e.newValue !== TAB && ready && player.getPlayerState() === 1) {
      yielded = true; player.pauseVideo(); S.playing = false; renderNow();   // แท็บอื่นเริ่มเล่น → หยุดแท็บนี้
    }
    if (e.key === LS_KEY && yielded && e.newValue) {
      try { Object.assign(S, JSON.parse(e.newValue)); S.playing = false; renderNow(); if (tab !== 'search') renderBody(); } catch { }
    }
  });

  setInterval(() => {
    if (!ready) return;
    let st; try { st = player.getPlayerState(); } catch { return; }
    const d = player.getDuration() || 0, t = player.getCurrentTime() || 0;
    if (!dragging) { r('seek').value = d ? t / d * 1000 : 0; setText('cur', fmt(t)); }
    setText('dur', fmt(d));
    r('prog').style.width = (d ? t / d * 100 : 0) + '%';
    if (st === 1 && !yielded && ++tickN % 4 === 0) { S.time = t; S.savedAt = Date.now(); save(); }
  }, 250);

  /* ---------- เริ่มทำงาน ---------- */
  function mount() {
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    document.body.appendChild(root);
    document.body.classList.add('hlm-on');
    if ('mediaSession' in navigator) {
      const h = (n, f) => { try { navigator.mediaSession.setActionHandler(n, f); } catch { } };
      h('play', toggle); h('pause', toggle); h('previoustrack', prev); h('nexttrack', () => next(false));
    }
    renderNow(); renderBody();
    loadYT();
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
