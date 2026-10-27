import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { characters } from '../src/data/characters.js';
import { fetchTenraiCharacters, matchTenraiCharacters, TENRAI_CHARACTERS_URL, TENRAI_TERMS_URL } from '../src/services/tenrai.js';

// One API request. Only the 18 exact matched portraits are eligible for download.
// Downloads stay in .verification and are never added to a public build.
const download = process.argv.includes('--download-preview');
const input = process.argv.find(value => value.startsWith('--from='))?.slice(7);
try {
  const records = input ? JSON.parse(await readFile(input, 'utf8')).data : await fetchTenraiCharacters();
  if(!Array.isArray(records) || !records.length)throw new Error('Invalid or empty character response');
  const matches = matchTenraiCharacters(characters, records);
  if(Object.values(matches).some(entry=>entry.status!=='identified'))throw new Error(`Incomplete identity match: ${Object.entries(matches).filter(([,entry])=>entry.status!=='identified').map(([slug,entry])=>`${slug}: ${entry.status}`).join(', ')}`);
  await mkdir('.verification/v2/characters', { recursive: true });
  for (const [slug, entry] of Object.entries(matches)) {
    if (!download || entry.status !== 'identified') continue;
    try {
      const response = await fetch(entry.portraitUrl, { signal: AbortSignal.timeout(20000) });
      if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Image HTTP ${response.status}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length > 5_000_000) throw new Error('Portrait exceeds 5 MB');
      await writeFile(`.verification/v2/characters/${slug}.jpg`, bytes);
      entry.localPreviewSrc = `__character-preview/${slug}.jpg`;
      entry.status = 'local-preview';
    } catch (error) { entry.downloadError = error.message; }
  }
  const manifest = { provider: 'tenrai', endpoint: TENRAI_CHARACTERS_URL, fetchedAt: new Date().toISOString(), status: 'fetched', sourceRecordCount: records.length, permissionReview: { source: TENRAI_TERMS_URL, status: 'unverified', note: 'API caching permitted; image rights are not granted by the API provider. No portraits copied into public/assets/characters.' }, characters: matches };
  await writeFile('src/data/characterImages.json', JSON.stringify(manifest, null, 2) + '\n');
  console.log(Object.entries(matches).map(([slug, entry]) => `${slug}: ${entry.status}`).join('\n'));
  if (Object.values(matches).some(entry => !['identified', 'local-preview'].includes(entry.status) || entry.downloadError)) process.exitCode = 1;
} catch (error) {
  console.error(`Tenrai import failed: ${error.message}. Existing catalog and cached portraits preserved.`);
  process.exitCode = 1;
}
