import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
const phase=process.argv.find(a=>a.startsWith('--phase='))?.slice(8)||'final';
const directory=`.verification/v4/${phase}`;await mkdir(directory,{recursive:true});
const browser=await chromium.launch(process.platform==='win32'?{channel:'chrome'}:{}),records=[];
try{
 for(const device of ['desktop','mobile']){
  const context=await browser.newContext({viewport:device==='mobile'?{width:390,height:844}:{width:1440,height:900},isMobile:device==='mobile',hasTouch:device==='mobile',locale:'it-IT',recordVideo:{dir:`${directory}/videos`,size:device==='mobile'?{width:390,height:844}:{width:960,height:600}}});
  const page=await context.newPage();
  for(const type of ['enhancement','emission','transmutation','conjuration','manipulation','specialization']){
   await page.goto(`http://127.0.0.1:5173/review/divination.html?type=${type}`);await page.waitForFunction(()=>window.divinationReview?.water.getState().ready);
   await page.evaluate(()=>{const {water}=window.divinationReview;water.pause();water.seek(0);});
   for(const p of [0,.5,1]){
    await page.evaluate(p=>{const w=window.divinationReview.water;w.seek(w.getState().duration*p);},p);
    await page.screenshot({path:`${directory}/${device}-${type}-${Math.round(p*100)}.png`});
    const state=await page.evaluate(()=>window.divinationReview.water.getState());records.push({device,type,p,...state});
   }
   if(type==='enhancement'){
    await page.locator('[data-detail]').check();await page.locator('.review-detail').screenshot({path:`${directory}/${device}-enhancement-detail.png`});
   }
   if(phase==='final'){
    await page.locator('[data-play]').click();await page.waitForTimeout(type==='specialization'?7900:6500);
    await page.goto(`http://127.0.0.1:5173/review/results.html?type=${type}`);await page.waitForFunction(()=>window.resultsReview);
    await page.locator('.wing-sprite[data-pose=smile][data-ready=true]').waitFor();
    await page.locator('.character-card:visible img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(()=>{}))));
    await page.locator('.result-review-controls').evaluate(el=>el.hidden=true);
    await page.screenshot({path:`${directory}/${device}-${type}-result.png`,fullPage:true});
    await page.locator('.scene').screenshot({path:`${directory}/${device}-${type}-scene.png`});
   }
  }
  await context.close();console.log(`${phase}: ${device} captured`);
 }
 await writeFile(`${directory}/frames.json`,JSON.stringify(records,null,2));
}finally{await browser.close();}
