import './styles.css';
import { translations, preferredLanguage } from './data/translations.js';
import { nenTypes } from './data/nenTypes.js';
import { createAttempt, selectAnswer, advance, goBack, reveal } from './game/stateMachine.js';
import { wingScene, setupMentor } from './components/WingScene.js';
import { mountHold } from './components/HoldInteraction.js';
import { resultView } from './components/ResultView.js';
import { icon, emblem } from './components/icons.js';
import { shareResult } from './game/share.js';

let storage;
try { storage=window.localStorage; } catch { /* The app works without storage. */ }
let lang=preferredLanguage(storage,navigator.language);
let state=createAttempt(), cleanupHold=null, effectTimer=null, exporting=false, holdActive=false;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector('#app').innerHTML=`
  <header class="site-header"><div class="brand">${emblem}<div><span>NEN DIVINATION</span><small data-i18n="tagline"></small></div></div>
  <nav class="language-switch" aria-label="Language"><button data-lang="it" aria-label="Italiano">IT</button><span aria-hidden="true">/</span><button data-lang="en" aria-label="English">EN</button></nav></header>
  <main id="experience"><nav class="journey" aria-label="Progress"><span data-step="1"><b>01</b><span data-i18n="step1"></span></span><i></i><span data-step="2"><b>02</b><span data-i18n="step2"></span></span><i></i><span data-step="3"><b>03</b><span data-i18n="step3"></span></span></nav>
  ${wingScene()}<div id="content" class="content"></div></main>
  <footer class="site-footer"><span class="footer-mark">NEN DIVINATION <span aria-hidden="true">·</span> HUNTER × HUNTER</span><p data-i18n="fan"></p><p data-i18n="privacy"></p></footer>
  <div class="toast" role="status" aria-live="polite"></div>`;
