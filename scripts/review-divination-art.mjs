import {chromium} from '@playwright/test';
import {mkdir,writeFile,copyFile,readdir,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {divinationEffects} from '../src/components/divinationTimeline.js';
const args=Object.fromEntries(process.argv.slice(2).map(s=>s.replace(/^--/,'').split('=')));
const phase=args.phase||'after',root='.verification/divination-art-v3',out=`${root}/${phase}`;
const types=(args.effects||Object.keys(divinationEffects).join(',')).split(',');
const devices=(args.devices||'desktop,mobile').split(',');
await mkdir(out,{recursive:true});
if(phase==='baseline'){
 await mkdir(`${out}/source`,{recursive:true});
 for(const f of ['WaterScene.js','divinationTimeline.js'])await copyFile(`src/components/${f}`,`${out}/source/${f}`);
 const hashes={};for(const f of await readdir('public/assets/divination'))hashes[f]=createHash('sha256').update(await readFile(`public/assets/divination/${f}`)).digest('hex');
 await writeFile(`${out}/asset-hashes.json`,JSON.stringify(hashes,null,2));
}
const browser=await chromium.launch(process.platform==='win32'?{channel:'chrome'}:{}),records=[];
try{
 for(const device of devices)for(const type of types){
  const viewport=device==='desktop'?{width:1440,height:900}:{width:390,height:844};
  const context=await browser.newContext({viewport,locale:'it-IT',isMobile:device!=='desktop',hasTouch:device!=='desktop',recordVideo:{dir:out,size:viewport}});
  const page=await context.newPage(),errors=[];
  if(device==='mobile'&&Number(args.throttle)>1){const session=await context.newCDPSession(page);await session.send('Emulation.setCPUThrottlingRate',{rate:Number(args.throttle)});}
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto('http://127.0.0.1:5173/review/divination.html');await page.locator('.water-effects[data-ready=true]').waitFor();await page.locator('.hands-motion[data-ready=true]').waitFor();
  await page.addStyleTag({content:'.review-controls{visibility:hidden}'});
  await page.evaluate(type=>{document.querySelector('[data-view]').value='scene';document.querySelector('[data-type]').value=type;window.divinationReview.play();window.divinationReview.water.pause();},type);
  await page.waitForTimeout(1250);
  const frames=[];
  for(const fraction of [0,.25,.5,.75,1]){
   const data=await page.evaluate(fraction=>{
    const w=window.divinationReview.water,t=performance.now();w.seek(w.getState().duration*fraction);const drawMs=performance.now()-t;
    const water=document.querySelector('.water-effects'),source=document.querySelector('.glass-plate');
    const c=Object.assign(document.createElement('canvas'),{width:600,height:860}),ctx=c.getContext('2d');
    for(const image of [source,water])ctx.drawImage(image,620,570,300,430,0,0,600,860);
    const r=water.getBoundingClientRect(),b=document.querySelector('.speech-bubble').getBoundingClientRect();
    return {png:c.toDataURL().split(',')[1],overlay:water.toDataURL().split(',')[1],state:w.getState(),drawMs,registered:JSON.stringify(r.toJSON())===JSON.stringify(source.getBoundingClientRect().toJSON()),covered:b.left<r.x+r.width/2&&b.right>r.x+r.width/2&&b.top<r.y+Number(water.dataset.surfaceY)/1024*r.height&&b.bottom>r.y+Number(water.dataset.surfaceY)/1024*r.height};
   },fraction);
   const tag=String(fraction*100).padStart(3,'0');
   await page.screenshot({path:`${out}/${device}-${type}-${tag}.png`});
   await writeFile(`${out}/${device}-${type}-${tag}-detail.png`,Buffer.from(data.png,'base64'));
   await writeFile(`${out}/${device}-${type}-${tag}-overlay.png`,Buffer.from(data.overlay,'base64'));
   const {png,overlay,...metrics}=data;frames.push({fraction,...metrics,sha256:createHash('sha256').update(Buffer.from(overlay,'base64')).digest('hex')});
  }
  await page.evaluate(()=>{window.artFrames=[];window.artCosts=[];window.artWatch=true;let last=performance.now();function monitor(t){if(!window.artWatch)return;window.artFrames.push(t-last);window.artCosts.push(Number(document.querySelector('.water-effects').dataset.renderMs));last=t;requestAnimationFrame(monitor);}requestAnimationFrame(monitor);window.divinationReview.play();});
  await page.waitForFunction(()=>window.divinationReview.water.getState().progress===1,null,{timeout:20000});
  await page.waitForTimeout(300);
  const cadence=await page.evaluate(()=>{window.artWatch=false;const a=window.artFrames.filter(x=>x>0).sort((a,b)=>a-b),cost=window.artCosts.filter(Number.isFinite).sort((a,b)=>a-b);return {frames:a.length,medianMs:a[Math.floor(a.length*.5)],p95Ms:a[Math.floor(a.length*.95)],renderP95Ms:cost[Math.floor(cost.length*.95)]};});
  const final=await page.locator('.water-effects').evaluate(c=>c.toDataURL());
  await page.evaluate(()=>{document.querySelector('[data-view]').value='result';document.querySelector('[data-view]').dispatchEvent(new Event('change'));});
  await page.screenshot({path:`${out}/${device}-${type}-result.png`});
  const persistent=await page.locator('.water-effects').evaluate((c,f)=>c.toDataURL()===f,final);
  const video=page.video();await context.close();await video.saveAs(`${out}/${device}-${type}.webm`);
  records.push({device,type,frames,cadence,persistent,errors});
  await writeFile(`${out}/report.json`,JSON.stringify(records,null,2));console.log(`${phase}: ${device} ${type}; p95=${cadence.p95Ms?.toFixed(1)} ms; persistent=${persistent}`);
 }
}finally{await browser.close();}
if(records.some(r=>r.errors.length||!r.persistent||r.frames.some(f=>!f.registered||f.covered)))process.exitCode=1;
