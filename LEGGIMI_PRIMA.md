# Come usare questo pacchetto (redesign, non nuovo progetto)

Questo pacchetto AGGIUNGE direttive grafiche al progetto Vite già online. **Non cancellare la cartella esistente**, `src`, `package.json`, test, dataset, workflow GitHub Pages o la specifica V1.

- `PROMPT_PER_CODEX.md`: istruzione principale; Copia il testo in Codex o chiedigli di leggerlo.
- `REDESIGN_VISIVO_SPEC.md`: specifica grafica dettagliata; ha precedenza sulla V1 solo per grafica/copy/layout.
- `GUIDA_IMMAGINI_E_ASSET.md`: fonti, elenco asset richiesti, gestione qualità/licenze.
- `reference/`: tutte le immagini originali inviate nella conversazione, rinominate chiaramente; l'immagine `OLD_DESIGN_DO_NOT_COPY.png` è un esempio da NON riprodurre.
- `assets/`: cartelle modello per Wing, personaggi e scena. Non contengono ancora sprite isolati autentici e utilizzabili: sono da reperire/preparare.

IMPORTANTE: questo pacchetto **non può magicamente produrre ritagli trasparenti di Wing o 18 immagini dei personaggi dall'anime**. I file in `reference/` sono screenshot interi a scopo di confronto. Un agente che li ha disponibili deve distinguere reference e asset pubblicabili.

Per Codex: «Leggi `PROMPT_PER_CODEX.md` e i due documenti collegati. Mantieni la logica esistente. Realizza prima una schermata visiva credibile e riferisci quali asset mancano».
