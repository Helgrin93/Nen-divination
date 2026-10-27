import { chromium,webkit } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
const output='.verification/divination';
await mkdir(output,{recursive:true});
const report=[];
for(const [name,engine,viewport] of [
  ['desktop',chromium,{width:1440,height:900}],
  ['mobile',chromium,{width:390,height:844}],
  ['small-mobile',chromium,{width:320,height:568}],
  ['tablet',chromium,{width:768,height:1024}],
  ['webkit',webkit,{width:390,height:844}],
]){
  const browser=await engine.launch(engine===chromium&&process.platform==='win32'?{channel:'chrome'}:{});
  const page=await browser.newPage({viewport,locale:'it-IT',isMobile:name!=='desktop',hasTouch:name!=='desktop',recordVideo:{dir:output,size:viewport}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.clock.install({time:new Date('2026-10-27T12:00:00Z')});
  await page.clock.pauseAt(new Date('2026-10-27T12:00:01Z'));
  await page.goto('http://127.0.0.1:5173/review/divination.html');
  await page.locator('.hands-motion[data-ready=true]').waitFor();
  await page.locator('.water-effects[data-ready=true]').waitFor();
  await page.locator('[data-rest]').click();await page.clock.runFor(1100);
  await page.screenshot({path:`${output}/${name}-rest.png`});
  await page.locator('[data-restart]').click();await page.clock.runFor(1250);
  await page.screenshot({path:`${output}/${name}-approach.png`});
  const hold=page.locator('.hold-button');await hold.focus();await page.keyboard.down('Space');
  await page.clock.runFor(1600);await page.screenshot({path:`${output}/${name}-hold-early.png`});
  const early=Number(await page.locator('.water-effects').getAttribute('data-concentration'));
  await page.clock.runFor(2500);await page.screenshot({path:`${output}/${name}-hold-late.png`});
  const late=Number(await page.locator('.water-effects').getAttribute('data-concentration'));
  await page.clock.runFor(550);await page.keyboard.up('Space');
  await page.clock.runFor(1350);await page.screenshot({path:`${output}/${name}-rise.png`});
  await page.clock.runFor(2600);await page.screenshot({path:`${output}/${name}-overflow.png`});
  if(name==='desktop'){
    const raw=await page.locator('.water-effects').evaluate(c=>c.toDataURL().split(',')[1]);
    await writeFile(`${output}/water-detail.png`,Buffer.from(raw,'base64'));
  }
  const metrics=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth>innerWidth,
    surfaceY:Number(document.querySelector('.water-effects').dataset.surfaceY),
    handPose:document.querySelector('.hands-motion').dataset.pose,
    effect:document.querySelector('.water-effects').dataset.renderedEffect,
  }));
  report.push({name,early,late,...metrics,errors});
  const video=page.video();await page.close();await video.saveAs(`${output}/${name}.webm`);await browser.close();
}
await writeFile(`${output}/report.json`,JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
