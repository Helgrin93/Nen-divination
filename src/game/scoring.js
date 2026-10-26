import calibration from '../../score_calibration.json' with { type: 'json' };
import { types } from '../data/questions.js';

export function rawCenteredScores(questions, answers) {
  const scores = Object.fromEntries(types.map(t => [t, 0]));
  for (const q of questions) {
    const selected = q.options.find(o => o.id === answers[q.id]);
    if (!selected) throw new Error('Missing answer: ' + q.id);
    for (const t of types) {
      const baseline = q.options.reduce((sum, o) => sum + o.weights[t], 0) / 4;
      scores[t] += selected.weights[t] - baseline;
    }
  }
  return scores;
}

export function calibratedScores(centered, n = 7) {
  const scale = Math.sqrt(7 / n);
  return Object.fromEntries(types.map(t => [t, centered[t] * scale / calibration.sd[t] + calibration.offset[t]]));
}

export function rankScores(scores, questions = [], answers = {}) {
  const counts = Object.fromEntries(types.map(t => [t, { 3: 0, 2: 0 }]));
  for (const q of questions) {
    const o = q.options.find(o => o.id === answers[q.id]);
    if (!o) throw new Error('Missing answer: ' + q.id);
    for (const t of types) if (o.weights[t] === 3 || o.weights[t] === 2) counts[t][o.weights[t]]++;
  }
  return [...types].sort((a, b) => scores[b] - scores[a] || counts[b][3] - counts[a][3] || counts[b][2] - counts[a][2] || a.localeCompare(b));
}

export function radarValues(scores) {
  const values = Object.values(scores);
  const low = Math.min(...values), high = Math.max(...values);
  return Object.fromEntries(types.map(t => [t, high === low ? 50 : Math.round(20 + 80 * (scores[t] - low) / (high - low))]));
}

export function evaluate(questions, answers) {
  if (questions.length < 7 || questions.length > 9) throw new Error('A result requires 7–9 answers');
  const centered = rawCenteredScores(questions, answers);
  const scores = calibratedScores(centered, questions.length);
  const ranking = rankScores(scores, questions, answers);
  const gap = scores[ranking[0]] - scores[ranking[1]];
  return { scores, ranking, primary: ranking[0], secondary: ranking[1], gap, radar: radarValues(scores), needsBonus: questions.length < 9 && gap <= calibration.bonus_threshold };
}
