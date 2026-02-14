// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ZONE_FAV_KEY = 'zone_favs_v1';
export const PROD_FAV_KEY = 'prod_favs_v1';
export const SETTINGS_KEY = 'settings_v1';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const listAZ = () => LETTERS.slice();

function sanitizeAisles(arr) {
  const up = (arr || []).map(x => String(x).toUpperCase());
  // garde uniquement A..Z, unique, ordre alphabétique
  const filtered = LETTERS.filter(ch => up.includes(ch));
  return filtered.length ? filtered : listAZ();
}

function aislesFromRange(start, end) {
  const s = (String(start || 'A').toUpperCase().match(/^[A-Z]$/) || ['A'])[0];
  const e = (String(end || 'Z').toUpperCase().match(/^[A-Z]$/) || ['Z'])[0];
  const si = LETTERS.indexOf(s);
  const ei = LETTERS.indexOf(e);
  const [a, b] = si <= ei ? [si, ei] : [ei, si];
  return LETTERS.slice(a, b + 1);
}

// ⚙️ Valeurs par défaut : on part avec A..Z pour chaque zone
export const DEFAULT_SETTINGS = {
  zones: {
    '1': { name: 'Ambiant',          aisles: listAZ(), shelfMax: 9 },
    '2': { name: 'Surgelés',         aisles: listAZ(), shelfMax: 11 },
    '3': { name: 'Frais',            aisles: listAZ(), shelfMax: 7 },
    '4': { name: 'Fruits & Légumes', aisles: listAZ(), shelfMax: 5 },
    '8': { name: 'Kardex',           aisles: listAZ(), shelfMax: 36 },
  },
};

// Helper public : renvoie la liste d’allées d’une zone (priorité aux aisles[])
export function getZoneAisles(zoneCfg) {
  if (!zoneCfg) return listAZ();
  if (Array.isArray(zoneCfg.aisles) && zoneCfg.aisles.length) {
    return sanitizeAisles(zoneCfg.aisles);
  }
  // rétrocompat : si un ancien réglage start/end existait
  if (zoneCfg.aisleStart || zoneCfg.aisleEnd) {
    return aislesFromRange(zoneCfg.aisleStart, zoneCfg.aisleEnd);
  }
  return listAZ();
}

export async function loadSettings() {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw);
    const merged = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      zones: { ...DEFAULT_SETTINGS.zones, ...(parsed.zones || {}) },
    };
    // Assainir les aisles de chaque zone
    Object.keys(merged.zones).forEach(z => {
      const zc = merged.zones[z] || {};
      merged.zones[z] = {
        name: zc.name || DEFAULT_SETTINGS.zones[z]?.name || `Zone ${z}`,
        shelfMax: parseInt(zc.shelfMax || DEFAULT_SETTINGS.zones[z]?.shelfMax || 1, 10),
        aisles: getZoneAisles(zc),
      };
    });
    return merged;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings) {
  // on ne stocke que ce qui est nécessaire
  const clean = { zones: {} };
  Object.keys(settings?.zones || {}).forEach(z => {
    const zc = settings.zones[z];
    clean.zones[z] = {
      name: zc.name,
      shelfMax: parseInt(zc.shelfMax || 1, 10),
      aisles: sanitizeAisles(zc.aisles),
    };
  });
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(clean));
}

export async function loadArray(key) {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return [];
  try { return JSON.parse(raw) || []; } catch { return []; }
}

export async function saveArray(key, arr) {
  await AsyncStorage.setItem(key, JSON.stringify(arr || []));
}

export function pad2(n) {
  const v = parseInt(n, 10) || 0;
  return v < 10 ? `0${v}` : `${v}`;
}

export function makeId(prefix='id') {
  return `${prefix}_${Math.random().toString(36).slice(2,8)}_${Date.now().toString(36)}`;
}
