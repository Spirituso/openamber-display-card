# OpenAmber Display Card

**Unofficial** Home Assistant card that looks and works like the Waveshare touch display of
[OpenAmber](https://github.com/Jordi1990/openamber). This is a community project and is not
maintained by the OpenAmber developer.

*Nederlands: een onofficiële Home Assistant-kaart die eruitziet en werkt als het Waveshare-display van OpenAmber.*

## Status

Card: early development. Dashboard: v0.2, complete (see below). What works today:

- Automatic discovery of the OpenAmber entities. The card reads the entity registry and matches on
  the entity names set in the firmware, so it works no matter how you named the device or renamed
  entities in Home Assistant.

Being ported from a working prototype dashboard (see Roadmap): Home, Thermostaat, Grafiek,
Instellingen, Service and Systeem.

## Ready-to-use dashboard (v0.2)

While the card is being built, the complete prototype dashboard is available in
[`dashboard/`](dashboard/). It has every page of the display: Home, Thermostaat, Grafiek,
Instellingen (all firmware menus), Service (incl. Diagnose with history graphs, Foutmeldingen,
Waarschuwingen) and Systeem.

**Languages:** Nederlands (default), English and Deutsch, switchable on the Systeem page.

### Installation

1. Install [button-card](https://github.com/custom-cards/button-card) (7.x) from HACS / the Marketplace.
2. Copy `dashboard/oa-graph.js` to `/config/www/` and add it as a dashboard resource:
   `/local/oa-graph.js`, type *JavaScript module*.
3. Create a dropdown helper (Settings > Devices & services > Helpers > Dropdown) named
   `OpenAmber display taal` with the options `Nederlands`, `English`, `Deutsch`
   → entity `input_select.openamber_display_taal`.
4. Create a new dashboard, open *Edit > Raw configuration editor* and paste the content of
   `dashboard/openamber-display.yaml`.
5. Reload the browser (Ctrl+Shift+R).

### Entity IDs

The dashboard uses fixed entity IDs from the author's installation. Most are `*.openamber_*`,
some are `*.zentrale_openamber_*` (the device was renamed to "Zentrale OpenAmber"). If your IDs
differ, use search & replace in the YAML before pasting. Values that do not exist show `-`.
The card in `src/` will find the entities automatically, so this step will go away.

### Translations

The dictionaries are in `dashboard/i18n/` (`strings`: exact texts, `patterns`: texts with numbers).
Selects keep sending the Dutch option values to the firmware, so switching the language never
changes a setting.

## Card installation (work in progress)

### HACS / Home Assistant Marketplace (custom repository)

1. Add `https://github.com/Spirituso/openamber-display-card` as a custom repository, type *Dashboard*.
2. Install **OpenAmber Display Card**.
3. Reload the browser (Ctrl+Shift+R).

### Manual

Copy `dist/openamber-display-card.js` to `/config/www/` and add it as a dashboard resource
(`/local/openamber-display-card.js`, type *JavaScript module*).

## Usage

```yaml
type: custom:openamber-display-card
# optional, only needed with more than one OpenAmber device:
# device_id: 623fce465f9849a5629bf439a4dd9ab5
```

Best used in a dashboard view of type *Panel*. The card needs an administrator account for the
entity registry lookup; for other users it falls back to matching the friendly names.

## Firmware versions

The list of entities in `src/entities.js` is generated from the OpenAmber firmware:

```sh
python3 tools/gen_entities.py /path/to/openamber > src/entities.js
npm run build
```

Entities that your firmware does not expose are shown as `-`, like on the display.

## Roadmap

1. Discovery and card frame (header bar, navigation) — in progress
2. Pages: Home, Thermostaat
3. Pages: Service (incl. Diagnose, Foutmeldingen, Waarschuwingen)
4. Pages: Instellingen (generated from the firmware menu)
5. Pages: Systeem, Grafiek (history from the Home Assistant recorder)
6. Languages: Dutch, English, German (done in the dashboard, to be ported to the card)

## License

GPL-3.0, like OpenAmber. Layout, texts and images are derived from the OpenAmber firmware
(© the OpenAmber contributors).
