# Art pass V3 — consegna artistica

La specifica `NEN_DIVINATION_ANIMAZIONI_V3_CODEX.md` è stata letta integralmente. L'intervento riguarda il renderer dell'acqua, i suoi materiali e la pagina review; Wing, mani, sfondo, domande, punteggi, radar, UI e layout del risultato rimangono quelli esistenti.

## Anteprima e confronto

Ritocchi del 29 ottobre dopo la revisione dell'utente: bagnatura del tavolo più leggibile attraverso le venature scurite, Emissione circa 7% più scura, residui circa 30% più grandi e leggermente più opachi. La battuta della Trasmutazione passa alla fase dolce esattamente al 90% (4320 ms su 4800). Manipolazione e Specializzazione restano invariate, con confronto dei frame finali su desktop e mobile. Catture locali: `.verification/divination-tweaks/before/` e `after/`.

Con Vite avviato (`npm.cmd run dev`):

- Animazioni interattive: `http://localhost:5173/review/divination.html`.
- Prima/dopo: `http://localhost:5173/.verification/divination-art-v3/comparison.html`.
- Materiale conservato: `.verification/divination-art-v3/baseline/` e `after/`. Ogni cartella contiene dodici clip reali (sei tipi × desktop/mobile), frame a 0/25/50/75/100%, dettagli del calice, canvas trasparenti e inquadratura risultato.
- La review aggiunge cinque pulsanti per gli istanti di confronto e il dettaglio ingrandito del calice. Play, pausa, slider, pressione, lingue e preset sono conservati. Questi controlli non entrano nella build di produzione.

L'audit iniziale distingue riscontri visivi e cause nel codice: [art-pass-v3-audit.md](assets/scene/art-pass-v3-audit.md). Le clip sono state riprodotte e decodificate; i contact sheet e `*-video-playback.json` documentano i punti osservati. Le immagini con percentuale sono ottenute con seek deterministico, non stimate dalla durata del video.

## Interventi

| Tipo | Cambiamento artistico e tecnico |
| --- | --- |
| Manipolazione | Dieci pose chiave della foglia originale, con torsione, curvatura della lamina e punta che segue la spinta. Una mesh 16×7 triangolata prepara 81 frame registrati sullo stesso pivot. Il runtime usa questi frame, senza rotazione rigida del PNG. Percorso cubico con anticipazione, accelerazione, cambio di direzione e assestamento; orientamento contenuto rispetto al precedente giro di 137°. Le onde nascono nei punti di passaggio della foglia e si estinguono. |
| Potenziamento | Superficie intera rimappata verso l'ellisse interna del bordo, con trasmissione del fondale caldo e menisco; eliminata la fascia ocra e il primo tentativo troppo opaco. Otto disegni nuovi per ciascuna colatura, con spessore e profilo variabili, registrati sul bordo. Le gocce partono dalle estremità misurate dei disegni e accelerano verso il tavolo. Alla fine rimangono acqua alta e una leggera impronta bagnata. |
| Emissione | Otto maschere illustrate di diffusione, rese cumulative e ammorbidite localmente. Il pigmento si propaga con densità irregolare, poi diventa uniforme. È applicato a una copia del liquido che conserva la luminanza e i riflessi del raster; rimossi gradiente rettangolare e compositing `multiply`. Ripristino esplicito del bordo e dei riflessi anteriori, foglia verde preservata. |
| Materializzazione | Quindici disegni in cinque famiglie: granulo, scaglia, residuo vegetale, fibra e deposito chiaro. Distribuzione con seed fisso, gruppi irregolari, profondità, nascita e traiettorie individuali; nessuna griglia modulare. Alcuni residui si depositano, altri rimangono sospesi. Texture separate e stabilizzate per impedire differenze al primo seek. |
| Trasmutazione | Un impulso iniziale molto tenue, che termina entro il primo quarto. Segue una pausa visiva reale; Wing reagisce nella fase già sincronizzata e dice «È diventata dolce. Eppure l’aspetto è lo stesso.» / «It tastes sweet. Yet it looks the same.» Nessun nuovo effetto cromatico o fenomeno inventato. |
| Specializzazione | Atlante, frammenti, campionamento, tempi e composizione precedenti conservati. Confronto dei cinque canvas nativi con la baseline, inclusi i frame intermedi; nessuna rigenerazione della foglia secca. |

## Asset e motore

Canvas 2D rimane il compositore. La deformazione della foglia viene preparata una volta, evitando mesh per frame, nuova dipendenza WebGL o immagini video nel runtime. Tutti i livelli rimangono nello spazio nativo 1536×1024, con conversione unica del ritaglio `(443,560,650,442)` in unità 1000×680.

