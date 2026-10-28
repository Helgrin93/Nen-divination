# Sei divinazioni — implementazione del 28 ottobre 2026

Le sei sequenze usano un unico compositore Canvas 2D con sprite illustrati. Il Canvas registra e maschera gli asset: non disegna proceduralmente le trasformazioni complesse. Nessuna dipendenza aggiunta.

## Anteprima di sviluppo

```powershell
npm.cmd run dev
```

Aprire `http://localhost:5173/review/divination.html`.

- Selezione diretta dei sei tipi, senza quiz; avvio, ripetizione, pausa/ripresa e cursore temporale.
- Pressione reale di 4,5 secondi, rilascio anticipato e ritorno al riposo.
- Lingua IT/EN e inquadratura scena/risultato, sullo stesso canvas.
- Il selettore Formato apre una finestra di anteprima con viewport richiesta: mobile 390 × 844 o desktop 1440 × 900. Il browser può limitare le finestre alla dimensione dello schermo; i test Playwright verificano le dimensioni esatte.
- In produzione non vengono inclusi HTML, JS, CSS o controlli di questa pagina. `window.divinationReview` esiste esclusivamente nell'entry di sviluppo.

## Sequenze

| Tipo | Durata | Realizzazione e stato finale |
| --- | --- | --- |
| Potenziamento | 6,2 s | Increspature, rialzo di circa 10 pixel nativi fino al bordo, due veli illustrati asimmetrici, otto gocce con caduta accelerata e sprite di impatto. Livello alto e macchia bagnata persistenti; le gocce terminano, senza rimanere sospese. |
| Emissione | 5,0 s | Fronte morbido di diffusione nel volume del liquido; colore rosato caldo, distinto dal blu tematico. Foglia, bordo, pareti esterne e principali riflessi anteriori sono esclusi o ricomposti dal raster originale. |
| Trasmutazione | 4,8 s | Increspature molto discrete, acqua naturale al termine. Dopo la fase di osservazione Wing reagisce con una posa già approvata e riferisce in IT/EN che è diventata dolce, come nella prova di Killua. Nessuna scintilla o trasformazione inventata per rendere visibile il gusto. |
| Materializzazione | 5,6 s | 56 piccoli residui non luminosi, da sette sprite di sedimento. Comparsa sfalsata, opacità diverse per la profondità; una parte si deposita, gli altri restano sospesi, all'interno della maschera del liquido. |
| Manipolazione | 6,0 s | Foglia estratta dall'originale: tremore, traslazione, rotazione di circa 137° nel piano dell'acqua. La compressione prospettica avviene dopo la rotazione; piccole onde accompagnano il movimento. Posizione finale persistente. |
| Specializzazione | 7,6 s | Sei disegni registrati della stessa foglia: perdita di colore, bordi secchi, crepe e rottura. Poi 23 frammenti illustrati: alcuni rimangono in superficie, altri affondano. Dialogo riferito esplicitamente a Neferpitou, senza generalizzare a tutti gli Specialisti. |

## Livelli e registrazione

Il fondale approvato rimane il proprietario del calice. Ordine: immagine originale → riparazione locale della foglia → volume/impurità → superficie/increspature → foglia/frammenti → riflessi anteriori originali → colature → gocce/macchia con esclusione del piede. Le mani e Wing conservano i renderer e i PNG precedenti.

Il canvas misura **1536 × 1024**, come il fondale, e condivide il suo rettangolo CSS. Le maschere sono espresse nelle unità locali 1000 × 680 del ritaglio `(443,560,650,442)`, trasformate una sola volta nello spazio nativo. Atlas e coordinate non dipendono dal viewport. Le griglie presenti nell'atlante della foglia restano fuori dai ritagli utilizzati.

Il vecchio renderer è sostituito, non montato insieme al nuovo. Nessun alone CSS, raggio energetico o sistema di particelle luminoso viene aggiunto.

## Asset nuovi

| Percorso in `public/assets/divination/` | Dimensioni | Provenienza e utilizzo |
| --- | --- | --- |
| `leaf-states-atlas.png` | 1774 × 887 RGBA | `image_gen.imagegen` integrato, sfondo trasparente. Sei stati della foglia, frammenti e residui; ritagli registrati nel renderer. |
| `overflow-atlas.png` | 1536 × 1024 RGBA | `image_gen.imagegen` integrato, sfondo trasparente. Due fasi di colatura, gocce, tre impatti e macchia irregolare sul tavolo. |
| `water-surface-clean.png` | 240 × 60 RGBA | Derivato dal raster originale; riparazione armonica della sola impronta della foglia, ancorata a `(650,600)`. Trasparente fuori dai 2244 pixel riparati. |

I prompt integrali e le varianti scartate sono documentati in `assets/scene/divination-generation-prompts.md`. Nessun riferimento runtime alla directory privata delle immagini generate. I tentativi AI aggiuntivi di riparare la superficie conservavano un segno ocra e sono stati scartati; la riparazione locale evita di ridisegnare la scena.

