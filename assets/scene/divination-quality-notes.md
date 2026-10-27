# Prova di qualità della divinazione — 27 ottobre 2026

Anteprima: `http://localhost:5173/review/divination.html`, con `npm.cmd run dev` avviato. Permette riposo, pressione di 4,5 secondi e riavvio senza compilare il quiz. È un ingresso separato, escluso dalla build di produzione. L'app principale integra gli stessi renderer.

## Analisi della versione precedente

`HandsMotion.js` deformava con una mesh triangolare i 304 pixel inferiori del fondale. Mani e tavolo appartenevano allo stesso raster: avvicinare la mano spostava anche le venature del legno, senza ruotare anatomicamente il palmo o piegare le dita.

`WaterScene.js` sovrapponeva al calice una tinta azzurra rettangolare, un'ellisse traslata, tre anelli uniformi, due tratti per il traboccamento e sei lineette luminose convergenti. Le altre reazioni erano sovrapposizioni geometriche. Il CSS aggiungeva un bagliore al canvas. Riflessi del vetro e superficie dell'acqua non erano separati.

## Prova realizzata

- Tre disegni distinti delle mani: riposo, avvicinamento e concentrazione. Il canvas registra separatamente i polsi e raccorda i disegni lungo una breve traiettoria di sollevamento. Nessuna mesh deforma più il tavolo. Riposo durante il quiz, avvicinamento all'invito di Wing, concentrazione alla pressione, ritorno all'avvicinamento al rilascio.
- Palmi rivolti verso il calice, dita curve e distanza dal vetro. Movimento durante la pressione inferiore a un pixel della scena. L'aura ricampiona soltanto due piccole zone accanto ai palmi, con ampiezza massima di 0,65 pixel; non produce luce né cambia la tinta della scena.
- Increspature dopo circa 450 ms, con intensità legata al tempo realmente trascorso nella pressione. Onde prospettiche con cresta e avvallamento, rifrazione di piccola ampiezza e maschera ellittica della superficie. La foglia oscilla impercettibilmente.
- Alla fine dei 4,5 secondi, il Potenziamento alza superficie e foglia, raggiunge il bordo e produce due veli sottili asimmetrici, gocce con accelerazione gravitazionale e una piccola zona bagnata. Il velo segue la coppa prima che le gocce si stacchino. Il livello arriva al bordo prima del traboccamento.
- Il calice originale è già quasi pieno: l'escursione disponibile è di circa 10 pixel nel raster originale, 16 nel canvas. Un rialzo maggiore portava acqua e foglia fuori dalla prospettiva del bordo. Non viene abbassato artificialmente il livello iniziale.
- Effetti precedenti rimossi. Emissione, Trasmutazione, Materializzazione, Manipolazione e Specializzazione mostrano per ora l'illustrazione immobile. Il punteggio, la categoria ottenuta, i contenuti e il layout finale non cambiano.

Il canvas acqua misura 1000 × 680 e corrisponde al ritaglio `(443, 560, 650, 442)` del raster 1536 × 1024. Include il tavolo sotto il piede, evitando gocce o una pozza sospese. I livelli condividono la camera responsive. Nessun filtro viene applicato alla scena. Movimento ridotto: pose e acqua ferme. Tastiera, touch, alternativa accessibile e cancellazione mantengono il comportamento precedente.

Solo nella divinazione il fumetto è più compatto su tablet verticale e smartphone piccoli, per lasciare acqua e pulsante visibili. Posizioni e stili del quiz e del risultato restano invariati. Gli avambracci rimangono ancorati sotto il bordo del fotogramma durante il sollevamento.

## Valutazione PixiJS 8

