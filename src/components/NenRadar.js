import { nenTypes, radarOrder } from '../data/nenTypes.js';

export function radarPoint(index, radius, cx = 240, cy = 190) {
  const angle = (index * 60 - 90) * Math.PI / 180;
  return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius];
}

export function nenRadar(values, t) {
  const points = radius => radarOrder.map((_, i) => radarPoint(i, radius).join(',')).join(' ');
  return `<figure class="radar-figure"><figcaption class="sr-only">${t.relative}</figcaption>
    <svg class="nen-radar" viewBox="0 0 480 380" role="img" aria-label="${t.relative}">
      ${[.2,.4,.6,.8,1].map(s => `<polygon points="${points(124*s)}" fill="none" stroke="#34434c" stroke-width="${s===1?1.3:.7}"/>`).join('')}
      ${radarOrder.map((_,i) => `<path d="M240 190 ${radarPoint(i,124).join(' ')}" stroke="#34434c" stroke-width=".7"/>`).join('')}
      <g class="radar-shape"><polygon points="${radarOrder.map((type,i) => radarPoint(i,124*values[type]/100).join(',')).join(' ')}" fill="var(--accent)" fill-opacity=".3" stroke="var(--accent)" stroke-width="1.5"/>
      ${radarOrder.map((type,i) => { const [x,y] = radarPoint(i,124*values[type]/100); return `<circle cx="${x}" cy="${y}" r="2.5" fill="#e0ede9"/>`; }).join('')}</g>
      ${radarOrder.map((type,i) => { const [x,y] = radarPoint(i,167); return `<text x="${x}" y="${y-6}" text-anchor="middle" fill="#d9e0e1" font-family="Georgia,serif" font-size="18">${nenTypes[type].name}</text><text x="${x}" y="${y+20}" text-anchor="middle" fill="${nenTypes[type].color}" font-family="Arial,sans-serif" font-size="23">${values[type]}%</text>`; }).join('')}
    </svg><details class="radar-explanation"><summary>${t.relative} <span aria-hidden="true">ⓘ</span></summary><p>${t.relativeNote}</p></details>
  </figure>`;
}
