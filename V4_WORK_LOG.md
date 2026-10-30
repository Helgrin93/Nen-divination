# V4 — registro di lavorazione

Data: 30 ottobre 2026. Branch: `final-polish-v4`. Base: `8ea2133` (`main`).

## Stato iniziale e mappa

File tracciati puliti; pacchetto `NEN_DIVINATION_V4_CODEX/` non tracciato, conservato e incluso nel checkpoint A come specifica/riferimenti locali. Nessun reset, stash distruttivo, push o merge.

- Entrypoint: `src/main.js`; componenti HTML/Canvas/SVG, senza framework.
- Quiz: `stateMachine`, `questionPicker`, `bonusPicker`, `scoring`; dati originali in `questions_scoring.json` e `score_calibration.json`.
- Scena persistente: `QuizScene`, `HandsMotion`, `WaterScene`, `WaterArtPass`, `GlassComposition`, `sceneGeometry`; quattro pose Wing precaricate.
- Risultato: `ResultView`, `NenRadar`, `CharacterCards`, `resultPresentation`, `characters`, `characterImages`; PNG in `game/share.js`.
- CSS: base + quiz/divinazione/risultato/scena unificata. Review: `review/results.html`, `review/divination.html` (solo sviluppo).
- Verifiche: Vitest, simulazione 30.000 partite + 6.000 profili, Playwright Chromium/WebKit, server build sotto `/nen-divination/`.

## Piano

A. Stabilità, revisione editoriale, 30 personaggi, dialoghi separati e contatto gomiti/tavolo.
B. Radar canonico con kanji, scheda risultato e personaggi 3+2.
C. Acqua del Potenziamento, sei reazioni, mobile, hold, Story e copia link.
D. QA completa, audit del bundle/repository, README e rapporto con confronti.

## Baseline

- `npm.cmd test`: 25/25.
- `npm.cmd run build`: riuscita.
- E2E: tutti i 30 test desktop esistenti superati; anche due casi tablet superati e uno escluso prima di interrompere deliberatamente la baseline estesa per iniziare il lavoro. Non è presentata come suite completa.
- Catture baseline: `.verification/v4/baseline/` (desktop/mobile, tre risultati e quiz).

## Fase A

- Importate letteralmente dal mandato le 30 descrizioni IT; traduzioni EN statiche e fedeli. Cinque personaggi per categoria, ordine stabile, mapping editoriale esplicito.
- Recuperati dal catalogo Tenrai 205 record e identificate univocamente tutte le 30 identità, conservando i primi 18 ID/URL e le rispettive copie preesistenti. Nessun nuovo ritratto scaricato/ripubblicato nel runtime; diritti ancora non verificati.
- Controllate integralmente 24 domande e 96 risposte IT/EN: già conformi, nessuna riscrittura necessaria. q07 maestro Nen, Heavens Arena, q19 quattro missioni confermate. Dataset, vettori, bonus e calibrazione invariati.
- Battute brevi separate, automatiche dopo 3 secondi senza skip; reazione garantita dopo la quarta risposta, scelte varie e stabili. Bonus, introduzione alla concentrazione e rivelazione con Continua. Il cambio lingua non riavvia il timer breve.
- Rimossi riferimenti a Neferpitou dalle battute e descrizioni della rivelazione, conservando la scheda personaggio.
- Contatto dei gomiti ricomposto con un ritaglio SVG delle stesse pose decodificate, sagoma arrotondata e ombra sul tavolo. Nessun nuovo volto/asset; layer escluso dalla scena risultato per preservarla.
- Test: 28 unitari; simulazione superata (vincite casuali 15,56–17,557%, medesime della baseline); due E2E mirati desktop/mobile superati, con tempi, lingue e dialoghi importanti verificati; build riuscita.

Riferimenti sulle immagini: [Tenrai, condizioni §§3 e 6](https://tenrai.org/terms), consultate il 30 ottobre 2026. I metadati disponibili non costituiscono licenza delle illustrazioni.

## Fase B

- Radar SVG con ordine fisso Enhancement → Transmutation → Conjuration → Specialization → Manipulation → Emission; colori canonici, sei medaglioni kanji, riempimento del vincitore e valori reali del quiz. Nessuna icona/asterisco/tooltip sotto il radar.
- Etichette esterne alla griglia e ai medaglioni; corretta una collisione iniziale fra nome e percentuale, rilevata dal test geometrico a 320 px.
- Tre card iniziali e due aggiuntive in un pannello animato con `aria-expanded`, `aria-controls`, `inert`, focus stabile e movimento ridotto rispettato. Ordine immutabile, mobile a colonna, testi integrali.
- Descrizioni tecniche dei sei poteri già complete nella base: riviste e conservate; distinta la personalità dalle abilità e resa più equilibrata anche l’affinità secondaria di Manipolazione.
- Tutti i 30 ritratti verificati: HTTP 200, contenuto JPEG, decodifica browser e CORS canvas riusciti. Nessuna nuova copia immagine nel runtime. Log tecnico nel catalogo e in `.verification/v4/portrait-audit.json`. Pubblicazione delle immagini: diritti non verificati, nessun permesso dedotto.
- Verifiche: 28 unitari e build; E2E con due risultati × due lingue × sette larghezze (320/375/390/430/768/1280/1440), nessun testo tagliato/collisione/overflow, espansione 3+2 e focus corretti. Screenshot in `.verification/v4/phase-b/`.
