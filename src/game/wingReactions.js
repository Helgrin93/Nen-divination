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
  let silentQuestions;
  const expressions=new Map();
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
      return null;
    },
    expressionForState(state){
      if(state.phase!=='quiz')return 'neutral';
      // One early expression, and occasionally a later one. This presentation
      // schedule never touches question order, answers or the scoring RNG.
      if(!silentQuestions){
        silentQuestions=new Set([1+Math.min(2,Math.floor(random()*3))]);
        if(random()<.5)silentQuestions.add(5+Math.min(1,Math.floor(random()*2)));
      }
      const key=state.questions[state.index].id;
      if(!expressions.has(key))expressions.set(key,silentQuestions.has(state.index)
        ? ['smile','gesture','eyesClosed'][Math.min(2,Math.floor(random()*3))] : 'neutral');
      return expressions.get(key);
    },
  };
}
