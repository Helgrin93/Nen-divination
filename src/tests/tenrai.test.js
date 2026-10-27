import { describe, it, expect } from 'vitest';
import { fetchTenraiCharacters, matchTenraiCharacters, TENRAI_CHARACTERS_URL } from '../services/tenrai.js';
import { characters } from '../data/characters.js';

const record = (name, mal_id = 1) => ({ character: { name, mal_id, url:`https://myanimelist.net/character/${mal_id}/Example`, images: { jpg: { image_url: 'https://cdn.myanimelist.net/images/characters/1/1.jpg' } }, nenType: 'wrong' } });
describe('Tenrai identity import', () => {
  it('resolves reordered names and exact aliases without importing Nen assignments', () => {
    const result = matchTenraiCharacters(characters, [record('Freecss, Gon'), record('Hisoka', 2), record('Kaito', 3), record('Ryuseih, Shalnark', 4)]);
    expect(result.gon.status).toBe('identified');
    expect(result.hisoka.malId).toBe(2);
    expect(result.kite.malId).toBe(3);
    expect(result.shalnark.malId).toBe(4);
    expect(result.shalnark.permissionStatus).toBe('unverified');
    expect(result.gon.nenType).toBeUndefined();
    expect(result.kurapika.status).toBe('missing');
  });
  it('rejects ambiguous identities, partial names, and untrusted image hosts', () => {
    const bad = record('Kurapika');bad.character.images.jpg.image_url = 'https://untrusted.example/image.jpg';
    const result = matchTenraiCharacters(characters, [record('Hisoka'), record('Morow, Hisoka', 2), record('Zoldyck'), bad]);
    expect(result.hisoka.status).toBe('ambiguous');
    expect(result.zeno.status).toBe('missing');
    expect(result.kurapika.status).toBe('missing-image');
  });
  it('uses the specified anime endpoint and reports outages or invalid payloads', async () => {
    let requested;
    const data = await fetchTenraiCharacters(async url => { requested = url;return { ok: true, json: async () => ({ data: [record('Kurapika')] }) }; });
    expect(requested).toBe(TENRAI_CHARACTERS_URL);expect(data).toHaveLength(1);
    await expect(fetchTenraiCharacters(async () => ({ ok: false, status: 429 }))).rejects.toThrow('429');
    await expect(fetchTenraiCharacters(async () => ({ ok: true, json: async () => ({ error: 'offline' }) }))).rejects.toThrow('Invalid');
    await expect(fetchTenraiCharacters(async () => ({ ok: true, json: async () => ({data:[record('Kurapika')],pagination:{has_next_page:true}}) }))).rejects.toThrow('incomplete');
  });
  it('retains real identities without inventing missing image URLs or trusting source links',()=>{
    const missing=record('Kurapika',28);missing.character.images=null;missing.character.url='javascript:alert(1)';
    const result=matchTenraiCharacters(characters,[missing,record('Freecss, Gon',-1)]);
    expect(result.kurapika).toMatchObject({malId:28,status:'missing-image',portraitUrl:null,sourceUrl:null,permissionStatus:'unverified'});
    expect(result.gon.status).toBe('invalid-id');
  });
});
