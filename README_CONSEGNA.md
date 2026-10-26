# Pacchetto di consegna per Codex

Carica `SPEC_NEN_DIVINATION_CODEX.md` a Codex come documento principale.
Allega anche `questions_scoring.json` e `score_calibration.json` per import diretto e le due immagini di riferimento nella cartella `reference/`.

* `reference/reel-composition-reference.png`: screenshot dal reel caricato, soltanto composizione
* `reference/result-design-reference.png`: mockup approvato, soltanto composizione/UI; i ritratti nell'immagine non vanno copiati

Per Wing e 18 personaggi usare soltanto ritratti autentici e con diritto d'uso; metadata AniList/Jikan non concedono licenze sulle illustrazioni. In mancanza, fallback tipografico fino all'approvazione degli asset.

Dopo le 24 domande e il punteggio, chiedi a Codex di aprire il sito con `npm run dev`, eseguire test e costruzione e riportare eventuali asset mancanti.
