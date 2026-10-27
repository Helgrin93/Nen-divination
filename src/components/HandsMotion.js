// Deform only the foreground of the approved painting. A continuous mesh keeps
// the original hands and table together, without cutout edges or duplicate hands.
const WIDTH=1536, TOP=720, HEIGHT=304, COLS=24, ROWS=8;
export function mountHandsMotion(scene){
  const image=scene.querySelector('.glass-plate'),canvas=scene.querySelector('.hands-motion');
  if(!image || !canvas)return {setActive(){},destroy(){}};
  const ctx=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let amount=0,target=0,frame=0,last=0;

  function vertex(x,y){
    const side=x<650?1:x>886?-1:0;
    const center=side===1?405:1131;
    const weight=side*Math.pow(Math.max(0,1-Math.abs(x-center)/245),2)*Math.sin(Math.PI*y/HEIGHT);
    return {x,y,dx:x+36*weight*amount,dy:y-9*Math.abs(weight)*amount};
  }
  function triangle(a,b,c){
    const det=(b.x-a.x)*(c.y-a.y)-(c.x-a.x)*(b.y-a.y);
    const xx=((b.dx-a.dx)*(c.y-a.y)-(c.dx-a.dx)*(b.y-a.y))/det;
    const xy=((c.dx-a.dx)*(b.x-a.x)-(b.dx-a.dx)*(c.x-a.x))/det;
    const yx=((b.dy-a.dy)*(c.y-a.y)-(c.dy-a.dy)*(b.y-a.y))/det;
    const yy=((c.dy-a.dy)*(b.x-a.x)-(b.dy-a.dy)*(c.x-a.x))/det;
    // Overlap clips by one source pixel so antialiasing never reveals the
    // unmoved underlay along internal mesh edges.
    const cx=(a.dx+b.dx+c.dx)/3,cy=(a.dy+b.dy+c.dy)/3;
    const expanded=p=>{const length=Math.hypot(p.dx-cx,p.dy-cy);return [p.dx+(p.dx-cx)/length,p.dy+(p.dy-cy)/length];};
    ctx.save();ctx.beginPath();ctx.moveTo(...expanded(a));ctx.lineTo(...expanded(b));ctx.lineTo(...expanded(c));ctx.closePath();ctx.clip();
    ctx.setTransform(xx,yx,xy,yy,a.dx-xx*a.x-xy*a.y,a.dy-yx*a.x-yy*a.y);
    ctx.drawImage(image,0,-TOP,WIDTH,1024);ctx.restore();
  }
  function draw(){
    ctx.clearRect(0,0,WIDTH,HEIGHT);
    // An opaque original underlay prevents hairline gaps between mesh triangles.
    ctx.drawImage(image,0,-TOP,WIDTH,1024);
    // Never resample the glass or its stem, including on WebKit's rasterizer.
    ctx.save();ctx.beginPath();ctx.rect(0,0,650,HEIGHT);ctx.rect(886,0,WIDTH-886,HEIGHT);ctx.clip();
    for(let row=0;row<ROWS;row++)for(let col=0;col<COLS;col++){
      if(col*WIDTH/COLS>=650 && (col+1)*WIDTH/COLS<=886)continue;
      const a=vertex(col*WIDTH/COLS,row*HEIGHT/ROWS);
      const b=vertex((col+1)*WIDTH/COLS,row*HEIGHT/ROWS);
      const c=vertex(col*WIDTH/COLS,(row+1)*HEIGHT/ROWS);
      const d=vertex((col+1)*WIDTH/COLS,(row+1)*HEIGHT/ROWS);
      triangle(a,b,c);triangle(b,d,c);
    }
    ctx.restore();
    canvas.dataset.approach=amount.toFixed(3);
  }
  function tick(now){
    frame=0;
    const dt=now-last;
    if(dt>=30){
      amount+=(target-amount)*(1-Math.exp(-Math.min(dt,80)/220));last=now;
      if(Math.abs(amount-target)<.002)amount=target;
      draw();canvas.hidden=amount===0;
    }
    if(amount!==target)frame=requestAnimationFrame(tick);
  }
  function setActive(active){
    target=active&&!reduced.matches?1:0;
    if(!image.complete || !image.naturalWidth)return;
    if(!frame && amount!==target){last=performance.now();canvas.hidden=false;frame=requestAnimationFrame(tick);}
  }
  const stop=()=>{cancelAnimationFrame(frame);frame=0;amount=target=0;canvas.hidden=true;canvas.dataset.approach='0';};
  const visibility=()=>{if(document.hidden)stop();};
  reduced.addEventListener('change',stop);document.addEventListener('visibilitychange',visibility);
  return {setActive,destroy(){stop();reduced.removeEventListener('change',stop);document.removeEventListener('visibilitychange',visibility);}};
}
