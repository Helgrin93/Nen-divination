import { test,expect } from '@playwright/test';

test('a failed neutral sprite falls back to another decoded Wing',async({page})=>{
  await page.route('**/wing-neutral.png',route=>route.abort());
  await page.goto('/');
  await expect(page.locator('.wing-sprite.is-active')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.wing-sprite.is-active')).toHaveCSS('opacity','1');
  await expect(page.locator('.wing-sprite.is-active')).toBeVisible();
  await expect(page.locator('.wing-sprite.is-active')).not.toHaveAttribute('data-pose','neutral');
});

test('Wing stays decoded, opaque and persistent over twelve question changes',async({page})=>{
  await page.addInitScript(()=>{
    crypto.getRandomValues=b=>{b[0]=4294967295;return b;};
    window.wingFrames=[];
  });
  await page.goto('/');
  await expect(page.locator('.wing-sprite[data-ready=true]')).toHaveCount(4);
  await page.locator('[data-action=begin]').click();
  await page.evaluate(()=>{
    window.originalSprites=[...document.querySelectorAll('.wing-sprite')];
    window.originalArt=document.querySelector('.quiz-scene-art');
    window.originalBox=document.querySelector('.wing-plate').getBoundingClientRect().toJSON();
    window.watchWing=true;
    function frame(){
      const active=document.querySelector('.wing-sprite.is-active');
      const box=document.querySelector('.wing-plate').getBoundingClientRect().toJSON();
      window.wingFrames.push({pose:active?.dataset.pose,ready:active?.dataset.ready,
        opacity:active&&getComputedStyle(active).opacity,
        stable:JSON.stringify(box)===JSON.stringify(window.originalBox),
        connected:window.originalArt===document.querySelector('.quiz-scene-art')&&window.originalSprites.every(img=>img.isConnected)});
      if(window.watchWing)requestAnimationFrame(frame);
    }frame();
  });
  // Revisit the reaction question six times. These are actual UI transitions,
  // with answer selection, not direct calls to the presentation controller.
  for(let i=0;i<2;i++){
    await page.locator('.answer').first().click();await page.locator('[data-action=next]').click();
  }
  for(let i=0;i<6;i++){
    await expect(page.locator('.scene')).toHaveAttribute('data-pose','eyesClosed');
    await page.locator('[data-action=back]').click();
    await expect(page.locator('.scene')).toHaveAttribute('data-pose','neutral');
    await page.locator('[data-action=next]').click();
  }
  for(let i=0;i<2;i++){
    await page.locator('.answer').first().click();await page.locator('[data-action=next]').click();
  }
  await expect(page.locator('.interlude [data-reaction],.interlude[data-reaction]')).toHaveCount(1);
  const frames=await page.evaluate(()=>{window.watchWing=false;return window.wingFrames;});
  expect(frames.length).toBeGreaterThan(10);
  expect(new Set(frames.map(f=>f.pose)).has('eyesClosed')).toBe(true);
  for(const f of frames)expect(f).toMatchObject({ready:'true',opacity:'1',stable:true,connected:true});
});

test('a delayed expression never replaces Wing with an unloaded frame',async({page})=>{
  let release;
  const gate=new Promise(resolve=>release=resolve);
  await page.route('**/wing-eyes-closed.png',async route=>{await gate;await route.continue();});
  await page.addInitScript(()=>{crypto.getRandomValues=b=>{b[0]=4294967295;return b;};});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.wing-sprite[data-pose=neutral]')).toHaveAttribute('data-ready','true');
  await page.locator('[data-action=begin]').click();
  for(let i=0;i<2;i++){
    await page.locator('.answer').first().click();await page.locator('[data-action=next]').click();
  }
  await expect(page.locator('.scene')).toHaveAttribute('data-expression','eyesClosed');
  await expect(page.locator('.wing-sprite.is-active')).toHaveAttribute('data-pose','neutral');
  await expect(page.locator('.wing-sprite.is-active')).toHaveCSS('opacity','1');
  await page.locator('[data-action=back]').click();
  release();
  await expect(page.locator('.wing-sprite[data-pose=eyesClosed]')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.wing-sprite.is-active')).toHaveAttribute('data-pose','neutral');
  await page.locator('[data-action=next]').click();
  await expect(page.locator('.wing-sprite.is-active')).toHaveAttribute('data-pose','eyesClosed');
  await expect(page.locator('.wing-sprite.is-active')).toHaveAttribute('data-ready','true');
});

test('native water coordinates stay registered and deferred effects leave no duplicate glass',async({page})=>{
  await page.goto('/review/divination.html');
  await expect(page.locator('.water-effects')).toHaveAttribute('data-ready','true');
  const registration=await page.evaluate(()=>{
    const c=document.querySelector('.water-effects'),image=document.querySelector('.glass-plate');
    const rect=el=>JSON.stringify(el.getBoundingClientRect().toJSON());
    return {width:c.width,height:c.height,same:rect(c)===rect(image)};
  });
  expect(registration).toEqual({width:1536,height:1024,same:true});
  for(const effect of ['none','emission','transmutation','conjuration','manipulation','specialization']){
    const alpha=await page.evaluate(effect=>{
      window.divinationReview.water.setEffect(effect);
      const c=document.querySelector('.water-effects'),data=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
      let sum=0;for(let i=3;i<data.length;i+=4)sum+=data[i];return sum;
    },effect);
    expect(alpha).toBe(0);
  }
});
