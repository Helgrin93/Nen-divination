// Technical availability is distinct from publication permission. No image files are saved.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from '@playwright/test';
const catalog=JSON.parse(await readFile('src/data/characterImages.json','utf8'));
await mkdir('.verification/v4',{recursive:true});
const browser=await chromium.launch(process.platform==='win32'?{channel:'chrome'}:{}),records=[];
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:5173');
 for(const [slug,entry] of Object.entries(catalog.characters)){
  const record={slug,name:entry.name,malId:entry.malId,url:entry.portraitUrl,source:entry.sourceUrl,permissionStatus:entry.permissionStatus};
  try{
   const response=await fetch(entry.portraitUrl,{signal:AbortSignal.timeout(15000)}),type=response.headers.get('content-type');
   record.httpStatus=response.status;record.contentType=type;
   if(!response.ok||!type?.startsWith('image/'))throw Error(`Invalid image: ${response.status} ${type}`);
   const data=new Uint8Array(await response.arrayBuffer());record.bytes=data.length;record.jpeg=data[0]===255&&data[1]===216;
   if(!record.jpeg)throw Error('Non-JPEG response');
   Object.assign(record,await page.evaluate(async url=>{
    const img=new Image();img.referrerPolicy='no-referrer';img.src=url;await img.decode();
    const result={width:img.naturalWidth,height:img.naturalHeight,browserDecoded:true};
    const cors=new Image();cors.crossOrigin='anonymous';cors.referrerPolicy='no-referrer';cors.src=url;
    try{await cors.decode();const c=document.createElement('canvas');c.width=c.height=10;c.getContext('2d').drawImage(cors,0,0,10,10);c.toDataURL();result.canvasCors=true;}catch{result.canvasCors=false;}
    return result;
   },entry.portraitUrl));
   entry.runtimeVerification={checkedAt:new Date().toISOString(),...record};
  }catch(error){record.error=error.message;}
  records.push(record);console.log(`${slug}: ${record.httpStatus||'failed'} browser=${record.browserDecoded||false} CORS=${record.canvasCors||false}`);
 }
 await writeFile('.verification/v4/portrait-audit.json',JSON.stringify({checkedAt:new Date().toISOString(),records},null,2));
 await writeFile('src/data/characterImages.json',JSON.stringify(catalog,null,2)+'\n');
 if(records.some(r=>r.error))process.exitCode=1;
}finally{await browser.close();}
