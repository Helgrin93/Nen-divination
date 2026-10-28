// Derive a local, seamless water repair from the approved raster. This is
// harmonic inpainting of the leaf footprint, not replacement scene artwork.
import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch(process.platform==='win32'?{channel:'chrome'}:{});
try{
 const page=await browser.newPage();await page.goto('http://127.0.0.1:5173');
 const png=await page.evaluate(async()=>{
  const image=new Image();image.src='/assets/scene-v3/unified-goblet-scene.png';await image.decode();
  const c=Object.assign(document.createElement('canvas'),{width:240,height:60}),ctx=c.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(image,650,600,240,60,0,0,240,60);
  const im=ctx.getImageData(0,0,240,60),mask=new Uint8Array(240*60);
  for(let y=12;y<44;y++){
   let left=180,right=40;
   for(let x=45;x<185;x++){const k=(y*240+x)*4;if(im.data[k+1]-im.data[k]>12&&im.data[k+1]-im.data[k+2]>35){left=Math.min(left,x);right=Math.max(right,x);}}
   if(right>=left)for(let yy=y-2;yy<=y+2;yy++)for(let xx=left-2;xx<=right+2;xx++)mask[yy*240+xx]=1;
  }
  const a=Float32Array.from(im.data),b=new Float32Array(a.length),indices=[];
  for(let i=0;i<mask.length;i++)if(mask[i]){indices.push(i);a[i*4]=173;a[i*4+1]=177;a[i*4+2]=167;}
  for(let step=0;step<1800;step++){
   for(const i of indices)for(let k=0;k<3;k++)b[i*4+k]=(a[(i-1)*4+k]+a[(i+1)*4+k]+a[(i-240)*4+k]+a[(i+240)*4+k])/4;
   for(const i of indices)for(let k=0;k<3;k++)a[i*4+k]=b[i*4+k];
  }
  for(let i=0;i<mask.length;i++){for(let k=0;k<3;k++)im.data[i*4+k]=a[i*4+k];im.data[i*4+3]=mask[i]?255:0;}
  ctx.putImageData(im,0,0);return c.toDataURL().split(',')[1];
 });
 await writeFile('public/assets/divination/water-surface-clean.png',Buffer.from(png,'base64'));
 console.log('Saved water-surface-clean.png (240 x 60), registered at scene (650, 600).');
}finally{await browser.close();}
