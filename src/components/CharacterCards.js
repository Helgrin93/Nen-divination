import { characters } from '../data/characters.js';

export function characterCards(type, lang, t) {
  return characters.filter(c => c.nenType === type).map(c => {
    const authorized = c.portraitSrc && c.permissionStatus === 'authorized';
    const preview = (import.meta.env.DEV || import.meta.env.MODE === 'local-review') && c.image?.localPreviewSrc;
    const src = authorized ? c.portraitSrc : preview;
    const source = c.image?.sourceUrl || c.sourceUrl;
    return `<article class="character-card"><div class="character-portrait">
      <div class="portrait-fallback"><small>${t.missing}</small></div>
      ${src ? `<img src="${import.meta.env.BASE_URL+src.replace(/^\//,'')}" alt="${c.name}" loading="lazy" width="130" height="180">` : ''}
      </div><div class="character-copy"><h3>${c.name}</h3><p>${c.description[lang]}</p><a href="${source}" target="_blank" rel="noopener noreferrer">${t.source} <span aria-hidden="true">↗</span></a></div></article>`;
  }).join('');
}
