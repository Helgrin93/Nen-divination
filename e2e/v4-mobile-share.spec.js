import {test,expect} from '@playwright/test';
import {readFile,mkdir} from 'node:fs/promises';
import {questions} from '../src/data/questions.js';

test('real mobile emulation places every question above the glass and preserves reachable white answers',async({browser},info)=>{
  test.skip(info.project.name!=='desktop','Explicit touch contexts cover all requested sizes once.');
  await mkdir('.verification/v4/mobile',{recursive:true});
  for(const [width,height] of [[320,700],[375,812],[390,844],[430,932],[768,1024],[844,390]]){
    const page=await browser.newPage({viewport:{width,height},isMobile:true,hasTouch:true,locale:'it-IT'});
    await page.goto('/');await page.locator('[data-action=begin]').click();
    if(width<701){
      const layout=await page.evaluate(()=>{
        const bubble=document.querySelector('.quiz-card>.speech-bubble').getBoundingClientRect(),art=document.querySelector('.water-stage').getBoundingClientRect();
        return {bubble: bubble.toJSON(),glassTop:art.top+art.height*575/1024,eyes:art.top+art.height*250/1024,answers:document.querySelector('.answers').getBoundingClientRect().toJSON()};
      });
      expect(layout.bubble.top).toBeGreaterThan(layout.eyes+5);
      expect(layout.bubble.bottom).toBeLessThan(layout.glassTop+4);
      for(const lang of ['it','en'])for(const q of questions){
        await page.locator('.question-title').evaluate((el,text)=>el.textContent=text,q[lang]);
        expect(await page.locator('.bubble-scroll').evaluate(el=>el.clientHeight>35&&getComputedStyle(el).overflowY==='auto')).toBe(true);
      }
    }
    await expect(page.locator('.answer')).toHaveCount(4);
    for(const answer of await page.locator('.answer').all()){
      await answer.scrollIntoViewIfNeeded();await expect(answer).toBeInViewport();
      expect((await answer.boundingBox()).height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`.verification/v4/mobile/${width}x${height}-quiz.png`});await page.close();
  }
});

test('Story PNG, existing card, copy success/failure and CORS-safe portrait fallback work',async({page},info)=>{
  await page.goto('/review/results.html?type=specialization');await page.waitForFunction(()=>window.resultsReview);
  for(const [action,height] of [['story',1920],['save',1350]]){
    const pending=page.waitForEvent('download');await page.locator(`[data-action=${action}]`).click();const download=await pending;
    const bytes=await readFile(await download.path());expect(bytes.readUInt32BE(16)).toBe(1080);expect(bytes.readUInt32BE(20)).toBe(height);
    await download.saveAs(`.verification/v4/${info.project.name}-${action}.png`);
  }
  await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copiedLink=text;}}});});
  await page.locator('[data-action=copy-link]').click();expect(await page.evaluate(()=>window.copiedLink)).toBe('https://helgrin93.github.io/nen-divination/');
  await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw Error('Denied');}}});});
  await page.locator('[data-action=copy-link]').click();await expect(page.locator('.copy-link-fallback input')).toBeFocused();await expect(page.locator('.copy-link-fallback')).toBeVisible();
  await page.route('https://portraits.example/**',r=>r.fulfill({status:403,body:'Denied'}));
  const fallback=await page.evaluate(async()=>{
    const {characters}=await import('/src/data/characters.js'),{createShareCard}=await import('/src/game/share.js');
    for(const c of characters.filter(c=>c.nenType==='specialization').slice(0,3)){c.permissionStatus='authorized';c.portraitSrc='https://portraits.example/'+c.slug+'.jpg';}
    const blob=await createShareCard(window.resultsReview.samples.specialization,'en',{format:'story'});return {type:blob.type,size:blob.size};
  });expect(fallback.type).toBe('image/png');expect(fallback.size).toBeGreaterThan(10000);
});
