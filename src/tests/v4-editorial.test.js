import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {characters} from '../data/characters.js';
import {questions} from '../data/questions.js';
import {wingDivination} from '../components/divinationTimeline.js';
import {nenTypes} from '../data/nenTypes.js';

it('preserves every approved Italian character description verbatim',()=>{
  const spec=readFileSync('NEN_DIVINATION_V4_CODEX/NEN_DIVINATION_FINAL_POLISH_V4.md','utf8');
  const approved=[...spec.matchAll(/^\*\*([^*]+)\*\* — (.+)$/gm)];
  expect(approved).toHaveLength(30);
  for(const [,name,description] of approved){const c=characters.find(c=>c.name===name);expect(c?.description.it).toBe(description);expect(c.description.en.length).toBeGreaterThan(100);expect(c.image.malId).toBeGreaterThan(0);}
});
it('keeps Neferpitou in the catalog and out of all revelation dialogue',()=>{
  expect(characters.find(c=>c.slug==='neferpitou').nenType).toBe('specialization');
  expect(JSON.stringify([wingDivination,nenTypes.specialization.effect])).not.toMatch(/Neferpitou/i);
});
it('retains the approved master, Heavens Arena and four distinct Hunter missions',()=>{
  expect(questions[6].it).toContain('il tuo maestro di Nen');
  expect(questions[6].it).not.toContain('Wing');
  expect(questions[18].options.map(o=>o.it)).toEqual([
    'Proteggere una persona importante durante un viaggio pericoloso.',
    'Indagare su misteriose sparizioni in una città isolata.',
    'Infiltrarti in un’organizzazione criminale senza farti scoprire.',
    'Recuperare un antico manufatto custodito in un luogo pieno di trappole.',
  ]);
});
