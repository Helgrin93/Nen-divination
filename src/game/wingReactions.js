// Presentation only. Never consume the quiz's random generator or inspect scores.
export const wingReactions = [
  { id:'interesting', expression:'smile' },
  { id:'understood', expression:'neutral' },
  { id:'letsSee', expression:'gesture' },
  { id:'curious', expression:'neutral' },
  { id:'veryGood', expression:'eyesClosed' },
];

function visualRandom(){
  return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296;
}

export function createWingReactions(random=visualRandom){
  let remaining=[],last=null;
  const events=new Map();
  function choose(key){
    if(events.has(key))return events.get(key);
    if(!remaining.length)remaining=[...wingReactions];
    const choices=remaining.filter(item=>item.id!==last);
    const chosen=choices[Math.min(choices.length-1,Math.floor(random()*choices.length))];
    remaining=remaining.filter(item=>item!==chosen);
    last=chosen.id;
    events.set(key,chosen);
    return chosen;
  }
  return {
    forState(state){
      if(state.phase!=='quiz')return null;
      if(state.pause)return choose('after-fourth-answer');
      // Only two optional reactions, once each; bonus dialogue is left alone.
      if(state.index===2 || state.index===6)return choose(`question-${state.questions[state.index].id}`);
      return null;
    },
  };
}
