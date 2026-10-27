// One photographic scene and one canvas persist from the quiz to the result.
import { wing } from '../data/wing.js';
const preview = import.meta.env.DEV || import.meta.env.MODE === 'local-review';
const base = import.meta.env.BASE_URL;

export function quizScene() {
  // Release assets have not been supplied yet. Do not ship private reference crops
  // or issue requests for invented asset paths in the normal production build.
  if (!preview) return '<div class="quiz-scene-art"><p class="scene-asset-notice" data-i18n="sceneMissing"></p></div>';
  return `<div class="quiz-scene-art" aria-hidden="true">
    <div class="water-stage unified-stage">
      <img class="glass-plate room-backdrop" src="${base}assets/scene-v3/unified-goblet-scene.png" width="1536" height="1024" alt="" fetchpriority="high">
      <canvas class="hands-motion" width="1536" height="304" hidden></canvas>
      <div class="scene-plate wing-plate">${Object.entries(wing.poses).map(([expression,src])=>`<img class="wing-sprite${expression==='neutral'?' is-active':''}" data-pose="${expression}" src="${base}${src}" alt="" ${expression==='neutral'?'fetchpriority="high"':''}>`).join('')}</div>
      <canvas class="water-effects" width="1000" height="563"></canvas>
    </div>
  </div>`;
}

export function setupQuizScene(scene) {
  const sprites=[...scene.querySelectorAll('.wing-sprite')];
  let requested='neutral';
  function setExpression(expression){
    requested=expression;
    const pose=expression==='curious'?'gesture':expression==='thinking'?'eyesClosed':expression;
    const available=sprites.find(img=>img.dataset.pose===pose && !img.hidden)
      || sprites.find(img=>img.dataset.pose==='neutral' && !img.hidden);
    scene.dataset.expression=expression;
    scene.dataset.pose=available?.dataset.pose || 'unavailable';
    sprites.forEach(img=>img.classList.toggle('is-active',img===available));
  }
  scene.querySelectorAll('.quiz-scene-art img').forEach(img => {
    img.addEventListener('error', () => {
      img.hidden = true;
      if(img.matches('.wing-sprite')){
        setExpression(requested);
        if(scene.dataset.pose!=='unavailable')return;
      }
      scene.dataset.previewAsset = 'missing';
    }, { once: true });
  });
  return setExpression;
}
