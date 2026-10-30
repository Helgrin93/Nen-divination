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
      <svg class="wing-table-contact" viewBox="0 0 1536 1024" aria-hidden="true"><defs><clipPath id="elbow-contact"><path d="M331 607H515V650Q510 666 482 667H363Q337 666 331 646ZM981 607H1168V646Q1162 666 1137 667H1015Q987 666 981 650Z"/></clipPath></defs><g fill="#584128" opacity=".23"><ellipse cx="423" cy="663" rx="82" ry="7"/><ellipse cx="1075" cy="663" rx="82" ry="7"/></g><g clip-path="url(#elbow-contact)"><image class="wing-elbows" href="${base}${wing.poses.neutral}" x="276.48" y="-109" width="983.04" height="773.32" preserveAspectRatio="none"/></g></svg>
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
    scene.querySelector('.wing-elbows')?.setAttribute('href',available.src);
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
