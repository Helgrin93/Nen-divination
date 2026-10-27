import http from 'node:http';
import { readFile,stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const review=process.argv.includes('--review');
const root=path.resolve(review?'.verification/v2/dist':'dist'),prefix='/nen-divination/';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
const server=http.createServer(async(req,res)=>{
  try{
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(!pathname.startsWith(prefix)){res.writeHead(404);res.end();return;}
    const filename=path.resolve(root,pathname.slice(prefix.length)||'index.html');
    if(!filename.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    const body=await readFile(filename);res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream'});res.end(body);
  }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
  browser=await chromium.launch(process.platform==='win32'?{channel:'chrome'}:{});
  const page=await browser.newPage({viewport:{width:390,height:844},locale:'it-IT'});
  await page.emulateMedia({reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(`http://127.0.0.1:${server.address().port}${prefix}`);
  await page.getByRole('button',{name:'Inizia',exact:true}).click();
  if(review){
    await page.locator('.water-effects[data-ready="true"]').waitFor();
    if(!await page.locator('.quiz-scene-art img').evaluateAll(images=>images.length>0&&images.every(image=>image.complete&&image.naturalWidth>0)))throw new Error('Review scene images failed under Pages prefix');
  }
  await page.locator('.answer').first().click();
  await page.getByRole('button',{name:'Continua',exact:true}).click();
  for(let n=0;n<9;n++){
    if(await page.locator('.interlude').count())await page.getByRole('button',{name:'Continua',exact:true}).click();
    if(await page.locator('.hold-button').count())break;
    await page.locator('.answer').first().click();
    await page.getByRole('button',{name:'Continua',exact:true}).click();
  }
  await page.getByRole('button',{name:'Rivela senza tenere premuto'}).click();
  await page.locator('.nen-title').waitFor();
  if(review){
    const rendered=await page.locator('.water-effects').getAttribute('data-rendered-effect');
    if(rendered!==await page.locator('.scene').getAttribute('data-effect'))throw new Error('Review result did not retain the water effect');
  }
  const download=page.waitForEvent('download');
  await page.getByRole('button',{name:'Salva risultato',exact:true}).click();
  if(!(await download).suggestedFilename().endsWith('.png'))throw new Error('PNG export failed');
  if(errors.length)throw new Error(errors.join('\n'));
  for(const forbidden of ['reference','questions_scoring.json','score_calibration.json',...(!review?['__scene-preview','__character-preview','assets/scene-v3']:[])]){
    try{await stat(path.join(root,forbidden));throw new Error(`Private reference/source unexpectedly published: ${forbidden}`);}catch(e){if(e.code!=='ENOENT')throw e;}
  }
  console.log('Production build served and played successfully under /nen-divination/. All asset requests passed; reference files are excluded.');
}finally{
  await browser?.close();
  server.closeAllConnections();
  await new Promise(resolve=>server.close(resolve));
}
