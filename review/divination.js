// Local review entry, deliberately excluded from Vite's production entrypoints.
import '../src/styles.css';
import '../src/styles/quiz-scene.css';
import '../src/styles/divination.css';
import '../src/styles/unified-scene.css';
import { quizScene,setupQuizScene } from '../src/components/QuizScene.js';
import { mountHandsMotion } from '../src/components/HandsMotion.js';
import { mountWaterScene } from '../src/components/WaterScene.js';
import { mountHold } from '../src/components/HoldInteraction.js';

document.body.dataset.phase='concentration';
document.querySelector('#app').innerHTML=`<header class="site-header"><span class="brand">Prova Potenziamento</span><button class="text-button" data-restart style="color:#f4ecdc">Ricomincia</button></header><main id="experience"><section class="scene" data-phase="concentration" data-effect="none" aria-label="Prova locale della divinazione">${quizScene()}<div class="content"><section class="focus-card"><div class="speech-bubble"><span class="speaker">WING</span><h1>Avvicina le mani al bicchiere.</h1><p>Concentrati sull’acqua. Lascia che l’aura fluisca, senza forzare.</p></div></section></div><div class="scene-hold-slot"><button class="hold-button"><span>Tieni premuto</span><small>4,5 s</small></button><div class="hold-progress" role="progressbar" aria-label="Concentrazione" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><button class="text-button accessible-reveal" data-rest>Mostra riposo</button></div><p class="scene-effect-caption" aria-live="polite"></p></section></main>`;
const scene=document.querySelector('.scene'),hands=mountHandsMotion(scene),water=mountWaterScene(scene);
setupQuizScene(scene)('neutral');hands.setPhase('concentration');
const button=document.querySelector('.hold-button');
let cleanup;
function start(){
  cleanup?.();water.reset();scene.dataset.phase='concentration';scene.dataset.effect='none';
  scene.classList.remove('is-holding');hands.setPhase('concentration');hands.setActive(false);
  button.disabled=false;button.querySelector('span').textContent='Tieni premuto';
  document.querySelector('.scene-hold-slot').hidden=false;
  document.querySelector('.hold-progress').style.setProperty('--progress',0);
  document.querySelector('.hold-progress').setAttribute('aria-valuenow','0');
  document.querySelector('.scene-effect-caption').textContent='';
  cleanup=mountHold({button,progress:document.querySelector('.hold-progress'),
    onStart(){hands.setPhase('concentration');hands.setActive(true);water.setConcentration(true);scene.classList.add('is-holding');button.querySelector('span').textContent='Concentrati…';},
    onReset(){hands.setActive(false);water.setConcentration(false);scene.classList.remove('is-holding');button.querySelector('span').textContent='Tieni premuto';},
    onComplete(){scene.dataset.phase='waterEffect';scene.dataset.effect='enhancement';hands.setPhase('waterEffect');hands.setActive(false);water.setEffect('enhancement');scene.classList.remove('is-holding');button.disabled=true;document.querySelector('.scene-hold-slot').hidden=true;document.querySelector('.scene-effect-caption').textContent='Il livello dell’acqua sale, fino a superare il bordo.';},
  });
}
document.querySelector('[data-restart]').addEventListener('click',start);
document.querySelector('[data-rest]').addEventListener('click',()=>{start();hands.setPhase('quiz');});
start();
// Diagnostic access stays confined to this explicitly separate review entry.
window.divinationReview={hands,water,scene};
