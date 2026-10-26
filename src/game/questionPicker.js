import { questions, dimensions } from '../data/questions.js';

export function seededRandom(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickQuestions(random = Math.random) {
  const chosen = dimensions.map(d => {
    const group = questions.filter(q => q.dimension === d);
    return group[Math.floor(random() * group.length)];
  });
  const extraArea = dimensions[Math.floor(random() * dimensions.length)];
  const remaining = questions.filter(q => q.dimension === extraArea && !chosen.includes(q));
  chosen.push(remaining[Math.floor(random() * remaining.length)]);
  return shuffle(chosen, random);
}