| Nuovo asset in `public/assets/divination/` | Dimensioni / origine |
| --- | --- |
| `leaf-flex-atlas-v3.png` | 3024×1152, 81 celle 336×128. Texture della foglia originale deformata con mesh; dieci pose chiave, 81 fotogrammi complessivi tra chiavi e intercalazioni. Pivot `(168,64)`, scala 1,5 rispetto alle unità locali. Nessuna nuova identità generata. |
| `overflow-ink-atlas-v3.png` | 1024×576, otto pose per lato della coppa, celle 128×288 e pivot `(64,12)`. Materiale AI rifinito: rimozione delle velature esterne, margini trasparenti, ancoraggi e curvatura adattati al calice. |
| `sediment-atlas-v3.png` | 320×192, quindici celle 64×64. Materiale AI rifinito: alpha pulito, margini e dimensioni coerenti. |
| `diffusion-mattes-v3.png` | 1024×640, otto celle 256×320. Densità derivata da pigmento illustrato AI; l'ultimo frame riempie intenzionalmente la maschera del volume. |
| `art-v3-manifest.json` | Coordinate, pivot, pose e punti di distacco. Dati equivalenti nel modulo generato `divinationArtData.js`. |

Gli asset hanno alpha reale. Le misure di dimensioni, trasparenza e margini sono in `.verification/divination-art-v3/asset-audit.json`. Gli originali approvati non sono sovrascritti; i loro hash restano quelli della baseline. I PNG nuovi sono materiali di produzione, non video o screenshot di test.

Le tre generazioni usano `image_gen.imagegen` integrato, senza CLI o API separata. Prompt completi: [art-pass-v3-prompts.json](assets/scene/art-pass-v3-prompts.json). I materiali grezzi, non usati dal runtime, sono in `.verification/divination-art-v3/materials/`; la rifinitura è riproducibile con `node scripts/prepare-divination-art.mjs` avendo tali sorgenti e Vite disponibili.

## Codice e verifiche

- `src/components/WaterArtPass.js`: nuovi materiali, percorso, onde di contatto, volume, riflessi, residui e gocce.
- `src/components/WaterScene.js`: integrazione nel canvas persistente, precaricamento e diagnostica dei tempi di disegno. Il ramo Specializzazione rimane invariato.
- `src/components/divinationArtData.js`: registrazione generata dei materiali.
- `src/components/divinationTimeline.js`: solo la battuta più breve della Trasmutazione; durate e fasi restano quelle esistenti.
- `review/divination.js`, `review/divination.css`: controlli di ispezione aggiuntivi, limitati allo sviluppo.
- `scripts/prepare-divination-art.mjs`, `review-divination-art.mjs`, `inspect-divination-art-video.mjs`, `build-divination-art-gallery.mjs`: preparazione, acquisizione, riproduzione dei filmati e galleria locale.
- `scripts/audit-divination-layers.mjs`: inventario esteso ai quattro nuovi atlas, con alpha e hash.
- `e2e/divination-art.spec.js` e `e2e/fixtures/specialization-approved.json`: regressione dell'effetto approvato, seek all'indietro senza accumuli e foglia contenuta nella superficie.

I test esistenti delle sei categorie, pressione, lingua, persistenza, offline ed esportazione sono eseguiti insieme ai nuovi test. La golden PNG è specifica dell'encoder Chromium: WebKit esegue i controlli funzionali di lifecycle e seek, evitando un confronto fra compressori PNG differenti. I confronti visivi prima/dopo di tutte le categorie sono acquisiti su Chromium desktop e mobile.

Registrazione finale: CPU mobile rallentata 4× tramite DevTools, formato 390×844. Il costo p95 del solo compositore è compreso tra 1,1 e 2,3 ms nei sei tipi; questa misura non include tutta la pipeline del browser. La cadenza p95 osservata è 8,1–22,5 ms su questo computer, con 16,0 ms nella Manipolazione, non una promessa di FPS su iPhone fisico. I report contengono i dati per effetto. Nessun errore di pagina o asset; allineamento e stato finale corretti nei dodici record.

Esiti: `npm.cmd test` **25 superati**; `npm.cmd run build` e `npm.cmd run test:build` **riusciti**. Il giro conclusivo delle tre suite di animazione sui cinque progetti dà **59 superati e 1 escluso** (golden PNG Chromium su WebKit). I **16 test eseguiti del flusso principale** nel giro esteso sono passati; quattro casi offline ripetitivi sono riservati al desktop. Nel primo giro un test WebKit con orologio controllato superava il budget di 60 secondi: eliminato il ridisegno della lente quando è nascosta e usato un avanzamento diretto per la sola verifica dello stato finale. Il test è poi passato anche su WebKit; i filmati artistici restano registrati in tempo reale.

Comandi di riproduzione:

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run test:build
npx.cmd playwright test e2e/divination-art.spec.js e2e/divination-effects.spec.js e2e/divination.spec.js e2e/app.spec.js
node scripts/review-divination-art.mjs --phase=after --throttle=4
node scripts/inspect-divination-art-video.mjs after
node scripts/build-divination-art-gallery.mjs
```

## Limiti reali

Non mancano PNG essenziali da chiedere all'utente. La foglia ha deformazione della texture originale, non nuovi disegni manuali fotogramma per fotogramma; le colature derivano da otto pose illustrate per lato. La rifrazione rimane una composizione 2D ricavata da un raster fuso, con maschere e riflessi conservati: non esiste un sorgente originale a materiali separati. Le prove sono su browser desktop ed emulati, senza iPhone/Android fisico. Gli effetti più fini vanno giudicati anche in movimento, usando il dettaglio della review.

Nessun push, merge, commit o deploy eseguito. Il file di istruzioni V3 fornito dall'utente è lasciato intatto.
