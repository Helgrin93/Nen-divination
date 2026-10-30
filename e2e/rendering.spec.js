import { test,expect } from '@playwright/test';
import {finishDialogue} from './helpers/dialogue.js';

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
  // Visit the separate reaction, then revisit answered questions six times.
  for(let i=0;i<2;i++){
    await page.locator('.answer').first().click();await page.locator('[data-action=next]').click();
  }
  await expect(page.locator('.scene')).toHaveAttribute('data-pose','eyesClosed');
  await finishDialogue(page);
  for(let i=0;i<6;i++){
    await expect(page.locator('.scene')).toHaveAttribute('data-pose','neutral');
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
  release();
  await expect(page.locator('.wing-sprite[data-pose=eyesClosed]')).toHaveAttribute('data-ready','true');
  await expect(page.locator('.wing-sprite.is-active')).toHaveAttribute('data-pose','eyesClosed');
  await expect(page.locator('.wing-sprite.is-active')).toHaveAttribute('data-ready','true');
  await finishDialogue(page);await page.locator('[data-action=back]').click();
  await expect(page.locator('.wing-sprite.is-active')).toHaveAttribute('data-pose','neutral');
});

test('native water coordinates stay registered and effects preserve the glass rim',async({page})=>{
  await page.goto('/review/divination.html');
  await expect(page.locator('.water-effects')).toHaveAttribute('data-ready','true');
  const registration=await page.evaluate(()=>{
    const c=document.querySelector('.water-effects'),image=document.querySelector('.glass-plate');
    const rect=el=>JSON.stringify(el.getBoundingClientRect().toJSON());
    return {width:c.width,height:c.height,same:rect(c)===rect(image)};
  });
  expect(registration).toEqual({width:1536,height:1024,same:true});
  for(const effect of ['none','emission','transmutation','conjuration','manipulation','specialization']){
    const unchanged=await page.evaluate(effect=>{
      const w=window.divinationReview.water;w.setEffect(effect);w.pause();
      const c=document.querySelector('.water-effects'),ctx=c.getContext('2d');
      const pixels=ctx.getImageData(680,585,175,17).data;
      w.reset();const rim=ctx.getImageData(680,585,175,17).data;
      return pixels.every((value,i)=>value===rim[i]);
    },effect);
    expect(unchanged).toBe(true);
  }
});

test('glass transmits the decoded Wing pose without restarting the running effect',async({page})=>{
  await page.goto('/review/divination.html');
  await expect(page.locator('.wing-sprite[data-ready=true]')).toHaveCount(4);
  await expect(page.locator('.water-effects')).toHaveAttribute('data-ready','true');
  const samples=await page.evaluate(()=>{
    const water=window.divinationReview.water,c=document.querySelector('.water-effects'),plate=document.querySelector('.glass-plate');
    water.setEffect('conjuration');water.pause();const time=water.getState().duration*.6;
    return ['neutral','smile','eyesClosed','gesture'].map(pose=>{
      for(const image of document.querySelectorAll('.wing-sprite'))image.classList.toggle('is-active',image.dataset.pose===pose);
      water.seek(time);
      const actual=Object.assign(document.createElement('canvas'),{width:1536,height:1024}),ac=actual.getContext('2d');ac.drawImage(plate,0,0);ac.drawImage(c,0,0);
      const expected=Object.assign(document.createElement('canvas'),{width:1536,height:1024}),ec=expected.getContext('2d');
      ec.drawImage(document.querySelector('.wing-sprite.is-active'),1536*.18,0,1536*.64,1024*.64);
      let error=0;for(const x of [730,750,768,785,805]){
        const a=ac.getImageData(x,600,1,1).data,e=ec.getImageData(x,600,1,1).data;
        for(let k=0;k<3;k++)error=Math.max(error,Math.abs(a[k]-e[k]));
      }
      return {pose,rendered:c.dataset.glassPose,error,elapsed:water.getState().elapsed,paused:water.getState().paused};
    });
  });
  for(const sample of samples){expect(sample.rendered).toBe(sample.pose);expect(sample.error).toBeLessThan(25);expect(sample.elapsed).toBe(3360);expect(sample.paused).toBe(true);}
});
