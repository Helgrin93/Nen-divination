# Correzioni di Manipolazione, residui e composizione

## Revisione successiva: materiali dell'acqua e visibilità dei residui

- **Materializzazione:** dimensione dei residui da 1,60 a 2,25 (circa +41%), maggiore opacità e minore attenuazione in profondità. Quantità mantenuta a 62. Le cinque famiglie illustrate e le traiettorie restano quelle esistenti. Ricampionamento esplicitamente di qualità alta per evitare differenze di rasterizzazione Chromium durante il seek.
- **Potenziamento:** la superficie rialzata campionava la zona d'aria sopra il liquido e appariva opaca e troppo chiara. Ora utilizza direttamente la texture dell'acqua sommersa, senza includere il bordo del vetro. Le forme illustrate delle colature, delle gocce e degli impatti mantengono disegno e tempi, con corpo più trasparente e colore ricavato dall'acqua nel bicchiere. Riflessi chiari e tratto sono conservati; nessun nuovo asset o filtro globale. Tavolo bagnato conservato.
- **Confronti:** quattro filmati desktop/mobile, frame a 0/25/50/75/100% e report in `.verification/divination-art-v3/material-match-before/` e `material-match-final/`. Riproduzione dei filmati e contatti visivi finali con `.verification/inspect-material-videos.mjs`.
- **Verifiche:** 25 test unitari superati; 21 E2E superati e un golden Chromium escluso intenzionalmente su WebKit; build e verifica della build riuscite. La regressione della Specializzazione continua a passare. Nessuna modifica al resto dell'app o push.

## Interventi

- **Manipolazione:** le pose deformate della stessa foglia restavano poco leggibili perché lo spostamento laterale era di soli 36 punti locali. La nuova traiettoria copre 86 punti, circa 56 pixel nativi, con anticipazione, cambio di direzione e assestamento. Le pose illustrate restano quelle approvate; otto onde di contatto seguono il percorso. La foglia rimane nella superficie ellittica.
- **Materializzazione:** 62 residui anziché 52 (+19%); moltiplicatore delle dimensioni da 1,30 a 1,60 (+23% rispetto alla revisione precedente). Conservati i materiali illustrati, la profondità, la distribuzione irregolare e l'occlusione del vetro.
- **Bicchiere:** la maschera originale escludeva Wing dall'intero calice, lasciando visibile il fondale arancione anche sopra l'acqua. `GlassComposition.js` ricava il colore trasmesso dalla posa di Wing effettivamente decodificata, nelle sole zone arancioni dell'aria e del bordo superiore. La camicia compare nelle pose a mani giunte; nella posa gestuale compare correttamente anche l'avambraccio. Tratto scuro, riflessi neutri e sagoma esterna rimangono quelli originali. Il cambio posa aggiorna la correzione anche in pausa e durante la reazione della Trasmutazione, senza riavviare la timeline.
- **Tappeto:** le crepe erano già disegnate nel raster fuso, anche sopra il tessuto. Una riparazione illustrata locale ripristina le due fasce blu; le crepe del muro si fermano dietro il tappeto. Il fondale originale resta intatto.

Nessuna modifica a domande, punteggi, scheda finale, inquadratura o disegni di Wing e mani. Conservati Potenziamento con tavolo bagnato, colore dell'Emissione, battuta della Trasmutazione al 90% e animazione della Specializzazione.

## Asset e origine

Nuovo asset: `public/assets/divination/rug-border-repair.png`, PNG RGBA **1536×1024**, circa **86 kB**, trasparente fuori da due strette fasce registrate. Generato con lo strumento integrato **image_gen.imagegen**, usando il fondale originale come riferimento. Il prompt completo è in `assets/scene/rug-repair-prompt.json`. Tutti i pixel generati fuori dalle due fasce sono scartati; non viene sostituita la scena intera.

Sorgente generata conservata localmente in `.verification/glass-rug-fix/rug-generated-source.png`. Estrazione riproducibile con `node scripts/prepare-rug-repair.mjs`, con Vite avviato e la sorgente locale disponibile. Non servono altre immagini da preparare.

La correzione del vetro usa direttamente i quattro PNG originali di Wing, senza generare o ridisegnare il personaggio. Rimane il compositore Canvas 2D esistente; nessuna nuova libreria o animazione CSS.

## Verifica locale

Anteprima: http://localhost:5173/review/divination.html

Confronto della scena e delle quattro pose: `.verification/glass-rug-fix/before/` e `.verification/glass-rug-fix/after/`. Registrazioni con frame esatti a 0/25/50/75/100% e video desktop/mobile: `.verification/divination-art-v3/glass-rug-final/`. Le acquisizioni e il materiale AI sorgente restano fuori dalla build e da Git.

La regressione della Specializzazione confronta cinque PNG conservati della versione approvata: tutti i pixel dell'animazione devono coincidere, escludendo soltanto la maschera della correzione comune del vetro e due pixel di ricampionamento. Gli originali di riferimento non vengono rigenerati. Altri controlli verificano l'escursione visibile e il contenimento della foglia, seek deterministico, persistenza, caricamento delle espressioni, colore trasmesso delle quattro pose e continuità dell'effetto durante il cambio posa.

Esiti: `npm.cmd test` **25 test superati**; `npm.cmd run build` e `npm.cmd run test:build` **riusciti**. Le suite E2E pertinenti (`app`, `divination`, `divination-art`, `divination-effects`, `rendering`) su desktop Chromium e mobile WebKit hanno **42 casi superati**, con **2 esclusioni intenzionali**: golden Chromium e ripetizione offline riservata al desktop. Il controllo offline della Trasmutazione esclude la correzione comune del vetro, perché il cambio espressione modifica legittimamente la camicia trasmessa; il liquido rimane identico. Il test inizialmente fallito è passato dopo questo aggiornamento.

Rivisti i dodici filmati con `node scripts/inspect-divination-art-video.mjs glass-rug-final`; fotogrammi di riscontro e intervalli riprodotti sono nei file `*-video-contact.png` e `*-video-playback.json`. Tutti i dodici record risultano registrati correttamente, con stato finale persistente e nessun errore di pagina o asset.

Le verifiche mobile usano Chromium con CPU rallentata 4× e WebKit emulato; non è stato usato un telefono fisico. Nessun push, commit o deploy eseguito.
