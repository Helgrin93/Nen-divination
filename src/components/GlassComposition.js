// Correct transmitted colour in the air gap and upper rim using the actual
// decoded Wing pose. The original glass ink and neutral highlights stay intact.
import {sceneSize,waterRegion as region,glassOutline} from './sceneGeometry.js';
export const glassRepairRegion={x:333,y:38,width:334,height:116};
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
export function composeGlassRepair(original,wingImage){
  const r=glassRepairRegion;
  const patch=Object.assign(document.createElement('canvas'),{width:r.width,height:r.height});
  if(!wingImage?.complete||!wingImage.naturalWidth||wingImage.hidden)return patch;
  const ctx=patch.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(original,r.x,r.y,r.width,r.height,0,0,r.width,r.height);
  const source=ctx.getImageData(0,0,r.width,r.height);
  const underlay=Object.assign(document.createElement('canvas'),{width:r.width,height:r.height});
  const uc=underlay.getContext('2d',{willReadFrequently:true}),scale=region.width/1000;
  uc.setTransform(1/scale,0,0,1/scale,-region.x/scale-r.x,-region.y/scale-r.y);
  const width=sceneSize.width*.64,height=sceneSize.height*.64;
  uc.drawImage(wingImage,(sceneSize.width-width)/2,0,width,height);
  const behind=uc.getImageData(0,0,r.width,r.height).data;
  const glass=new Path2D(glassOutline),geometry=original.getContext('2d');
  for(let y=0;y<r.height;y++)for(let x=0;x<r.width;x++){
    const i=(y*r.width+x)*4,px=x+r.x,py=y+r.y;
    const red=source.data[i],green=source.data[i+1],blue=source.data[i+2];
    const inner=((px-500)/146)**2+((py-89)/39)**2;
    const outer=((px-500)/159)**2+((py-91)/52)**2;
    const offset=(px-500)/143;
    const surfaceBack=105-24*Math.sqrt(Math.max(0,1-offset*offset));
    const air=inner<1&&py<surfaceBack;
    const side=(px<367||px>635)&&py>=86&&py<=147;
    const rim=(outer<1&&inner>=1)||side;
    const orange=smooth((red-blue-28)/42)*smooth((red-green-7)/24)*smooth((red-105)/60);
    let coverage=0;
    if(air)coverage=clamp((1-inner)*18)*clamp((surfaceBack-py)*1.5);
    if(rim)coverage=1;
    // The back lip sits ABOVE the bowl outline. The old bowl-only gate left
    // its amber pixels untouched even though the repair already covered it.
    const alpha=(rim||geometry.isPointInPath(glass,px,py))?coverage*orange*behind[i+3]/255:0;
    const glassMix=rim?.10:.035;
    const luminance=red*.2126+green*.7152+blue*.0722;
    for(let k=0;k<3;k++)source.data[i+k]=rim
      ? luminance*[.96,1.015,1.06][k]
      : behind[i+k]*(1-glassMix)+[192,208,216][k]*glassMix;
    source.data[i+3]=alpha*255;
  }
  ctx.putImageData(source,0,0);return patch;
}
