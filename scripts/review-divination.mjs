import { chromium,webkit } from '@playwright/test';
import { mkdir,writeFile } from 'node:fs/promises';
import { divinationEffects } from '../src/components/divinationTimeline.js';
const output='.verification/divination-v3',origin=process.env.DIVINATION_AUDIT_URL||'http://127.0.0.1:5173';
await mkdir(output,{recursive:true});
const report=[];
for(const [name,engine,viewport] of [
 ['desktop',chromium,{width:1440,height:900}],['mobile',chromium,{width:390,height:844}],
 ['small-mobile',chromium,{width:320,height:568}],['tablet',chromium,{width:768,height:1024}],['webkit',webkit,{width:390,height:844}],
]){
 const browser=await engine.launch(engine===chromium&&process.platform==='win32'?{channel:'chrome'}:{});
 try{
  // Real-time recording: the screenshots below also include deterministic
  // start/middle/end samples, but the video never accelerates its clock.
  const context=await browser.newContext({viewport,locale:'it-IT',isMobile:name!=='desktop',hasTouch:name!=='desktop',recordVideo:{dir:output,size:viewport}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(r.url()));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(origin+'/review/divination.html');await page.locator('.water-effects[data-ready=true]').waitFor();await page.locator('.hands-motion[data-ready=true]').waitFor();
  // Keep development controls out of the captured artwork without changing
  // the actual scene, camera, hands, animation or result styles.
  await page.addStyleTag({content:'.review-controls{visibility:hidden}'});
  async function captureDetail(type,stage){
   const png=await page.evaluate(()=>{const c=Object.assign(document.createElement('canvas'),{width:540,height:860}),ctx=c.getContext('2d');for(const source of [document.querySelector('.glass-plate'),document.querySelector('.water-effects')])ctx.drawImage(source,630,570,270,430,0,0,540,860);return c.toDataURL().split(',')[1];});
   await writeFile(`${output}/${name}-${type}-${stage}-detail.png`,Buffer.from(png,'base64'));
  }
  for(const [type,spec] of Object.entries(divinationEffects)){
   await page.evaluate(type=>{document.querySelector('[data-view]').value='scene';document.querySelector('[data-type]').value=type;window.divinationReview.play();window.divinationReview.water.pause();window.divinationReview.water.seek(0);},type);
   await page.screenshot({path:`${output}/${name}-${type}-start.png`});
   await captureDetail(type,'start');
   await page.evaluate(()=>window.divinationReview.water.resume());
   await page.waitForTimeout(spec.duration/2);
   await page.screenshot({path:`${output}/${name}-${type}-middle.png`});
   await captureDetail(type,'middle');
   await page.waitForFunction(()=>window.divinationReview.water.getState().progress===1,{},{timeout:12000});
   await page.screenshot({path:`${output}/${name}-${type}-end.png`});
   await captureDetail(type,'end');
   // Full-resolution composited detail is useful on small mobile displays.
   const detail=await page.evaluate(()=>{const c=Object.assign(document.createElement('canvas'),{width:540,height:860}),ctx=c.getContext('2d');for(const source of [document.querySelector('.glass-plate'),document.querySelector('.water-effects')])ctx.drawImage(source,630,570,270,430,0,0,540,860);return c.toDataURL().split(',')[1];});
   await writeFile(`${output}/${name}-${type}-detail.png`,Buffer.from(detail,'base64'));
   const before=await page.locator('.water-effects').evaluate(c=>c.toDataURL());
   const metrics=await page.evaluate(()=>{
    const c=document.querySelector('.water-effects'),im=document.querySelector('.glass-plate'),r=c.getBoundingClientRect(),bubble=document.querySelector('.speech-bubble').getBoundingClientRect();
    const x=r.x+r.width/2,y=r.y+Number(c.dataset.surfaceY)/c.height*r.height;
    return {overflow:document.documentElement.scrollWidth>innerWidth,registered:JSON.stringify(r.toJSON())===JSON.stringify(im.getBoundingClientRect().toJSON()),waterCovered:x>=bubble.left&&x<=bubble.right&&y>=bubble.top&&y<=bubble.bottom,state:window.divinationReview.water.getState()};
   });
   await page.evaluate(()=>{document.querySelector('[data-view]').value='result';document.querySelector('[data-view]').dispatchEvent(new Event('change'));});
   await page.screenshot({path:`${output}/${name}-${type}-result.png`});
   const persistent=await page.locator('.water-effects').evaluate((c,before)=>c.toDataURL()===before,before);
   report.push({name,type,...metrics,persistent,errors:[...errors]});
   console.log(`${name}: ${type} complete, registered=${metrics.registered}, persistent=${persistent}`);
  }
  const video=page.video();await context.close();await video.saveAs(`${output}/${name}-six-effects.webm`);
 }finally{await browser.close();}
 await writeFile(`${output}/report.json`,JSON.stringify(report,null,2));
}
if(report.some(r=>r.errors.length||r.overflow||!r.registered||!r.persistent||r.waterCovered))process.exitCode=1;
console.log(`Saved ${report.length} effect/device records, start/middle/end/result screenshots, details and real-time video in ${output}.`);
