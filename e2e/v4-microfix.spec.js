import {test,expect} from '@playwright/test';
import {questions} from '../src/data/questions.js';

async function geometry(page){
  return page.evaluate(()=>{
    const box=selector=>document.querySelector(selector).getBoundingClientRect().toJSON();
    const stage=box('.unified-stage'),bubble=box('.speech-bubble');
    const tail=parseFloat(getComputedStyle(document.querySelector('.speech-bubble'),'::before').height);
    return{stage,bubble,tail,answers:box('.answers'),navigation:box('.question-navigation'),
      overflow:document.documentElement.scrollWidth>innerWidth,scroll:document.querySelector('.answers').scrollTop};
  });
}

test('dialogue clears Wing and the glass; every answer clears navigation through viewport and safe-area changes',async({page},info)=>{
  const mobile=info.project.use.viewport.width<=700;
  await page.goto('/');
  await page.locator('.water-effects[data-ready=true]').waitFor();
  const start=await page.locator('[data-action=begin]').boundingBox();
  expect(Math.abs(start.x+start.width/2-info.project.use.viewport.width/2)).toBeLessThan(1);
  await page.locator('[data-action=begin]').click();
  const original=await page.locator('.unified-stage').boundingBox();
  const heights=mobile?[info.project.use.viewport.height,info.project.use.viewport.height-100,info.project.use.viewport.height]:[info.project.use.viewport.height];
  for(const height of heights){
    await page.setViewportSize({width:info.project.use.viewport.width,height});
    // Native env(safe-area-inset-bottom) is zero in desktop emulation. Exercise
    // the same reserved-space variable with a 34px iPhone inset as well.
    if(mobile)await page.locator('.scene').evaluate(el=>el.style.setProperty('--scene-safe-bottom','34px'));
    for(const language of ['it','en']){
      await page.locator(`[data-lang=${language}]`).click();
      const longest=questions.flatMap(q=>q.options.map(option=>option[language])).sort((a,b)=>b.length-a.length)[0];
      await page.locator('.answer>span:last-child').evaluateAll((nodes,text)=>nodes.forEach(node=>node.textContent=text),longest);
      const g=await geometry(page);
      expect(g.overflow).toBe(false);
      if(mobile){
        expect(g.bubble.y-g.tail).toBeGreaterThan(g.stage.y+g.stage.width*.233);
        expect(g.bubble.bottom).toBeLessThan(g.stage.y+g.stage.width*.383);
        expect(g.answers.bottom+6).toBeLessThanOrEqual(g.navigation.y);
        expect(g.navigation.bottom+34).toBeLessThanOrEqual(height);
      }
      for(let i=0;i<4;i++){
        const answer=page.locator('.answer').nth(i);
        await answer.scrollIntoViewIfNeeded();
        const a=await answer.boundingBox(),nav=await page.locator('.question-navigation').boundingBox();
        expect(a.y+a.height).toBeLessThanOrEqual(nav.y);
        if(mobile){
          const area=await page.locator('.answers').boundingBox();
          expect(a.y).toBeGreaterThanOrEqual(area.y-1);
          expect(a.y+a.height).toBeLessThanOrEqual(area.y+area.height+1);
        }
        await answer.click();await expect(answer).toHaveAttribute('aria-pressed','true');
      }
    }
  }
  const current=await page.locator('.unified-stage').boundingBox();
  expect(current).toEqual(original);
  await page.locator('[data-action=next]').click();
  expect((await geometry(page)).scroll).toBe(0);
  await page.locator('[data-action=back]').click();
  expect((await geometry(page)).scroll).toBe(0);
  await expect(page.locator('.answer').last()).toHaveAttribute('aria-pressed','true');
});

test('question and important dialogue remain fully readable by scrolling on a short screen',async({page},info)=>{
  test.skip(info.project.use.viewport.width>700,'Short mobile reading area');
  await page.goto('/');
  const intro=page.locator('.intro-card h1');
  await intro.evaluate(el=>el.scrollTop=el.scrollHeight);
  expect(await intro.evaluate(el=>el.scrollTop+el.clientHeight>=el.scrollHeight-1)).toBe(true);
  await page.locator('[data-action=begin]').click();
  await page.locator('.question-title').evaluate(el=>el.textContent='Una domanda molto lunga per verificare che ogni riga rimanga leggibile con lo scroll interno della vignetta, anche quando le barre del browser riducono lo spazio disponibile sullo schermo.');
  const scroll=page.locator('.bubble-scroll');
  await scroll.focus();await scroll.evaluate(el=>el.scrollTop=el.scrollHeight);
  expect(await scroll.evaluate(el=>el.scrollTop+el.clientHeight>=el.scrollHeight-1)).toBe(true);
  await expect(page.locator('.answer')).toHaveCount(4);
});
