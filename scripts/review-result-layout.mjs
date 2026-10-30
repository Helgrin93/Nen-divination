import {finishDialogue,finishRevelation} from '../e2e/helpers/dialogue.js';
import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {questions} from '../src/data/questions.js';
const args=Object.fromEntries(process.argv.slice(2).map(s=>s.replace(/^--/,'').split('=')));
const root=`.verification/result-redesign/${args.phase||'after'}`;await mkdir(root,{recursive:true});
const browser=await chromium.launch(process.platform==='win32'?{channel:'chrome'}:{}),records=[];
try{for(const device of (args.devices||'desktop,mobile').split(','))for(const type of (args.types||'conjuration').split(',')){
 const page=await browser.newPage({viewport:device==='desktop'?{width:1440,height:1000}:{width:390,height:844},locale:'it-IT',reducedMotion:'reduce'});
 await page.addInitScript(()=>{let seed=56;Math.random=()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};});
 await page.goto('http://127.0.0.1:5173');await page.locator('.water-effects[data-ready=true]').waitFor();await page.locator('.hands-motion[data-ready=true]').waitFor();
 await page.getByRole('button',{name:'Inizia',exact:true}).click();
 for(let n=0;n<9;n++){
  await finishDialogue(page);
  if(await page.locator('.hold-button').count())break;
  const ids=await page.locator('.answer').evaluateAll(nodes=>nodes.map(n=>n.dataset.option)),q=questions.find(q=>q.options.some(o=>o.id===ids[0]));
  const best=[...q.options].sort((a,b)=>b.weights[type]-a.weights[type])[0];await page.locator(`[data-option="${best.id}"]`).click();await page.getByRole('button',{name:'Continua',exact:true}).click();
 }
 await finishDialogue(page);await page.getByRole('button',{name:'Rivela senza tenere premuto'}).click();await finishRevelation(page);await page.locator('.nen-title').waitFor();
 await page.locator('.wing-sprite[data-pose=smile][data-ready=true]').waitFor();await page.waitForTimeout(450);
 const upper=await page.locator('.scene').screenshot({path:`${root}/${device}-${type}-scene.png`});
 const pixels=await page.locator('.water-effects').evaluate(c=>c.toDataURL());
 for(const lang of ['it','en']){
  await page.getByRole('button',{name:lang==='it'?'Italiano':'English',exact:true}).click();await page.locator('.result-view').waitFor();
  await page.locator('.characters').scrollIntoViewIfNeeded();
  await page.locator('.character-portrait img').evaluateAll(imgs=>Promise.all(imgs.map(img=>img.decode().catch(()=>{}))));
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:`${root}/${device}-${type}-${lang}.png`,fullPage:true});
  const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,title:document.querySelector('.nen-title').textContent,images:[...document.querySelectorAll('.character-portrait img')].map(img=>({src:img.getAttribute('src'),loaded:img.complete&&img.naturalWidth>0})),scene:document.querySelector('.scene').getBoundingClientRect().toJSON()}));
  records.push({device,type,lang,...metrics,upperSha256:createHash('sha256').update(upper).digest('hex'),waterSha256:createHash('sha256').update(pixels).digest('hex')});
 }
 await page.close();console.log(`${device}: ${type}`);
}await writeFile(`${root}/report.json`,JSON.stringify(records,null,2));}finally{await browser.close();}
