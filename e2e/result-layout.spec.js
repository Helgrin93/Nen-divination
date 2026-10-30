import {finishDialogue,finishRevelation} from './helpers/dialogue.js';
import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {questions,types} from '../src/data/questions.js';
import {evaluate} from '../src/game/scoring.js';
import {characters} from '../src/data/characters.js';
import {resultPresentation,resultRadarOrder} from '../src/data/resultPresentation.js';
import {translations} from '../src/data/translations.js';

for(const type of types)test(`${type}: real quiz result, bilingual panels, portraits, save and share`,async({page},testInfo)=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(()=>{let seed=56;Math.random=()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');await expect(page.locator('.water-effects')).toHaveAttribute('data-ready','true');
  await page.locator('.scene').evaluate(el=>{window.resultScene=el;window.resultCanvas=el.querySelector('.water-effects');window.resultHands=el.querySelector('.hands-motion');});
  await page.getByRole('button',{name:'Inizia',exact:true}).click();
  const used=[],answers={};
  for(let n=0;n<9;n++){
    await finishDialogue(page);
    if(await page.locator('.hold-button').count())break;
    const ids=await page.locator('.answer').evaluateAll(nodes=>nodes.map(n=>n.dataset.option));
    const q=questions.find(q=>q.options.some(o=>o.id===ids[0])),best=[...q.options].sort((a,b)=>b.weights[type]-a.weights[type])[0];
    used.push(q);answers[q.id]=best.id;
    await page.locator(`[data-option="${best.id}"]`).click();await page.getByRole('button',{name:'Continua',exact:true}).click();
  }
  const expected=evaluate(used,answers);expect(expected.primary).toBe(type);
  await page.getByRole('button',{name:'Rivela senza tenere premuto'}).click();await finishRevelation(page);
  const view=page.locator('.result-view');await expect(view).toHaveAttribute('data-result-type',type);
  await expect(page.locator('.water-effects')).toHaveAttribute('data-effect-progress','1');
  const sceneBefore=await page.locator('.scene').evaluate(el=>({html:el.innerHTML,water:el.querySelector('.water-effects').toDataURL(),hands:el.querySelector('.hands-motion').toDataURL(),box:el.getBoundingClientRect().toJSON()}));
  for(const lang of ['it','en']){
    await page.getByRole('button',{name:lang==='it'?'Italiano':'English',exact:true}).click();
    await expect(page.locator('.power-card .eyebrow')).toHaveText(translations[lang].power);
    await expect(page.locator('.power-description')).toHaveText(resultPresentation[type].ability[lang]);
    await expect(page.locator('.affinity-card h2')).toHaveText(new RegExp(expected.secondary,'i'));
    await expect(page.locator('.affinity-description')).toHaveText(resultPresentation[expected.secondary].secondary[lang]);
    await expect(page.locator('.characters h2')).toHaveText(translations[lang].characters);
    const axes=await page.locator('.radar-axis').evaluateAll(nodes=>nodes.map(el=>({type:el.dataset.nen,value:Number(el.dataset.value),colour:el.querySelector('text').getAttribute('fill')})));
    expect(axes).toEqual(resultRadarOrder.map(id=>({type:id,value:expected.radar[id],colour:resultPresentation[id].colour})));
    const actualCharacters=await page.locator('.character-card').evaluateAll(nodes=>nodes.map(el=>({slug:el.dataset.character,malId:Number(el.dataset.malId),name:el.querySelector('h3').textContent})));
    expect(actualCharacters).toEqual(characters.filter(c=>c.nenType===type).map(c=>({slug:c.slug,malId:c.image.malId,name:c.name})));
    await page.locator('.characters').scrollIntoViewIfNeeded();
    await page.locator('.character-portrait img').evaluateAll(images=>Promise.all(images.map(img=>img.decode())));
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    expect(await page.locator('.character-portrait img').evaluateAll(images=>images.length===3&&images.every(img=>img.naturalWidth===225&&img.naturalHeight===350))).toBe(true);
    const geometry=await view.evaluate(el=>{
      const main=el.querySelector('.result-main').getBoundingClientRect(),power=el.querySelector('.power-card').getBoundingClientRect(),affinity=el.querySelector('.affinity-card').getBoundingClientRect(),scene=document.querySelector('.scene').getBoundingClientRect(),title=el.querySelector('.nen-title');
      return{overflow:document.documentElement.scrollWidth>innerWidth,titleFits:title.scrollWidth<=title.clientWidth,belowScene:main.top>=scene.bottom-1,desktopCards:Math.abs(power.top-affinity.top)<1,stackedCards:affinity.top>=power.bottom,sceneStable:window.resultScene===document.querySelector('.scene')&&window.resultCanvas===document.querySelector('.water-effects')&&window.resultHands===document.querySelector('.hands-motion')};
    });
    expect(geometry).toMatchObject({overflow:false,titleFits:true,belowScene:true,sceneStable:true});
    expect(page.viewportSize().width>700?geometry.desktopCards:geometry.stackedCards).toBe(true);
    expect(await page.locator('.water-effects').evaluate(c=>c.toDataURL())).toBe(sceneBefore.water);
    expect(await page.locator('.hands-motion').evaluate(c=>c.toDataURL())).toBe(sceneBefore.hands);
    expect(await page.locator('.scene').evaluate(el=>el.getBoundingClientRect().toJSON())).toEqual(sceneBefore.box);
    await page.screenshot({path:`.verification/result-redesign/e2e/${testInfo.project.name}-${type}-${lang}.png`,fullPage:true});
  }
  const download=page.waitForEvent('download');await page.getByRole('button',{name:'Save result',exact:true}).click();
  const file=await download;expect(file.suggestedFilename()).toBe(`nen-divination-${type}.png`);
  const path=await file.path(),png=await readFile(path);expect(png.readUInt32BE(16)).toBe(1080);expect(png.readUInt32BE(20)).toBe(1350);
  await page.evaluate(()=>{window.nativeShared=false;Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.nativeShared=data.files.length===1&&data.files[0].type==='image/png';}});});
  await page.getByRole('button',{name:'Share',exact:true}).click();await expect.poll(()=>page.evaluate(()=>window.nativeShared)).toBe(true);
  await page.evaluate(()=>{Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false});});
  const fallback=page.waitForEvent('download');await page.getByRole('button',{name:'Share',exact:true}).click();expect((await fallback).suggestedFilename()).toBe(`nen-divination-${type}.png`);
  expect(errors).toEqual([]);
});
