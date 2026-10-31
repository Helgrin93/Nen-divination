# Nen Divination V4 — microfix finali

Data: 31 ottobre 2026. Modifiche locali, senza commit, push, merge o pubblicazione.

## Correzioni

- **Domande su smartphone:** vignetta e triangolo ancorati alle proporzioni della camera esistente, nella fascia tra mento e bordo del calice. Occhi, occhiali e volto restano liberi. Padding ridotto; testo lungo scorrevole senza rimpicciolire Wing o spostare la scena. Su 320 × 568 la vignetta offre una riga intera iniziale e lo scroll interno permette di leggere il resto.
- **Risposte e navigazione:** due righe di griglia distinte per elenco scorrevole e pulsanti. L'elenco ha altezza minima zero, spazio finale e margini di scroll; la navigazione riserva anche `safe-area-inset-bottom`. La quarta risposta può essere portata interamente sopra i pulsanti. Una nuova domanda riparte dall'inizio dell'elenco; la selezione e il cambio lingua conservano lo scroll corrente.
- **Gomiti:** raccordo SVG locale delle maniche, contorno inferiore curvo, fusione del bordo superiore e ombre di contatto sfumate. Le quattro pose continuano a usare gli stessi PNG, senza ridisegno del personaggio.
- **Bicchiere:** l'arancione proviene dal raster e rimaneva sul labbro posteriore perché la correzione era limitata al contorno della coppa. Estesa la maschera al bordo superiore; neutralizzati soltanto i pixel caldi selezionati, conservandone la luminanza. Riflessi chiari, inchiostro e corpo del calice restano invariati. Nessuna modifica alle sei animazioni.
- **Inizia e Continua:** rimossi gli scostamenti laterali. Pulsanti centrati. Su mobile introduzione e dialoghi importanti occupano l'area libera sotto la scena, con il pulsante subito sotto la vignetta; sul desktop il pulsante resta centrato sotto il calice, senza coprire vetro o mani.
- **Ritmo:** un solo commento breve dopo la quarta risposta, scelto tra le frasi bilingui esistenti, separato dalla domanda e con avanzamento automatico dopo circa tre secondi. Rimossi i commenti dopo la seconda e la sesta risposta. Bonus e istruzione prima della divinazione mantengono il pulsante Continua.
- **Presenza di Wing:** uno o due cambi silenziosi di espressione per tentativo, con posizioni variabili e memorizzate. Le reazioni usano l'espressione associata. Il caricamento attende la decodifica e mantiene una posa disponibile in caso di errore. Nessun nuovo movimento continuo; nessun battito artificiale ottenuto alternando pose dell'intero corpo.
- **Conclusione:** dialogo separato con sorriso, testo esatto IT/EN e pulsante Continua. La scheda finale aspetta l'utente; la didascalia della divinazione viene rimossa per evitare testo aggiuntivo e sovrapposizioni.

> IT: «Ecco… La tua affinità Nen si è manifestata.»  
> EN: «There… Your Nen affinity has revealed itself.»

Sfondo, tappeto, crepe, proporzioni della camera e PNG originali sono conservati. Non sono stati modificati domande, risposte, punteggi, radar, scheda finale, catalogo dei personaggi, descrizioni, salvataggio, condivisione o ripetizione del quiz. Le uniche traduzioni modificate sono le due battute conclusive.

## Screenshot prima e dopo

Aprire la [galleria di confronto](docs/v4-microfix/confronto.html), anche tramite il server locale: `http://localhost:5173/docs/v4-microfix/confronto.html`. La galleria è un documento di verifica e non entra nella build pubblica.

Screenshot iniziali acquisiti prima delle modifiche ai file applicativi; stessa lingua e sequenza casuale per il confronto.

