import { nenTypes } from '../data/nenTypes.js';
import {resultPresentation,resultRadarOrder as radarOrder} from '../data/resultPresentation.js';

export function radarPoint(index, radius, cx = 240, cy = 190) {
  const angle = (index * 60 - 90) * Math.PI / 180;
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
}

export function nenRadar(values, t) {
  const points = radius => radarOrder.map((_, i) => radarPoint(i, radius).join(',')).join(' ');
  return `<figure class="radar-figure"><figcaption class="sr-only">${t.relative}</figcaption>
    <svg class="nen-radar" viewBox="0 -18 480 414" role="img" aria-label="${t.relative}">
      ${[.2,.4,.6,.8,1].map(s => `<polygon points="${points(138*s)}" fill="none" stroke="${s===1?'#b9c6cb':'#34434c'}" stroke-width="${s===1?1.1:.7}"/>`).join('')}
      ${radarOrder.map((_,i) => `<path d="M240 190 ${radarPoint(i,138).join(' ')}" stroke="#34434c" stroke-width=".7"/>`).join('')}
      <g class="radar-shape"><polygon points="${radarOrder.map((type,i) => radarPoint(i,138*values[type]/100).join(',')).join(' ')}" fill="var(--accent)" fill-opacity=".3" stroke="var(--accent)" stroke-width="1.5"/>
      ${radarOrder.map((type,i) => { const [x,y] = radarPoint(i,138*values[type]/100); return `<circle cx="${x}" cy="${y}" r="2.5" fill="#e0ede9"/>`; }).join('')}</g>
      ${radarOrder.map((type,i) => { const [x,y] = radarPoint(i,174),colour=resultPresentation[type].colour;return `<g class="radar-axis" data-nen="${type}" data-value="${values[type]}"><title>${nenTypes[type].name}: ${values[type]}%</title><text x="${x}" y="${y-6}" text-anchor="middle" fill="${colour}" font-family="Georgia,serif" font-size="24">${nenTypes[type].name}</text><text x="${x}" y="${y+23}" text-anchor="middle" fill="${colour}" font-family="Georgia,serif" font-size="32">${values[type]}%</text></g><circle cx="${radarPoint(i,138)[0]}" cy="${radarPoint(i,138)[1]}" r="2" fill="#edf1ef"/>`; }).join('')}
    </svg><details class="radar-explanation"><summary>${t.relative} <span aria-hidden="true">ⓘ</span></summary><p>${t.relativeNote}</p></details>
  </figure>`;
}