const content=document.querySelector('#content'),scene=document.querySelector('.scene');
const setExpression=setupMentor(scene);
const t=()=>translations[lang];
function translate(){
  document.documentElement.lang=lang;
  document.title=`Nen Divination · ${t().tagline}`;
  scene.setAttribute('aria-label',t().tagline);
  document.querySelector('.journey').setAttribute('aria-label',lang==='it'?'Avanzamento':'Progress');
  document.querySelector('.language-switch').setAttribute('aria-label',lang==='it'?'Lingua':'Language');
  document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t()[el.dataset.i18n]);
  document.querySelectorAll('[data-lang]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.lang===lang)));
  if(state.result && ['waterEffect','result'].includes(state.phase)){
    scene.querySelector('.scene-effect-caption').textContent=state.phase==='result'?nenTypes[state.result.primary].effect[lang]:t().revealing;
  }
  if(holdActive){const label=document.querySelector('.hold-button span');if(label)label.textContent=t().holding;}
  const progress=document.querySelector('.hold-progress');if(progress)progress.setAttribute('aria-label',t().holding);
}
function focusHeading(){
  const heading=content.querySelector('h1,h2');
  if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
}
function bringContentIntoView(){
  const top=content.getBoundingClientRect().top;
  const headerHeight=document.querySelector('.site-header').offsetHeight;
  if(top<headerHeight || top>innerHeight*.7){
    window.scrollTo({top:window.scrollY+top-headerHeight-20,behavior:reducedMotion.matches?'instant':'smooth'});
  }
}
function render({focus=false}={}){
  cleanupHold?.();cleanupHold=null;holdActive=false;
  const tr=t(), phase=state.phase;
  document.body.dataset.phase=phase;
  scene.dataset.phase=phase;scene.classList.remove('is-holding');
  if(!['waterEffect','result'].includes(phase)){scene.dataset.effect='none';scene.querySelector('.scene-effect-caption').textContent='';}
  const step=phase==='intro'?1:['quiz','bonus'].includes(phase)?2:3;
  document.querySelectorAll('[data-step]').forEach(el=>{el.classList.toggle('active',Number(el.dataset.step)===step);if(Number(el.dataset.step)===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  document.documentElement.style.setProperty('--accent',phase==='result'?nenTypes[state.result.primary].color:'#c8b998');
  scene.querySelector('.scene-hold-slot').innerHTML='';
  if(phase==='intro'){
    setExpression('neutral');
    content.innerHTML=`<section class="intro-card overlay-card"><p class="eyebrow">${tr.eyebrow}</p><h1>${tr.title}<br><em>${tr.titleEm}</em></h1><div class="wing-dialogue"><span class="speaker">WING</span><p>“${tr.intro}”</p></div><p class="intro-note">${tr.introNote}</p><button class="button primary" data-action="begin">${tr.begin}${icon('arrow')}</button><div class="intro-meta"><span>${tr.duration}</span><span class="meta-dot">·</span><span>${tr.six}</span></div></section>`;
  }else if(phase==='quiz'||phase==='bonus'){
    if(state.pause){
      setExpression('smile');
      content.innerHTML=`<section class="interlude overlay-card"><span class="speaker">WING</span><h2>“${tr.interesting}”</h2><p>${tr.interestingNote}</p><button class="button primary" data-action="resume">${tr.next}${icon('arrow')}</button></section>`;
    }else{
      setExpression(state.index===2?'thinking':state.index===5?'curious':'neutral');
      const q=state.questions[state.index],total=state.index<7?7:state.index+1;
      content.innerHTML=`<section class="quiz-card overlay-card"><div class="question-meta"><span>${tr.question} <strong>${String(state.index+1).padStart(2,'0')}</strong> ${tr.of} ${total}</span><span class="question-marks" aria-hidden="true">${Array.from({length:total},(_,i)=>`<i class="${i<=state.index?'filled':''}"></i>`).join('')}</span></div>
      <div class="quiz-wing"><span class="speaker">WING</span><p>${state.index>=7?tr['bonus'+(state.index+1)]:tr.instinct}</p></div><h1 class="question-title">${q[lang]}</h1>
      <div class="answers">${q.options.map((o,i)=>`<button class="answer ${state.answers[q.id]===o.id?'is-selected':''}" data-option="${o.id}" aria-pressed="${state.answers[q.id]===o.id}"><span class="answer-letter" aria-hidden="true">${'ABCD'[i]}</span><span>${o[lang]}</span>${state.answers[q.id]===o.id?icon('check'):''}</button>`).join('')}</div>
      <div class="question-navigation"><button class="text-button" data-action="back" ${state.index===0?'disabled':''}>${icon('back')}${tr.back}</button><button class="button next-button" data-action="next" ${!state.answers[q.id]?'disabled':''}>${tr.next}${icon('arrow')}</button></div></section>`;
    }
  }else if(phase==='concentration'){
    setExpression('neutral');
    content.innerHTML=`<section class="focus-card overlay-card"><p class="eyebrow" data-i18n="step2"></p><h1 data-i18n="focusTitle"></h1><div class="wing-dialogue"><span class="speaker">WING</span><p data-i18n="focus"></p></div><p class="hold-help" data-i18n="holdHelp"></p><button class="text-button accessible-reveal" data-action="reveal" data-i18n="accessible"></button></section>`;
    scene.querySelector('.scene-hold-slot').innerHTML=`<button class="hold-button" aria-describedby="hold-description">${icon('hand')}<span data-i18n="hold"></span><small>4.5 s</small></button><div class="hold-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div><span id="hold-description" class="sr-only" data-i18n="holdHelp"></span><span class="hold-announcement sr-only" aria-live="polite"></span>`;
    const button=scene.querySelector('.hold-button');
    cleanupHold=mountHold({button,progress:scene.querySelector('.hold-progress'),onStart:()=>{
      holdActive=true;scene.classList.add('is-holding');button.querySelector('span').textContent=t().holding;scene.querySelector('.hold-announcement').textContent=t().holding;
    },onReset:()=>{holdActive=false;scene.classList.remove('is-holding');button.querySelector('span').textContent=t().hold;scene.querySelector('.hold-announcement').textContent=t().reset;},onComplete:completeHold});
  }else if(phase==='waterEffect'){
    setExpression('curious');
    content.innerHTML=`<section class="revelation-card overlay-card" aria-live="polite"><p class="eyebrow">NEN DIVINATION</p><h1>${tr.revealTitle}</h1><p>${tr.revealing}</p><div class="reveal-indicator" aria-hidden="true"></div></section>`;
  }else if(phase==='result'){
    setExpression('smile');
    content.innerHTML=`<p class="wing-result-line"><span class="speaker">WING</span> “${tr.revealed}”</p>${resultView(state.result,lang,tr)}`;
    content.querySelectorAll('.character-portrait img').forEach(img=>img.addEventListener('error',()=>img.remove(),{once:true}));
  }
  translate();
  if(focus)focusHeading();
}
function completeHold(){
  if(!reveal(state))return;
  render({focus:true});
  scene.dataset.effect=state.result.primary;
  effectTimer=setTimeout(()=>{
    if(state.phase!=='waterEffect')return;
    state.phase='result';render({focus:true});
  },reducedMotion.matches?150:2700);
}
let toastTimer;
function toast(message){const el=document.querySelector('.toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),6000);}
document.addEventListener('click',async e=>{
  const language=e.target.closest('[data-lang]');
  if(language){
    lang=language.dataset.lang;try{storage?.setItem('lang',lang);}catch{ /* optional */ }
    if(state.phase==='concentration')translate();else render();
    return;
  }
  const option=e.target.closest('[data-option]');
  if(option){selectAnswer(state,option.dataset.option);render();content.querySelector(`[data-option="${option.dataset.option}"]`).focus({preventScroll:true});return;}
  const action=e.target.closest('[data-action]')?.dataset.action;
  if(!action)return;
  if(action==='begin'){state.phase='quiz';render({focus:true});bringContentIntoView();}
  if(action==='resume'){state.pause=false;render({focus:true});bringContentIntoView();}
  if(action==='next'){
    advance(state);render({focus:true});
    if(state.phase==='concentration')scene.scrollIntoView({block:'start',behavior:reducedMotion.matches?'instant':'smooth'});
    else bringContentIntoView();
  }
  if(action==='back'){goBack(state);render({focus:true});bringContentIntoView();}
  if(action==='reveal')completeHold();
  if(action==='replay'){
    clearTimeout(effectTimer);state=createAttempt();scene.dataset.effect='none';render({focus:true});window.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});
  }
  if((action==='save'||action==='share')&&state.phase==='result'&&!exporting){
    exporting=true;
    const controls=content.querySelectorAll('[data-action="save"],[data-action="share"]');controls.forEach(b=>{b.disabled=true;b.setAttribute('aria-busy','true');});
    try{const status=await shareResult(state.result,lang,action==='share');toast(t()[status]);}
    catch(error){console.error('PNG export failed',error);toast(t().exportError);}
    finally{exporting=false;controls.forEach(b=>{b.disabled=false;b.removeAttribute('aria-busy');});}
  }
});
render();