| Viewport / motore | Prima | Dopo | Quarta risposta dopo scroll |
| --- | --- | --- | --- |
| Desktop 1440 × 900 / Chromium | [Domanda](docs/v4-microfix/before/desktop-quiz.png) | [Domanda](docs/v4-microfix/after/desktop-quiz.png) | [Risposte](docs/v4-microfix/after/desktop-last-answer.png) |
| iPhone 390 × 844 / WebKit | [Domanda](docs/v4-microfix/before/iphone-quiz.png) | [Domanda](docs/v4-microfix/after/iphone-quiz.png) | [Ultima risposta](docs/v4-microfix/after/iphone-last-answer.png) |
| iPhone piccolo 320 × 568 / WebKit | [Domanda](docs/v4-microfix/before/iphone-small-quiz.png) | [Domanda](docs/v4-microfix/after/iphone-small-quiz.png) | [Ultima risposta](docs/v4-microfix/after/iphone-small-last-answer.png) |
| Android 412 × 915 / Chromium | [Domanda](docs/v4-microfix/before/android-quiz.png) | [Domanda](docs/v4-microfix/after/android-quiz.png) | [Ultima risposta](docs/v4-microfix/after/android-last-answer.png) |

Altre evidenze:

- Introduzione: [desktop prima](docs/v4-microfix/before/desktop-intro.png), [desktop dopo](docs/v4-microfix/after/desktop-intro.png), [iPhone dopo](docs/v4-microfix/after/iphone-intro.png).
- Gomiti e calice: [scena prima](docs/v4-microfix/before/desktop-scene.png), [scena dopo](docs/v4-microfix/after/desktop-scene.png).
- Viewport ridotta: [iPhone 390 × 744](docs/v4-microfix/after/iphone-browser-bars.png), [iPhone piccolo 320 × 468](docs/v4-microfix/after/iphone-small-browser-bars.png).
- [Unico commento breve](docs/v4-microfix/after/iphone-interlude.png), [concentrazione](docs/v4-microfix/after/iphone-concentration.png).
- Conclusione: [IT su iPhone](docs/v4-microfix/after/iphone-conclusion-it.png), [EN su iPhone piccolo](docs/v4-microfix/after/iphone-small-conclusion-en.png).
- Risultato: [desktop](docs/v4-microfix/after/desktop-result.png), [iPhone](docs/v4-microfix/after/iphone-result.png).

Le misure complete sono salvate in [before/geometry.json](docs/v4-microfix/before/geometry.json) e [after/geometry.json](docs/v4-microfix/after/geometry.json). A 390 × 844 il bordo superiore della vignetta passa da circa 193 a 223 px; a 320 × 568 da circa 145 a 164 px. In tutti e quattro i confronti la camera mantiene le stesse coordinate e dimensioni. Il layout delle domande desktop resta identico.

## Verifiche

| Verifica | Esito |
| --- | --- |
| `npm.cmd test` | 29 test superati, sei file. |
| `npm.cmd run test:simulation` | 30.000 partite e 6.000 profili sintetici superati; stessa calibrazione: 19.218 / 7.013 / 3.769 tentativi da 7 / 8 / 9 domande. |
| Suite browser mirata iniziale | 62 superati, 8 esclusioni previste su sette progetti. |
| `npx.cmd playwright test --workers=2` | 246 superati, 34 esclusioni previste, nessun fallimento; sette progetti, 11,6 minuti. |
| Ripetizione finale `e2e/v4-microfix.spec.js` e `e2e/v4-dialogue.spec.js` | 19 superati, 2 esclusioni previste, nessun fallimento su tutti e sette i progetti dopo gli ultimi affinamenti CSS. |
| `npm.cmd run build` | Superata. |
| `npm.cmd run test:build` | Superata su desktop e mobile: quiz completo, risultato e download PNG sotto `/nen-divination/`; richieste asset riuscite. |
| Screenshot prima/dopo | Quattro viewport; WebKit per i due iPhone, Chromium per desktop e Android. |

