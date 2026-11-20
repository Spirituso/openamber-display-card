// Finds the Home Assistant entities of one OpenAmber device.
//
// ESPHome registers every entity with unique_id "<mac>/<n>/<domain>/<name as set in the firmware>"
// (older ESPHome: "<mac>-<domain>-<object_id>"). That part does not change when the user renames the
// device or the entities, so the card matches on it instead of on entity ids.
import { ENTITIES } from './entities.js';

const objectId = (name) => name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '_');

export async function discover(hass, wantedDevice) {
  let registry = [];
  try {
    registry = await hass.callWS({ type: 'config/entity_registry/list' });
  } catch (e) {
    registry = []; // not an admin user: fall back to the names below
  }
  const byKey = {};
  const wanted = Object.entries(ENTITIES);
  const esphome = registry.filter((r) => r.platform === 'esphome' && !r.disabled_by);
  // Pick the device with the most OpenAmber entities, unless the card config names one.
  const score = {};
  const match = (r, dom, name) => r.entity_id.startsWith(dom + '.') &&
    (r.unique_id.endsWith('/' + dom + '/' + name) || r.unique_id.endsWith('-' + dom + '-' + objectId(name)));
  for (const r of esphome) {
    if (wanted.some(([, [dom, name]]) => match(r, dom, name))) score[r.device_id] = (score[r.device_id] || 0) + 1;
  }
  const device = wantedDevice || Object.keys(score).sort((a, b) => score[b] - score[a])[0];
  for (const [key, [dom, name]] of wanted) {
    const r = esphome.find((x) => x.device_id === device && match(x, dom, name));
    if (r) byKey[key] = r.entity_id;
  }
  if (!Object.keys(byKey).length) {
    // Fallback without registry access: friendly name "<device name> <entity name>".
    for (const [key, [dom, name]] of wanted) {
      const id = Object.keys(hass.states).find((e) => e.startsWith(dom + '.') &&
        String(hass.states[e].attributes.friendly_name || '').endsWith(' ' + name));
      if (id) byKey[key] = id;
    }
  }
  return { device, entities: byKey };
}
