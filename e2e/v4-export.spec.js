import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

test('Story exports exactly three stable characters, includes authorized CORS portraits and survives denied images/share',async({page})=>{
  let denied=false;
  await page.route('https://portrait-test.example/**',async route=>{
    if(denied){await route.fulfill({status:403,body:'Denied'});return;}
    const slug=new URL(route.request().url()).pathname.slice(1).replace('.jpg','');
    await route.fulfill({status:200,contentType:'image/jpeg',headers:{'Access-Control-Allow-Origin':'*'},body:await readFile(`public/assets/characters/${slug}.jpg`)});
  });
  await page.goto('/review/results.html?type=specialization');await page.waitForFunction(()=>window.resultsReview);
  await page.locator('[data-action=characters]').click();await expect(page.locator('.character-card:visible')).toHaveCount(5);
  const exported=await page.evaluate(async()=>{
    const {charactersFor}=await import('/src/data/characters.js'),{createShareCard}=await import('/src/game/share.js'),three=charactersFor('specialization').slice(0,3);
    const original=CanvasRenderingContext2D.prototype.drawImage,fill=CanvasRenderingContext2D.prototype.fillText;
    window.exportedPortraitCount=0;window.exportedText=[];
    CanvasRenderingContext2D.prototype.drawImage=function(...args){if(args[0]?.naturalWidth===225&&args[0]?.naturalHeight===350)window.exportedPortraitCount++;return original.apply(this,args);};
    CanvasRenderingContext2D.prototype.fillText=function(...args){window.exportedText.push(args[0]);return fill.apply(this,args);};
    for(const c of three){c.permissionStatus='authorized';c.portraitSrc='https://portrait-test.example/'+c.slug+'.jpg';}
    const blob=await createShareCard(window.resultsReview.samples.specialization,'en',{format:'story'}),count=window.exportedPortraitCount,text=[...window.exportedText];
    const url=URL.createObjectURL(blob),image=new Image();image.src=url;await image.decode();const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0);const alpha=ctx.getImageData(540,900,1,1).data[3];URL.revokeObjectURL(url);
    CanvasRenderingContext2D.prototype.drawImage=original;CanvasRenderingContext2D.prototype.fillText=fill;
    return {count,text,alpha,type:blob.type,names:three.map(c=>c.name)};
  });
  expect(exported.count).toBe(3);expect(exported.alpha).toBe(255);expect(exported.type).toBe('image/png');
  for(const name of exported.names)expect(exported.text).toContain(name);
  expect(exported.text).not.toContain('Neon Nostrade');expect(exported.text).not.toContain('Meleoron');
  denied=true;
  expect(await page.evaluate(async()=>{const {createShareCard}=await import('/src/game/share.js');return(await createShareCard(window.resultsReview.samples.specialization,'it',{format:'story'})).type;})).toBe('image/png');
  await page.evaluate(()=>{Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('Cancelled','AbortError');}});});
  expect(await page.evaluate(async()=>{const {shareResult}=await import('/src/game/share.js');return shareResult(window.resultsReview.samples.specialization,'en',true);})).toBe('cancelled');
  await page.evaluate(()=>{Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('Permission denied','NotAllowedError');}});});
  const pending=page.waitForEvent('download');
  expect(await page.evaluate(async()=>{const {shareResult}=await import('/src/game/share.js');return shareResult(window.resultsReview.samples.specialization,'en',true);})).toBe('downloaded');
  expect((await pending).suggestedFilename()).toBe('nen-divination-specialization.png');
});
