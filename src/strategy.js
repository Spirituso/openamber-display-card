// Dashboard strategy "custom:openamber-display": builds the complete OpenAmber display dashboard
// (all pages of the Waveshare display) and fills in the entity ids of the user's own OpenAmber.
import { SLOTS, DASHBOARD } from './dashboard.js';

const LANGUAGES = ['Nederlands', 'English', 'Deutsch'];

// Finds the entity id for every slot. ESPHome unique ids end in "/<domain>/<name in the firmware>",
// which does not change when the user renames the device or its entities.
export async function resolveEntities(hass, deviceId) {
  let registry = [];
  try { registry = await hass.callWS({ type: 'config/entity_registry/list' }); } catch (e) { registry = []; }
  const esphome = registry.filter((r) => r.platform === 'esphome' && r.unique_id);
  const hit = (r, dom, name) => r.entity_id.startsWith(dom + '.') && r.unique_id.endsWith('/' + name);
  let device = deviceId;
  if (!device) {
    const score = {};
    for (const r of esphome) if (SLOTS.some(([dom, name]) => hit(r, dom, name))) score[r.device_id] = (score[r.device_id] || 0) + 1;
    device = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
  }
  const ids = SLOTS.map(([dom, name]) => {
    const r = esphome.find((x) => x.device_id === device && hit(x, dom, name));
    if (r) return r.entity_id;
    // Without access to the registry (non-admin user): match "<device name> <entity name>".
    return Object.keys(hass.states).find((e) => e.startsWith(dom + '.') &&
      String(hass.states[e].attributes.friendly_name || '').endsWith(' ' + name)) || null;
  });
  return { device, ids };
}

const NAV_PAGE = "history.pushState(null,'','${p}');window.dispatchEvent(new CustomEvent('location-changed',{detail:{replace:false}}))";
const NAV_CARD = "this.dispatchEvent(new CustomEvent('oa-nav',{bubbles:true,composed:true,detail:'${p}'}))";

// mode 'dashboard': views navigate with the browser URL; mode 'card': views send an oa-nav event
// that the single card catches, so it works inside any dashboard.
export async function buildDashboard(config, hass, mode = 'dashboard') {
  const { ids } = await resolveEntities(hass, config.device_id);
  const found = ids.filter(Boolean).length;
  const map = {};
  SLOTS.forEach(([dom, , orig], i) => { map[orig] = ids[i] || `${dom}.openamber_not_found_${i}`; });
  window.__oaMap = map; // used by the Grafiek element
  if (!found) {
    return { views: [{ title: 'OpenAmber', cards: [{ type: 'markdown', content:
      '## OpenAmber Display\nGeen OpenAmber-apparaat gevonden. Is de ESPHome-integratie ingesteld en ben je ingelogd als beheerder?' }] }] };
  }
  const base = mode === 'card' ? 'oa' : (config.url_path || location.pathname.split('/')[1] || 'openamber-display').replace(/[^a-zA-Z0-9_-]/g, '');
  const lang = LANGUAGES.includes(config.language) ? config.language : 'Nederlands';
  let text = JSON.stringify(DASHBOARD)
    .replace(/@@(\d+)@@/g, (m, i) => map[SLOTS[+i][2]])
    .split('/openamber-display/').join('/' + base + '/')
    .split("{}).state || 'Nederlands'").join(`{}).state || '${lang}'`);
  if (mode === 'card') text = text.split(NAV_PAGE).join(NAV_CARD);
  const dash = JSON.parse(text);
  if (mode === 'dashboard' && !customElements.get('button-card')) {
    dash.views.unshift({ title: 'Setup', path: 'setup', cards: [{ type: 'markdown', content:
      '## OpenAmber Display\nThis dashboard needs **button-card** (HACS / Marketplace). Install it and reload the page.' }] });
  }
  return dash;
}

class OpenAmberDisplayStrategy extends HTMLElement {
  static async generate(config, hass) { return buildDashboard(config || {}, hass); }
}
if (!customElements.get('ll-strategy-dashboard-openamber-display')) {
  customElements.define('ll-strategy-dashboard-openamber-display', OpenAmberDisplayStrategy);
}
