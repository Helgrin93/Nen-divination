import http from 'node:http';
import { readFile,stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root=path.resolve('dist'),prefix='/nen-divination/';
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
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
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`);});
  await page.goto(`http://127.0.0.1:${server.address().port}${prefix}`);
  await page.getByRole('button',{name:'Inizia la prova'}).click();
  await page.locator('.answer').first().click();
  await page.getByRole('button',{name:'Continua',exact:true}).click();
  if(errors.length)throw new Error(errors.join('\n'));
  for(const forbidden of ['reference','questions_scoring.json','score_calibration.json']){
    try{await stat(path.join(root,forbidden));throw new Error(`Private reference/source unexpectedly published: ${forbidden}`);}catch(e){if(e.code!=='ENOENT')throw e;}
  }
  console.log('Production build served and played successfully under /nen-divination/. All asset requests passed; reference files are excluded.');
}finally{
  await browser?.close();
  server.closeAllConnections();
  await new Promise(resolve=>server.close(resolve));
}
