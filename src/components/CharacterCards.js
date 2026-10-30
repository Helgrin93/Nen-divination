import { charactersFor } from '../data/characters.js';

export function portraitSource(character) {
  if(character.portraitSrc && character.permissionStatus==='authorized')return character.portraitSrc;
  // Preserve the existing local review cache; do not redistribute new copies.
  if((import.meta.env.DEV||import.meta.env.MODE==='local-review')&&character.image?.cachedPortraitSrc)return import.meta.env.BASE_URL+character.image.cachedPortraitSrc;
  return character.image?.portraitUrl || null;
}

export function characterCards(type, lang, t, {extra=false}={}) {
  return charactersFor(type).slice(extra?3:0,extra?5:3).map(c => {
    const src=portraitSource(c),source=c.image?.sourceUrl;
    return `<article class="character-card" data-character="${c.slug}" data-mal-id="${c.image?.malId||''}"><div class="character-portrait">
      <div class="portrait-fallback" role="status"><small>${t.missing}</small></div>
      ${src?`<img src="${src}" alt="${t.portrait}: ${c.name}" loading="lazy" decoding="async" referrerpolicy="no-referrer" width="225" height="350">`:''}
      </div><div class="character-copy"><h3>${c.name}</h3><p>${c.description[lang]}</p>${source?`<a href="${source}" target="_blank" rel="noopener noreferrer">${t.source} <span aria-hidden="true">↗</span></a>`:''}</div></article>`;
  }).join('');
}

export function setupCharacterCards(root,t) {
  for(const img of root.querySelectorAll('.character-portrait img')){
    const failed=()=>{img.closest('.character-portrait').dataset.imageStatus='unavailable';img.remove();};
    img.addEventListener('error',failed,{once:true});
    if(img.complete&&!img.naturalWidth)failed();
  }
  const button=root.querySelector('[data-action=characters]'),panel=root.querySelector('#extra-characters');
  if(!button||!panel)return;
  button.addEventListener('click',()=>{
    const expanded=button.getAttribute('aria-expanded')!=='true';
    button.setAttribute('aria-expanded',String(expanded));button.textContent=expanded?t.showLess:t.showMore;
    panel.inert=!expanded;panel.setAttribute('aria-hidden',String(!expanded));
    panel.classList.toggle('is-expanded',expanded);
  });
}
