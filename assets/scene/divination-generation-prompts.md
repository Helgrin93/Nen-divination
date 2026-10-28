# Prompt finali — prova della divinazione

Strumento: `image_gen.imagegen` integrato, nessuna CLI. Un riferimento locale per ogni chiamata: `public/assets/scene-v3/unified-goblet-scene.png`. Asset copiati in `public/assets/divination/`.

## Tavolo senza mani — `table-clean.png`

`transparent_background: false`

```text
Use case: precise-object-edit. Edit target: supplied 1536x1024 anime painting. Produce a matching clean background plate. Remove ONLY the two foreground human hands and their shadows at the bottom of the image, reconstructing the uninterrupted honey brown horizontal wooden tabletop behind them. Keep EXACT original composition, dimensions, glass goblet, water, floating green leaf, wall, cracks and decorative rug. No human, no extra objects, no text. Preserve anime linework, warm palette and lighting. The goblet must remain exactly centered and unchanged. The lower left and lower right should just be seamless wood, including to the bottom edge. Do not redesign or repaint other areas.
```

## Tre pose delle mani — `hands-poses.png`

`transparent_background: true`. Richiesti 1536 × 1536; restituiti 1254 × 1254. I ritagli runtime rispettano le dimensioni effettive, senza modificare l'immagine generata.

```text
Use case: stylized-concept. Asset type: transparent anime animation hand sprite atlas. Input image is STYLE and POV reference ONLY. Create one square 1536x1536 RGBA transparent sprite sheet, exactly THREE equally tall horizontal rows, each 1536x512. Each row contains ONLY a left and right pair of young human hands AND their forearms extending to the bottom edge of that row. No background, no glass, no leaf, no table, no effects, no aura, no text, no grid, no labels. Match reference peach skin tone, thin dark anime outlines, flat cel shaded warm soft colors. First person view like reference, camera looking downward at glass on table, pair symmetric in placement but naturally different details. Five anatomically correct fingers on each hand. Center gap between hands must remain empty and transparent to fit a 200px wide goblet centered at x768. Row 1 REST: relaxed fingers gently curled, backs of hands facing camera, left hand from x200 at bottom to x550 at y280, right mirrored. Row 2 APPROACH: wrists lifting and turning, relaxed fingers more upright, palms facing inward toward blank central gap; left forearm x260 at bottom, left fingertips around x615 y160, right mirrored. Row 3 CONCENTRATION: both hands upright beside central gap, palms naturally facing inward toward each other and glass, show outer back/side of hands to camera, cupped gently, fingers anatomically bent as if holding an invisible ball WITHOUT touching it. Left fingertips near x635 y70, right fingertips near x901 y70, fingertips never entering middle x660..876. Forearms at x290 and1246 bottom. These are different anatomical drawings of the same pair of hands, NOT a rotated copy. Each row's forearms stop neatly at the bottom of its row and never overlap adjacent rows. Preserve the style of reference exactly. Transparent background is essential.
```

## Acqua senza foglia — `water-clean.png`

`transparent_background: false`

```text
Use case: precise-object-edit. Edit the supplied original anime painting. Remove ONLY the green leaf floating on the water inside the glass goblet. Fill the small leaf footprint with the same clear transparent water and appropriate soft reflections continuous with the adjacent surface. The water surface should be clean with absolutely no leaf, no green marks, no floating object. EXACTLY preserve every other part of the input: same 1536x1024 framing, identical glass rim, bowl, stem and foot, same position, same water level, same wooden table, hands, decorative wall rug, cracks, palette, shading and anime linework. Do not add ripples or any effect. This is a clean surface layer used to animate the original leaf separately. Only erase the leaf and reconstruct the water it covered. No other change.
```

## Ricostruzione delle sei categorie — 28 ottobre 2026

Strumento: **`image_gen.imagegen` integrato**, senza CLI/API a pagamento separata. Riferimento di stile per entrambe le generazioni selezionate: `public/assets/scene-v3/unified-goblet-scene.png`. `transparent_background: true`. Output copiati nel progetto.

### `leaf-states-atlas.png` — prompt completo

