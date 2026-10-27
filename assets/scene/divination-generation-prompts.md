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
