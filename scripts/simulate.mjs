import { types } from '../src/data/questions.js';
import { seededRandom } from '../src/game/questionPicker.js';
import { createAttempt, selectAnswer, advance } from '../src/game/stateMachine.js';

const seed=20261117;
const random=seededRandom(seed), N=30000;
const wins=Object.fromEntries(types.map(t=>[t,0])),lengths={7:0,8:0,9:0};
function play(rng,choose){
  const s=createAttempt(rng);s.phase='quiz';
  while(['quiz','bonus'].includes(s.phase)){
    s.pause=false;
    const q=s.questions[s.index];selectAnswer(s,choose(q,rng).id);advance(s);
  }
  return s;
}
for(let i=0;i<N;i++){
  const s=play(random,(q,rng)=>q.options[Math.floor(rng()*4)]);
  wins[s.result.primary]++;lengths[s.questions.length]++;
}
const percentages=Object.fromEntries(types.map(t=>[t,Number((100*wins[t]/N).toFixed(3))]));
const synthetic={};
for(const type of types){
  let matches=0;
  for(let i=0;i<1000;i++){
    const s=play(random,q=>[...q.options].sort((a,b)=>b.weights[type]-a.weights[type])[0]);
    if(s.result.primary===type)matches++;
  }
  synthetic[type]=matches/10;
}
const report={seed,trials:N,uniformWinnerPercent:percentages,attemptLengths:lengths,syntheticTargetWinPercent:synthetic,note:'Synthetic model only; no measured psychological validity. Original calibration unchanged.'};
console.log(JSON.stringify(report,null,2));
const balanced=Object.values(percentages).every(p=>Math.abs(p-100/6)<=2);
const reachable=Object.values(synthetic).every(p=>p>50);
if(!balanced||!reachable)throw new Error('Simulation regression: unbalanced uniform winners or unreachable synthetic profile');
