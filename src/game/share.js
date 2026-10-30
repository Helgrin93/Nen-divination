import {nenTypes} from '../data/nenTypes.js';
import {resultPresentation} from '../data/resultPresentation.js';
import {translations} from '../data/translations.js';
import {charactersFor} from '../data/characters.js';
import {radarSvg} from '../components/NenRadar.js';

export const QUIZ_URL='https://helgrin93.github.io/nen-divination/';

function wrapText(ctx,text,x,y,maxWidth,lineHeight,maxLines=Infinity){
  const lines=[];let line='';
  for(const word of text.split(' ')){
    const next=line?`${line} ${word}`:word;
    if(ctx.measureText(next).width>maxWidth&&line){lines.push(line);line=word;}else line=next;
  }
  if(line)lines.push(line);
  for(let i=0;i<Math.min(lines.length,maxLines);i++){
    let text=lines[i];
    if(i===maxLines-1&&lines.length>maxLines){while(ctx.measureText(text+'…').width>maxWidth)text=text.slice(0,-1);text+='…';}
    ctx.fillText(text,x,y+i*lineHeight);
  }
  return y+Math.min(lines.length,maxLines)*lineHeight;
}
async function svgImage(svg){
  const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
  try{const image=new Image();image.src=url;await image.decode();return image;}finally{URL.revokeObjectURL(url);}
}
async function exportPortrait(character){
  // Image rights and CORS are separate gates. An API URL grants neither.
  if(character.permissionStatus!=='authorized'||!character.portraitSrc)return null;
  try{
    const response=await fetch(character.portraitSrc,{mode:'cors',signal:AbortSignal.timeout(4000)});
    if(!response.ok||!response.headers.get('content-type')?.startsWith('image/'))return null;
    const blob=await response.blob();if(blob.size>5_000_000)return null;
    const url=URL.createObjectURL(blob);
    try{const image=new Image();image.src=url;await image.decode();return image;}finally{URL.revokeObjectURL(url);}
  }catch{return null;}
}

export async function createShareCard(result,lang,{format='card'}={}){
  await document.fonts.ready;
  const story=format==='story',height=story?1920:1350,type=nenTypes[result.primary],t=translations[lang],colour=resultPresentation[result.primary].colour;
  const canvas=Object.assign(document.createElement('canvas'),{width:1080,height});
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable');
  ctx.fillStyle='#080e15';ctx.fillRect(0,0,1080,height);
  const gradient=ctx.createRadialGradient(540,height/2,0,540,height/2,1000);
  gradient.addColorStop(0,colour+'16');gradient.addColorStop(1,'#080e15');ctx.fillStyle=gradient;ctx.fillRect(0,0,1080,height);
  ctx.strokeStyle='#29404e';ctx.lineWidth=2;ctx.strokeRect(38,38,1004,height-76);
  ctx.textAlign='center';ctx.fillStyle='#c8b998';ctx.font='22px Arial';ctx.fillText('N E N   D I V I N A T I O N',540,story?190:104);
  ctx.fillStyle='#aebbc8';ctx.font='21px Arial';ctx.fillText(t.resultLabel,540,story?265:198);
  let size=76;ctx.fillStyle=colour;ctx.font=`${size}px Georgia`;
  while(ctx.measureText(type.name.toUpperCase()).width>930){size--;ctx.font=`${size}px Georgia`;}
  ctx.fillText(type.name.toUpperCase(),540,story?350:282);
  if(lang==='it'){ctx.fillStyle='#d5dfde';ctx.font='32px Georgia';ctx.fillText(type.it,540,story?400:332);}
  ctx.fillStyle='#c8d4dc';ctx.font='27px Georgia';wrapText(ctx,type.personality[lang],540,story?453:397,890,36);
  if(!story){
    ctx.fillStyle='#aebbc8';ctx.font='18px Arial';ctx.fillText(t.secondary,540,555);
    ctx.fillStyle='#edf1ef';ctx.font='30px Georgia';ctx.fillText(nenTypes[result.secondary].name,540,596);
  }
  const svg=radarSvg(result.radar,t,colour).replace('viewBox=','width="600" height="540" viewBox=');
  const radar=await svgImage(svg);
  ctx.drawImage(radar,story?90:180,story?565:615,story?900:720,story?810:648);
  if(story){
    const three=charactersFor(result.primary).slice(0,3),images=await Promise.all(three.map(exportPortrait));
    ctx.fillStyle='#aebbc8';ctx.font='20px Arial';ctx.fillText(t.storyCharacters,540,1418);
    for(let i=0;i<three.length;i++){
      const x=70+i*320,character=three[i],image=images[i];
      ctx.strokeStyle='#29404e';ctx.strokeRect(x,1444,300,188);
      ctx.fillStyle='#edf1ef';ctx.textAlign='center';ctx.font='26px Georgia';wrapText(ctx,character.name,x+150,1482,278,29,2);
      if(image){
        const crop=Math.min(image.width,image.height*.85);ctx.drawImage(image,(image.width-crop)/2,0,crop,crop/1.5,x+65,1532,170,86);
      }else{
        // An honest text-only card, never a fake portrait or an initial avatar.
        ctx.fillStyle='#becbd4';ctx.font='20px Georgia';wrapText(ctx,character.description[lang],x+150,1545,270,26,3);
      }
    }
    ctx.textAlign='center';ctx.setLineDash([7,8]);ctx.strokeStyle='#405565';ctx.strokeRect(310,1678,460,82);ctx.setLineDash([]);
    ctx.fillStyle='#b8c8d2';ctx.font='22px Arial';ctx.fillText(t.storySticker,540,1727);
    ctx.fillStyle='#99adbb';ctx.font='21px Arial';ctx.fillText('helgrin93.github.io/nen-divination',540,1810);
    canvas.dataset.portraitsIncluded=String(images.filter(Boolean).length);
  }else{
    ctx.fillStyle='#99adbb';ctx.font='18px Arial';ctx.fillText('helgrin93.github.io/nen-divination',540,1295);
  }
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('PNG encoding failed');
  return blob;
}

export function downloadCard(blob,type,format='card'){
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=`nen-divination-${type}${format==='story'?'-story':''}.png`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}

export async function shareResult(result,lang,share=false,format='card'){
  const blob=await createShareCard(result,lang,{format});
  if(share){
    const file=new File([blob],`nen-divination-${result.primary}${format==='story'?'-story':''}.png`,{type:'image/png'});
    const data={files:[file],title:`Nen Divination · ${nenTypes[result.primary].name}`,text:translations[lang].shareNote,url:QUIZ_URL};
    try{if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share(data);return 'shared';}}
    catch(error){if(error.name==='AbortError')return 'cancelled';}
  }
  downloadCard(blob,result.primary,format);return format==='story'?'storySaved':share?'downloaded':'saved';
}

export async function copyQuizLink(){
  try{await navigator.clipboard.writeText(QUIZ_URL);return true;}catch{return false;}
}
