// One compositor owns the registered liquid; illustrated atlases supply complex shapes.
import { waterRegion as region } from './sceneGeometry.js';
import { divinationEffects, sampleDivination, clamp, smooth } from './divinationTimeline.js';
const W=1000,H=680;
const leafOutline='M416 109 Q439 98 462 91 Q507 80 552 95 L588 105 L588 109 L568 110 Q535 128 485 122 Q450 122 416 109 Z';
const liquidOutline='M364 104 Q500 58 636 104 C638 217 615 334 511 363 C413 365 365 265 364 104Z';
const frontHighlights='M373 111 Q386 115 402 118 C391 231 416 321 454 344 L435 337 C393 302 374 216 373 111Z M612 114 L631 106 C637 225 610 312 566 341 L554 345 C599 295 616 216 612 114Z';
const makeCanvas=(w=W,h=H)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
export function mountWaterScene(scene){
  const canvas=scene.querySelector('.water-effects'),image=scene.querySelector('.glass-plate');
  if(!canvas||!image)throw new Error('The registered canvas and original scene are required.');
  const ctx=canvas.getContext('2d',{willReadFrequently:true}),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let leafMask=new Path2D(leafOutline);
  const interior=new Path2D(liquidOutline),highlights=new Path2D(frontHighlights),assets={};
  let original,base,leaf,surface,frame=0,last=0,elapsed=0,holdTime=0,concentration=0;
  let effect='none',holding=false,paused=false,active=true,ready=false,completed=false,fragments=[],sediment=[];
  function crop(source,...rect){const c=makeCanvas(rect[2],rect[3]);c.getContext('2d').drawImage(source,...rect,0,0,c.width,c.height);return c;}
  function prepare(){
    if(!active)return;
    original=makeCanvas();original.getContext('2d').drawImage(image,region.x,region.y,region.width,region.height,0,0,W,H);
    base=makeCanvas();const bc=base.getContext('2d',{willReadFrequently:true});bc.drawImage(original,0,0);
    // Infer a precise matte from the green blade in the approved raster.
    const src=bc.getImageData(0,0,W,H).data;
    // Derive the footprint from the actual approved raster, including its
    // upper edge and stem, rather than an approximate hand-authored outline.
    leafMask=new Path2D();
    for(let y=80;y<126;y++){
      let left=600,right=400;
      for(let x=405;x<600;x++){
        const i=(y*W+x)*4;
        if(src[i+1]-src[i]>12&&src[i+1]-src[i+2]>35){left=Math.min(left,x);right=Math.max(right,x);}
      }
      if(right>=left)leafMask.rect(left-1,y-1,right-left+3,3);
    }
    // A local alpha repair reconstructed from adjacent original pixels avoids
    // the leaf-shaped amber ghost in the AI clean plate. No other scene pixel
    // can be replaced by this 240 x 60 registered patch.
    bc.drawImage(assets.clean,(650-region.x)/.65,(600-region.y)/.65,240/.65,60/.65);
    leaf=makeCanvas();const lc=leaf.getContext('2d');lc.clip(leafMask);lc.drawImage(original,0,0);
    surface=makeCanvas();const sc=surface.getContext('2d');sc.beginPath();sc.ellipse(500,105,130,17,0,0,Math.PI*2);sc.clip();sc.drawImage(base,0,0);
    fragments=[[954,627,82,58],[1065,598,51,42],[1161,620,46,38],[1009,686,64,41],[1112,699,48,36],[1180,672,64,57],[1265,649,38,38]].map(r=>crop(assets.leaves,...r));
    sediment=[[1403,641,55,38],[1500,610,50,39],[1552,655,41,36],[1643,623,37,32],[1449,685,43,39],[1585,691,44,34],[1674,672,40,37]].map(r=>crop(assets.leaves,...r));
    ready=true;scene.dataset.waterAsset='ready';canvas.dataset.ready='true';draw();
    if((holding||effect!=='none')&&!reduced.matches)schedule(true);else finishIfNeeded();
  }
  function sprite(source,x,y,w,h,alpha=1){if(alpha<=0)return;ctx.save();ctx.globalAlpha=clamp(alpha);ctx.drawImage(source,x,y,w,h);ctx.restore();}
  function atlas(rect,dest,alpha=1,source=assets.overflow){if(alpha<=0)return;ctx.save();ctx.globalAlpha=clamp(alpha);ctx.drawImage(source,...rect,...dest);ctx.restore();}
  function ripples(y,strength,cx=500){
    if(strength<.001)return;
    ctx.save();ctx.beginPath();ctx.ellipse(500,y,139,22,0,0,Math.PI*2);ctx.clip();
    for(let i=0;i<3;i++){
      const phase=(elapsed/1450+i/3)%1,r=14+phase*135,alpha=Math.sin(phase*Math.PI)*strength;
      for(const [offset,color] of [[1,'rgba(64,77,68,'],[0,'rgba(247,245,222,']]){
        ctx.strokeStyle=color+(alpha*.27)+')';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(cx,y+offset,r,r*.155,0,0,Math.PI*2);ctx.stroke();
      }
    }ctx.restore();
  }
  function drawLeaf(x=500,y=105,angle=0,alpha=1){
    ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);
    // Rotation in the water plane followed by its perspective compression.
    ctx.scale(1,.24);ctx.rotate(angle);ctx.scale(1,1/.24);ctx.translate(-500,-105);ctx.drawImage(leaf,0,0);ctx.restore();
  }
  function drawEmission(f){
    if(!f.colour)return;ctx.save();ctx.clip(interior);
    const front=390-420*f.colour,wash=ctx.createLinearGradient(0,front,0,front+105);
    wash.addColorStop(0,'rgba(168,61,58,0)');wash.addColorStop(1,`rgba(168,61,58,${.48*f.colour})`);
    ctx.globalCompositeOperation='multiply';ctx.fillStyle=wash;ctx.fillRect(355,65,290,320);ctx.restore();
  }
  function drawSediment(f){
    ctx.save();ctx.clip(interior);
    for(let i=0;i<56;i++){
      const birth=.09+i/56*.53,age=clamp((f.progress-birth)/(.98-birth));if(!age)continue;
      const x=389+(i*83)%218,y=144+(i*47)%145+(i%3?0:67)*smooth(age),size=3.2+i%5*.65;
      sprite(sediment[i%sediment.length],x+Math.sin(age*3+i)*2,y,size,size*.75,smooth(age/.21)*(.35+i%4*.13));
    }ctx.restore();
  }
  function drawWithering(f){
    const q=f.wither*5,index=Math.min(5,Math.floor(q)),mix=smooth(q-index),residual=1-smooth((f.progress-.70)/.23);
    const rects=[[19,146,409,151],[461,146,410,151],[903,146,410,151],[1346,146,410,151],[19,586,409,158],[461,586,410,158]];
    const replace=smooth((f.progress-.08)/.14);drawLeaf(500,105,0,1-replace);
    atlas(rects[index],[416,85,172,40],replace*residual*(1-mix),assets.leaves);
    if(index<5)atlas(rects[index+1],[416,85,172,40],replace*residual*mix,assets.leaves);
    ctx.save();ctx.clip(interior);
    for(let i=0;i<23;i++){
      const birth=.58+i%8*.025,age=clamp((f.progress-birth)/(1-birth));if(!age)continue;
      const x=433+(i*41)%132+Math.sin(i*1.7)*age*15,sink=i%3!==0,y=103+Math.sin(i)*4+(sink?age*age*(94+i%5*19):age*9),size=4+i%4*1.6;
      ctx.save();ctx.translate(x,y);ctx.rotate(age*(i%2?1:-1)*1.8);
      sprite(fragments[i%fragments.length],-size/2,-size/3,size,size*.65,smooth(age/.16)*(sink?.60:.85));ctx.restore();
    }ctx.restore();
  }
  function drawOverflow(f){
    const p=f.progress,flow=smooth((p-.34)/.20)*(1-smooth((p-.75)/.22)),wet=smooth((p-.55)/.38);
    if(wet){ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.moveTo(626,565);ctx.ellipse(500,565,126,45,0,0,Math.PI*2);ctx.closePath();ctx.clip('evenodd');atlas([90,786,653,139],[329,581,342,61],wet*.40);ctx.restore();}
    if(flow>0){
      const advance=smooth((p-.34)/.23),mature=smooth((p-.48)/.10);
      for(const side of [-1,1]){
        const x=side===-1?333:635,w=side===-1?50:40,h=(side===-1?210:181)*advance;
        ctx.save();ctx.beginPath();ctx.rect(x-8,74,w+16,h);ctx.clip();
        atlas(side===-1?[235,52,139,466]:[500,85,121,346],[x,78,w,side===-1?221:183],flow*(1-mature)*.85);
        atlas(side===-1?[922,45,151,406]:[1198,76,127,431],[x,78,w,side===-1?221:214],flow*mature*.85);ctx.restore();
      }
    }
    let drops=0;
    for(let i=0;i<8;i++){
      const age=(p-(.48+i*.038))/.18;if(age<0||age>1.2)continue;
      const x=i%2?646:357,targetY=607+i%3*4,startY=i%2?283:291;
      if(age<1){atlas([1096,602,83,175],[x-4,startY+(targetY-startY)*age*age,8,12+age*3],.78);drops++;}
      else{const k=clamp((age-1)/.2),step=Math.min(2,Math.floor(k*3));atlas([[869,802,168,140],[1054,806,177,139],[1230,838,222,110]][step],[x-18,targetY-9,36,15],(1-k)*.55);}
    }canvas.dataset.droplets=String(drops);
  }
  function draw(){
    if(!ready)return;
    const f=sampleDivination(effect,elapsed),enhancing=effect==='enhancement',moving=effect==='manipulation',special=effect==='specialization';
    ctx.resetTransform();ctx.clearRect(0,0,canvas.width,canvas.height);ctx.setTransform(region.width/W,0,0,region.height/H,region.x,region.y);
    const surfaceY=105-(enhancing?16*f.rise:0),altered=concentration>0||enhancing||moving||special||effect==='emission';
    if(altered)ctx.drawImage(assets.clean,(650-region.x)/.65,(600-region.y)/.65,240/.65,60/.65);
    if(enhancing&&f.rise){ctx.save();ctx.clip(interior);ctx.drawImage(surface,0,-16*f.rise);ctx.restore();}
    if(effect==='emission')drawEmission(f);if(effect==='conjuration')drawSediment(f);
    const envelope=effect==='none'?0:Math.sin(Math.PI*f.progress),leafX=moving?500+44*Math.sin(f.travel*Math.PI*1.5)*smooth(f.travel/.15):500;
    const leafY=moving?105+5*Math.sin(f.travel*Math.PI*3):surfaceY;
    ripples(surfaceY,concentration*.68+(enhancing?.30*envelope:0)+(moving?.60*envelope:0)+(effect==='transmutation'?.10*envelope:0),leafX);
    if(special)drawWithering(f);
    else if(altered)drawLeaf(leafX,leafY+Math.sin(elapsed/500)*.40*concentration,moving?f.travel*2.4+Math.sin(elapsed/42)*.018*(1-smooth(f.progress/.24)):Math.sin(elapsed/680)*.006*concentration);
    if(effect==='emission'||effect==='conjuration'||special){ctx.save();ctx.clip(highlights);ctx.drawImage(original,0,0);ctx.restore();}
    if(enhancing)drawOverflow(f);else canvas.dataset.droplets='0';
    const stageChanged=canvas.dataset.stage!==f.stage||canvas.dataset.renderedEffect!==effect;
    Object.assign(canvas.dataset,{renderedEffect:effect,effectProgress:String(f.progress),concentration:concentration.toFixed(3),surfaceY:(region.y+surfaceY*region.height/H).toFixed(2),stage:f.stage,paused:String(paused),elapsed:String(elapsed),duration:String(f.duration)});
    scene.dataset.effectStage=f.stage;
    if(stageChanged)scene.dispatchEvent(new CustomEvent('divinationstage',{detail:{effect,stage:f.stage}}));
  }
  function finishIfNeeded(){if(ready&&effect!=='none'&&elapsed>=divinationEffects[effect].duration&&!completed){completed=true;scene.dispatchEvent(new CustomEvent('divinationcomplete',{detail:{effect}}));}}
  function schedule(fresh=false){if(ready&&!frame&&active&&!paused&&!document.hidden){if(fresh)last=performance.now();frame=requestAnimationFrame(tick);}}
  function tick(now){
    frame=0;const dt=Math.max(0,now-last);last=now;
    elapsed=effect==='none'?elapsed+dt:Math.min(divinationEffects[effect].duration,elapsed+dt);
    if(holding){holdTime+=dt;concentration=smooth((holdTime/4500-.10)/.90);}else concentration*=Math.exp(-dt/190);
    if(concentration<.001)concentration=0;draw();finishIfNeeded();
    if(!reduced.matches&&(holding||concentration>0||(effect!=='none'&&!completed)))schedule();
  }
  function setConcentration(value){if(holding===value)return;holding=value;if(value){holdTime=0;concentration=0;elapsed=0;}if(reduced.matches){concentration=0;draw();}else schedule(true);}
  function setEffect(next,{restart=false}={}){
    if(next!=='none'&&!Object.hasOwn(divinationEffects,next))throw new RangeError(`Unknown Nen effect: ${next}`);
    if(effect===next&&!restart)return;
    cancelAnimationFrame(frame);frame=0;effect=next;holding=false;concentration=0;completed=false;paused=false;
    elapsed=reduced.matches&&next!=='none'?divinationEffects[next].duration:0;draw();finishIfNeeded();if(next!=='none'&&!reduced.matches)schedule(true);
  }
  function pause(){paused=true;cancelAnimationFrame(frame);frame=0;draw();}
  function resume(){if(!paused)return;paused=false;draw();if(effect!=='none'&&!completed)schedule(true);}
  function seek(ms){if(effect==='none')return;elapsed=Math.max(0,Math.min(divinationEffects[effect].duration,Number(ms)||0));completed=elapsed>=divinationEffects[effect].duration;draw();}
  function reset(){cancelAnimationFrame(frame);frame=0;holding=false;concentration=0;effect='none';elapsed=0;holdTime=0;paused=false;completed=false;draw();}
  function motionChange(){if(reduced.matches){cancelAnimationFrame(frame);frame=0;concentration=0;elapsed=effect==='none'?0:divinationEffects[effect].duration;draw();finishIfNeeded();}else if(effect!=='none'&&!completed)schedule(true);}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;holding=false;concentration=0;draw();}else if(!paused&&(concentration>0||(effect!=='none'&&!completed)))schedule(true);}
  async function load(){
    try{await Promise.all([image.decode(),...Object.entries({leaves:'leaf-states-atlas.png',overflow:'overflow-atlas.png',clean:'water-surface-clean.png'}).map(async([name,path])=>{const asset=new Image();asset.src=import.meta.env.BASE_URL+'assets/divination/'+path;await asset.decode();assets[name]=asset;})]);prepare();}
    catch(error){if(active){canvas.hidden=true;scene.dataset.waterAsset='missing';scene.dispatchEvent(new CustomEvent('divinationerror',{detail:{message:error.message}}));}}
  }
  reduced.addEventListener('change',motionChange);document.addEventListener('visibilitychange',visibility);load();
  return {setEffect,setConcentration,pause,resume,seek,reset,getState:()=>({effect,elapsed,paused,ready,...sampleDivination(effect,elapsed)}),destroy(){active=false;cancelAnimationFrame(frame);reduced.removeEventListener('change',motionChange);document.removeEventListener('visibilitychange',visibility);}};
}
