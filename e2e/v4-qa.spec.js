import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {createAttempt,selectAnswer,advance} from '../src/game/stateMachine.js';
import {seededRandom} from '../src/game/questionPicker.js';
import {finishDialogue} from './helpers/dialogue.js';

function plan(length){
 for(let seed=1;seed<500;seed++){
  const state=createAttempt(seededRandom(seed)),steps=[];state.phase='quiz';
  while(['quiz','bonus'].includes(state.phase)){state.pause=false;const q=state.questions[state.index];steps.push(q.options[0].id);selectAnswer(state,q.options[0].id);advance(state);}
  if(steps.length===length)return {seed,steps};
 }throw Error('No bonus fixture found');
}

for(const count of [8,9])test(`${count}-question bonus path separates explanations in both languages and resets hold on a hidden tab`,async({page},info)=>{
  await mkdir('.verification/v4/qa',{recursive:true});
  const fixture=plan(count);
  await page.clock.install();
  await page.addInitScript(seed=>{Math.random=()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};},fixture.seed);
  await page.goto('/');await page.locator('.water-effects[data-ready=true]').waitFor();await page.locator('[data-action=begin]').click();
  for(let i=0;i<count;i++){
    if(await page.locator('[data-dialogue=short]').count()){
      if(i===4)await page.screenshot({path:`.verification/v4/qa/${info.project.name}-interlude.png`});
      await page.clock.fastForward(3100);
    }
    if(i>=7){
      await expect(page.locator('.interlude')).toHaveAttribute('data-kind','bonus'+(i+1));
      await page.locator('[data-lang=en]').click();await expect(page.locator('.interlude')).toHaveAttribute('data-dialogue','important');
      await page.screenshot({path:`.verification/v4/qa/${info.project.name}-bonus${i+1}.png`});
      await page.locator('[data-lang=it]').click();
    }
    await finishDialogue(page);await expect(page.locator('.bonus-dialogue,.wing-reaction')).toHaveCount(0);
    await page.locator(`[data-option="${fixture.steps[i]}"]`).click();await page.locator('[data-action=next]').click();
  }
  await finishDialogue(page);await page.clock.runFor(1200);
  const button=page.locator('.hold-button');await expect(button).toBeInViewport();await button.focus();await page.keyboard.down('Space');await page.clock.runFor(2250);
  const value=Number(await page.locator('.hold-progress').getAttribute('aria-valuenow'));expect(value).toBeGreaterThan(40);expect(value).toBeLessThan(60);
  await page.screenshot({path:`.verification/v4/qa/${info.project.name}-concentration.png`});
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});await page.keyboard.up('Space');
  await expect(page.locator('.hold-progress')).toHaveAttribute('aria-valuenow','0');await expect(page.locator('body')).toHaveAttribute('data-phase','concentration');
});

test('all six effects stay registered after scrolling, resize and DPR changes; compositor timing is recorded',async({browser},info)=>{
 test.skip(info.project.name!=='desktop','Three explicit device-scale contexts are exercised once.');
 const records=[];
 for(const dpr of [1,2,3]){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:dpr,isMobile:true,hasTouch:true}),page=await context.newPage();
  const session=await context.newCDPSession(page);await session.send('Emulation.setCPUThrottlingRate',{rate:4});
  await page.goto('/review/divination.html');await page.locator('.water-effects[data-ready=true]').waitFor();
  for(const effect of ['enhancement','emission','transmutation','conjuration','manipulation','specialization']){
    const samples=await page.evaluate(effect=>{
      const w=window.divinationReview.water;w.setEffect(effect,{restart:true});w.pause();const samples=[];
      for(let i=1;i<=24;i++){w.seek(w.getState().duration*i/24);samples.push(Number(document.querySelector('.water-effects').dataset.renderMs));}return samples;
    },effect);
    await page.setViewportSize({width:430,height:932});await page.evaluate(()=>scrollTo(0,150));
    const registration=await page.evaluate(()=>{const c=document.querySelector('.water-effects').getBoundingClientRect(),image=document.querySelector('.glass-plate').getBoundingClientRect();return {x:c.x-image.x,y:c.y-image.y,width:c.width-image.width,height:c.height-image.height};});
    expect(Object.values(registration).every(value=>Math.abs(value)<.01)).toBe(true);
    samples.sort((a,b)=>a-b);records.push({dpr,effect,cpuThrottle:4,drawP95:samples[Math.floor(samples.length*.95)],max:samples.at(-1)});
    await page.setViewportSize({width:390,height:844});
  }
  await context.close();
 }
 await writeFile('.verification/v4/performance.json',JSON.stringify(records,null,2));
});
