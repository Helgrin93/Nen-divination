import { characters } from '../data/characters.js';
import { emblem } from './icons.js';

export function characterCards(type, lang, t) {
  return characters.filter(c => c.nenType === type).map(c => {
    const authorized = c.portraitSrc && c.permissionStatus === 'authorized';
    return `<article class="character-card"><div class="character-portrait">
      <div class="portrait-fallback">${emblem}<span>${c.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</span><small>${t.missing}</small></div>
      ${authorized ? `<img src="${import.meta.env.BASE_URL+c.portraitSrc.replace(/^\//,'')}" alt="${c.name}" loading="lazy" width="130" height="180">` : ''}
      </div><div class="character-copy"><h3>${c.name}</h3><p>${c.description[lang]}</p><a href="${c.sourceUrl}" target="_blank" rel="noopener noreferrer">${t.source} <span aria-hidden="true">↗</span></a></div></article>`;
  }).join('');
}
