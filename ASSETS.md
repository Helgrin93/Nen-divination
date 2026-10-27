# Provenienza degli asset

Stato aggiornato: [ASSET_STATUS.md](ASSET_STATUS.md). La V2 è in revisione locale, non pronta per la pubblicazione.

| Materiale | Provenienza | Stato |
| --- | --- | --- |
| Quattro espressioni Wing | PNG trasparenti preesistenti in `public/assets/scene-v3/wing-*.png` | Fonte e permessi non registrati; solo anteprima locale, nessun volto creato in questa revisione |
| Muro con tappeto e crepe | `public/assets/scene-v3/wall-rug.png`, imagegen integrato, 27 ottobre 2026; riferimento allegato dall'utente | Generato su richiesta esplicita; solo fondale senza persone. Prompt: `assets/scene/wall-rug.prompt.md` |
| Tavolo, mani e calice | `reference/ANIME_HANDS_GLASS_REFERENCE.png` fornito dall'utente | Usato nell'anteprima privata; permessi di redistribuzione non verificati |
| Montaggio scenico | Muro raster e Wing separati; tavolo/mani/calice preesistenti | Ritaglio responsive del muro; mani non isolate in livelli separati |
| 18 ritratti | MyAnimeList via [Tenrai](https://api.tenrai.org/v1/anime/11061/characters) | 18 identità/ID/URL reali recuperati; zero immagini pubblicate, permessi non verificati |
| Acqua/foglia animate | Maschere canvas sul riferimento anime | Foglia estratta; acqua nascosta interpolata da pixel adiacenti; artefatti possibili |
| Mockup risultato | reference/RESULT_TARGET_EXACT.png e duplicato V1 | Solo composizione; ritratti non estratti |
| Scena/effetti V1 | SVG e CSS preesistenti | Storici, non montati nel flusso corrente |
| Radar e icone | SVG/canvas locali | Nessun asset personaggio |
| Font | Georgia/Times New Roman e Arial/Helvetica di sistema | Nessun download |

I ritagli storici sono riproducibili con `npm.cmd run assets:scene` e restano in `.verification/v2/scene`. Lo script usa il file Wing opzionale solo se già presente; altrimenti ritaglia il reel. Lo script non genera immagini né ricostruisce volti/mani. Il flusso attuale usa invece i quattro PNG di Wing e il muro generato sopra elencati; conserva l'immagine mani/calice in `.verification/v2/scene`. Server locale e build `local-review` espongono questi asset; la build normale esclude anche `assets/scene-v3/`.

`npm.cmd run assets:characters` interroga Tenrai e aggiorna soltanto i metadati. Il 27 ottobre 2026 l'importazione è riuscita: 205 record ricevuti, 18 abbinati. `src/data/characterImages.json` registra nomi, URL effettivi, ID MAL, credito, data e `permissionStatus: unverified`. Nessuna chiamata API viene eseguita durante il quiz. Il fallback AniList richiesto non è stato necessario.

I [termini Tenrai §§3 e 6](https://tenrai.org/terms) permettono la cache delle risposte ma non concedono diritti sulle immagini di terzi. Non essendo stati verificati permessi specifici, nessun file è stato copiato in `public/assets/characters/`. Un URL restituito dall'API non diventa automaticamente `portraitSrc`. Il download opzionale esplicito `--download-preview` resta limitato a `.verification/v2/characters`, senza attribuire permessi.

Per un futuro ritratto autorizzato, salvarlo in `public/assets/characters/<slug>.webp` e compilare `portraitSrc`, `sourceUrl`, `credit`, `permissionStatus: 'authorized'` nel catalogo, registrando il permesso qui. Le associazioni Nen restano curate localmente.

Hunter × Hunter e i personaggi appartengono ai rispettivi titolari. I dialoghi dell'app non sono presentati come citazioni canoniche.
