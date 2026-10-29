// Verify the exact Tenrai/MAL identities already recorded locally. No API search.
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const catalog=JSON.parse(await readFile('src/data/characterImages.json','utf8'));
const directory='.verification/result-redesign/portraits';await mkdir(directory,{recursive:true});
if(process.argv.includes('--install')){
 const audit=JSON.parse(await readFile('.verification/result-redesign/portrait-audit.json','utf8'));
 await mkdir('public/assets/characters',{recursive:true});
 for(const [slug,entry]of Object.entries(catalog.characters)){
  const record=audit.records.find(record=>record.slug===slug&&record.malId===entry.malId&&record.url===entry.portraitUrl&&record.status===200);
  const bytes=await readFile(`${directory}/${slug}.jpg`);
  if(!record||createHash('sha256').update(bytes).digest('hex')!==record.sha256)throw new Error(`Unverified cached portrait: ${slug}`);
  await copyFile(`${directory}/${slug}.jpg`,`public/assets/characters/${slug}.jpg`);
  entry.cachedPortraitSrc=`assets/characters/${slug}.jpg`;
  entry.imageVerification={checkedAt:audit.checkedAt,httpStatus:200,sha256:record.sha256,bytes:record.bytes};
 }
 catalog.permissionReview={...catalog.permissionReview,reviewedAt:new Date().toISOString(),note:'Tenrai Terms sections 3 and 6 checked. They permit API-response caching and do not grant third-party image rights. The 18 exact MAL portraits are cached for the requested local result redesign; permissionStatus remains unverified. No license or publishing permission is inferred.'};
 await writeFile('src/data/characterImages.json',JSON.stringify(catalog,null,2)+'\n');
 console.log('Installed 18 verified catalog portraits; rights status preserved.');
 process.exit(0);
}
const records=[];
for(const [slug,entry]of Object.entries(catalog.characters)){
 const url=new URL(entry.portraitUrl),identity=new URL(entry.sourceUrl);
 if(url.protocol!=='https:'||url.hostname!=='cdn.myanimelist.net'||!url.pathname.startsWith('/images/characters/')||identity.pathname.split('/')[2]!==String(entry.malId))throw new Error(`Invalid catalog identity: ${slug}`);
 try{
  const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
  if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))throw new Error(`Portrait HTTP ${response.status}`);
  const bytes=Buffer.from(await response.arrayBuffer());if(bytes.length>5_000_000)throw new Error('Portrait exceeds 5 MB');
  await writeFile(`${directory}/${slug}.jpg`,bytes);
  records.push({slug,malId:entry.malId,url:url.href,status:response.status,contentType:response.headers.get('content-type'),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
  console.log(`${slug}: ${response.status}, ${bytes.length} bytes`);
 }catch(error){records.push({slug,malId:entry.malId,url:url.href,error:error.message});console.error(`${slug}: ${error.message}`);}
}
await writeFile('.verification/result-redesign/portrait-audit.json',JSON.stringify({checkedAt:new Date().toISOString(),records},null,2));
if(records.some(record=>record.error))process.exitCode=1;
