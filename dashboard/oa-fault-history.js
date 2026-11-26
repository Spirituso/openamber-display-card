// OpenAmber display: error history (<oa-fault-history>) for the Foutmeldingen page.
(() => {
if (customElements.get('oa-fault-history')) return;
const R = [["binary_sensor.openamber_storing_compressorstart_p03","F","P03 - Storing compressorstart","P03 - Störung Kompressorstart","P03 - Compressor start fault"],["binary_sensor.openamber_hogedrukbeveiliging_p05","F","P05 - Storing compressor - hogedrukbeveiliging","P05 - Störung Kompressor - Hochdruckschutz","P05 - Compressor fault - high pressure protection"],["binary_sensor.openamber_storing_sensor_persgasdruk_p08","F","P08 - Storing sensor persgasdruk","P08 - Störung Hochdrucksensor","P08 - Discharge pressure sensor fault"],["binary_sensor.openamber_storing_sensor_verdamper_condensor_p09","F","P09 - Storing sensor verdamper/condensor buitendeel","P09 - Störung Fühler Verdampfer/Verflüssiger Außenteil","P09 - Outdoor evaporator/condenser sensor fault"],["binary_sensor.openamber_voedingsspanning_p10","F","P10 - Voedingsspanning te hoog of te laag","P10 - Versorgungsspannung zu hoch oder zu niedrig","P10 - Supply voltage too high or too low"],["binary_sensor.openamber_storing_buitentemperatuursensor_f01","F","F01 - Storing buitentemperatuursensor","F01 - Störung Außentemperaturfühler","F01 - Outside temperature sensor fault"],["binary_sensor.openamber_storing_sensor_verdamper_condensor_f02","F","F02 - Storing sensor verdamper/condensor buitendeel","F02 - Störung Fühler Verdampfer/Verflüssiger Außenteil","F02 - Outdoor evaporator/condenser sensor fault"],["binary_sensor.openamber_storing_persgas_temperatuursensor_f03","F","F03 - Storing persgas temp sensor","F03 - Störung Heißgas-Temperaturfühler","F03 - Discharge gas temperature sensor fault"],["binary_sensor.openamber_storing_zuigas_temperatuursensor_f04","F","F04 - Storing zuiggas temp sensor","F04 - Störung Sauggas-Temperaturfühler","F04 - Suction gas temperature sensor fault"],["binary_sensor.openamber_storing_zuiggas_druk_sensor_f05","F","F05 - Storing zuiggas druk sensor","F05 - Störung Saugdrucksensor","F05 - Suction gas pressure sensor fault"],["binary_sensor.openamber_storing_persgas_druk_sensor_f06","F","F06 - Storing sensor persgasdruk","F06 - Störung Hochdrucksensor","F06 - Discharge pressure sensor fault"],["binary_sensor.openamber_storing_hogedrukbeveiliging_f07","F","F07 - Storing hogedrukbeveiliging","F07 - Störung Hochdruckschutz","F07 - High pressure protection fault"],["binary_sensor.openamber_storing_ventilatormotor_dc_f09","F","F09 - Storing ventilatormotor DC","F09 - Störung DC-Lüftermotor","F09 - DC fan motor fault"],["binary_sensor.openamber_communicatiefout_pcb_e01","F","E01 - Communicatiestoring","E01 - Kommunikationsstörung","E01 - Communication fault"],["binary_sensor.openamber_storing_inverter_communicatie_e02","F","E02 - Communicatiestoring","E02 - Kommunikationsstörung","E02 - Communication fault"],["binary_sensor.openamber_bedrijfsstroom_warmtepomp_e03","F","E03 - Voedingsspanning","E03 - Versorgungsspannung","E03 - Supply voltage"],["binary_sensor.openamber_bedrijfsstroom_warmtepomp_e04","F","E04 - Overbelasting voedingsspanning","E04 - Überlastung Versorgungsspannung","E04 - Supply voltage overload"],["binary_sensor.openamber_storing_inverter_e05","F","E05 - Probleem inverter PCB","E05 - Problem Inverterplatine","E05 - Inverter PCB problem"],["binary_sensor.openamber_storing_vcd_module_e06","F","E06 - VDC-module voedingsspanning","E06 - Versorgungsspannung VDC-Modul","E06 - VDC module supply voltage"],["binary_sensor.openamber_storing_voedingsspanning_e07","F","E07 - Voedingsspanning te hoog of te laag","E07 - Versorgungsspannung zu hoch oder zu niedrig","E07 - Supply voltage too high or too low"],["binary_sensor.openamber_storing_eeprom_warmtepomp_e08","F","E08 - Storing EEPROM warmtepomp","E08 - EEPROM-Störung Wärmepumpe","E08 - Heat pump EEPROM fault"],["binary_sensor.openamber_storing_ventilatormotor_dc_f10","F","F10 - Storing ventilatormotor DC","F10 - Störung DC-Lüftermotor","F10 - DC fan motor fault"],["binary_sensor.zentrale_openamber_pomp_start_timeout","T","TO01 - Pomp start timeout","TO01 - Zeitüberschreitung Pumpenstart","TO01 - Pump start timeout"],["binary_sensor.zentrale_openamber_compressor_start_timeout","T","TO02 - Compressor start timeout","TO02 - Zeitüberschreitung Kompressorstart","TO02 - Compressor start timeout"],["binary_sensor.zentrale_openamber_pomp_stop_timeout","T","TO03 - Pomp stop timeout","TO03 - Zeitüberschreitung Pumpenstopp","TO03 - Pump stop timeout"],["binary_sensor.zentrale_openamber_3_weg_klep_status_fout","T","TO04 - 3-weg klep status fout","TO04 - Statusfehler 3-Wege-Ventil","TO04 - 3-way valve state error"],["binary_sensor.zentrale_openamber_modbus_verbinding_timeout","T","TO05 - Modbus verbinding timeout","TO05 - Zeitüberschreitung Modbus-Verbindung","TO05 - Modbus connection timeout"],["binary_sensor.zentrale_openamber_binnenunit_failsafe_herstart_fout","T","TO06 - Binnenunit failsafe / herstart","TO06 - Inneneinheit Failsafe / Neustart","TO06 - Indoor unit failsafe / restart"],["binary_sensor.zentrale_openamber_compressor_onverwacht_gestopt","T","TO07 - Compressor onverwacht gestopt","TO07 - Kompressor unerwartet gestoppt","TO07 - Compressor stopped unexpectedly"],["binary_sensor.zentrale_openamber_temperatuurverschil_tuo_tui_te_groot","T","TO08 - Temperatuurverschil Tuo-Tui te groot","TO08 - Temperaturdifferenz Tuo-Tui zu groß","TO08 - Tuo-Tui temperature difference too high"],["binary_sensor.zentrale_openamber_geen_flow_bij_draaiende_compressor","T","TO09 - Geen flow bij draaiende compressor","TO09 - Kein Durchfluss bei laufendem Kompressor","TO09 - No flow while the compressor runs"],["binary_sensor.zentrale_openamber_storing_sensor_ruimtetemperatuur_f13","F","F13 - Storing sensor ruimtetemperatuur","F13 - Störung Raumtemperaturfühler","F13 - Room temperature sensor fault"],["binary_sensor.zentrale_openamber_geen_meting_ble_ruimtesensor_b01","F","B01 - Geen meting BLE-ruimtesensor","B01 - Kein Messwert vom BLE-Raumfühler","B01 - No reading from BLE room sensor"],["binary_sensor.zentrale_openamber_storing_sensor_tapwatertemperatuur_f14","F","F14 - Storing sensor tapwatertemperatuur","F14 - Störung Warmwasserfühler","F14 - Hot water temperature sensor fault"],["binary_sensor.zentrale_openamber_storing_sensor_cv_aanvoertemperatuur_f15","F","F15 - Storing sensor cv-aanvoertemperatuur","F15 - Störung Vorlauffühler","F15 - Supply temperature sensor fault"],["binary_sensor.openamber_storing_sensor_aanvoertemperatuur_tuo_f16","F","F16 - Storing sensor aanvoertemperatuur Tuo","F16 - Störung Vorlauffühler Tuo","F16 - Supply temperature sensor Tuo fault"],["binary_sensor.openamber_storing_sensor_retourtemperatuur_tui_f17","F","F17 - Storing sensor retourtemperatuur Tui","F17 - Störung Rücklauffühler Tui","F17 - Return temperature sensor Tui fault"],["binary_sensor.openamber_storing_sensor_condensortemperatuur_tup_f18","F","F18 - Storing sensor condensortemperatuur Tup","F18 - Störung Verflüssigerfühler Tup","F18 - Condenser temperature sensor Tup fault"],["binary_sensor.zentrale_openamber_storing_sensor_cv_aanvoertemperatuur_zone_1_f21","F","F21 - Storing sensor cv-aanvoertemperatuur zone 1","F21 - Störung Vorlauffühler Zone 1","F21 - Supply temperature sensor zone 1 fault"],["binary_sensor.zentrale_openamber_storing_sensor_cv_aanvoertemperatuur_zone_2_f22","F","F22 - Storing sensor cv-aanvoertemperatuur zone 2","F22 - Störung Vorlauffühler Zone 2","F22 - Supply temperature sensor zone 2 fault"],["binary_sensor.openamber_bedrijfstroom_warmtepomp_p01","W","P01 - Bedrijfstroom warmtepomp","P01 - Betriebsstrom Wärmepumpe","P01 - Heat pump operating current"],["binary_sensor.openamber_bedrijfstroom_warmtepomp_p02","W","P02 - Bedrijfstroom warmtepomp","P02 - Betriebsstrom Wärmepumpe","P02 - Heat pump operating current"],["binary_sensor.openamber_laag_drukverschil_p06","W","P06 - Storing compressor - laag drukverschil","P06 - Störung Kompressor - geringer Druckunterschied","P06 - Compressor fault - low pressure difference"],["binary_sensor.openamber_compressor_voorverwarming_p07","W","P07 - Compressor voorverwarming","P07 - Kompressor-Vorheizung","P07 - Compressor preheating"],["binary_sensor.zentrale_openamber_compressor_geblokkeerd_door_buitentemperatuur_p11","W","P11 - Compressor geblokkeerd door buitentemperatuur","P11 - Kompressor durch Außentemperatur gesperrt","P11 - Compressor blocked by outside temperature"],["binary_sensor.openamber_laag_drukverschil_p13","W","P13 - Storing compressor - laag drukverschil","P13 - Störung Kompressor - geringer Druckunterschied","P13 - Compressor fault - low pressure difference"],["binary_sensor.zentrale_openamber_communicatie_failsafe_binnenunit","W","Communicatie-failsafe binnenunit","Kommunikations-Failsafe Inneneinheit","Indoor unit communication failsafe"],["binary_sensor.zentrale_openamber_eeprom_fout_binnenunit","W","EEPROM-fout binnenunit","EEPROM-Fehler Inneneinheit","Indoor unit EEPROM error"],["binary_sensor.zentrale_openamber_pompterugmelding_p0_alarm","W","Pompterugmelding P0 alarm","Alarm Rückmeldung Pumpe P0","P0 pump feedback alarm"]]; // [entity, kind F/T/W, nl, de, en]
const LANG = 'input_select.openamber_display_taal';
const TXT = {
  nl: { d1: '24 u', d7: '7 dagen', d30: '30 dagen', none: 'Geen fouten of waarschuwingen in deze periode', act: 'actief', load: 'Laden…', err: 'Historie kon niet worden geladen', F: 'Storing', T: 'Timeout', W: 'Waarschuwing', since: 'al actief bij begin periode', n: 'meldingen', tot: 'Totaal' },
  de: { d1: '24 h', d7: '7 Tage', d30: '30 Tage', none: 'Keine Störungen oder Warnungen in diesem Zeitraum', act: 'aktiv', load: 'Lädt…', err: 'Verlauf konnte nicht geladen werden', F: 'Störung', T: 'Timeout', W: 'Warnung', since: 'schon aktiv bei Beginn des Zeitraums', n: 'Meldungen', tot: 'Gesamt' },
  en: { d1: '24 h', d7: '7 days', d30: '30 days', none: 'No errors or warnings in this period', act: 'active', load: 'Loading…', err: 'Could not load history', F: 'Error', T: 'Timeout', W: 'Warning', since: 'already active at start of period', n: 'events', tot: 'Total' },
};
const COL = { F: '#B91C1C', T: '#C2410C', W: '#B45309' };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
class OaFaultHistory extends HTMLElement {
  constructor() { super(); this.days = 7; this.ev = null; this.err = false; this.root = this.attachShadow({ mode: 'open' }); }
  get hass() { const h = document.querySelector('home-assistant'); return h && h.hass; }
  get lang() { const h = this.hass, s = h && h.states[LANG]; const v = s ? s.state : ''; return v === 'Deutsch' ? 'de' : v === 'English' ? 'en' : 'nl'; }
  connectedCallback() {
    this.root.innerHTML = `<style>
:host{display:block;container-type:inline-size;--u:calc(100cqw / 940)}
.w{position:absolute;inset:0;box-sizing:border-box;background:#fff;border:1px solid #E5E7EB;border-radius:calc(12*var(--u));display:flex;flex-direction:column;overflow:hidden;color:#1F2937}
.t{display:flex;gap:calc(8*var(--u));padding:calc(10*var(--u)) calc(14*var(--u));align-items:center}
.b{flex:0 0 auto;padding:calc(6*var(--u)) calc(16*var(--u));border-radius:calc(10*var(--u));background:#E5E7EB;font-size:calc(19*var(--u));cursor:pointer;user-select:none}
.b.on{background:#1E4E8C;color:#fff}
.s{margin-left:auto;font-size:calc(18*var(--u));color:#4B5563}
.l{flex:1;overflow-y:auto;padding:0 calc(14*var(--u)) calc(12*var(--u));display:flex;flex-direction:column;gap:calc(6*var(--u))}
.e{background:#F5F5F5;padding:calc(7*var(--u)) calc(10*var(--u));border-left:calc(6*var(--u)) solid #999;font-size:calc(19*var(--u));line-height:1.25}
.e .h{display:flex;justify-content:space-between;gap:calc(10*var(--u))}
.e .n{font-weight:500}.e .m{color:#4B5563;font-size:calc(17*var(--u))}
.x{padding:calc(10*var(--u));font-size:calc(20*var(--u));color:#4B5563}
.a{color:#B91C1C;font-weight:500}
</style><div class="w"><div class="t"></div><div class="l"></div></div>`;
    this.load(); this.timer = setInterval(() => this.load(), 60000);
    this.lt = setInterval(() => { if (this.lang !== this.lastLang) this.draw(); }, 1000);
  }
  disconnectedCallback() { clearInterval(this.timer); clearInterval(this.lt); }
  async load() {
    const hass = this.hass; if (!hass) { setTimeout(() => this.load(), 1000); return; }
    const end = new Date(), start = new Date(end.getTime() - this.days * 864e5), days = this.days;
    try {
      const hist = await hass.callWS({ type: 'history/history_during_period', start_time: start.toISOString(), end_time: end.toISOString(), entity_ids: R.map((r) => r[0]), minimal_response: true, no_attributes: true, significant_changes_only: false });
      if (days !== this.days) return;
      const ev = [];
      for (const r of R) {
        const list = hist[r[0]] || []; let cur = null, real = null;
        list.forEach((p, i) => {
          const s = p.s !== undefined ? p.s : p.state; const t = p.lu !== undefined ? p.lu * 1000 : Date.parse(p.last_updated || p.last_changed);
          if (s !== 'on' && s !== 'off') return; // unavailable/unknown: keep the running event
          if (s === 'on' && real !== 'on') cur = { r, from: t, to: null, pre: i === 0 && t <= start.getTime() + 1000 };
          if (s === 'off' && real === 'on' && cur) { cur.to = t; ev.push(cur); cur = null; }
          real = s;
        });
        if (cur) ev.push(cur);
      }
      ev.sort((a, b) => b.from - a.from);
      this.ev = ev; this.err = false;
    } catch (e) { console.warn('oa-fault-history', e); this.err = true; }
    this.draw();
  }
  fmt(t) { const l = this.lang === 'de' ? 'de-DE' : this.lang === 'en' ? 'en-GB' : 'nl-NL'; return new Date(t).toLocaleString(l, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }); }
  dur(ms) { const m = Math.round(ms / 60000); if (m < 1) return '< 1 min'; if (m < 60) return m + ' min'; const h = Math.floor(m / 60); return h < 48 ? `${h} h ${m % 60} min` : `${Math.floor(h / 24)} d ${h % 24} h`; }
  draw() {
    const L = this.lang, X = TXT[L]; this.lastLang = L;
    const top = this.root.querySelector('.t'), list = this.root.querySelector('.l'); if (!top) return;
    const cnt = this.ev ? this.ev.length : 0;
    top.innerHTML = [1, 7, 30].map((d) => `<div class="b${d === this.days ? ' on' : ''}" onclick="void 0" data-d="${d}">${X['d' + d]}</div>`).join('') + (this.ev ? `<div class="s">${X.tot}: ${cnt} ${X.n}</div>` : '');
    top.querySelectorAll('.b').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); this.days = +b.dataset.d; this.ev = null; this.draw(); this.load(); }));
    if (this.err) { list.innerHTML = `<div class="x">${X.err}</div>`; return; }
    if (!this.ev) { list.innerHTML = `<div class="x">${X.load}</div>`; return; }
    if (!cnt) { list.innerHTML = `<div class="x">${X.none}</div>`; return; }
    const ni = L === 'de' ? 3 : L === 'en' ? 4 : 2;
    list.innerHTML = this.ev.map((e) => {
      const k = e.r[1], end = e.to ? `${this.fmt(e.to)} · ${this.dur(e.to - e.from)}` : `<span class="a">${X.act}</span> · ${this.dur(Date.now() - e.from)}`;
      return `<div class="e" style="border-left-color:${COL[k]}"><div class="h"><span class="n">${esc(e.r[ni])}</span><span style="color:${COL[k]}">${X[k]}</span></div>` +
        `<div class="m">${this.fmt(e.from)} → ${end}${e.pre ? ' · ' + X.since : ''}</div></div>`;
    }).join('');
  }
}
customElements.define('oa-fault-history', OaFaultHistory);
})();
