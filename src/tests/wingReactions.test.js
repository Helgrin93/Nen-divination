import { describe,it,expect } from 'vitest';
import { createWingReactions,wingReactions } from '../game/wingReactions.js';
import { translations } from '../data/translations.js';

const state=(index,pause=false)=>({phase:'quiz',index,pause,questions:Array.from({length:7},(_,i)=>({id:`q${i}`}))});
describe('Wing presentation reactions',()=>{
  it('varies occasional reactions and the guaranteed fourth-answer pause without repeating',()=>{
    const director=createWingReactions(()=>0);
    const seen=[director.forState(state(2)),director.forState(state(4,true)),director.forState(state(6))];
    expect(new Set(seen.map(item=>item.id)).size).toBe(3);
    expect(director.forState(state(0))).toBeNull();
    expect(director.forState(state(1))).toBeNull();
    expect(director.forState(state(5))).toBeNull();
    for(const reaction of wingReactions)for(const lang of ['it','en'])expect(translations[lang][reaction.id]).toBeTruthy();
  });
  it('keeps the same reaction on rerender, language changes and back navigation',()=>{
    let calls=0;
    const director=createWingReactions(()=>{calls++;return .75;});
    const first=director.forState(state(2));
    const snapshot=state(4,true),before=structuredClone(snapshot);
    const fourth=director.forState(snapshot);
    expect(director.forState(snapshot)).toBe(fourth);
    expect(director.forState(state(2))).toBe(first);
    expect(calls).toBe(2);expect(snapshot).toEqual(before);
  });
  it('does not replace bonus dialogue or react during concentration/results',()=>{
    const director=createWingReactions(()=>{throw Error('Unexpected visual random call');});
    for(const phase of ['intro','bonus','concentration','waterEffect','result'])expect(director.forState({...state(2),phase})).toBeNull();
  });
});
