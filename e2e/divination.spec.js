import { test,expect } from '@playwright/test';

test('progressive hold, local masks, physical rise and reset in the quality preview',async({page},testInfo)=>{
  await page.clock.install({time:new Date('2026-10-27T12:00:00Z')});
  await page.clock.pauseAt(new Date('2026-10-27T12:00:01Z'));
  await page.goto('/review/divination.html');
  await expect(page.locator('.hands-motion')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.water-effects')).toHaveAttribute('data-ready','true');
  const read=()=>page.locator('.water-effects').evaluate(c=>({
    strength:Number(c.dataset.concentration),surface:Number(c.dataset.surfaceY),pixels:c.toDataURL(),
  }));
  await page.locator('[data-rest]').click();await page.clock.runFor(1200);
  await expect(page.locator('.hands-motion')).toHaveAttribute('data-pose','rest');
  const original=await read();
  await page.locator('[data-restart]').click();await page.clock.runFor(1200);
  await expect(page.locator('.hands-motion')).toHaveAttribute('data-pose','approach');
  const layout=await page.evaluate(()=>{
    const canvas=document.querySelector('.water-effects'),r=canvas.getBoundingClientRect();
    const x=r.x+r.width/2,y=r.y+Number(canvas.dataset.surfaceY)/canvas.height*r.height;
    const bubble=document.querySelector('.speech-bubble').getBoundingClientRect();
    const button=document.querySelector('.hold-button').getBoundingClientRect();
    return {
      waterCovered:!!document.elementFromPoint(x,y)?.closest('.speech-bubble,.scene-hold-slot'),
      controlsOverlap:bubble.bottom>button.top&&bubble.top<button.bottom,
    };
  });
  expect(layout).toEqual({waterCovered:false,controlsOverlap:false});
  const button=page.locator('.hold-button');await button.focus();await page.keyboard.down('Space');
  await page.clock.runFor(1800);const early=await read();
  await page.clock.runFor(2200);const late=await read();
  expect(late.strength).toBeGreaterThan(early.strength+.4);
  expect(late.surface).toBe(original.surface);
  await expect(page.locator('.scene')).toHaveAttribute('data-effect','none');
  const bounds=await page.locator('.water-effects').evaluate(canvas=>{
    const pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;
    // Aura must not introduce any luminous marks outside the goblet.
    let outside=0;for(let y=0;y<canvas.height;y+=3)for(const x of [20,100,250,1250,1400,1500])outside+=pixels[(y*canvas.width+x)*4+3];
    return outside;
  });
  expect(bounds).toBe(0);
  await page.keyboard.up('Space');await page.clock.runFor(1400);
  expect((await read()).pixels).toBe(original.pixels);
  await expect(page.locator('.hands-motion')).toHaveAttribute('data-pose','approach');
  await expect(page.locator('.hold-progress')).toHaveAttribute('aria-valuenow','0');
  await button.focus();await page.keyboard.down('Enter');await page.clock.runFor(4490);
  await expect(page.locator('.scene')).toHaveAttribute('data-effect','none');
  await page.clock.runFor(50);await page.keyboard.up('Enter');
  await expect(page.locator('.scene')).toHaveAttribute('data-effect','enhancement');
  await page.clock.runFor(1500);const middle=await read();
  await page.clock.runFor(2500);const final=await read();
  expect(middle.surface).toBeLessThan(original.surface);expect(final.surface).toBeLessThan(middle.surface);
  await expect(page.locator('.water-effects')).toHaveAttribute('data-effect-progress','1');
  await expect(page.locator('.hands-motion')).toHaveAttribute('data-pose','concentration');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:`.verification/divination/${testInfo.project.name}-verified.png`});
  await page.locator('[data-restart]').click();await page.clock.runFor(1600);
  expect((await read()).pixels).toBe(original.pixels);
});

test('reduced motion, failed sprites and replay keep a usable scene',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/review/divination.html');
  await expect(page.locator('.hands-motion')).toHaveAttribute('data-ready','true');
  await page.evaluate(()=>window.divinationReview.water.setEffect('enhancement'));
  await expect(page.locator('.water-effects')).toHaveAttribute('data-effect-progress','1');
  await page.locator('[data-restart]').click();
  await expect(page.locator('.water-effects')).toHaveAttribute('data-rendered-effect','none');
  await page.route('**/hands-poses.png',route=>route.abort());
  await page.reload();
  await expect(page.locator('.scene')).toHaveAttribute('data-hands-asset','missing');
  await expect(page.locator('.hands-motion')).toBeHidden();
  await expect(page.locator('.glass-plate')).toBeVisible();
  await expect(page.locator('.hold-button')).toBeEnabled();
});
