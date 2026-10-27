import { nenTypes } from '../data/nenTypes.js';
import { nenRadar } from './NenRadar.js';
import { characterCards } from './CharacterCards.js';
import { icon } from './icons.js';

export function resultView(result, lang, t) {
  const type = nenTypes[result.primary];
  return `<div class="result-view">
    <section class="result-main panel"><div class="result-copy"><p class="eyebrow">${t.resultLabel}</p><h1 class="nen-title" tabindex="-1">${type.name}</h1>
      ${lang==='it' ? `<p class="nen-subtitle">${type.it}</p>` : ''}
      <p class="personality">${type.personality[lang]}</p>
      <div class="secondary-card"><span>${t.secondary}</span><strong>${nenTypes[result.secondary].name}</strong>${result.gap<=.35 ? `<small>${t.close}</small>` : ''}</div>
    </div>${nenRadar(result.radar,t)}</section>
    <details class="meaning panel" open><summary>${t.means}<span class="chevron" aria-hidden="true"></span></summary><div class="meaning-content"><p>${type.ability[lang]}</p><p class="water-explanation">${type.effect[lang]}</p><small>${t.traitsNote}</small></div></details>
    <section class="characters panel"><h2 id="characters-heading">${t.characters}</h2><div class="character-grid" role="region" aria-labelledby="characters-heading" tabindex="0">${characterCards(result.primary,lang,t)}</div></section>
    <div class="result-actions"><button class="button" data-action="save">${icon('download')}${t.save}</button><button class="button share-button" data-action="share">${icon('share')}${t.share}</button><button class="button" data-action="replay">${icon('replay')}${t.replay}</button></div>
    <p class="quiz-disclaimer">${t.ludic}</p>
  </div>`;
}