I test includono tutte le risposte selezionabili, anche usando i testi più lunghi del catalogo in IT/EN, ordine e selezioni conservati al cambio lingua, scroll riportato all'inizio al cambio domanda, safe area inferiore simulata di 34 px e riduzione/ripristino dell'altezza di 100 px. La suite esistente controlla inoltre tutte le domande in IT/EN, i percorsi bonus 8/9, le sei divinazioni, i fotogrammi approvati della Specializzazione, caricamento lento/asset assenti, radar, personaggi, PNG, Story, condivisione e Riprova.

Le esclusioni della suite completa sono duplicati intenzionali fuori dal desktop e il confronto PNG specifico di Chromium su WebKit. Nella ripetizione finale sono esclusi soltanto i due casi di lettura mobile sui progetti desktop e tablet. I 19 controlli finali ripetono casi della suite completa e non sono conteggiati come ulteriori casi distinti.

I metadati Playwright della suite completa e della ripetizione finale riportano entrambi `status: passed` e `failedTests: []`.

Log locali: `.verification/microfix-targeted.log`, `.verification/microfix-e2e.log`, `.verification/microfix-final-targeted.log`, `.verification/microfix-build.log`, `.verification/microfix-production.log`, `.verification/microfix-simulation.log`, `.verification/microfix-screenshots.log`. Anche `git diff --check` è superato.

## File modificati o aggiunti

| File | Intervento |
| --- | --- |
| `src/styles/unified-scene.css` | Ancoraggio mobile, scroll, safe area, pulsanti e dialoghi importanti. |
| `src/components/QuizScene.js` | Curve delle maniche, fusione e ombre di contatto SVG. |
| `src/components/GlassComposition.js` | Maschera del labbro posteriore e correzione cromatica selettiva. |
| `src/game/wingReactions.js` | Un solo commento e variazioni silenziose memorizzate. |
| `src/main.js` | Espressioni del quiz e rimozione della didascalia durante la conclusione. |
| `src/data/translations.js` | Battuta conclusiva esatta in italiano e inglese. |
| `src/tests/wingReactions.test.js` | Frequenza dei commenti, espressioni e stato immutato. |
| `e2e/v4-microfix.spec.js` | Geometria, safe area, viewport dinamica, leggibilità e selezione. |
| `e2e/v4-dialogue.spec.js` | Unico commento, tempi e conclusione bilingue. |
| `e2e/v2-scene.spec.js`, `e2e/rendering.spec.js` | Aspettative aggiornate alla regia delle espressioni silenziose. |
| `playwright.config.js` | Aggiunti Android 412 × 915 e WebKit 320 × 568. |
| `scripts/review-microfix.mjs` | Acquisizione ripetibile di screenshot e geometria. |
| `docs/v4-microfix/` | Screenshot prima/dopo, misure e galleria di confronto. |
| `V4_MICROFIX_REPORT.md` | Questo rapporto. |

## Limiti residui

La verifica Safari è eseguita con WebKit e input touch emulato, compresi resize e safe area simulata. Non equivale a una prova su iPhone fisico con le barre native di Safari: quella verifica resta da effettuare sul dispositivo. Anche Android è emulato.

Sulle viewport più piccole, le domande lunghe richiedono lo scroll della vignetta e le risposte quello dell'elenco. È una scelta per preservare leggibilità, scena e libertà del volto; ogni testo e risposta resta raggiungibile. Il battito di ciglia dedicato non è stato aggiunto perché gli asset disponibili sono quattro pose complete, non fotogrammi degli occhi allineati per un battito isolato.

## Verifica personale

Dalla cartella del progetto eseguire `npm.cmd run dev`, quindi aprire `http://localhost:5173/`. Per i confronti usare `http://localhost:5173/docs/v4-microfix/confronto.html`.

Per ripetere le acquisizioni dopo le modifiche, con Vite attivo: `node scripts/review-microfix.mjs`. L'opzione `--before` serve a registrare una nuova baseline e sovrascrive gli screenshot iniziali: non usarla per rivedere questo confronto.
