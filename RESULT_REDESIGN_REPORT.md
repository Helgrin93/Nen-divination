# Scheda risultati — revisione dal mockup

La modifica riguarda esclusivamente il contenuto inferiore del risultato. Il nuovo allegato rosso/verde/giallo/viola/bianco/blu guida tipografia, pannelli, bordi, spaziature, simboli e disposizione. La scena illustrata superiore del mockup non viene usata.

## Risultato

- Primo pannello: titolo luminoso nel colore della categoria, nome italiano, personalità e radar esagonale con valori reali del quiz. Ogni asse ha il proprio colore. L'ordine visuale degli assi segue il nuovo mockup; l'algoritmo non cambia.
- Seconda fascia: potere Nen esteso con simbolo, nome e descrizione, affiancato alla seconda affinità su desktop; due pannelli impilati su smartphone. La frase sulle affinità vicine compare solo quando il risultato reale soddisfa la condizione già esistente.
- Terzo pannello: tre personaggi del catalogo curato, ritratto, nome, abilità e collegamento alla fonte. Conservati Kurapika, Kite e Shizuku per Materializzazione: il mockup non modifica le associazioni Nen del catalogo.

Le descrizioni generiche di Netero, Meruem e Biscuit sono sostituite con una breve spiegazione dell'abilità effettiva, in entrambe le lingue. Riscontri: [sinossi ufficiale NTV, episodio 126](https://www.ntv.co.jp/hunterhunter/story/126.html), [Meruem](https://hunterxhunter.fandom.com/wiki/Meruem), [Biscuit](https://hunterxhunter.fandom.com/wiki/Biscuit_Krueger). Le identità e le categorie restano quelle del catalogo locale.
- Pulsanti: Salva risultato, Condividi e Riprova. Il PNG rimane 1080×1350; palette e assi dell'esportazione ora corrispondono alla scheda. Condivisione nativa e download alternativo conservati.

Palette limitata alla presentazione dei risultati: Potenziamento verde, Emissione giallo, Trasmutazione viola, Materializzazione rosso, Manipolazione bianco/grigio, Specializzazione blu. `nenTypes.js`, domande, pesi, calibrazione, bonus, logica del quiz e animazioni non sono modificati.

## Scena superiore conservata

Nessuna modifica a `QuizScene.js`, `WaterScene.js`, `WaterArtPass.js`, `HandsMotion.js`, `GlassComposition.js`, `sceneGeometry.js`, timeline o asset scenici. Le dimensioni preesistenti della scena desktop e mobile sono mantenute nel CSS del risultato. L'oggetto DOM della scena e i due canvas restano gli stessi durante la transizione e il cambio lingua.

Acquisita la scena prima e dopo tramite il quiz reale con risposte riproducibili. Per Materializzazione, screenshot della sola scena, byte del canvas dell'acqua e coordinate del contenitore coincidono esattamente su desktop e mobile. I test confrontano inoltre acqua, mani e geometria durante entrambi i cambi di lingua in ciascuno dei sei risultati.

## Ritratti: verifica e condizioni

I 18 URL già presenti in `src/data/characterImages.json` hanno risposto **HTTP 200**, con MIME immagine e decodifica browser **225×350**. Nomi, ID MAL, URL e associazioni Nen sono conservati; nessuna immagine generata con AI, iniziale o avatar sostitutivo. Copie esatte in `public/assets/characters/<slug>.jpg`, circa 678 kB complessivi, disponibili anche offline e nella build con prefisso `/nen-divination/`.

`imageVerification` registra data, stato HTTP, dimensione in byte e SHA-256. Sorgenti e crediti MyAnimeList via Tenrai rimangono nel catalogo; ciascuna scheda collega la pagina del personaggio. Lo script `scripts/cache-result-portraits.mjs` verifica gli URL esatti; `--install` verifica gli hash delle copie prima di installarle. L'importatore Tenrai conserva una copia verificata quando ID e URL non cambiano.

Verificati i [termini Tenrai, sezioni 3 e 6](https://tenrai.org/terms): consentono di memorizzare le risposte API, ma non concedono una licenza sulle immagini di terzi. Perciò **`permissionStatus` resta `unverified`**. L'integrazione locale richiesta non viene dichiarata una verifica dei diritti di redistribuzione. La pagina dei termini MyAnimeList non è risultata accessibile dallo strumento web; non si attribuiscono condizioni non lette. Nessuna pubblicazione automatica.

## Anteprima e materiali

- Anteprima diretta: http://localhost:5173/review/results.html — selettore dei sei tipi, IT/EN, salvataggio e condivisione. Usa gli stessi componenti della build e risultati calcolati dal motore esistente su risposte orientate alla categoria; non percentuali inventate dal mockup. Pagina esclusa dalla build di produzione.
- App completa: http://localhost:5173/
- Prima: `.verification/result-redesign/before/`.
- Dopo: `.verification/result-redesign/final/` e `.verification/result-redesign/e2e/`.
- Verifica immagini e contatto dei 18 ritratti: `.verification/result-redesign/portrait-audit.json`, `portraits-contact.png`.
- Acquisizioni riproducibili: `node scripts/review-result-layout.mjs --phase=final --types=enhancement,emission,transmutation,conjuration,manipulation,specialization`.

La documentazione precedente in `ASSET_STATUS.md` descrive revisioni storiche: l'assenza di immagini e il vecchio pannello espandibile non descrivono questa nuova scheda.

## Verifiche

`e2e/result-layout.spec.js` completa il quiz reale per ogni categoria e ricalcola i risultati dalle risposte selezionate. Verifica testi IT/EN, sei valori e colori del radar, seconda affinità, tre identità MAL, decodifica immagini, contenimento dei titoli, disposizione responsive, persistenza dei canvas, PNG, condivisione nativa simulata e download alternativo. Formati: desktop, tablet, mobile, 320 pixel e WebKit mobile. **30 casi superati**.

I test del flusso esistente passano su desktop e WebKit mobile, compreso il giro offline di tutti i risultati sul desktop. Un controllo immediato di larghezza su WebKit è fallito nel giro parallelo; il caso isolato è poi passato. I 30 test dedicati verificano il contenimento dopo il caricamento effettivo dei ritratti.

`npm.cmd test`: **25 test superati**. `npm.cmd run build` e `npm.cmd run test:build`: **riusciti**. Nessun push, commit o deploy eseguito.
