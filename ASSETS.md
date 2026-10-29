# Provenienza degli asset

Stato aggiornato: [ASSET_STATUS.md](ASSET_STATUS.md). La scena completa viene inclusa nella build di produzione; permessi da documentare sotto.

| Materiale | Provenienza | Stato |
| --- | --- | --- |
| Quattro espressioni Wing | PNG trasparenti preesistenti in `public/assets/scene-v3/wing-*.png` | Inclusi nella build richiesta; fonte e permessi non verificati, nessuna licenza attribuita |
| Muro con tappeto e crepe | `public/assets/scene-v3/wall-rug.png`, imagegen integrato, 27 ottobre 2026; riferimento allegato dall'utente | Generato su richiesta esplicita; solo fondale senza persone. Prompt: `assets/scene/wall-rug.prompt.md` |
| Tavolo, mani e calice | `reference/ANIME_HANDS_GLASS_REFERENCE.png` fornito dall'utente | Usato nell'anteprima privata; permessi di redistribuzione non verificati |
| Montaggio scenico | Muro raster e Wing separati; tavolo/mani/calice preesistenti | Ritaglio responsive del muro; mani non isolate in livelli separati |
| 18 ritratti | MyAnimeList via [Tenrai](https://api.tenrai.org/v1/anime/11061/characters) | 18 identità/ID/URL reali recuperati; zero immagini pubblicate, permessi non verificati |
| Acqua/foglia animate | Maschere canvas sul riferimento anime | Foglia estratta; acqua nascosta interpolata da pixel adiacenti; artefatti possibili |
| Mockup risultato | reference/RESULT_TARGET_EXACT.png e duplicato V1 | Solo composizione; ritratti non estratti |
| Scena/effetti V1 | SVG e CSS preesistenti | Storici, non montati nel flusso corrente |
| Radar e icone | SVG/canvas locali | Nessun asset personaggio |
| Font | Georgia/Times New Roman e Arial/Helvetica di sistema | Nessun download |

I ritagli storici sono riproducibili con `npm.cmd run assets:scene` e restano in `.verification/v2/scene`. Lo script usa il file Wing opzionale solo se già presente; altrimenti ritaglia il reel. Lo script non genera immagini né ricostruisce volti/mani. Il flusso attuale usa invece i quattro PNG di Wing e il muro generato sopra elencati; conserva l'immagine mani/calice in `.verification/v2/scene`. I ritagli privati restano disponibili soltanto nel server locale e nella build `local-review`. La build normale include esclusivamente i cinque asset runtime elencati sotto.

`npm.cmd run assets:characters` interroga Tenrai e aggiorna soltanto i metadati. Il 27 ottobre 2026 l'importazione è riuscita: 205 record ricevuti, 18 abbinati. `src/data/characterImages.json` registra nomi, URL effettivi, ID MAL, credito, data e `permissionStatus: unverified`. Nessuna chiamata API viene eseguita durante il quiz. Il fallback AniList richiesto non è stato necessario.

I [termini Tenrai §§3 e 6](https://tenrai.org/terms) permettono la cache delle risposte ma non concedono diritti sulle immagini di terzi. Non essendo stati verificati permessi specifici, nessun file è stato copiato in `public/assets/characters/`. Un URL restituito dall'API non diventa automaticamente `portraitSrc`. Il download opzionale esplicito `--download-preview` resta limitato a `.verification/v2/characters`, senza attribuire permessi.

Per un futuro ritratto autorizzato, salvarlo in `public/assets/characters/<slug>.webp` e compilare `portraitSrc`, `sourceUrl`, `credit`, `permissionStatus: 'authorized'` nel catalogo, registrando il permesso qui. Le associazioni Nen restano curate localmente.

Hunter × Hunter e i personaggi appartengono ai rispettivi titolari. I dialoghi dell'app non sono presentati come citazioni canoniche.

## Build di produzione - 27 ottobre 2026

**Aggiornamento scheda risultati:** i 18 ritratti MyAnimeList già identificati tramite Tenrai sono ora copiati in `public/assets/characters/`, su richiesta esplicita dell'utente. URL, ID, crediti e hash sono registrati nel catalogo; i file si caricano e si decodificano nel browser e sono inclusi nella build locale. `permissionStatus` rimane `unverified`: i termini Tenrai non concedono diritti sulle immagini di terzi. Nessuna nuova licenza è attribuita e nessun push o deploy è eseguito. Verifica e condizioni in [RESULT_REDESIGN_REPORT.md](RESULT_REDESIGN_REPORT.md). Le indicazioni storiche sopra su zero ritratti si riferiscono alla versione precedente.

La scena corrente usa `unified-goblet-scene.png` (fondale generato con tappeto, crepe, tavolo, mani, calice e foglia) e `wing-neutral.png`, `wing-smile.png`, `wing-eyes-closed.png`, `wing-gesture.png`. Acqua, foglia e movimento delle mani sono elaborati sul canvas a partire dal fondale; non richiedono ritagli privati. `wall-rug.png` costituisce un input del montaggio, non un file richiesto a runtime. Le righe storiche sopra relative al riferimento anime descrivono la precedente anteprima.

La build pubblica soltanto questi cinque PNG di scene-v3. Esclude `background-source.png`, `composition-source.png`, `wall-rug.png`, anteprime e cartella `reference`. Nessun blocco della scena dipende dalla configurazione di produzione.

Permessi ancora da documentare: i quattro file `wing-*.png` hanno origine e autorizzazione alla redistribuzione non verificate. Non risulta accertato un divieto specifico, ma la modifica tecnica non certifica i diritti. Per una pubblicazione con permessi documentati servono autorizzazione per questi quattro file oppure quattro pose sostitutive con licenza compatibile (neutro, sorriso, occhi chiusi, gesto), trasparenti e con lo stesso allineamento. Il fondale risulta registrato come generato con imagegen da riferimenti del progetto; la generazione non documenta i diritti dei riferimenti. Se non utilizzabili, serve un fondale originale o autorizzato di 1536 x 1024 con stessa composizione e coordinate del calice per preservare le maschere canvas. Nessun asset viene escluso silenziosamente per questi motivi.
