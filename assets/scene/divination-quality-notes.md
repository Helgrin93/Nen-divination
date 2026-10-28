# Verifica artistica delle sei divinazioni — 28 ottobre 2026

La precedente prova animava soltanto il Potenziamento. Il renderer corrente usa sprite illustrati per traboccamento, gocce, impatti, foglia secca, frammenti e residui; programma movimenti, maschere, transizioni, diffusione e increspature. Le sei categorie hanno timeline proprie.

Dettagli e comandi: [DIVINATION_IMPLEMENTATION.md](../../DIVINATION_IMPLEMENTATION.md). Anteprima: `http://localhost:5173/review/divination.html`, disponibile solo in sviluppo.

## Criteri applicati

- Il calice, Wing, le mani, lo sfondo e la luce provengono dagli asset approvati. Nessun nuovo bicchiere generato per categoria.
- Foglia mobile estratta dal riferimento, ruotata nel piano dell'acqua con compressione prospettica. Sagoma impressa rimossa prima di riposizionarla.
- Rialzo limitato alla capienza visibile del disegno originale; leggibilità affidata anche a colature, gocce finite e macchia illustrata.
- Emissione rosata nel solo liquido, foglia preservata, riflessi anteriori originali ripristinati.
- Trasmutazione resa attraverso il dialogo di Wing sul sapore dolce; nessuna prova visiva inventata.
- Residui e frammenti piccoli, opachi o semitrasparenti, senza luce propria e con profondità diverse.
- Specializzazione riferita a Neferpitou: foglia verde, spenta, bruna, fragile, frammentata; niente cambiamenti di illuminazione ambientale.

## Correzioni emerse dall'ispezione

Il vecchio asset AI senza foglia lasciava una sagoma ocra. Una seconda generazione non l'ha eliminata in modo soddisfacente. È stata sostituita da una riparazione locale, calcolata sui pixel originali, della sola impronta della foglia. La prima estrazione della foglia includeva un piccolo riflesso del bordo: ristretto il dominio e affinata la selezione cromatica per escluderlo. La superficie mobile è ritagliata dentro la bocca, evitando di sollevare il bordo insieme all'acqua.

L'anteprima risultato nasconde il fumetto della concentrazione: questa correzione appartiene soltanto alla pagina di sviluppo. Il layout della scheda finale dell'app è conservato.

## Evidenze

`.verification/divination-v3/` contiene inizio, metà, fine, risultato e dettagli per tutte le sei categorie su desktop, tablet, mobile, mobile piccolo e WebKit. Ogni formato ha un video reale delle sei sequenze e record in `report.json`. I frame compositi sono confrontabili con `unified-goblet-scene.png`, non soltanto con il canvas trasparente.

I test browser verificano anche avvio effettivo, pausa/ripresa, ricerca temporale, replay, allineamento dei rettangoli, persistenza, lingua, input e movimento ridotto. Non sono state eseguite prove su dispositivi fisici. I riflessi restano quelli di un'illustrazione raster con maschere locali, non una simulazione fisica completa.
