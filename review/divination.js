// Separate development entry: never bundled with the production app.
import '../src/styles.css';
import '../src/styles/quiz-scene.css';
import '../src/styles/divination.css';
import '../src/styles/unified-scene.css';
import './divination.css';
import { quizScene,setupQuizScene } from '../src/components/QuizScene.js';
import { mountHandsMotion } from '../src/components/HandsMotion.js';
import { mountWaterScene } from '../src/components/WaterScene.js';
import { mountHold } from '../src/components/HoldInteraction.js';
import { divinationEffects,wingDivination,wingTransmutationIntro } from '../src/components/divinationTimeline.js';
import { nenTypes } from '../src/data/nenTypes.js';
if(!import.meta.env.DEV)throw new Error('The animation preview is development-only.');
document.body.dataset.phase='concentration';
document.querySelector('#app').innerHTML=`<header class="site-header"><span class="brand">Divinazione · Studio animazioni</span><button class="text-button" data-restart>Ricomincia</button></header><main id="experience"><section class="scene" data-phase="concentration" data-effect="none" aria-label="Anteprima delle sei divinazioni">${quizScene()}<div class="content"><section class="focus-card"><div class="speech-bubble"><span class="speaker">WING</span><h1>Avvicina le mani al bicchiere.</h1><p data-dialogue>Concentrati sull’acqua. Lascia che l’aura fluisca, senza forzare.</p></div></section></div><div class="scene-hold-slot"><button class="hold-button"><span>Tieni premuto</span><small>4,5 s</small></button><div class="hold-progress" role="progressbar" aria-label="Concentrazione" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><button class="text-button accessible-reveal" data-rest>Mostra riposo</button></div><p class="scene-effect-caption" aria-live="polite"></p></section></main><aside class="review-controls" aria-label="Controlli animazione"><label>Tipo Nen <select data-type>${Object.keys(divinationEffects).map(type=>`<option value="${type}">${nenTypes[type].it}</option>`).join('')}</select></label><div class="review-actions"><button data-play>Avvia / ripeti</button><button data-pause>Pausa</button><button data-reset>Concentrazione</button></div><label>Tempo <input data-time type="range" min="0" max="6200" step="10" value="0"><output data-clock>0,00 s</output></label><div class="review-options"><label>Lingua <select data-language><option value="it">IT</option><option value="en">EN</option></select></label><label>Inquadratura <select data-view><option value="scene">Scena</option><option value="result">Risultato</option></select></label><label>Formato <select data-size><option value="responsive">Responsive</option><option value="390">Mobile 390</option><option value="1440">Desktop 1440</option></select></label></div><p data-status aria-live="polite">Pronto · seleziona un tipo o prova la pressione.</p></aside>`;
const scene=document.querySelector('.scene'),hands=mountHandsMotion(scene),water=mountWaterScene(scene);
const expression=setupQuizScene(scene),button=document.querySelector('.hold-button'),type=document.querySelector('[data-type]'),slider=document.querySelector('[data-time]');
let cleanup,language='it';expression('neutral');hands.setPhase('concentration');
function dialogue(){
  const tasting=type.value==='transmutation',sweet=water.getState().stage==='sweet';
  document.querySelector('.focus-card h1').textContent=language==='it'?'Osserva l’acqua.':'Watch the water.';
  document.querySelector('[data-dialogue]').textContent=(tasting&&!sweet?wingTransmutationIntro:wingDivination[type.value])[language];
  document.querySelector('.scene-effect-caption').textContent=tasting&&!sweet?(language==='it'?'L’acqua rimane limpida. Osserva le piccole increspature.':'The water stays clear. Watch the tiny ripples.'):nenTypes[type.value].effect[language];
}
function view(){const phase=document.querySelector('[data-view]').value==='result'?'result':scene.dataset.effect==='none'?'concentration':'waterEffect';scene.dataset.phase=phase;document.body.dataset.phase=phase;}
function play(){cleanup?.();water.reset();scene.dataset.effect=type.value;hands.setPhase('waterEffect');hands.setActive(false);scene.classList.remove('is-holding');document.querySelector('.scene-hold-slot').hidden=true;dialogue();view();expression('curious');water.setEffect(type.value,{restart:true});slider.max=divinationEffects[type.value].duration;document.querySelector('[data-pause]').textContent='Pausa';}
function start(){
  cleanup?.();water.reset();scene.dataset.effect='none';scene.dataset.phase='concentration';document.body.dataset.phase='concentration';document.querySelector('[data-view]').value='scene';
  scene.classList.remove('is-holding');hands.setPhase('concentration');hands.setActive(false);expression('neutral');document.querySelector('.focus-card h1').textContent='Avvicina le mani al bicchiere.';button.disabled=false;button.querySelector('span').textContent='Tieni premuto';document.querySelector('.scene-hold-slot').hidden=false;
  document.querySelector('.hold-progress').style.setProperty('--progress',0);document.querySelector('.hold-progress').setAttribute('aria-valuenow','0');document.querySelector('.scene-effect-caption').textContent='';document.querySelector('[data-dialogue]').textContent='Concentrati sull’acqua. Lascia che l’aura fluisca, senza forzare.';
  cleanup=mountHold({button,progress:document.querySelector('.hold-progress'),onStart(){hands.setPhase('concentration');hands.setActive(true);water.setConcentration(true);scene.classList.add('is-holding');button.querySelector('span').textContent='Concentrati…';},onReset(){hands.setActive(false);water.setConcentration(false);scene.classList.remove('is-holding');button.querySelector('span').textContent='Tieni premuto';},onComplete:play});
}
document.querySelector('[data-restart]').addEventListener('click',start);document.querySelector('[data-reset]').addEventListener('click',start);
document.querySelector('[data-rest]').addEventListener('click',()=>{start();hands.setPhase('quiz');});
document.querySelector('[data-play]').addEventListener('click',play);
type.addEventListener('change',play);
document.querySelector('[data-pause]').addEventListener('click',()=>{water.getState().paused?water.resume():water.pause();});
slider.addEventListener('input',()=>{if(water.getState().effect==='none')play();water.pause();water.seek(slider.value);});
document.querySelector('[data-language]').addEventListener('change',e=>{language=e.target.value;document.documentElement.lang=language;if(water.getState().effect!=='none')dialogue();});
document.querySelector('[data-view]').addEventListener('change',view);
document.querySelector('[data-size]').addEventListener('change',e=>{
  if(e.target.value==='responsive')return;
  const width=Number(e.target.value),height=width===390?844:900;
  window.open(`${import.meta.env.BASE_URL}review/divination.html?type=${type.value}`,'nen-divination-device',`popup=yes,width=${width},height=${height}`);
  e.target.value='responsive';
});
scene.addEventListener('divinationcomplete',()=>{expression('smile');});
scene.addEventListener('divinationstage',({detail})=>{if(detail.effect==='transmutation'){dialogue();expression(detail.stage==='sweet'?'smile':'curious');}});
function status(){const s=water.getState();slider.value=s.elapsed;document.querySelector('[data-clock]').textContent=`${(s.elapsed/1000).toFixed(2)} / ${(s.duration/1000).toFixed(2)} s`;document.querySelector('[data-pause]').textContent=s.paused?'Riprendi':'Pausa';document.querySelector('[data-status]').textContent=`${s.effect} · ${s.stage} · ${s.paused?'pausa':s.progress===1?'completata':'in esecuzione'}`;requestAnimationFrame(status);}start();status();
window.divinationReview={hands,water,scene,play,start};
const requested=new URLSearchParams(location.search).get('type');
if(Object.hasOwn(divinationEffects,requested)){type.value=requested;play();}
