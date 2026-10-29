export const clamp=n=>Math.max(0,Math.min(1,n));
export const smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
export const divinationEffects={
  enhancement:{duration:6200,stages:['stir','rise','meniscus','overflow','settled'],cuts:[.12,.30,.40,.94]},
  emission:{duration:5000,stages:['clear','diffusion','uniform'],cuts:[.12,.88]},
  transmutation:{duration:4800,stages:['ripple','taste','sweet'],cuts:[.30,.90]},
  conjuration:{duration:5600,stages:['clear','materialize','suspended','settled'],cuts:[.10,.40,.85]},
  manipulation:{duration:6000,stages:['tremble','drift','turn','settled'],cuts:[.15,.40,.91]},
  specialization:{duration:7600,stages:['fade','curl','brittle','fragment','sink'],cuts:[.24,.44,.62,.82]},
};
export function sampleDivination(effect,time){
  const spec=divinationEffects[effect];
  if(!spec)return {duration:0,progress:0,stage:'rest',rise:0,colour:0,travel:0,wither:0};
  const progress=clamp(time/spec.duration),stage=spec.stages[spec.cuts.filter(cut=>progress>=cut).length];
  return {duration:spec.duration,progress,stage,rise:smooth((progress-.08)/.32),colour:smooth((progress-.10)/.72),travel:smooth((progress-.10)/.82),wither:clamp((progress-.10)/.66)};
}
export const wingDivination={
  enhancement:{it:'Guarda il bordo: il volume dell’acqua sta aumentando.',en:'Watch the rim. The volume of water is increasing.'},
  emission:{it:'Il colore si diffonde nell’acqua. È una prova di Emissione.',en:'The colour is spreading through the water. This is Emission.'},
  transmutation:{it:'È diventata dolce. Eppure l’aspetto è lo stesso.',en:'It tastes sweet. Yet it looks the same.'},
  conjuration:{it:'Vedi quei piccoli residui? Si stanno formando dentro l’acqua.',en:'See those tiny specks? They are forming inside the water.'},
  manipulation:{it:'La foglia si muove e ruota: la tua aura ne guida il movimento.',en:'The leaf is moving and turning. Your aura is guiding it.'},
  specialization:{it:'La foglia appassisce e si sfalda, come nella prova di Neferpitou. È una possibile manifestazione della Specializzazione.',en:'The leaf is withering and breaking apart, as in Neferpitou’s test. This is one possible manifestation of Specialization.'},
};
export const wingTransmutationIntro={
  it:'L’acqua sembra la stessa. Aspetta… osserviamo con calma.',
  en:'The water looks the same. Wait… let us watch carefully.',
};
