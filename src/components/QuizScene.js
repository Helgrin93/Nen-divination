// One photographic scene and one canvas persist from the quiz to the result.
import { wing } from '../data/wing.js';
import { wingOcclusionMask } from './sceneGeometry.js';
const base = import.meta.env.BASE_URL;

export function quizScene() {
  return `<div class="quiz-scene-art" aria-hidden="true">
    <div class="water-stage unified-stage" style='--wing-occlusion:${wingOcclusionMask}'>
      <img class="glass-plate room-backdrop" src="${base}assets/scene-v3/unified-goblet-scene.png" width="1536" height="1024" alt="" fetchpriority="high">
      <img class="rug-border-repair" src="${base}assets/divination/rug-border-repair.png" width="1536" height="1024" alt="">
      <canvas class="hands-motion" width="1536" height="512" hidden></canvas>
      <div class="scene-plate wing-plate">${Object.entries(wing.poses).map(([expression,src])=>`<img class="wing-sprite${expression==='neutral'?' is-active':''}" data-pose="${expression}" src="${base}${src}" alt="" ${expression==='neutral'?'fetchpriority="high"':''}>`).join('')}</div>
      <canvas class="water-effects" width="1536" height="1024"></canvas>
    </div>
  </div>`;
}

export function setupQuizScene(scene) {
  const sprites=[...scene.querySelectorAll('.wing-sprite')];
  const ready=new Set();
  let requested='neutral';
  function setExpression(expression){
    requested=expression;
    const pose=expression==='curious'?'gesture':expression==='thinking'?'eyesClosed':expression;
    const available=sprites.find(img=>img.dataset.pose===pose && ready.has(img))
      || sprites.find(img=>img.classList.contains('is-active') && ready.has(img))
      || sprites.find(img=>img.dataset.pose==='neutral' && ready.has(img))
      || sprites.find(img=>ready.has(img));
    scene.dataset.expression=expression;
    // Keep the current frame until the replacement has loaded AND decoded.
    if(!available){
      if(sprites.every(img=>img.hidden))scene.dataset.pose='unavailable';
      return;
    }
    scene.dataset.pose=available.dataset.pose;
    sprites.forEach(img=>img.classList.toggle('is-active',img===available));
  }
  sprites.forEach(img=>{
    async function decode(){
      try{
        await img.decode();
        if(!img.naturalWidth || img.hidden)return;
        ready.add(img);img.dataset.ready='true';setExpression(requested);
      }catch{ /* The current sprite remains visible if decoding fails. */ }
    }
    img.addEventListener('load',decode,{once:true});
    if(img.complete&&img.naturalWidth)decode();
  });
  scene.querySelectorAll('.quiz-scene-art img').forEach(img => {
    img.addEventListener('error', () => {
      img.hidden = true;
      ready.delete(img);
      if(img.matches('.wing-sprite')){
        setExpression(requested);
        if(scene.dataset.pose!=='unavailable')return;
      }
      scene.dataset.previewAsset = 'missing';
    }, { once: true });
  });
  return setExpression;
}
