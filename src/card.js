// custom:openamber-display-card — the whole OpenAmber display (all pages) in one card,
// for use inside any dashboard. Navigation between the pages stays inside the card.
import { buildDashboard } from './strategy.js';

const VERSION = '0.4.2';

// button-card templates live in the dashboard config, which a card in someone else's dashboard
// does not have: merge the template into every page instead.
const inline = (card, templates) => {
  const t = templates[card.template];
  if (!t) return card;
  const { template, ...rest } = card;
  return {
    ...t, ...rest,
    variables: { ...(t.variables || {}), ...(rest.variables || {}) },
    custom_fields: { ...(t.custom_fields || {}), ...(rest.custom_fields || {}) },
    styles: { ...(t.styles || {}), ...(rest.styles || {}) },
  };
};

class OpenAmberDisplayCard extends HTMLElement {
  setConfig(config) {
    this.config = { page: 'home', ...(config || {}) };
    this.pages = null;
  }
  set hass(hass) {
    this._hass = hass;
    if (this.current) this.current.hass = hass;
    if (!this._building) { this._building = true; this.build(); }
  }
  async build() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = '<style>:host{display:block}#v{width:100%}</style><div id="v"></div>';
      this.addEventListener('oa-nav', (e) => { e.stopPropagation(); this.show(String(e.detail).split('/').filter(Boolean).pop()); });
    }
    const box = this.shadowRoot.getElementById('v');
    if (!customElements.get('button-card')) {
      box.innerHTML = '<ha-card style="padding:16px">OpenAmber Display: please install <b>button-card</b> (HACS / Marketplace) and reload.</ha-card>';
      this._building = false; return;
    }
    const dash = await buildDashboard(this.config, this._hass, 'card');
    const templates = dash.button_card_templates || {};
    this.pages = {};
    for (const v of dash.views) if (v.cards && v.cards[0]) this.pages[v.path] = inline(v.cards[0], templates);
    this.helpers = await window.loadCardHelpers();
    this.cache = {};
    this.show(this.pages[this.config.page] ? this.config.page : 'home');
  }
  show(path) {
    if (!this.pages || !this.pages[path]) return;
    let el = this.cache[path];
    if (!el) {
      el = this.cache[path] = this.helpers.createCardElement(this.pages[path]);
      el.addEventListener('ll-rebuild', () => { delete this.cache[path]; this.show(path); });
    }
    el.hass = this._hass;
    const box = this.shadowRoot.getElementById('v');
    box.replaceChildren(el);
    this.current = el;
  }
  getCardSize() { return 10; }
  getGridOptions() { return { columns: 'full', rows: 'auto' }; }
  static getStubConfig() { return { page: 'home' }; }
}
if (!customElements.get('openamber-display-card')) customElements.define('openamber-display-card', OpenAmberDisplayCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'openamber-display-card', name: 'OpenAmber Display', description: 'The OpenAmber Waveshare display (all pages) in one card' });
console.info(`%c OPENAMBER-DISPLAY-CARD %c ${VERSION} `, 'color:#fff;background:#15457A', 'color:#15457A;background:#F5F8FC');
