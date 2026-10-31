import { describe,it,expect } from 'vitest';
import { createWingReactions,wingReactions } from '../game/wingReactions.js';
import { translations } from '../data/translations.js';

const state=(index,pause=false)=>({phase:'quiz',index,pause,questions:Array.from({length:7},(_,i)=>({id:`q${i}`}))});
describe('Wing presentation reactions',()=>{
  it('speaks only after the fourth answer and keeps the existing localized phrases',()=>{
    const director=createWingReactions(()=>0);
    for(let i=0;i<7;i++)expect(director.forState(state(i))).toBeNull();
    expect(wingReactions).toContain(director.forState(state(4,true)));
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
    expect(calls).toBe(1);expect(snapshot).toEqual(before);
  });
  it('caches occasional silent expressions without mutating quiz state or choosing a predictable question',()=>{
    const positions=new Set();
    for(const chance of [0,.4,.99]){
      const director=createWingReactions(()=>chance),snapshot=state(0),before=structuredClone(snapshot);
      expect(director.expressionForState(snapshot)).toBe('neutral');
      expect(snapshot).toEqual(before);
      const poses=Array.from({length:7},(_,i)=>director.expressionForState(state(i)));
      expect(poses.filter(p=>p!=='neutral').length).toBeGreaterThanOrEqual(1);
      expect(poses.filter(p=>p!=='neutral').length).toBeLessThanOrEqual(2);
      positions.add(poses.findIndex(p=>p!=='neutral'));
      for(let i=6;i>=0;i--)expect(director.expressionForState(state(i))).toBe(poses[i]);
    }
    expect(positions.size).toBe(3);
  });
  it('does not replace bonus dialogue or react during concentration/results',()=>{
    const director=createWingReactions(()=>{throw Error('Unexpected visual random call');});
    for(const phase of ['intro','bonus','concentration','waterEffect','result'])expect(director.forState({...state(2),phase})).toBeNull();
  });
});