Il comando seguente rigenera la riparazione della superficie con il server di sviluppo avviato:

```powershell
node scripts/prepare-water-surface.mjs
```

Non mancano asset essenziali per le sei sequenze. Il progetto non dispone di un sorgente originale a livelli: il vetro conserva il raster approvato, maschere locali e ripristino dei riflessi; non è una simulazione ottica 3D. La qualità può essere ulteriormente rifinita artisticamente senza cambiare il sistema.

## Stato, accessibilità e passaggi di fase

La pressione resta di 4500 ms. Il rilascio anticipato fa decadere le increspature e ripristina l'acqua; i reset cancellano timeline e fotogrammi precedenti. Il completamento effettivo del renderer emette `divinationcomplete`: solo allora l'app passa al risultato, mantenendo lo stesso canvas e gli stessi pixel finali. La selezione della lingua non riavvia l'effetto.

La timeline usa il tempo trascorso, includendo il costo di disegno dei frame. La scheda nascosta sospende l'avanzamento; al ritorno la sequenza riprende senza saltare fasi. Movimento ridotto: stato finale immediato e testo descrittivo. Domande, punteggi e assegnazione Nen non sono modificati.

## Verifica ripetibile

```powershell
npm.cmd test
npm.cmd run build
npm.cmd run test:build
npm.cmd run preview
npx.cmd playwright test
node scripts/audit-divination-layers.mjs
node scripts/review-divination.mjs
```

`test:build` completa il quiz, conserva la trasformazione ed esporta il PNG da una build servita sotto `/nen-divination/`. Controllato anche `npm run preview`: asset caricati e controlli di sviluppo assenti.

Il test browser dedicato attraversa avvio, pausa, ripresa, ricerca temporale, risultato e replay per ciascuna categoria sui cinque progetti. Comprende inoltre sospensione della scheda e movimento ridotto. I test precedenti per effetti differiti sono stati aggiornati alle sei trasformazioni.

Esiti: **25 test unitari superati; suite completa con 87 test browser superati e 8 casi ripetitivi esclusi**. Dopo il raccordo finale del dialogo della Trasmutazione sono stati ripetuti con successo **35 controlli browser** su tutte le categorie e i cinque formati, inclusa la comparsa ritardata del messaggio sul sapore, e **4 test del flusso principale**. Ripetuti anche build, `test:build` e controllo tramite `npm run preview`, tutti riusciti. La simulazione esistente di 30.000 partite è superata; calibrazione e pesi restano invariati.

Lo script di revisione salva in `.verification/divination-v3/` inizio, metà, fine, inquadratura risultato, dettaglio del calice e un video **in tempo reale** delle sei sequenze per ciascun formato: desktop 1440 × 900, tablet 768 × 1024, mobile 390 × 844, mobile piccolo 320 × 568, WebKit 390 × 844. `report.json` registra errori, allineamento, copertura del calice, overflow orizzontale e persistenza del fotogramma finale. I video non usano l'orologio accelerato.

Revisione finale: **30 combinazioni effetto/formato**, 120 screenshot di fase, dettagli aggiuntivi e cinque video. Nessun errore di pagina o asset, nessun overflow orizzontale o fumetto sul piano dell'acqua; registrazione e persistenza corrette in tutti i record. `video-contact.png` contiene sei fotogrammi decodificati dal video desktop, ispezionati insieme agli screenshot.

Gli screenshot sono stati ispezionati confrontandoli con l'originale: eliminati il residuo verde della foglia, la sagoma ocra della prima riparazione, il riflesso trascinato sopra la superficie e la sovrapposizione del fumetto nella sola anteprima risultato. La Trasmutazione rimane intenzionalmente poco visibile. Test e registrazioni si svolgono in browser emulati, non su telefoni fisici.

## File di implementazione

- `src/components/WaterScene.js`: compositore, maschere, sprite e ciclo di vita.
- `src/components/divinationTimeline.js`: durate, fasi, interpolazioni e dialoghi IT/EN.
- `src/main.js`: completamento della sequenza prima del risultato e dialogo di Wing.
- `src/data/nenTypes.js`: descrizioni aggiornate delle manifestazioni, senza modifiche a nomi, colori tematici o personalità.
- `review/divination.html`, `review/divination.js`, `review/divination.css`: anteprima di sviluppo.
- `scripts/prepare-water-surface.mjs`, `scripts/audit-divination-layers.mjs`, `scripts/review-divination.mjs`: preparazione e verifica.
- `e2e/divination-effects.spec.js`, `e2e/divination.spec.js`, `e2e/rendering.spec.js`, `e2e/app.spec.js`: controlli browser aggiornati.
- Tre nuovi PNG elencati sopra.
- `README.md`, questo resoconto e `assets/scene/divination-generation-prompts.md`, `divination-layer-spec.md`, `divination-quality-notes.md`: istruzioni, provenienza degli asset e verifica aggiornate.

Nessun push, commit o deploy automatico.