```text
Use case: illustration-story. Asset type: transparent PNG animation sprite atlas for an existing 2D anime water-divination app. The input image is STYLE AND LEAF SHAPE REFERENCE ONLY; do NOT redraw the scene or glass. Draw a carefully aligned atlas, square canvas, exactly 4 columns by 2 rows of equal cells, transparent background throughout. Each cell has ONE isolated leaf or debris cluster, centered with wide transparent margins, no text, no labels, no shadows cast on a background. Camera: the flattened shallow top-oblique view of the green leaf floating in the reference goblet. Leaf blade points LEFT with short stem on RIGHT, width about 4.2 times its apparent height, natural dark thin ink outline, olive yellow-green cel shading and clearly drawn brown-green veins, match reference palette precisely. Same apparent full leaf width and center in all first six cells; leaf occupies 75 percent of each cell width. TOP ROW left to right: 1 exact healthy green leaf like reference; 2 same leaf with muted olive colors, first brown dry tips and edges; 3 same leaf with half brown ochre blade and curled dark brittle edges, still same outline; 4 same leaf completely dry dark umber, small fissures following the veins. BOTTOM ROW left to right: 1 same dry leaf with several cracks and small missing edge sections; 2 remaining broken skeleton and 6 small disconnected leaf pieces in original footprint; 3 a loose cluster of 10 tiny irregular dark brown leaf flakes, each distinctly separated with transparent space, matte nonluminous; 4 loose cluster of 8 tiny irregular muted tan grey olive sediment specks, individually distinct, matte, nonluminous. Do not add water, glass, light effects, purple, flames, glow or scenery. Flat hand-painted anime art, no 3D, no photographic textures. Crucial: true transparent alpha, consistent cell alignment, coherent same leaf shape through all frames, not eight different leaves.
```

Output effettivo 1774 × 887. Le linee di griglia generate non vengono mai campionate dai ritagli runtime. La foglia originale rimane lo sprite della Manipolazione; gli stati dell'atlante servono alla Specializzazione.

### `overflow-atlas.png` — prompt completo

```text
Use case: illustration-story. Asset type: production transparent PNG sprite atlas, 2 columns x 2 rows. Use the input illustration ONLY as reference for anime cel-shaded clear water, glass proportions and warm light; do not reproduce the scene. All 4 cells equal, separated by transparent gutters, no grid lines. Transparent alpha background. NO glass, no vessel, no hands, no scenery, no text. TOP LEFT CELL: isolated overflow water veil, clear translucent liquid forming two unequal narrow irregular rivulets, starting on the left and right sides of an invisible rounded goblet, at same top y; gap between start points 200 px when the cell is 400px wide. Left rivulet travels nearly vertically downward, curves inward slightly along the outside of the bowl and finishes 210px below; right starts 8px lower, is narrower and ends 145px below. Gentle curved meniscus folds at their tops, visibly liquid with changing organic width, dark desaturated grey teal ink outlines, translucent pale warm blue-grey body and restrained ivory cel-shaded highlights, no uniform blue strokes. Everything in cell stays inside a 240 wide x 300 high bounding box. TOP RIGHT CELL: exact same registered rivulet composition and proportions, mature flowing phase: left rivulet thicker near top, divides into two small irregular hanging rounded tongues at bottom, right extends to 220px. No falling drops in either top cell. BOTTOM LEFT CELL: isolated small irregular flat puddle on a wooden table that is NOT drawn, with three connected asymmetric lobes, shallow foreshortened top-oblique perspective ellipse aspect about 4:1, gently dark transparent warm grey interior and thin broken ivory glints at the edges. No white opaque fill, no giant splashes. BOTTOM RIGHT CELL: 6 individually separated tiny clear water sprites arranged 3 columns by 2 rows inside that cell: top row a round hanging bead, an elongated falling drop, a second smaller asymmetric drop; bottom row three restrained small impact splash crowns progressing from tiny vertical impact to low spread ripples, shallow perspective. Thin dark grey anime outlines and pale muted highlights, translucent interiors, no glow, no neon, no photorealism. This is delicate hand-drawn water animation for the EXISTING small goblet; match reference style, maintain organic liquid shapes and true transparency.
```

Output effettivo 1536 × 1024. I rivoli vengono ritagliati separatamente e registrati sui due lati della coppa; gocce, impatti e macchia hanno sorgenti proprie nello stesso atlante.

### Varianti scartate

Una richiesta di estrazione dello sfondo sull'atlante dell'acqua ha prodotto una variante più contrastata senza un vantaggio visivo sufficiente. Un nuovo tentativo di rimuovere la foglia dal fondale lasciava ancora tratti ocra. Entrambi sono conservati soltanto in `.verification/generated-unused/`, esclusi da build e Git. Nessuna variante scartata è referenziata dal codice.

`water-surface-clean.png` non è una nuova immagine AI: è una riparazione locale del raster approvato, riproducibile con `node scripts/prepare-water-surface.mjs`, trasparente fuori dall'impronta originale della foglia.
