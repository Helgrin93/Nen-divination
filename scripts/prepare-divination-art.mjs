// Asset finishing: original-leaf mesh poses, registered AI ink layers and clean alpha.
import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
const browser=await chromium.launch(process.platform==='win32'?{channel:'chrome'}:{});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:5173');
 const data=await page.evaluate(async()=>{
  const make=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
  const load=async path=>{const i=new Image();i.src=path;await i.decode();return i;};
  const [scene,water,pigment,sediment]=await Promise.all(['/assets/scene-v3/unified-goblet-scene.png','/.verification/divination-art-v3/materials/overflow-source.png','/.verification/divination-art-v3/materials/pigment-source.png','/.verification/divination-art-v3/materials/sediment-source.png'].map(load));
  const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  function trimmed(source,rect){
   const c=make(rect[2],rect[3]),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(source,...rect,0,0,c.width,c.height);
   const p=x.getImageData(0,0,c.width,c.height);let box={x:c.width,y:c.height,right:0,bottom:0};
   for(let y=0;y<c.height;y++)for(let xx=0;xx<c.width;xx++){
    const k=(y*c.width+xx)*4,a=p.data[k+3];p.data[k+3]=a*smooth((a-24)/85);
    if(p.data[k+3]>95){box.x=Math.min(box.x,xx);box.y=Math.min(box.y,y);box.right=Math.max(box.right,xx);box.bottom=Math.max(box.bottom,y);}
   }
   x.putImageData(p,0,0);return {c,box};
  }
  // Match the existing original leaf matte exactly; no generated new identity.
  const original=make(1000,680),oc=original.getContext('2d',{willReadFrequently:true});oc.drawImage(scene,443,560,650,442,0,0,1000,680);
  const leaf=make(224,86),lc=leaf.getContext('2d'),raw=oc.getImageData(0,0,1000,680).data,matte=new Path2D();
  for(let y=80;y<126;y++){let l=600,r=400;for(let x=405;x<600;x++){const k=(y*1000+x)*4;if(raw[k+1]-raw[k]>12&&raw[k+1]-raw[k+2]>35){l=Math.min(l,x);r=Math.max(r,x);}}if(r>=l)matte.rect(l-1,y-1,r-l+3,3);}
  lc.translate(-388,-62);lc.clip(matte);lc.drawImage(original,0,0);
  const keys=[
   {yaw:0,bend:0,twist:0,tip:0},{yaw:.035,bend:.8,twist:-1.1,tip:.7},
   {yaw:.12,bend:2.0,twist:-2.8,tip:2.1},{yaw:.29,bend:3.1,twist:-4.0,tip:3.6},
   {yaw:.47,bend:1.7,twist:-1.0,tip:2.3},{yaw:.55,bend:-.8,twist:2.8,tip:-.8},
   {yaw:.44,bend:.7,twist:1.5,tip:-.4},{yaw:.32,bend:-.3,twist:-.5,tip:.6},
   {yaw:.35,bend:.12,twist:.16,tip:.15},{yaw:.34,bend:0,twist:0,tip:0},
  ];
  const poses=make(3024,1152),pc=poses.getContext('2d');
  function triangle(ctx,s,d){
   const [s0,s1,s2]=s,[d0,d1,d2]=d,det=(s1.x-s0.x)*(s2.y-s0.y)-(s2.x-s0.x)*(s1.y-s0.y);
   const a=((d1.x-d0.x)*(s2.y-s0.y)-(d2.x-d0.x)*(s1.y-s0.y))/det;
   const c=((d2.x-d0.x)*(s1.x-s0.x)-(d1.x-d0.x)*(s2.x-s0.x))/det;
   const b=((d1.y-d0.y)*(s2.y-s0.y)-(d2.y-d0.y)*(s1.y-s0.y))/det;
   const e=((d2.y-d0.y)*(s1.x-s0.x)-(d1.y-d0.y)*(s2.x-s0.x))/det;
   ctx.save();ctx.beginPath();ctx.moveTo(d0.x,d0.y);ctx.lineTo(d1.x,d1.y);ctx.lineTo(d2.x,d2.y);ctx.closePath();ctx.clip();ctx.transform(a,b,c,e,d0.x-a*s0.x-c*s0.y,d0.y-b*s0.x-e*s0.y);ctx.drawImage(leaf,0,0);ctx.restore();
  }
  for(let f=0;f<81;f++){
   const t=f/80*9,i=Math.min(8,Math.floor(t)),q=smooth(t-i),pose={};for(const k of ['yaw','bend','twist','tip'])pose[k]=keys[i][k]+(keys[i+1][k]-keys[i][k])*q;
   const offset={x:f%9*336+168,y:Math.floor(f/9)*128+64};
   const vertex=(x,y)=>{
    const u=x-112,v=y-43,n=u/112,planeV=v/.42;
    const z=pose.bend*(1-n*n)*(v*v/650)+pose.twist*n*(v/24)+pose.tip*Math.max(0,-n)**3;
    return {x:offset.x+(u*Math.cos(pose.yaw)-planeV*Math.sin(pose.yaw))*1.5,y:offset.y+((u*Math.sin(pose.yaw)+planeV*Math.cos(pose.yaw))*.42-z)*1.5};
   };
   for(let row=0;row<7;row++)for(let col=0;col<16;col++){
    const s=[{x:col*14,y:row*86/7},{x:(col+1)*14,y:row*86/7},{x:col*14,y:(row+1)*86/7},{x:(col+1)*14,y:(row+1)*86/7}];
    const d=s.map(v=>vertex(v.x,v.y));triangle(pc,[s[0],s[1],s[2]],[d[0],d[1],d[2]]);triangle(pc,[s[1],s[3],s[2]],[d[1],d[3],d[2]]);
   }
  }
  const flows=make(1024,576),fc=flows.getContext('2d'),flowTips=[];
  for(let f=0;f<8;f++)for(let side=0;side<2;side++){
   const rect=[f%4*384+side*192,Math.floor(f/4)*512,192,512],{c,box}=trimmed(water,rect),cx=c.getContext('2d',{willReadFrequently:true}),im=cx.getImageData(0,0,c.width,c.height);
   // Anchor each hand-drawn mouth to the same rim point. Remove low-alpha haze
   // and disconnected droplets: their motion belongs to the droplet timeline.
   let anchorSum=0,anchorN=0;for(let y=box.y;y<Math.min(box.y+12,c.height);y++)for(let x=box.x;x<=box.right;x++)if(im.data[(y*c.width+x)*4+3]>100){anchorSum+=x;anchorN++;}
   const anchor=anchorSum/anchorN,mask=new Uint8Array(c.width*c.height),queue=[];
   for(let y=box.y;y<box.y+12;y++)for(let x=box.x;x<=box.right;x++)if(im.data[(y*c.width+x)*4+3]>70){const k=y*c.width+x;if(!mask[k]){mask[k]=1;queue.push(k);}}
   for(let j=0;j<queue.length;j++){const k=queue[j],x=k%c.width,y=Math.floor(k/c.width);for(const [xx,yy]of[[x-1,y],[x+1,y],[x,y-1],[x,y+1]])if(xx>=0&&xx<c.width&&yy>=0&&yy<c.height){const n=yy*c.width+xx;if(!mask[n]&&im.data[n*4+3]>45){mask[n]=1;queue.push(n);}}}
   let lastY=box.y,lastX=anchor;
   for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const k=y*c.width+x;if(!mask[k])im.data[k*4+3]=0;else if(y>lastY){lastY=y;lastX=x;}}
   cx.putImageData(im,0,0);
   fc.save();fc.beginPath();fc.rect(f*128,side*288,128,288);fc.clip();
   for(let y=box.y;y<=lastY;y++){
    const dy=(y-box.y)*.65,bend=(side===0?1:-1)*28*(dy/215)**2;
    fc.drawImage(c,0,y,192,1,f*128+64-anchor*.55+bend,side*288+12+dy,192*.55,1.05);
   }
   fc.restore();flowTips.push({frame:f,side,x:64+(lastX-anchor)*.55+(side===0?1:-1)*28*((lastY-box.y)*.65/215)**2,y:12+(lastY-box.y)*.65});
  }
  const residues=make(320,192),rc=residues.getContext('2d');
  for(let row=0;row<3;row++)for(let col=0;col<5;col++){
   const {c,box}=trimmed(sediment,[Math.round(col*1536/5),Math.round(row*1024/3),Math.floor(1536/5),Math.floor(1024/3)]);
   const w=box.right-box.x+1,h=box.bottom-box.y+1,scale=46/Math.max(w,h);
   rc.drawImage(c,box.x-2,box.y-2,w+4,h+4,col*64+32-(w+4)*scale/2,row*64+32-(h+4)*scale/2,(w+4)*scale,(h+4)*scale);
  }
  const diffusion=make(1024,640),dc=diffusion.getContext('2d'),pw=256,ph=320,previous=new Float32Array(pw*ph);
  for(let f=0;f<8;f++){
   const c=make(pw,ph),cx=c.getContext('2d',{willReadFrequently:true});cx.drawImage(pigment,f%4*384,Math.floor(f/4)*512,384,512,0,0,pw,ph);const im=cx.getImageData(0,0,pw,ph);
   for(let i=0;i<pw*ph;i++){
    const a=smooth((im.data[i*4+3]-15)/150);previous[i]=Math.max(previous[i],a);
    const density=f===7?1:previous[i]*(.58+.06*f);
    im.data[i*4]=im.data[i*4+1]=im.data[i*4+2]=255;im.data[i*4+3]=density*255;
   }cx.putImageData(im,0,0);dc.drawImage(c,f%4*pw,Math.floor(f/4)*ph);
  }
  const assets={
   'leaf-flex-atlas-v3.png':poses.toDataURL().split(',')[1],
   'overflow-ink-atlas-v3.png':flows.toDataURL().split(',')[1],
   'sediment-atlas-v3.png':residues.toDataURL().split(',')[1],
   'diffusion-mattes-v3.png':diffusion.toDataURL().split(',')[1],
  };
  return {assets,meta:{leaf:{width:3024,height:1152,columns:9,frames:81,cell:[336,128],pivot:[168,64],scale:1.5,keys},overflow:{cell:[128,288],pivot:[64,12],columns:8,rows:2,flowTips},sediment:{families:5,variants:3,cell:[64,64]},diffusion:{cell:[256,320],frames:8}}};
 });
 for(const [name,png]of Object.entries(data.assets))await writeFile(`public/assets/divination/${name}`,Buffer.from(png,'base64'));
 await writeFile('public/assets/divination/art-v3-manifest.json',JSON.stringify(data.meta,null,2));
 await writeFile('src/components/divinationArtData.js','// Generated registered asset coordinates; see scripts/prepare-divination-art.mjs.\nexport const artData='+JSON.stringify(data.meta,null,2)+';\n');
 console.log(JSON.stringify(data.meta,null,2));
}finally{await browser.close();}
