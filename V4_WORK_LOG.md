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

## Fase C

- Potenziamento: cancellata la vecchia impronta della superficie con materiale realmente sommerso, traslata/rimappata la superficie originale senza foglia verso il bordo; il fronte sale insieme al resto del livello. Colature/gocce rese più leggibili e coerenti con tinta e opacità del liquido. Ripristino del labbro limitato alla sua maschera: nessuna fascia di sfondo, secondo calice o superficie congelata.
- Vignetta mobile portata vicino al busto di Wing e sopra il calice; risposte e camera conservate. Domande lunghe scorrevoli anche da tastiera. Intermezzi e Continua importanti separati dal bicchiere. Verifiche tattili a 320×700, 375×812, 390×844, 430×932, tablet e landscape.
- Hold conservato nella posizione inferiore, immediato per il pollice: test reali di eventi touch, 4,5 secondi, cancellazione, blur, tastiera e alternativa accessibile superati. Nessuna modifica arbitraria della durata o dello scoring.
- Export 1080×1350 conservato; aggiunta Story 1080×1920 dedicata, con radar identico, breve descrizione, tre personaggi stabili e area sticker Link. Copia link con fallback manuale selezionabile. Web Share continua a supportare file PNG e fallback download/cancellazione.
- I ritratti non hanno permessi di redistribuzione verificati: la Story li omette e mostra tre schede testuali reali. Il caricamento di ritratti autorizzati è predisposto con CORS, timeout e fallback; verificato anche un rifiuto HTTP/CORS senza bloccare il PNG. Non è dichiarato che immagini omesse siano presenti nell’export.
- Verifiche di fase: 28 unitari e build; 21 test di animazione superati su Chromium desktop/WebKit mobile, uno escluso perché golden PNG specifico di Chromium; 3 test mobile/Story superati, uno escluso duplicato; 2 test touch/hold su mobile superati. La golden approvata di Specializzazione è invariata fuori dalla correzione comune del vetro.
- Catturati frame 0/50/100% dei sei tipi desktop/mobile prima e dopo; registrazione reale delle sequenze e dei risultati in `.verification/v4/final/`. Esito della prima esecuzione mirata: un’asserzione precedente richiedeva Neferpitou, aggiornata al requisito V4; il controllo mobile ha richiesto di alzare ulteriormente la vignetta di pochi pixel.
- Scena superiore: confronto desktop identico byte per byte. Mobile con stessa emulazione: 10 pixel differiscono soltanto nel piccolo bordo del calice (x166–182, y88–102 su 390×242), causa residua non determinata; mani, camera, asset e stato conclusivo conservati. Il renderer del Potenziamento è l’unica modifica intenzionale all’effetto superiore.

## Fase D

- Audit scritto prima delle esclusioni: nessun file eliminato; base `water-clean.png` non usata dal runtime e cache dei ritratti non autorizzati escluse solo dal bundle pubblico. `table-clean.png`, tutti gli atlas, workflow, fixture e sorgenti conservati. Circa 2,33 MB evitati nel pacchetto pubblico. `.env*` ignorati con eccezione `.env.example`.
- README aggiornato a V4, dipendenze di rete e permessi descritti senza contraddizioni con il comportamento effettivo. Aggiunti rapporto finale e galleria con screenshot reali e video locali indicizzati.
- Suite estesa su cinque progetti: 185 casi, 163 superati, 21 esclusi, un problema reale a 320×568 nella review di concentrazione. Correzione: area di lettura interna scorrevole, con triangolo e bordo della vignetta conservati; il calice rimane scoperto. Il caso e le verifiche correlate sono stati ripetuti dopo la correzione.
- Ultimi ritocchi QA: ingresso morbido della vignetta senza animare Wing; Story con descrizione più breve e più grande, sticker/link e tre schede entro l’area utile, senza comprimere il desktop. Verifica dedicata di ritratti autorizzati con CORS riuscito, errore 403/CORS, PNG opaco, tre personaggi stabili, Web Share annullato e permesso negato con download.
- Build normale e `local-review` servite sotto `/nen-divination/` con successo e rete consentita. Il sandbox senza rete produce errori espliciti sui CDN, documentati; non sono stati nascosti dal test.
- Prestazioni: CPU 4×, DPR 1/2/3, p95 disegno del compositore 0,6–3,3 ms (misura parziale locale). Video completi decodificati: desktop 65,52 s, mobile 56,88 s.
- Dati e scoring confrontati con `8ea2133`: invariati. Le verifiche conclusive e i rispettivi comandi sono nel rapporto finale.
- Copertura finale aggregata: 169 E2E distinti superati, 21 esclusioni intenzionali su 190 casi disponibili; il conteggio comprende suite estesa e ripetizioni dopo le correzioni, non una singola esecuzione tutta verde. Ultimo controllo di lettura/dialoghi/bonus a 320×568: 3 superati, uno escluso duplicato. Nessun difetto riproducibile rimasto aperto; un tentativo desktop con navigazione durante la prova è passato nella ripetizione isolata.
