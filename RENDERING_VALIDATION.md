# Verifica rendering — 28 ottobre 2026

## Cause verificate

- **Wing:** la scena e i quattro PNG erano già persistenti. `main.js` ricostruiva il pannello delle domande, non il personaggio. La dissolvenza simultanea di 240 ms fra due PNG trasparenti lasciava trasparire lo sfondo: nei fotogrammi acquisiti l'opacità combinata scendeva a circa **0,75**. Non è stata osservata una rimozione completa del personaggio dal DOM. Inoltre `setupQuizScene` considerava disponibile qualsiasi immagine non nascosta, anche prima di caricamento e decodifica: con un asset ritardato poteva quindi attivare un fotogramma vuoto.
- **Coordinate:** le vecchie regole `1000/563` di `divination.css` erano già sovrascritte da `unified-scene.css`: lo stage effettivo era correttamente 3:2. Anche il ritaglio 650 × 442 e il buffer 1000 × 680 avevano lo stesso rapporto. Il problema non era quindi una deformazione globale sempre presente, ma un sistema fragile di ritagli e sovrascritture, il ridisegno opaco dell'intera coppa, il campione rettangolare di acqua ingrandito e le maschere dei livelli sovrapposti.
- **Occlusione:** la parte bassa dello sprite di Wing interseca la bocca del bicchiere. Eliminare soltanto il ridisegno della coppa esponeva una striscia della camicia dentro il vetro. La nuova maschera sottrae la sagoma del bicchiere allo sprite nelle coordinate condivise, conservando l'occlusione originale.
- **Mani:** l'interpolazione sovrapponeva due disegni anatomici differenti; nella parte centrale del cambio potevano comparire due palmi o dita semitrasparenti. Non veniva ricreato il canvas.
- `WingScene.js` contiene il vecchio renderer SVG e `setupMentor`, ma non è importato dall'app attuale. Modificarlo non avrebbe corretto il quiz.

## Interventi

- `QuizScene.js`: disponibilità degli sprite solo dopo `decode()`, mantenimento dell'ultimo sprite pronto, applicazione della richiesta più recente anche quando un download termina in ritardo; canvas nativo 1536 × 1024.
- `divination.css`: cambio di espressione opaco, senza dissolvenza fra sagome trasparenti.
- `main.js`: la selezione aggiorna soltanto pulsanti, attributi accessibili e abilitazione di Continua; il contenuto non viene riposizionato nel DOM se è già nel genitore corretto.
- `sceneGeometry.js`: geometria condivisa del ritaglio, della sagoma e della maschera di occlusione di Wing.
- `unified-scene.css`: canvas e sfondo occupano esattamente lo stesso rettangolo; maschera di Wing registrata sulla stessa scena, senza cambiare scala o posizione degli sprite.
- `WaterScene.js`: canvas trasparente a riposo, interventi limitati a foglia, acqua e traboccamento; nessun ridisegno della coppa; bordo escluso dagli effetti invece di essere ridisegnato; eliminato il campione rettangolare ingrandito. Il Potenziamento conserva la salita progressiva entro il bordo, le increspature, la foglia galleggiante e il traboccamento asimmetrico con gocce e zona bagnata.
- `HandsMotion.js`: un solo disegno anatomico opaco per fotogramma; mantenuto il movimento dei polsi e il ripristino delle impronte originali sul tavolo. Il passaggio fra i tre disegni resta discreto: non è un morph delle dita.

Nessuna modifica agli asset, alle reazioni e alle frasi occasionali, alla pausa dopo la quarta risposta, alle domande, ai punteggi o al codice/stile della schermata finale. Nessun push.

## Stato delle sei animazioni

| Categoria | Stato effettivo |
| --- | --- |
| Potenziamento | Implementato: salita del livello, superficie, foglia, traboccamento e gocce. |
| Emissione | Animazione specifica rinviata; acqua originale, risultato e descrizione esistenti. |
| Trasmutazione | Animazione specifica rinviata; acqua originale, risultato e descrizione esistenti. |
| Materializzazione | Animazione specifica rinviata; acqua originale, risultato e descrizione esistenti. |
| Manipolazione | Animazione specifica rinviata; acqua originale, risultato e descrizione esistenti. |
| Specializzazione | Animazione specifica rinviata; acqua originale, risultato e descrizione esistenti. |

La concentrazione preliminare è condivisa; non costituisce l'animazione specifica delle altre cinque categorie. `data-deferred=true` ne segnala esplicitamente lo stato.

## Riproduzione e regressioni

- Prima degli interventi: riproduzione locale della divinazione, screenshot a inizio/metà/fine su desktop 1440 × 900 e smartphone 390 × 844; campionamento delle opacità durante più passaggi del quiz.
- Dopo gli interventi: stessa acquisizione e ispezione visiva; opacità combinata di Wing sempre 1 nei campioni acquisiti. Gli screenshot sono in `.verification/render-before/` e `.verification/render-after/`, con nomi `desktop-start.png`, `desktop-middle.png`, `desktop-end.png` e corrispondenti `mobile-*`; i campioni sono in `wing-frames.json`. Sono artefatti locali ignorati da Git.
- `e2e/rendering.spec.js`: oltre dieci passaggi consecutivi tramite pulsanti reali, inclusi ritorni alla domanda con reazione, verifica a ogni animation frame di presenza/decodifica/opacità/posizione, pausa dopo la quarta risposta, asset ritardato e completamento di un download dopo essere tornati indietro, coordinate native identiche allo sfondo e trasparenza delle cinque animazioni rinviate.
- `e2e/divination.spec.js`: mantenuti i controlli su concentrazione progressiva, rilascio e ripristino esatto, salita del livello, traboccamento, pose delle mani, accessibilità, movimento ridotto e asset mancante; adattato il controllo dei pixel alle coordinate native.
- `e2e/app.spec.js`: adattati i controlli di pixel alle coordinate native; verifica delle sei categorie, esportazione PNG offline, replay e integrità della scena.
- Verifica browser con Chrome desktop, Chrome mobile emulato e WebKit mobile emulato. Non è una prova su dispositivi fisici.
- Verifiche aggiuntive: test unitari, build Vite e `test:build` con percorso di pubblicazione `/nen-divination/`, caricamento degli asset, percorso completo del quiz ed esportazione PNG.

Esiti conclusivi:

- `npm.cmd test`: **25 superati**.
- `npx.cmd playwright test --project=desktop --project=mobile --project=mobile-webkit`: **29 superati, 4 esclusi intenzionalmente** (controlli duplicati che la suite riserva al desktop).
- Dopo l'aggiunta del fallback anche per lo sprite neutro mancante, `npx.cmd playwright test e2e/rendering.spec.js --project=desktop --project=mobile --project=mobile-webkit`: **12 superati**, inclusi i tre nuovi casi di asset neutro mancante. Gli altri nove ripetono le regressioni della suite completa.
- `npm.cmd run build`, `npm.cmd run test:build` e `git diff --check`: completati con successo.
