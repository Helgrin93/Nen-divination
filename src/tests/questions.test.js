import { describe,it,expect } from 'vitest';
import { questions,types,dimensions } from '../data/questions.js';
import { pickQuestions,seededRandom } from '../game/questionPicker.js';
import { pickBonus } from '../game/bonusPicker.js';
import calibration from '../../score_calibration.json' with {type:'json'};
import { characters } from '../data/characters.js';

describe('Original bilingual question bank',()=>{
  it('preserves 24 questions, 96 stable option IDs and 3/2/1 vectors',()=>{
    expect(questions).toHaveLength(24);
    const options=questions.flatMap(q=>q.options);
    expect(options).toHaveLength(96);expect(new Set(options.map(o=>o.id)).size).toBe(96);
    for(const q of questions){
      expect(q.options).toHaveLength(4);expect(q.it).toBeTruthy();expect(q.en).toBeTruthy();
      for(const o of q.options){
        expect(o.it).toBeTruthy();expect(o.en).toBeTruthy();expect(Object.keys(o.weights).sort()).toEqual([...types].sort());
        expect(Object.values(o.weights).sort()).toEqual([0,0,0,1,2,3]);
      }
    }
    for(const d of dimensions)expect(questions.filter(q=>q.dimension===d)).toHaveLength(4);
    expect(questions.find(q=>q.id==='q03').it).toContain('Heavens Arena');
    expect(JSON.stringify(questions)).not.toContain('Torre Celeste');
  });
  it('covers all areas, has no duplicates and distributes extra areas uniformly',()=>{
    const rng=seededRandom(113), extra=Object.fromEntries(dimensions.map(d=>[d,0]));
    for(let n=0;n<6000;n++){
      const selected=pickQuestions(rng);expect(selected).toHaveLength(7);expect(new Set(selected.map(q=>q.id)).size).toBe(7);
      const counts=dimensions.map(d=>selected.filter(q=>q.dimension===d).length);
      expect([...counts].sort()).toEqual([1,1,1,1,1,2]);extra[dimensions[counts.indexOf(2)]]++;
    }
    Object.values(extra).forEach(n=>expect(n).toBeGreaterThan(850));
    Object.values(extra).forEach(n=>expect(n).toBeLessThan(1150));
  });
  it('picks the most discriminating unused bonus after standardization',()=>{
    const used=pickQuestions(seededRandom(63)),a='enhancement',b='emission';
    const spread=q=>{const d=q.options.map(o=>o.weights[a]/calibration.sd[a]-o.weights[b]/calibration.sd[b]);return Math.max(...d)-Math.min(...d);};
    const chosen=pickBonus(used,a,b);
    expect(used.some(q=>q.id===chosen.id)).toBe(false);
    expect(spread(chosen)).toBeCloseTo(Math.max(...questions.filter(q=>!used.includes(q)).map(spread)));
    expect(pickBonus(used,a,b).id).toBe(chosen.id);
  });
  it('has exactly three specified characters for each type and no unauthorized images',()=>{
    expect(characters).toHaveLength(18);expect(new Set(characters.map(c=>c.slug)).size).toBe(18);
    types.forEach(type=>expect(characters.filter(c=>c.nenType===type)).toHaveLength(3));
    expect(characters.filter(c=>c.nenType==='conjuration').map(c=>c.slug)).toEqual(['kurapika','kite','shizuku']);
    characters.forEach(c=>{expect(c.description.it).toBeTruthy();expect(c.description.en).toBeTruthy();expect(c.permissionStatus==='authorized'||!c.portraitSrc).toBe(true);});
  });
});
