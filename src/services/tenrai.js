export const TENRAI_CHARACTERS_URL = 'https://api.tenrai.org/v1/anime/11061/characters';
export const TENRAI_TERMS_URL = 'https://tenrai.org/terms';

// Exact curated identity aliases; API metadata never decides Nen affiliation.
const aliases = {
  gon: ['Freecss, Gon'], netero: ['Netero, Isaac'], uvogin: ['Uvogin'],
  meruem: ['Meruem'], zeno: ['Zoldyck, Zeno'], razor: ['Razor'],
  killua: ['Zoldyck, Killua'], hisoka: ['Hisoka', 'Morow, Hisoka'],
  biscuit: ['Krueger, Biscuit'], kurapika: ['Kurapika'], kite: ['Kite', 'Kaito'],
  shizuku: ['Shizuku', 'Murasaki, Shizuku'], illumi: ['Zoldyck, Illumi'],
  morel: ['Mackernasey, Morel', 'Morel'], shalnark: ['Shalnark', 'Ryuseih, Shalnark'],
  chrollo: ['Lucilfer, Chrollo', 'Chrollo Lucilfer'], neferpitou: ['Neferpitou'], pakunoda: ['Pakunoda'],
};
const normalize = value => value.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean).sort().join(' ');

export async function fetchTenraiCharacters(fetcher = fetch) {
  const response = await fetcher(TENRAI_CHARACTERS_URL, { signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`Tenrai HTTP ${response.status}; retry later${response.headers?.get('retry-after') ? ` (Retry-After: ${response.headers.get('retry-after')})` : ''}.`);
  const payload = await response.json();
  if (!Array.isArray(payload.data) || !payload.data.length || payload.pagination?.has_next_page) throw new Error('Invalid or incomplete Tenrai character response.');
  return payload.data;
}

export function matchTenraiCharacters(catalog, records) {
  return Object.fromEntries(catalog.map(entry => {
    const names = new Set([entry.name, ...(aliases[entry.slug] || [])].map(normalize));
    const matches = records.map(row => row.character).filter(character => character && typeof character.name === 'string' && names.has(normalize(character.name)));
    const identity = { slug: entry.slug, name: entry.name, provider: 'tenrai' };
    if (matches.length !== 1) return [entry.slug, { ...identity, status: matches.length ? 'ambiguous' : 'missing' }];
    const character = matches[0];
    const portraitUrl = character.images?.jpg?.image_url;
    let validImage = false;
    try { const url = new URL(portraitUrl); validImage = url.protocol === 'https:' && url.hostname === 'cdn.myanimelist.net' && /^\/images\/characters\//.test(url.pathname); } catch { /* no image */ }
    if (!Number.isInteger(character.mal_id) || character.mal_id<=0) return [entry.slug, { ...identity, status: 'invalid-id' }];
    let sourceUrl=null;
    try { const url=new URL(character.url);if(url.protocol==='https:' && url.hostname==='myanimelist.net' && url.pathname.split('/')[1]==='character' && url.pathname.split('/')[2]===String(character.mal_id))sourceUrl=url.href; } catch { /* keep the observed ID; do not invent a source URL */ }
    return [entry.slug, {
      ...identity, status: validImage ? 'identified' : 'missing-image', malId: character.mal_id, sourceName: character.name,
      sourceUrl,
      portraitUrl: validImage ? portraitUrl : null, localPreviewSrc: null,
      permissionStatus: 'unverified',
      permissionSource: TENRAI_TERMS_URL,
      permissionNote: 'Tenrai Terms §§3,6 permit caching API responses but grant no license to third-party artwork. No image reuse permission verified.',
      credit: 'MyAnimeList via Tenrai v1; Hunter × Hunter — respective rights holders',
    }];
  }));
}
