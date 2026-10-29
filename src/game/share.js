import { nenTypes } from '../data/nenTypes.js';
import {resultPresentation,resultRadarOrder as radarOrder} from '../data/resultPresentation.js';
import { translations } from '../data/translations.js';

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) { ctx.fillText(line,x,y); y+=lineHeight; line=word; }
    else line=next;
  }
  ctx.fillText(line,x,y);
}

export async function createShareCard(result, lang) {
  await document.fonts.ready;
  const type = nenTypes[result.primary], t = translations[lang];
  const colour=resultPresentation[result.primary].colour;
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.fillStyle = '#080e15'; ctx.fillRect(0,0,1080,1350);
  const gradient=ctx.createRadialGradient(540,700,0,540,700,700);
  gradient.addColorStop(0,colour+'13'); gradient.addColorStop(1,'#080e15');
  ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,1350);
  ctx.strokeStyle='#263947';ctx.lineWidth=2;ctx.strokeRect(38,38,1004,1274);
  ctx.textAlign='center'; ctx.fillStyle='#c8b998';ctx.font='20px Arial';ctx.fillText('N E N   D I V I N A T I O N',540,104);
  ctx.fillStyle='#aebbc8';ctx.font='20px Arial';ctx.fillText(t.resultLabel,540,198);
  ctx.fillStyle=colour;
  let size=72;ctx.font=`${size}px Georgia`;
  while(ctx.measureText(type.name.toUpperCase()).width>930){size--;ctx.font=`${size}px Georgia`;}
  ctx.fillText(type.name.toUpperCase(),540,282);
  ctx.fillStyle='#d5dfde';ctx.font='30px Georgia';
  if(lang==='it')ctx.fillText(type.it,540,332);
  ctx.fillStyle='#bac6cb';ctx.font='24px Arial';
  wrapText(ctx,type.personality[lang],540,397,850,35);
  ctx.fillStyle='#aebbc8';ctx.font='18px Arial';ctx.fillText(t.secondary,540,545);
  ctx.fillStyle='#edf1ef';ctx.font='30px Georgia';ctx.fillText(nenTypes[result.secondary].name,540,585);
  const cx=540,cy=900,r=190;
  const point=(i,radius)=>[cx+Math.cos((i*60-90)*Math.PI/180)*radius,cy+Math.sin((i*60-90)*Math.PI/180)*radius];
  const polygon=points=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();};
  ctx.lineWidth=1.5;ctx.strokeStyle='#34434c';
  for(const scale of [.2,.4,.6,.8,1]){polygon(radarOrder.map((_,i)=>point(i,r*scale)));ctx.stroke();}
  for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(...point(i,r));ctx.stroke();}
  polygon(radarOrder.map((type,i)=>point(i,r*result.radar[type]/100)));ctx.fillStyle=colour+'48';ctx.fill();ctx.strokeStyle=colour;ctx.lineWidth=3;ctx.stroke();
  radarOrder.forEach((typeId,i)=>{
    const [x,y]=point(i,268);ctx.fillStyle=resultPresentation[typeId].colour;ctx.font='23px Georgia';ctx.fillText(nenTypes[typeId].name,x,y-6);
    ctx.font='28px Arial';ctx.fillText(`${result.radar[typeId]}%`,x,y+28);
  });
  ctx.fillStyle='#aebbc8';ctx.font='19px Arial';ctx.fillText(t.relative,540,1234);
  ctx.font='16px Arial';ctx.fillText(t.shareNote,540,1273);
  const blob = await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob)throw new Error('PNG encoding failed');
  return blob;
}

export function downloadCard(blob, type) {
  const url=URL.createObjectURL(blob), link=document.createElement('a');
  link.href=url;link.download=`nen-divination-${type}.png`;document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
}

export async function shareResult(result,lang,share=false) {
  const blob=await createShareCard(result,lang);
  if(share){
    const file=new File([blob],`nen-divination-${result.primary}.png`,{type:'image/png'});
    const data={files:[file],title:`Nen Divination · ${nenTypes[result.primary].name}`,text:translations[lang].shareNote};
    try {
      if(navigator.share && navigator.canShare?.({files:[file]})){
        await navigator.share(data);return 'shared';
      }
    }catch(error){if(error.name==='AbortError')return 'cancelled';}
  }
  downloadCard(blob,result.primary);
  return share?'downloaded':'saved';
}
