import {chromium,webkit} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';

const phase=process.argv.includes('--before')?'before':'after';
const root=`docs/v4-microfix/${phase}`;
await mkdir(root,{recursive:true});
const records=[];
for(const [name,engine,viewport] of [
  ['desktop',chromium,{width:1440,height:900}],
  ['iphone',webkit,{width:390,height:844}],
  ['iphone-small',webkit,{width:320,height:568}],
  ['android',chromium,{width:412,height:915}],
]){
  const browser=await engine.launch(engine===chromium&&process.platform==='win32'?{channel:'chrome'}:{});
  try{
    const page=await browser.newPage({viewport,isMobile:name!=='desktop',hasTouch:name!=='desktop',locale:'it-IT'});
    await page.addInitScript(()=>{
      let seed=56;
      Math.random=()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};
    });
    await page.goto('http://127.0.0.1:5173/');
    await page.locator('.water-effects[data-ready=true]').waitFor();
    await page.waitForFunction(()=>[...document.querySelectorAll('.wing-sprite')].every(img=>img.dataset.ready==='true'));
    await page.screenshot({path:`${root}/${name}-intro.png`});
    await page.locator('[data-action=begin]').click();
    await page.screenshot({path:`${root}/${name}-quiz.png`});
    records.push({name,viewport,...await page.evaluate(()=>{
      const box=selector=>{const {x,y,width,height,bottom}=document.querySelector(selector).getBoundingClientRect();return{x,y,width,height,bottom};};
      return{stage:box('.unified-stage'),bubble:box('.speech-bubble'),answers:box('.answers'),navigation:box('.question-navigation'),scrollHeight:document.querySelector('.answers').scrollHeight};
    })});
    await page.locator('.answer').last().scrollIntoViewIfNeeded();
    await page.screenshot({path:`${root}/${name}-last-answer.png`});
    await page.locator('#content').evaluate(el=>el.style.visibility='hidden');
    await page.locator('.scene').screenshot({path:`${root}/${name}-scene.png`});
    if(phase==='after'){
      await page.locator('#content').evaluate(el=>el.style.visibility='visible');
      if(name!=='desktop'){
        await page.setViewportSize({width:viewport.width,height:viewport.height-100});
        await page.screenshot({path:`${root}/${name}-browser-bars.png`});
        await page.setViewportSize(viewport);
      }
      for(let n=0;n<10;n++){
        if(await page.locator('[data-dialogue=short]').count()){
          await page.screenshot({path:`${root}/${name}-interlude.png`,animations:'disabled'});
          await page.locator('[data-dialogue=short]').waitFor({state:'detached',timeout:5000});
        }
        if(await page.locator('[data-dialogue=important]').count())await page.locator('[data-action=resume]').click();
        if(await page.locator('.hold-button').count())break;
        await page.locator('.answer').first().click();
        await page.locator('[data-action=next]').click();
      }
      await page.screenshot({path:`${root}/${name}-concentration.png`});
      await page.emulateMedia({reducedMotion:'reduce'});
      await page.locator('[data-action=reveal]').click();
      await page.locator('[data-kind=revealed]').waitFor();
      await page.screenshot({path:`${root}/${name}-conclusion-it.png`,animations:'disabled'});
      await page.locator('[data-lang=en]').click();
      await page.screenshot({path:`${root}/${name}-conclusion-en.png`,animations:'disabled'});
      await page.locator('[data-action=resume]').click();
      await page.screenshot({path:`${root}/${name}-result.png`,fullPage:true});
    }
    console.log(`${phase}: ${name}`);
  }finally{await browser.close();}
}
await writeFile(`${root}/geometry.json`,JSON.stringify(records,null,2));
