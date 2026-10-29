# Livelli della divinazione — stato corrente

> Art pass V3: materiali e coordinate aggiornati in [ART_PASS_V3_REPORT.md](../../ART_PASS_V3_REPORT.md). Specializzazione e asset approvati conservati. La descrizione seguente documenta la base precedente.

Aggiornamento del 28 ottobre 2026. L'analisi precedente rilevava cinque effetti assenti e una sagoma ocra nel vecchio `water-clean.png`. Il renderer è stato sostituito con sei sequenze complete. Specifica, asset e comandi correnti: [DIVINATION_IMPLEMENTATION.md](../../DIVINATION_IMPLEMENTATION.md).

## Composizione

Correzioni successive: [SCENE_CORRECTIONS_REPORT.md](../../SCENE_CORRECTIONS_REPORT.md). Due fasce RGBA ripristinano il bordo del tappeto davanti alle crepe. Il compositore ricostruisce la trasparenza dell'aria e del bordo superiore del bicchiere dalla posa attiva di Wing, prima degli effetti del liquido. Il fondale e i quattro sprite originali restano intatti.

1. Fondale approvato immutabile, proprietario del calice, dello stelo e del bordo.
2. `water-surface-clean.png`: riparazione locale con alpha della foglia impressa, 240 × 60, origine nativa `(650,600)`. Derivazione armonica dal disegno originale; nessun ridisegno dell'ambiente.
3. Interno del liquido mascherato: diffusione del colore e residui illustrati.
4. Superficie estratta senza foglia; rialzo entro i circa 10 pixel nativi disponibili. Onde leggere programmatiche.
5. Foglia originale per il movimento; sei stati illustrati e frammenti per l'appassimento.
6. Ripristino dei riflessi anteriori del vetro dal raster originale, senza un secondo bordo.
7. Atlante illustrato di colature, gocce, impatti e tavolo bagnato. Occlusione del piede nella macchia; nessuna goccia congelata al termine.

Tutti i livelli seguono la camera condivisa nello spazio 1536 × 1024. Le unità locali 1000 × 680 mappano una sola volta il ritaglio `(443,560,650,442)`. I ritagli degli atlas e le destinazioni sono espliciti in `WaterScene.js`.

## Materiale conservato

`unified-goblet-scene.png`, i quattro sprite di Wing, `hands-poses.png` e `table-clean.png` non sono modificati. Il precedente `water-clean.png` rimane nel repository per confronto; il renderer dell'acqua non lo carica.

Asset nuovi: `leaf-states-atlas.png` (1774 × 887), `overflow-atlas.png` (1536 × 1024), `water-surface-clean.png` (240 × 60). I primi due sono illustrati con `image_gen.imagegen` integrato e alpha verificato. Non servono altri asset essenziali per osservare le sei sequenze.

## Controllo

Con Vite avviato, `node scripts/audit-divination-layers.mjs` misura dimensioni, alpha e hash dei vecchi e nuovi PNG. `node scripts/review-divination.mjs` produce screenshot temporali e video reali per tutti i tipi e cinque formati. Le misure di pixel accompagnano l'ispezione visiva; non la sostituiscono.

Resta un limite esplicito: il raster originale non è un sorgente a livelli PSD/KRA. Le maschere conservano il disegno del vetro e i suoi riflessi principali, senza simulare rifrazione volumetrica completa.
