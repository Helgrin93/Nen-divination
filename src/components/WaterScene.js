// Local coordinates map to the approved goblet illustration, never the viewport.
const W=1000,H=680;
const leafOutline='M416 109 Q439 98 462 91 Q507 80 552 95 L588 105 L588 109 L568 110 Q535 128 485 122 Q450 122 416 109 Z';
const glassOutline='M342 86 C340 25 656 25 657 86 C672 225 640 374 521 400 L479 400 C370 374 334 231 342 86 Z';
const waterInterior='M356 88 Q500 38 644 88 C651 224 628 359 510 381 C393 382 352 270 356 88Z';
const makeCanvas=(w,h)=>Object.assign(document.createElement('canvas'),{width:w,height:h});
const clamp=n=>Math.max(0,Math.min(1,n));
const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};

export function mountWaterScene(scene){
  const canvas=scene.querySelector('.water-effects'),image=scene.querySelector('.glass-plate');
  if(!canvas||!image)return {setEffect(){},setConcentration(){},reset(){},destroy(){}};
  // Pin CPU rasterization: switching backends after pixel reads otherwise
  // changes a few antialiased rim pixels by one value when replaying.
  const ctx=canvas.getContext('2d',{willReadFrequently:true}),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const cleanImage=new Image();
  const leafMask=new Path2D(leafOutline),silhouette=new Path2D(glassOutline),interior=new Path2D(waterInterior);
  let original,base,leaf,surface,frame=0,last=0,elapsed=0,effect='none',progress=0;
  let holding=false,holdStarted=0,concentration=0,effectStarted=0,active=true;

  function prepare(){
    if(!image.naturalWidth||!cleanImage.complete||!cleanImage.naturalWidth)return;
    original=makeCanvas(W,H);original.getContext('2d').drawImage(image,443,560,650,442,0,0,W,H);
    leaf=makeCanvas(W,H);const lc=leaf.getContext('2d');lc.clip(leafMask);lc.drawImage(original,0,0);
    base=makeCanvas(W,H);const bc=base.getContext('2d');bc.drawImage(original,0,0);
    // A dedicated inpainted water plate avoids stretching rim highlights into
    // the space beneath the moving leaf. Only its original footprint is used.
    bc.save();bc.clip(leafMask);bc.drawImage(cleanImage,443,560,650,442,0,0,W,H);bc.restore();
    surface=makeCanvas(W,H);const sc=surface.getContext('2d');
    sc.beginPath();sc.ellipse(500,105,143,24,0,0,Math.PI*2);sc.clip();sc.drawImage(base,0,0);
    canvas.dataset.ready='true';draw();
  }
  function ripples(y,strength){
    // Perspective waves with a dark trough beside each highlight, clipped to
    // the actual surface. Subpixel displacement replaces luminous energy FX.
    ctx.save();ctx.beginPath();ctx.ellipse(500,y,140,23,0,0,Math.PI*2);ctx.clip();
    for(let i=0;i<4;i++){
      const phase=(elapsed*.46+i*.27)%1,r=18+phase*139,fade=Math.sin(phase*Math.PI)*strength;
      for(const [offset,color,alpha] of [[1.4,'70,83,77',.21],[0,'247,245,222',.35]]){
        ctx.strokeStyle=`rgba(${color},${fade*alpha})`;ctx.lineWidth=1.25;ctx.beginPath();
        for(let j=0;j<=90;j++){
          const a=j/90*Math.PI*2,wobble=Math.sin(a*3+elapsed*1.3+i)*.65*strength;
          const x=497+Math.cos(a)*(r+wobble),wy=y+Math.sin(a)*(r*.16+wobble*.22)+offset;
          if(j===0)ctx.moveTo(x,wy);else ctx.lineTo(x,wy);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  function overflow(p){
    const spill=smooth((p-.46)/.30);if(!spill)return;
    // Unequal thin sheets follow the outside of the bowl before detaching.
    for(const [side,delay] of [[-1,0],[1,.12]]){
      const q=clamp((spill-delay)/(1-delay));if(!q)continue;
      const x=500+side*155;
      ctx.save();ctx.lineCap='round';ctx.beginPath();ctx.rect(x-48,83,96,12+221*q);ctx.clip();
      ctx.beginPath();ctx.moveTo(x,90);ctx.bezierCurveTo(x+side*12,123,x+side*5,220,x-side*31,296);
      ctx.strokeStyle=`rgba(105,147,151,${.20*q})`;ctx.lineWidth=8*q;ctx.stroke();
      ctx.strokeStyle=`rgba(234,243,234,${.48*q})`;ctx.lineWidth=2.1*q;ctx.stroke();
      ctx.beginPath();ctx.moveTo(x-side*3,93);ctx.bezierCurveTo(x+side*6,135,x-side*1,222,x-side*32,292);
      ctx.strokeStyle=`rgba(255,253,237,${.3*q})`;ctx.lineWidth=1;ctx.stroke();
      ctx.restore();ctx.save();
      for(let i=0;i<3&&q>.92;i++){
        const age=(elapsed*.92+i*.33+(side===1?.17:0))%1,fall=age*age*324*q;
        ctx.fillStyle=`rgba(221,235,227,${.52*q*(1-age*.4)})`;
        ctx.beginPath();ctx.ellipse(x-side*32+side*age*5,296+fall,1.8+age*.6,3+age*4,side*.08,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();
    }
    const wet=smooth((p-.72)/.28);
    if(wet){
      ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);
      ctx.moveTo(626,565);ctx.ellipse(500,565,126,45,0,0,Math.PI*2);ctx.closePath();ctx.clip('evenodd');
      ctx.translate(500,620);ctx.scale(1,.13);ctx.beginPath();
      for(let i=0;i<=80;i++){
        const a=i/80*Math.PI*2,r=(111+Math.sin(a*5)*6+Math.cos(a*7)*3)*wet;
        if(i===0)ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);else ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
      }
      ctx.closePath();ctx.fillStyle='rgba(71,91,79,.15)';ctx.fill();ctx.strokeStyle='rgba(241,240,213,.23)';ctx.lineWidth=1;ctx.stroke();ctx.restore();
    }
  }
  function draw(){
    if(!base)return;
    const enhancing=effect==='enhancement',p=enhancing?smooth(progress):0;
    // The approved goblet is already nearly full: its perspective rim only
    // leaves ~10 native pixels of headroom. Never levitate water above it.
    const rise=16*smooth(p/.60),surfaceY=105-rise;
    const strength=concentration*.78+(enhancing?.30*(1-p)+.18:0);
    ctx.clearRect(0,0,W,H);
    // Five unapproved reactions intentionally retain the untouched water.
    if(!concentration&&!enhancing){
      ctx.save();ctx.clip(silhouette);ctx.drawImage(original,0,0);ctx.restore();
    }else{
      ctx.save();ctx.clip(silhouette);ctx.drawImage(base,0,0);ctx.restore();
      ctx.save();ctx.clip(interior);
      if(rise>0){
        // Remove the old meniscus as the real surface moves upward.
        ctx.save();ctx.beginPath();ctx.ellipse(500,108,141,31,0,0,Math.PI*2);ctx.clip();
        ctx.globalAlpha=smooth(rise/8);ctx.drawImage(base,425,146,150,46,357,75,286,70);ctx.restore();
        const water=ctx.createLinearGradient(0,surfaceY,0,205);
        water.addColorStop(0,'rgba(199,221,213,.12)');water.addColorStop(1,'rgba(200,219,208,0)');
        ctx.fillStyle=water;ctx.fillRect(357,surfaceY,286,140);
      }
      ctx.save();ctx.beginPath();ctx.ellipse(500,surfaceY,143,24,0,0,Math.PI*2);ctx.clip();
      for(let row=79;row<132;row+=2){
        const offset=Math.sin(row*.43+elapsed*2.2)*strength*1.35;
        // Baked rim highlights must never rise along with the water.
        if(!rise)ctx.drawImage(surface,355,row,290,2,355+offset,row,290,2.15);
      }
      if(rise>0){
        const reflection=ctx.createLinearGradient(0,surfaceY-24,0,surfaceY+24);
        reflection.addColorStop(0,'rgba(151,176,179,.23)');reflection.addColorStop(.55,'rgba(217,226,213,.12)');reflection.addColorStop(1,'rgba(119,148,152,.18)');
        ctx.fillStyle=reflection;ctx.fillRect(355,surfaceY-24,290,48);
      }
      ctx.restore();
      if(rise>0){
        ctx.beginPath();ctx.ellipse(500,surfaceY,142,23,0,0,Math.PI*2);
        ctx.strokeStyle='rgba(221,234,224,.42)';ctx.lineWidth=1.2;ctx.stroke();
      }
      ripples(surfaceY,strength);ctx.restore();
      // The original rim remains in front of the water and its reflections.
      if(rise){
        ctx.save();ctx.clip(silhouette);ctx.beginPath();
        ctx.ellipse(500,92,157,48,0,0,Math.PI*2);ctx.closePath();
        ctx.moveTo(646,89);ctx.ellipse(500,89,146,39,0,0,Math.PI*2);ctx.closePath();
        ctx.clip('evenodd');ctx.drawImage(base,0,0);ctx.restore();
      }
      ctx.save();ctx.translate(500,surfaceY+Math.sin(elapsed*2.1)*.65*strength);
      ctx.rotate(Math.sin(elapsed*1.45)*.009*strength);ctx.translate(-500,-105);ctx.drawImage(leaf,0,0);ctx.restore();
      if(enhancing)overflow(p);
    }
    canvas.dataset.renderedEffect=effect;canvas.dataset.effectProgress=String(progress);
    canvas.dataset.concentration=concentration.toFixed(3);canvas.dataset.surfaceY=surfaceY.toFixed(2);
    canvas.dataset.deferred=String(effect!=='none'&&!enhancing);
  }
  function schedule(){if(!frame&&active&&!document.hidden)frame=requestAnimationFrame(tick);}
  function tick(now){
    frame=0;const dt=Math.min(60,now-last||16);last=now;elapsed+=dt/1000;
    if(holding)concentration=smooth((clamp((now-holdStarted)/4500)-.10)/.90);
    else concentration*=Math.exp(-dt/190);
    if(concentration<.001)concentration=0;
    if(effect==='enhancement')progress=reduced.matches?1:clamp((now-effectStarted)/3900);
    draw();
    if(!reduced.matches&&(holding||concentration>0||(effect==='enhancement'&&progress<1)))schedule();
  }
  function setConcentration(value){
    if(holding===value)return;holding=value;
    if(value){holdStarted=performance.now();concentration=0;}
    if(reduced.matches){concentration=0;draw();}else schedule();
  }
  function setEffect(next){
    if(effect===next)return;
    effect=next;holding=false;concentration=0;progress=reduced.matches?1:0;
    effectStarted=performance.now();last=effectStarted;draw();if(next==='enhancement')schedule();
  }
  function reset(){cancelAnimationFrame(frame);frame=0;holding=false;concentration=0;effect='none';progress=0;elapsed=0;draw();}
  function motionChange(){
    if(reduced.matches){cancelAnimationFrame(frame);frame=0;concentration=0;progress=effect==='none'?0:1;draw();}else schedule();
  }
  function visibility(){
    if(document.hidden){cancelAnimationFrame(frame);frame=0;holding=false;concentration=0;draw();}
    else {last=performance.now();if(effect==='enhancement'&&progress<1)schedule();}
  }
  cleanImage.onload=prepare;
  cleanImage.onerror=()=>{canvas.hidden=true;scene.dataset.waterAsset='missing';};
  cleanImage.src=import.meta.env.BASE_URL+'assets/divination/water-clean.png';
  image.addEventListener('load',prepare);reduced.addEventListener('change',motionChange);document.addEventListener('visibilitychange',visibility);
  if(image.complete)prepare();
  return {setEffect,setConcentration,reset,destroy(){active=false;cancelAnimationFrame(frame);cleanImage.onload=cleanImage.onerror=null;image.removeEventListener('load',prepare);reduced.removeEventListener('change',motionChange);document.removeEventListener('visibilitychange',visibility);}};
}
