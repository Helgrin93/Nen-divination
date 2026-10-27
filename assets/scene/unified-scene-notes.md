# Scena continua — 27 ottobre 2026

Asset: `public/assets/scene-v3/unified-goblet-scene.png` (1536 × 1024).
Creato con lo strumento integrato imagegen; nessuna API/CLI esterna.

La scena usa un solo fondale con muro, tappeto, tavolo, mani e calice.
I quattro PNG originali di Wing restano sovrapposti nella stessa camera:
neutro, sorriso, occhi chiusi e gesto. Le espressioni cambiano con dissolvenza.
Il canvas modifica soltanto l'acqua e la foglia; non contiene più un secondo
riquadro della scena anime. Le coordinate del canvas sono riferite alla regione
`x=443, y=560, width=650, height=366` della nuova illustrazione.

I sorgenti precedenti sono conservati. L'asset è incluso nella build di revisione
locale, secondo la configurazione già esistente del progetto.

## Concentrazione e reazioni

Le mani del dipinto originale si avvicinano leggermente al calice durante la
pressione, attraverso una deformazione locale su canvas; tornano alla posizione
iniziale al rilascio. Il centro della scena e il calice non vengono deformati.
Increspature e piccoli flussi luminosi accompagnano la concentrazione. I sei
effetti dell'acqua sono più visibili e si sviluppano in 3,6 secondi; la schermata
di rivelazione resta visibile per 4,2 secondi prima del risultato.
Con movimento ridotto, le mani restano ferme e gli effetti finali sono statici.

## Prompt imagegen

Use case: precise-object-edit / compositing.
Create a seamless anime game scene background plate, landscape 1536 x 1024.
Input 1 composition-source.png is the edit target and exact composition guide. Input 2 ANIME_HANDS_GLASS_REFERENCE.png is ONLY the reference for the rounded goblet shape. Input 3 wall-rug.png is the room wall design.
Preserve the first image's continuous warm wooden tabletop perspective, foreground player's two hands and their positions, clean anime lines, warm shading, and framing. Replace ONLY its straight tumbler with a clear stemmed goblet having the reference's wide oval rim, rounded tall bowl tapering smoothly into a thin stem, and a small flat circular foot resting on the table. Fill with clear water nearly to rim and a single green leaf. Goblet centered x=768, rim at about y=720, bowl ending y=900, stem and foot ending y=984; bowl width about 205 px. It must be integrated naturally into the table with reflections, same line art and lighting. Do NOT paste the second reference rectangle or its hands.
Remove Wing completely from this background plate: his four existing transparent animation sprites will be composited separately. Reconstruct the wall behind him. Use the third input's ochre cracked plaster and hanging patterned rug as the wall, filling the area above the back edge of the tabletop. Keep the tabletop back edge at y=682 across the frame as in the first image. No chair, no extra people. The result should be ONE continuous scene, with coherent perspective and light, no split panels, no seams, no photographic inserts, no text or UI. Keep player's hands exactly from first image.