Consultate le guide ufficiali su [renderer](https://pixijs.com/8.x/guides/components/renderers) e [filtri](https://pixijs.com/8.x/guides/components/filters). WebGL con displacement filter sarebbe utile per rifrazione continua o deformazioni più complesse della foglia. Questa prova usa due sprite per posa, pochi tratti e piccole aree di ricampionamento: Canvas 2D permette maschere e compositing senza una nuova dipendenza o una seconda pipeline shader. `package.json` e lockfile invariati. Si rivaluterà WebGL dopo la revisione visiva; la libreria da sola non risolve gli asset a livelli mancanti.

## Asset inclusi

Generati con `image_gen.imagegen` integrato, senza CLI o API esterna. Input di tutte e tre le chiamate: `public/assets/scene-v3/unified-goblet-scene.png`. Copie salvate nel progetto; nessun riferimento runtime alla cartella privata delle immagini generate.

| File in `public/assets/divination/` | Dimensioni | Uso |
| --- | --- | --- |
| `table-clean.png` | 1536 × 1024 | Ripristina solo le due aree delle mani e delle ombre originali. |
| `hands-poses.png` | 1254 × 1254, RGBA | Tre coppie di mani, registrate con ritagli individuali perché il generatore non ha rispettato una griglia perfetta. Alpha verificato nel browser. |
| `water-clean.png` | 1536 × 1024 | Ripara solo lo spazio coperto dalla foglia; gli altri pixel non vengono usati. |

File originali di Wing, tappeto e fondale non modificati. Prompt completi in [divination-generation-prompts.md](divination-generation-prompts.md).

## Asset ancora necessari e limiti visivi

1. **Fotogrammi intermedi delle mani**: almeno 6–8 disegni allineati per riposo → sollevamento → rotazione del polso → concentrazione. Le tre pose attuali hanno raccordi brevi con sovrapposizione su canvas: una sequenza illustrata completa eliminerebbe l'accenno di dissolvenza. Non è un rig anatomico articolato.
2. **Vetro e acqua su livelli separati**: coppa e stelo trasparenti con riflessi anteriori/posteriori, superficie senza foglia, corpo dell'acqua e maschere esatte. La prova ricostruisce una piccola porzione del menisco dal raster; questo limita la qualità dei riflessi mentre il livello sale.
3. **Foglia con alpha rifinito** nella stessa prospettiva: il ritaglio attuale conserva alcuni pixel dell'acqua circostante. Servirà anche per le future reazioni, non implementate qui.
4. **Sequenza del velo d'acqua sul bordo**, 4–6 fotogrammi con spessore e riflessi coerenti con il disegno originale. La prova attuale usa veli e gocce procedurali sobri; non è una simulazione completa di fluidi.

Non occorrono nuove immagini di Wing, tappeto o stanza. Gli asset delle altre cinque reazioni restano fuori da questa prova e non sono stati generati.

## Verifica

`node scripts/review-divination.mjs` salva sei fasi, un video e un report per ciascun formato in `.verification/divination/`: desktop 1440 × 900, tablet 768 × 1024, smartphone 390 × 844, smartphone piccolo 320 × 568 e WebKit 390 × 844. L'orologio controllato fissa il confronto a 1,6 e 4,1 secondi della pressione. Screenshot ispezionati: pose, increspature, rialzo e traboccamento. Corretti doppio bordo, duplicazione della foglia e quota della zona bagnata. Report senza errori di pagina, richieste fallite o overflow orizzontale nei cinque formati. Nessuna prova su smartphone fisico.

I test browser verificano crescita dell'intensità, ripristino dei pixel al rilascio e al replay, durata di 4,5 secondi, livello dell'acqua, assenza di segni luminosi fuori dal calice, cinque categorie differite, mouse/touch/tastiera, movimento ridotto, asset mancanti, flusso completo ed export offline.

Comandi: `npm.cmd test`, `npm.cmd run build`, `npm.cmd run test:build`, `npx.cmd playwright test`. Build verificata anche sotto `/nen-divination/`, con tutti i nuovi asset risolti. Nessun push GitHub o deploy eseguito.

Verifiche complete: **25 test unitari superati**, **32 test browser superati**, **8 casi ripetitivi esclusi** dalla configurazione per i dispositivi secondari. Dopo l'ultima rifinitura degli avambracci e del fumetto, ripetuta la verifica mirata della divinazione su tutti e cinque i formati, includendo l'assenza di sovrapposizioni fra istruzioni, acqua e comandi.
