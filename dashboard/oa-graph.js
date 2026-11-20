// OpenAmber display: Grafiek page as a custom element (<oa-graph>), drawn like the Waveshare display.
(() => {
if (customElements.get('oa-graph')) return;
const E = {
  tc: 'sensor.openamber_cv_aanvoertemperatuur_tc', sp: 'sensor.openamber_huidig_setpoint',
  tuo: 'sensor.openamber_cv_aanvoertemperatuur_tuo', tui: 'sensor.openamber_cv_retourtemperatuur_tui',
  hz: 'sensor.openamber_compressor_frequentie', hc: 'sensor.openamber_control_loop_state_heat_cool',
  dhw: 'sensor.openamber_control_loop_state_dhw',
};
const CL = 'climate.openamber_amber_thermostat';
const D = { hStart: 'number.openamber_compressor_start_delta', hStop: 'number.openamber_compressor_stop_delta', cStart: 'number.zentrale_openamber_compressor_start_delta_koelen', cStop: 'number.openamber_compressor_stop_delta_koelen' };
const PW = 708, PH = 274, PX = 252, PY = 16, LANE_Y = 288, LANE_H = 64, LANE_MAX = 70, CAP = 24 * 60;
const COL = { 1: '#2E8B57', 2: '#E09F1F', 3: '#B5306A', 4: '#2B8AD9' };
const state = (dhw, hc) => (dhw || '').startsWith('Compressor') ? 3 : hc === 'Defrosting' ? 4 : (hc === 'Compressor softstart' || hc === 'Wait compressor running') ? 2 : hc === 'Compressor running' ? 1 : 0;
const NS = 'http://www.w3.org/2000/svg';
const GDE = { 'Tc nu': 'Tc jetzt', 'Staat stil': 'Stillstand', 'Koelen': 'Kühlen', 'Verwarmen': 'Heizen', 'Softstart': 'Sanftanlauf', 'Tapwater': 'Warmwasser', 'Ontdooien': 'Abtauen', 'Tuo en Tui': 'Tuo und Tui', 'Compressor': 'Kompressor', 'De eerste meting verschijnt binnen een minuut': 'Der erste Messwert erscheint innerhalb einer Minute' };
const GDRX = [[/^Tc om (.+)$/, 'Tc um $1'], [/^(\d+) u$/, '$1 h']];
const GEN = { 'Tc nu': 'Tc now', 'Staat stil': 'Idle', 'Koelen': 'Cooling', 'Verwarmen': 'Heating', 'Softstart': 'Soft start', 'Tapwater': 'Hot water', 'Ontdooien': 'Defrost', 'Tuo en Tui': 'Tuo and Tui', 'De eerste meting verschijnt binnen een minuut': 'The first reading appears within a minute' };
const GRX = [[/^Tc om (.+)$/, 'Tc at $1'], [/^(\d+) u$/, '$1 h']];
const LANG = 'input_select.openamber_display_taal';
class OaGraph extends HTMLElement {
  constructor() { super(); this.hours = 1; this.pipes = false; this.cursor = -1; this.samples = []; this.root = this.attachShadow({ mode: 'open' }); }
  get hass() { const h = document.querySelector('home-assistant'); return h && h.hass; }
  connectedCallback() {
    this.root.innerHTML = '<style>:host{display:block}svg{width:100%;height:100%;display:block;font-family:inherit;user-select:none}.b{cursor:pointer}</style><svg viewBox="0 0 976 436"></svg>';
    this.svg = this.root.querySelector('svg');
    this.load(); this.timer = setInterval(() => this.load(), 60000); this.lt = setInterval(() => { const e = this.en; if (e !== this.lastEn) { this.lastEn = e; if (this.samples) this.draw(); } }, 1000);
  }
  disconnectedCallback() { clearInterval(this.timer); clearInterval(this.lt); }
  async load() {
    const hass = this.hass; if (!hass) { setTimeout(() => this.load(), 1000); return; }
    const end = new Date(), start = new Date(end.getTime() - CAP * 60000);
    let hist = {};
    try {
      hist = await hass.callWS({ type: 'history/history_during_period', start_time: start.toISOString(), end_time: end.toISOString(), entity_ids: Object.values(E), minimal_response: true, no_attributes: true, significant_changes_only: false });
    } catch (e) { hist = {}; }
    const series = {};
    for (const [k, id] of Object.entries(E)) {
      const arr = (hist[id] || []).map((p) => [((p.lu !== undefined ? p.lu : Date.parse(p.last_updated || p.last_changed) / 1000)) * 1000, p.s !== undefined ? p.s : p.state]);
      const cur = hass.states[id]; if (cur) arr.push([end.getTime(), cur.state]);
      series[k] = arr;
    }
    const now = Math.floor(end.getTime() / 60000) * 60000;
    const idx = {}; for (const k in series) idx[k] = 0;
    const out = [];
    for (let m = CAP; m >= 0; m--) {
      const t = now - m * 60000; const v = {};
      for (const k in series) { const a = series[k]; while (idx[k] + 1 < a.length && a[idx[k] + 1][0] <= t) idx[k]++; v[k] = a.length && a[idx[k]][0] <= t ? a[idx[k]][1] : undefined; }
      const num = (x) => { const f = parseFloat(x); return isNaN(f) ? null : f; };
      out.push({ t, tc: num(v.tc), sp: num(v.sp), tuo: num(v.tuo), tui: num(v.tui), hz: Math.max(0, Math.round(num(v.hz) || 0)), st: state(v.dhw, v.hc), any: v.tc !== undefined });
    }
    const first = out.findIndex((s) => s.any);
    this.samples = first < 0 ? [] : out.slice(first).reverse(); // index = age, 0 newest
    this.draw();
  }
  el(tag, attrs, parent, text) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text !== undefined) e.textContent = this.tr(String(text)); (parent || this.svg).appendChild(e); return e; }
  get lang() { const h = this.hass; return (h && h.states[LANG] && h.states[LANG].state) || 'Nederlands'; }
  get en() { return this.lang; }
  tr(t) { const l = this.lang; const D = l === 'Deutsch' ? GDE : l === 'English' ? GEN : null; if (!D) return t; const R = l === 'Deutsch' ? GDRX : GRX; if (D[t] !== undefined) return D[t]; for (const [r, x] of R) if (r.test(t)) return t.replace(r, x); return t; }
  txt(x, y, s, size, color, extra = {}) { return this.el('text', Object.assign({ x, y, 'font-size': size, fill: color, 'dominant-baseline': 'hanging' }, extra), null, s); }
  btn(x, y, w, h, label, active, fn) {
    const g = this.el('g', { class: 'b' });
    this.el('rect', { x, y, width: w, height: h, rx: 10, fill: active ? '#1F3B68' : '#E5E7EB' }, g);
    this.el('text', { x: x + w / 2, y: y + h / 2, 'font-size': 20, fill: active ? '#fff' : '#1F2933', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g, label);
    g.addEventListener('click', (ev) => { ev.stopPropagation(); fn(); });
  }
  draw() {
    const svg = this.svg; svg.innerHTML = '';
    const hass = this.hass; const S = this.samples; const span = this.hours * 60; const vis = Math.min(S.length, span + 1);
    const cooling = hass && hass.states[CL] && hass.states[CL].state === 'cool';
    const nv = (id) => { const s = hass && hass.states[id]; const v = s ? parseFloat(s.state) : NaN; return isNaN(v) ? 0 : v; };
    const above = cooling ? nv(D.cStart) : nv(D.hStop), below = cooling ? nv(D.cStop) : nv(D.hStart);
    this.el('rect', { x: 0, y: 0, width: 976, height: 436, rx: 18, fill: '#F5F8FC' });
    // left column
    const hasCur = this.cursor >= 0 && this.cursor < S.length;
    const s = S.length ? S[hasCur ? this.cursor : 0] : null;
    const hm = (t) => { const d = new Date(t); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
    const f1 = (v) => v === null || v === undefined ? '-' : v.toFixed(1);
    this.txt(20, 18, hasCur && s ? 'Tc om ' + hm(s.t) : 'Tc nu', 20, '#5B6878');
    this.txt(20, 42, s ? (s.tc === null ? '-' : f1(s.tc) + ' °C') : '-', 32, '#1F2933');
    this.txt(20, 84, s ? 'Setpoint ' + f1(s.sp) : '', 20, '#5B6878');
    this.txt(20, 126, 'Compressor', 20, '#5B6878');
    this.txt(20, 150, s ? s.hz + ' Hz' : '-', 32, '#1F2933');
    if (s) {
      const names = { 0: 'Staat stil', 1: cooling ? 'Koelen' : 'Verwarmen', 2: 'Softstart', 3: 'Tapwater', 4: 'Ontdooien' };
      if (s.st) this.el('rect', { x: 20, y: 196, width: 14, height: 14, rx: 3, fill: COL[s.st] });
      this.txt(s.st ? 40 : 20, 192, names[s.st], 20, '#5B6878');
    }
    this.btn(20, 248, 186, 48, 'Tuo en Tui', this.pipes, () => { this.pipes = !this.pipes; this.draw(); });
    [[1, 20], [6, 84], [24, 148]].forEach(([h, x]) => this.btn(x, 308, 58, 48, h + ' u', this.hours === h, () => { this.hours = h; this.cursor = -1; this.draw(); }));
    if (s && this.pipes) { this.txt(20, 368, 'Tuo ' + f1(s.tuo), 20, '#C8480C'); this.txt(112, 368, 'Tui ' + f1(s.tui), 20, '#0A8176'); }
    this.txt(214, 332, 'Hz', 20, '#5B6878');
    // legend
    [['#2E8B57', 'Verwarmen', 252], ['#E09F1F', 'Softstart', 426], ['#B5306A', 'Tapwater', 586], ['#2B8AD9', 'Ontdooien', 744]].forEach(([c, l, x]) => { this.el('rect', { x, y: 411, width: 14, height: 14, rx: 3, fill: c }); this.txt(x + 20, 406, l, 20, '#5B6878'); });
    const plot = this.el('g', { transform: `translate(${PX},${PY})` });
    const ax = (age) => PW - 1 - (age * (PW - 1)) / span;
    if (!vis) { this.el('text', { x: PW / 2, y: 120, 'font-size': 24, fill: '#5B6878', 'text-anchor': 'middle' }, plot, 'De eerste meting verschijnt binnen een minuut'); }
    // scale
    let lo = 1000, hi = -1000;
    for (let a = 0; a < vis; a++) { const x = S[a]; if (x.tc !== null) { lo = Math.min(lo, x.tc); hi = Math.max(hi, x.tc); } if (x.sp !== null) { lo = Math.min(lo, x.sp - below); hi = Math.max(hi, x.sp + above); } }
    if (lo > hi) { lo = 20; hi = 40; }
    const step = hi - lo > 30 ? 10 : 5; const sl = Math.floor(lo / step) * step; let sh = Math.ceil(hi / step) * step; if (sh <= sl) sh = sl + step;
    const px = PH / (sh - sl); const Y = (v) => PH - (v - sl) * px;
    // band (60 columns, averaged setpoint)
    const bh = (above + below) * px;
    for (let i = 0; i < 60 && vis; i++) {
      const x0 = i * PW / 60, x1 = (i + 1) * PW / 60;
      const newest = Math.max(0, Math.floor((PW - x1) * span / PW)), oldest = Math.min(Math.floor((PW - x0) * span / PW), vis - 1);
      let sum = 0, n = 0; for (let a = newest; a <= oldest; a++) if (S[a].sp !== null) { sum += S[a].sp; n++; }
      if (n) this.el('rect', { x: x0, y: PH - (sum / n + above - sl) * px, width: x1 - x0 + 0.5, height: bh, fill: '#CBDDF1' }, plot);
    }
    for (let v = sl; v <= sh; v += step) { const y = Y(v); this.el('line', { x1: 0, y1: y, x2: PW, y2: y, stroke: '#DDE3EA', 'stroke-width': 1 }, plot); this.el('text', { x: 242, y: PY + y, 'font-size': 20, fill: '#5B6878', 'text-anchor': 'end', 'dominant-baseline': 'central' }, null, String(v)); }
    const every = this.hours === 1 ? 15 : this.hours === 6 ? 60 : 240; const nowd = new Date(); const nowMin = nowd.getHours() * 60 + nowd.getMinutes();
    for (let a = 0; a <= span; a++) {
      if (((nowMin - a) % every + every) % every) continue;
      const x = ax(a); this.el('line', { x1: x, y1: 0, x2: x, y2: 352, stroke: '#E7ECF2', 'stroke-width': 1 }, plot);
      if (x > 28 && x < PW - 28) { const m = ((nowMin - a) % 1440 + 1440) % 1440; this.el('text', { x, y: 358, 'font-size': 20, fill: '#5B6878', 'text-anchor': 'middle', 'dominant-baseline': 'hanging' }, plot, String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0')); }
    }
    const clip = this.el('clipPath', { id: 'c' }, this.el('defs', {}, plot)); this.el('rect', { x: 0, y: 0, width: PW, height: PH }, clip);
    const lines = this.el('g', { 'clip-path': 'url(#c)' }, plot);
    const L = (key, color, width) => { const bucket = Math.max(1, Math.ceil(span / 240)); const pts = []; for (let a = vis - 1; a >= 0; a -= bucket) { let sum = 0, n = 0; for (let b = a; b > a - bucket && b >= 0; b--) if (S[b][key] !== null) { sum += S[b][key]; n++; } if (n) pts.push(ax(a).toFixed(1) + ',' + Y(sum / n).toFixed(1)); } if (pts.length >= 2) this.el('polyline', { points: pts.join(' '), fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, lines); };
    L('sp', '#3F76B3', 2); if (this.pipes) { L('tui', '#0A8176', 2); L('tuo', '#C8480C', 2); } L('tc', '#0F3564', 4);
    // compressor lane
    this.el('rect', { x: 0, y: LANE_Y, width: PW, height: LANE_H, fill: '#E5E7EB' }, plot);
    for (let x = 0; x < PW; x += 2) {
      const a = Math.round((PW - 1 - x) / (PW - 1) * span); if (a >= vis) continue;
      const smp = S[a]; if (!smp.hz) continue;
      const h = Math.min(smp.hz, LANE_MAX) * LANE_H / LANE_MAX;
      this.el('rect', { x, y: LANE_Y + LANE_H - h, width: 2, height: h, fill: COL[smp.st || 1] }, plot);
    }
    if (hasCur) { const x = ax(this.cursor); this.el('line', { x1: x, y1: 0, x2: x, y2: 352, stroke: '#1F2933', 'stroke-width': 2 }, plot); }
    const hit = this.el('rect', { x: 0, y: 0, width: PW, height: 386, fill: 'transparent', class: 'b' }, plot);
    hit.addEventListener('click', (ev) => {
      ev.stopPropagation(); if (!S.length) return;
      const r = hit.getBoundingClientRect(); const x = (ev.clientX - r.left) / r.width * PW;
      const age = Math.round((PW - 1 - x) / (PW - 1) * span);
      this.cursor = (hasCur && Math.abs(age - this.cursor) <= span / 100) ? -1 : Math.max(0, Math.min(age, S.length - 1)); this.draw();
    });
  }
}
customElements.define('oa-graph', OaGraph);
})();
