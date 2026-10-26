import { questions } from '../data/questions.js';
import calibration from '../../score_calibration.json' with { type: 'json' };

export function pickBonus(used, first, second) {
  const areas = {};
  for (const q of used) areas[q.dimension] = (areas[q.dimension] || 0) + 1;
  const spread = q => {
    const differences = q.options.map(o => o.weights[first] / calibration.sd[first] - o.weights[second] / calibration.sd[second]);
    return Math.max(...differences) - Math.min(...differences);
  };
  return questions.filter(q => !used.some(u => u.id === q.id)).sort((a, b) =>
    spread(b) - spread(a) || (areas[a.dimension] || 0) - (areas[b.dimension] || 0) || a.id.localeCompare(b.id)
  )[0];
}
