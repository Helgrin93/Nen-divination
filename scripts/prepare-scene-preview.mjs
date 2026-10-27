// Local review only: extract unaltered rectangles from the user-supplied reel.
// No generated images, inpainting or reference UI is included.
import { chromium } from '@playwright/test';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
const destination = '.verification/v2/scene';
await mkdir(destination, { recursive: true });
await copyFile('reference/ANIME_HANDS_GLASS_REFERENCE.png', `${destination}/anime-water-scene.png`);
const browser = await chromium.launch(process.platform === 'win32' ? { channel: 'chrome' } : {});
try {
  const page = await browser.newPage();
  await page.goto(process.env.PREVIEW_URL || 'http://127.0.0.1:5173/');
  await page.evaluate(async () => {
    document.body.innerHTML = '<video muted preload="auto" src="/reference/reel-original.mp4"></video>';
    await new Promise((resolve, reject) => {
      const video = document.querySelector('video');
      video.onloadedmetadata = resolve; video.onerror = reject;
    });
  });
  for (const [name, time, rectangle] of [
    ['wing-room', 18, [32, 46, 448, 554]],
    ['table-glass', 14, [32, 600, 448, 347]],
    ['room-edge', 18, [0, 46, 76, 554]],
    ['table-edge', 14, [0, 610, 90, 337]],
  ]) {
    const bytes = await page.locator('video').evaluate(async (video, { time, rectangle }) => {
      video.currentTime = time;
      await new Promise(resolve => video.onseeked = resolve);
      const [x, y, width, height] = rectangle;
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(video, x, y, width, height, 0, 0, width, height);
      return canvas.toDataURL('image/png').split(',')[1];
    }, { time, rectangle });
    await writeFile(`${destination}/${name}.png`, Buffer.from(bytes, 'base64'));
  }
  // Optional frame left by the previous session. Its source URL and permission
  // have not been recorded; keep it strictly in the private local preview.
  try {
    const portrait=await page.evaluate(async()=>{
      const img=new Image();img.src='/.verification/v2/wing-telasa.png';await img.decode();
      const canvas=document.createElement('canvas');canvas.width=550;canvas.height=422;
      canvas.getContext('2d').drawImage(img,100,0,550,422,0,0,550,422);
      return canvas.toDataURL('image/png').split(',')[1];
    });
    await writeFile(`${destination}/wing-room.png`,Buffer.from(portrait,'base64'));
  } catch { console.log('Optional Wing frame unavailable: existing reel crop retained.'); }
  console.log(`Local scene extracts saved in ${destination}; excluded from Git and the normal build.`);
} finally { await browser.close(); }
