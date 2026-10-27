// Local effect coordinates map to a 650 × 366 region of the unified scene.
// Only the goblet is composited above Wing; the room and hands stay untouched.
const leafOutline = 'M416 109 Q439 98 462 91 Q507 80 552 95 L588 105 L588 109 L568 110 Q535 128 485 122 Q450 122 416 109 Z';
const glassInterior = 'M352 103 Q353 76 500 76 Q640 76 646 103 C649 234 633 365 510 384 C387 385 352 275 352 103 Z';
const glassOutline = 'M342 86 C340 25 656 25 657 86 C672 225 640 374 521 400 L479 400 C370 374 334 231 342 86 Z';
const makeCanvas = (w,h) => Object.assign(document.createElement('canvas'), {width:w,height:h});
const ease = n => n*n*(3-2*n);

export function mountWaterScene(scene) {
  const canvas=scene.querySelector('.water-effects'),image=scene.querySelector('.glass-plate');
  if(!canvas || !image)return {setEffect(){},setConcentration(){},reset(){},destroy(){}};
  // Keep transparent mask edges deterministic when restoring the initial scene.
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let base=null,leaf=null,effect='none',progress=0,frame=0,started=0,lastTick=0;
  let concentrating=false,concentration=0,elapsed=0;
  const mask=new Path2D(leafOutline), glassMask=new Path2D(glassInterior), silhouette=new Path2D(glassOutline);

  function prepare(){
    if(!image.naturalWidth)return;
    const original=makeCanvas(1000,563),originalCtx=original.getContext('2d',{willReadFrequently:true});
    originalCtx.drawImage(image,443,560,650,366,0,0,1000,563);
    leaf=makeCanvas(1000,563);
    const leafCtx=leaf.getContext('2d');leafCtx.clip(mask);leafCtx.drawImage(original,0,0);
    base=makeCanvas(1000,563);const baseCtx=base.getContext('2d');baseCtx.drawImage(original,0,0);
    // Reconstruct only the water hidden by the leaf from adjacent rows of the
    // same illustration. Vertical reflections remain in their original columns.
    const pixels=originalCtx.getImageData(0,0,1000,563),clean=baseCtx.getImageData(0,0,1000,563);
    for(let y=70;y<146;y++)for(let x=395;x<606;x++){
      const at=(y*1000+x)*4,top=(67*1000+x)*4,bottom=(148*1000+x)*4,ratio=(y-67)/81;
      for(let c=0;c<3;c++)clean.data[at+c]=pixels.data[top+c]*(1-ratio)+pixels.data[bottom+c]*ratio;
    }
    const patch=makeCanvas(1000,563);patch.getContext('2d').putImageData(clean,0,0);
    baseCtx.save();baseCtx.clip(mask);baseCtx.drawImage(patch,0,0);baseCtx.restore();
    draw();canvas.dataset.ready='true';
  }

  function draw(){
    if(!base)return;
    const p=ease(progress);
    ctx.clearRect(0,0,1000,563);
    ctx.save();ctx.clip(silhouette);ctx.drawImage(base,0,0);ctx.restore();
    ctx.save();ctx.clip(glassMask);
    if(effect==='emission'){
      ctx.globalCompositeOperation='color';ctx.globalAlpha=.95*p;ctx.fillStyle='#5758eb';ctx.fillRect(330,50,330,420);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
      ctx.fillStyle=`rgba(91,105,238,${.34*p})`;ctx.fillRect(330,50,330,420);
      ctx.strokeStyle=`rgba(213,223,255,${.42*p})`;ctx.lineWidth=5;
      for(let i=0;i<3;i++){const y=165+i*65;ctx.beginPath();ctx.moveTo(350,y);ctx.bezierCurveTo(430,y-24*Math.sin(elapsed*2+i),560,y+24,650,y-8);ctx.stroke();}
    }
    if(effect==='enhancement'){
      ctx.fillStyle=`rgba(141,207,233,${.32*p})`;ctx.fillRect(345,105-43*p,310,310);
      ctx.fillStyle=`rgba(194,237,250,${.6*p})`;ctx.beginPath();ctx.ellipse(500,105-43*p,144,25,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle=`rgba(245,253,255,${.95*p})`;ctx.lineWidth=5;ctx.stroke();
    }
    if(effect==='conjuration'){
      for(let i=0;i<18;i++){
        const x=390+(i*67)%215,y=150+(i*43)%200;
        ctx.save();ctx.translate(x,y+35*(1-p)+Math.sin(elapsed*2+i)*5*p);ctx.rotate(i*1.7+elapsed*.3);ctx.globalAlpha=p*(.7+(i%3)*.15);
        const size=8+i%4*2;ctx.fillStyle=i%2?'#a9efd9':'#effff7';ctx.strokeStyle='#407f73';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-size);ctx.lineTo(size*.6,0);ctx.lineTo(0,size);ctx.lineTo(-size*.6,0);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
      }
    }
    if(effect==='transmutation'){
      ctx.fillStyle=`rgba(255,212,119,${.17*p})`;ctx.fillRect(350,80,300,310);
      for(let i=0;i<16;i++){
        const x=395+(i*47)%210+Math.sin(elapsed*2+i)*5*p,y=170+(i*37)%200-65*p;
        ctx.strokeStyle=`rgba(255,238,177,${p*.95})`;ctx.fillStyle=`rgba(255,220,135,${p*.24})`;ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(x,y,5+i%4*1.5,0,Math.PI*2);ctx.fill();ctx.stroke();
      }
    }
    const rippleStrength=concentration*.85+(effect!=='none'?.6*p:0);
    if(rippleStrength>0){
      for(let i=0;i<3;i++){
        const cycle=(elapsed*.65+i/3)%1;
        ctx.strokeStyle=`rgba(235,255,247,${rippleStrength*(1-cycle)*.9})`;ctx.lineWidth=3.5;
        ctx.beginPath();ctx.ellipse(500,105-(effect==='enhancement'?43*p:0),30+110*cycle,6+19*cycle,0,0,Math.PI*2);ctx.stroke();
      }
    }
    ctx.restore();
    ctx.save();
    let dx=0,dy=0,angle=0;
    if(effect==='manipulation'){dx=35*Math.sin(p*Math.PI*2)+22*p;dy=10*Math.sin(p*Math.PI*2);angle=p*(Math.PI*2+.45);}
    if(effect==='enhancement')dy=-43*p;
    if(concentration>0){dy+=Math.sin(elapsed*3)*2*concentration;angle+=Math.sin(elapsed*2)*.035*concentration;}
    ctx.translate(500+dx,105+dy);ctx.rotate(angle);ctx.translate(-500,-105);
    if(effect==='specialization'){
      ctx.filter=`brightness(${1-.88*Math.min(1,p*2)}) saturate(${1-p})`;
      ctx.globalAlpha=1-Math.max(0,(p-.4)/.6);
    }
    ctx.drawImage(leaf,0,0);ctx.restore();
    if(effect==='specialization' && p>.4){
      ctx.save();ctx.clip(glassMask);ctx.filter='brightness(.13) saturate(.15)';ctx.globalAlpha=Math.min(1,(p-.4)*3);
      for(let i=0;i<9;i++){
        const x=418+i*18,y=86+(i%3)*9,fall=(p-.4)/.6*(80+(i*31)%150);
        ctx.save();ctx.translate(x+(i%2?18:-10),y+fall);ctx.rotate((i%2?1:-1)*p*.7);
        ctx.beginPath();ctx.moveTo(-8,-5);ctx.lineTo(-2,-13);ctx.lineTo(7,-6);ctx.lineTo(4,8);ctx.lineTo(-5,5);ctx.closePath();ctx.clip();
        ctx.drawImage(leaf,x,y,19,29,-9,-14,21,31);ctx.restore();
      }
      ctx.restore();
    }
    if(effect==='enhancement'){
      ctx.strokeStyle=`rgba(215,245,255,${.95*p})`;ctx.lineWidth=7;ctx.lineCap='round';
      for(const [x,y] of [[345,93],[654,93]]){
        ctx.beginPath();ctx.moveTo(x,y);ctx.bezierCurveTo(x-12,y+30,x+12,y+95*p,x+7,y+220*p);ctx.stroke();
        for(let i=0;i<3;i++){const drop=(elapsed*.7+i/3)%1;ctx.fillStyle=`rgba(222,248,255,${.9*p*(1-drop)})`;ctx.beginPath();ctx.ellipse(x+7,y+180*p+drop*150,4,8,0,0,Math.PI*2);ctx.fill();}
      }
    }
    if(concentration>0){
      ctx.save();ctx.globalAlpha=concentration;ctx.shadowColor='#d1ffe5';ctx.shadowBlur=12;
      for(const direction of [-1,1])for(let i=0;i<3;i++){
        const cycle=(elapsed*.55+i/3)%1;
        const x=500+direction*(300-135*cycle),y=300-120*cycle;
        ctx.strokeStyle=`rgba(213,255,226,${(1-cycle)*.7})`;ctx.lineWidth=4;
        ctx.beginPath();ctx.moveTo(x+direction*25,y+35);ctx.quadraticCurveTo(x,y+5,x-direction*12,y-12);ctx.stroke();
      }
      ctx.restore();
    }
    canvas.dataset.renderedEffect=effect;canvas.dataset.effectProgress=String(progress);
    canvas.dataset.concentration=concentration.toFixed(3);
  }
  function tick(now){
    frame=0;
    const dt=Math.min(80,now-lastTick);lastTick=now;
    elapsed=(now-started)/1000;
    if(effect!=='none')progress=Math.min(1,(now-started)/3600);
    concentration+=((concentrating?1:0)-concentration)*(1-Math.exp(-dt/180));
    if(Math.abs(concentration-(concentrating?1:0))<.002)concentration=concentrating?1:0;
    draw();
    if(!reduced.matches&&(concentrating||concentration>0||(effect!=='none'&&progress<1)))frame=requestAnimationFrame(tick);
  }
  function setConcentration(active){
    if(concentrating===active)return;
    concentrating=active;
    if(reduced.matches){concentration=active?.5:0;draw();return;}
    if(!frame){started=lastTick=performance.now();frame=requestAnimationFrame(tick);}
  }
  function setEffect(next){
    if(effect===next)return;
    cancelAnimationFrame(frame);frame=0;concentrating=false;concentration=0;elapsed=0;effect=next;progress=reduced.matches?1:0;started=lastTick=performance.now();draw();
    if(progress<1)frame=requestAnimationFrame(tick);
  }
  const motionChange=()=>{if(reduced.matches){cancelAnimationFrame(frame);frame=0;concentration=concentrating?.5:0;progress=effect==='none'?0:1;elapsed=0;draw();}};
  reduced.addEventListener('change',motionChange);
  image.addEventListener('load',prepare);
  if(image.complete)prepare();
  return {
    setEffect,setConcentration,
    reset(){cancelAnimationFrame(frame);frame=0;concentrating=false;concentration=0;elapsed=0;effect='none';progress=0;draw();},
    destroy(){cancelAnimationFrame(frame);image.removeEventListener('load',prepare);reduced.removeEventListener('change',motionChange);},
  };
}
