// openamber-display-card: the OpenAmber Waveshare display in Home Assistant.
// Status: discovery works; the display pages are being ported (see README, Roadmap).
import { ENTITIES } from './entities.js';
import { discover } from './discovery.js';

const VERSION = '0.3.0';

class OpenAmberDisplayCard extends HTMLElement {
  setConfig(config) { this.config = config || {}; }
  set hass(hass) {
    this._hass = hass;
    if (!this._started) { this._started = true; this.init(); }
  }
  async init() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = '<ha-card style="padding:16px">OpenAmber: entiteiten zoeken…</ha-card>';
    this.found = await discover(this._hass, this.config.device_id);
    const n = Object.keys(this.found.entities).length, total = Object.keys(ENTITIES).length;
    this.shadowRoot.innerHTML = `<ha-card header="OpenAmber Display" style="padding:0 16px 16px">
      <div>${n} van ${total} OpenAmber-entiteiten gevonden${this.found.device ? '' : ' (geen OpenAmber-apparaat gevonden)'}.</div></ha-card>`;
  }
  getCardSize() { return 6; }
  static getStubConfig() { return {}; }
}
customElements.define('openamber-display-card', OpenAmberDisplayCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: 'openamber-display-card', name: 'OpenAmber Display', description: 'Het OpenAmber Waveshare-display in Home Assistant' });
console.info(`%c OPENAMBER-DISPLAY-CARD %c ${VERSION} `, 'color:#fff;background:#15457A', 'color:#15457A;background:#F5F8FC');
