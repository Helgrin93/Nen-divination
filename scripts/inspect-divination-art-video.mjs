import{chromium}from'@playwright/test';import{readFile,writeFile}from'node:fs/promises';import{divinationEffects}from'../src/components/divinationTimeline.js';
const phase=process.argv[2]||'baseline',base=`.verification/divination-art-v3/${phase}`;const b=await chromium.launch({channel:'chrome'});
try{for(const device of ['desktop','mobile']){
 const p=await b.newPage({viewport:device==='desktop'?{width:1440,height:900}:{width:390,height:844}});await p.goto('http://127.0.0.1:5173/review/divination.html');await p.locator('.water-effects[data-ready=true]').waitFor();
 const result=await p.evaluate(async({device,phase,specs})=>{
  const r=document.querySelector('.water-effects').getBoundingClientRect(),roi=[r.x+620*r.width/1536,r.y+570*r.height/1024,300*r.width/1536,430*r.height/1024];
  const c=Object.assign(document.createElement('canvas'),{width:1620,height:1210}),ctx=c.getContext('2d'),played=[];ctx.fillStyle='#282e28';ctx.fillRect(0,0,c.width,c.height);
  for(const [col,[type,spec]]of Object.entries(specs).entries()){
   const v=document.createElement('video');v.muted=true;v.src=`/.verification/divination-art-v3/${phase}/${device}-${type}.webm`;await new Promise((ok,no)=>{v.onloadeddata=ok;v.onerror=no;});
   const start=Math.max(0,v.duration-spec.duration/1000-.6);v.currentTime=start+.05;await new Promise(ok=>v.onseeked=ok);await v.play();await new Promise(ok=>setTimeout(ok,450));v.pause();played.push({type,videoDuration:v.duration,watchedFrom:start,watchedTo:v.currentTime});
   for(const[row,f]of[.25,.5,.75].entries()){
    v.currentTime=start+spec.duration/1000*f;await new Promise(ok=>v.onseeked=ok);ctx.drawImage(v,...roi,col*270,row*400+25,270,387);
    ctx.fillStyle='#f4f0dd';ctx.font='12px Arial';ctx.fillText(`${type} · video ${v.currentTime.toFixed(2)} s`,col*270+8,row*400+18);
   }
  }
  return{png:c.toDataURL().split(',')[1],played};
 },{device,phase,specs:divinationEffects});await writeFile(`${base}/${device}-video-contact.png`,Buffer.from(result.png,'base64'));await writeFile(`${base}/${device}-video-playback.json`,JSON.stringify(result.played,null,2));await p.close();
}}finally{await b.close();}
