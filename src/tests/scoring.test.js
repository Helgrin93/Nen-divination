import { describe,it,expect,vi } from 'vitest';
import { questions,types } from '../data/questions.js';
import { rawCenteredScores,calibratedScores,rankScores,radarValues,evaluate } from '../game/scoring.js';
import calibration from '../../score_calibration.json' with {type:'json'};
import { pickQuestions,seededRandom } from '../game/questionPicker.js';

describe('Centered calibrated scoring',()=>{
  it('subtracts the exact per-question baseline',()=>{
    expect(rawCenteredScores([questions[0]],{q01:'q01_1'})).toEqual({enhancement:2.25,emission:1.25,transmutation:0,conjuration:-1.25,manipulation:-1.25,specialization:-1});
  });
  it('rejects missing or foreign answer IDs instead of inventing a result',()=>{
    expect(()=>rawCenteredScores([questions[0]],{})).toThrow('Missing answer: q01');
    expect(()=>rawCenteredScores([questions[0]],{q01:'q02_1'})).toThrow();
    expect(()=>evaluate([],{})).toThrow();
  });
  it('uses supplied constants and sqrt(7/n) scaling before offsets',()=>{
    const scores=Object.fromEntries(types.map(t=>[t,3]));
    for(const n of [7,8,9])for(const t of types)expect(calibratedScores(scores,n)[t]).toBeCloseTo(3*Math.sqrt(7/n)/calibration.sd[t]+calibration.offset[t],12);
  });
  it('breaks exact ties by weight 3, then weight 2, then alphabetic ID',()=>{
    const scores=Object.fromEntries(types.map(t=>[t,0]));
    expect(rankScores(scores)[0]).toBe('conjuration');
    const ranked=rankScores(scores,[questions[0]],{q01:'q01_1'});
    expect(ranked.slice(0,2)).toEqual(['enhancement','emission']);
  });
  it('normalizes the radar relatively, with percent endpoints 20 and 100',()=>{
    expect(Object.values(radarValues(Object.fromEntries(types.map(t=>[t,0]))))).toEqual([50,50,50,50,50,50]);
    const values=radarValues(Object.fromEntries(types.map((t,i)=>[t,i-3])));
    expect(Math.min(...Object.values(values))).toBe(20);expect(Math.max(...Object.values(values))).toBe(100);
    expect(Object.values(values).reduce((a,b)=>a+b)).not.toBe(100);
  });
  it('is deterministic even when Math.random would throw',()=>{
    const chosen=pickQuestions(seededRandom(5)),answers=Object.fromEntries(chosen.map(q=>[q.id,q.options[1].id]));
    const expected=evaluate(chosen,answers);
    const spy=vi.spyOn(Math,'random').mockImplementation(()=>{throw Error('Random result forbidden');});
    try{expect(evaluate(chosen,answers)).toEqual(expected);}finally{spy.mockRestore();}
  });
});
