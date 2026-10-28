import { chromium } from '@playwright/test';
import { mkdir,writeFile,readFile,readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
// Read-only audit of the current PNGs. Requires the existing Vite dev server.
// Artifacts are diagnostic screenshots/metrics, never replacement game assets.
const baseURL=process.env.DIVINATION_AUDIT_URL || 'http://127.0.0.1:5173';
const out='.verification/divination-layer-audit';
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome'});
try{
const page=await browser.newPage({viewport:{width:1600,height:850}});
await page.goto(baseURL);
const result=await page.evaluate(async()=>{
 const paths=['/assets/scene-v3/unified-goblet-scene.png','/assets/divination/water-clean.png','/assets/divination/table-clean.png','/assets/divination/hands-poses.png'];
 const items=await Promise.all(paths.map(async path=>{
  const image=new Image();image.src=path;await image.decode();
  const canvas=Object.assign(document.createElement('canvas'),{width:image.width,height:image.height});
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
  const data=ctx.getImageData(0,0,image.width,image.height).data;
  let transparent=0,partial=0,opaque=0;
  for(let i=3;i<data.length;i+=4){if(data[i]===0)transparent++;else if(data[i]===255)opaque++;else partial++;}
  return {path,image,data,canvas,width:image.width,height:image.height,alpha:{transparent,partial,opaque}};
 }));
 function compare(a,b,roi){
  let changed=0,totalDelta=0,maxDelta=0,box={left:Infinity,top:Infinity,right:0,bottom:0};
  for(let y=roi.y;y<roi.y+roi.height;y++)for(let x=roi.x;x<roi.x+roi.width;x++){
   const i=(y*a.width+x)*4;let delta=0;for(let c=0;c<3;c++)delta+=Math.abs(a.data[i+c]-b.data[i+c]);
   if(delta){changed++;totalDelta+=delta;maxDelta=Math.max(maxDelta,delta);box.left=Math.min(box.left,x);box.top=Math.min(box.top,y);box.right=Math.max(box.right,x);box.bottom=Math.max(box.bottom,y);}
  }
  return {roi,changed,total:roi.width*roi.height,meanRGBDelta:totalDelta/(roi.width*roi.height*3),maxRGBSumDelta:maxDelta,changedBounds:changed?box:null};
 }
 const original=items[0];
 const comparisons=items.slice(1,3).map(item=>({path:item.path,
  full:compare(original,item,{x:0,y:0,width:1536,height:1024}),
  mouth:compare(original,item,{x:660,y:580,width:220,height:85}),
  leaf:compare(original,item,{x:710,y:610,width:120,height:35}),
  innerWater:compare(original,item,{x:710,y:660,width:100,height:100})
 }));
 document.querySelectorAll('style,link[rel=stylesheet]').forEach(el=>el.remove());
 document.body.removeAttribute('data-phase');
 document.body.innerHTML='<main id="audit"><h1>Audit dei livelli: immagini originali, nessun effetto aggiunto</h1><p>Ritaglio nativo x=650, y=575, w=240, h=260, ingrandito 2× per ispezione. Scacchiera visibile soltanto se il PNG è trasparente.</p><div id="plates"></div></main>';
 const style=document.createElement('style');style.textContent='body{margin:0;background:#202225;color:#eee;font:16px Arial}#audit{padding:20px}#plates{display:flex;gap:22px}figure{margin:0;width:480px;flex:none}figcaption{min-height:45px;font-weight:bold}.crop{position:relative;width:480px;height:520px;overflow:hidden;background:repeating-conic-gradient(#ddd 0 25%,#999 0 50%) 0/20px 20px}.crop canvas{position:absolute;left:-1300px;top:-1150px;width:3072px;height:2048px}p{line-height:1.5}';document.head.append(style);
 for(const item of items.slice(0,3)){
  const figure=document.createElement('figure'),caption=document.createElement('figcaption'),crop=document.createElement('div');
  caption.textContent=item.path.split('/').pop();crop.className='crop';crop.append(item.canvas);figure.append(caption,crop);document.querySelector('#plates').append(figure);
 }
 return {images:items.map(({path,width,height,alpha})=>({path,width,height,alpha})),comparisons};
});
await page.screenshot({path:`${out}/source-comparison.png`});
result.inventory=await readdir('public/assets/divination');
result.referenceCommit='a23403b';
result.scope='Existing composite PNGs and hand atlas, not a visual acceptance test for future layers.';
result.visualReviewRequired=true;
for(const item of result.images){
 const bytes=await readFile(`public${item.path}`);
 item.sha256=createHash('sha256').update(bytes).digest('hex');
}
await writeFile(`${out}/audit.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
