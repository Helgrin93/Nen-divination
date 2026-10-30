# V4 — audit di pulizia

Audit eseguito prima delle esclusioni dal bundle, il 30 ottobre 2026. Base: 177 file tracciati prima degli ultimi strumenti V4. Nessun file viene eliminato dal repository.

| Gruppo | Uso verificato | Decisione e conseguenza |
|---|---|---|
| `src/main.js`, moduli `src/components`, `src/game`, `src/data`, CSS | Runtime importato da Vite | Conservare; niente riscrittura. |
| `questions_scoring.json`, `score_calibration.json` | Importati dal quiz | Conservare integralmente: 24 domande, 96 vettori e calibrazione invariati. |
| `public/assets/scene-v3/unified-goblet-scene.png`, quattro pose Wing | Scena persistente approvata | Conservare file e inquadratura; sempre nel bundle. |
| `public/assets/divination/table-clean.png` | `HandsMotion.js`, rimozione dell’impronta delle mani | **Conservare nel bundle**: il nome “clean” non significa obsoleto. |
| Atlanti foglia, colature, mani, residui e diffusione; superficie pulita; riparazione tappeto | Import/caricamento da `WaterScene`, `WaterArtPass`, `QuizScene`, `HandsMotion` | Conservare tutti, inclusi `overflow-atlas.png` e `leaf-states-atlas.png`, ancora necessari. |
| `public/assets/divination/water-clean.png` (1,65 MB) | Nessun caricamento runtime; usato dall’audit storico dei materiali | Escludere soltanto dalla build normale. Rimane nel repository, nello sviluppo e nella build di review. |
| `public/assets/characters/*.jpg` (18 copie preesistenti, circa 0,7 MB) | Cache locale delle tre card iniziali, diritti non verificati | Conservare per la prova locale; escludere dalla build pubblica se non autorizzati. In produzione le schede referenziano gli URL originali tracciati. Nessuna nuova copia dei 12 ritratti aggiunti. L’embed remoto non viene presentato come autorizzazione di pubblicazione. |
| `composition-source.png`, `background-source.png`, `wall-rug.png` | Sorgenti della scena, già escluse dal bundle | Conservare: servono alla rigenerazione e alla provenienza. |
| `src/components/WingScene.js`, `src/components/icons.js`, regole CSS storiche | `WingScene` non è un entrypoint attuale; icone/CSS condivisi anche con review/documentazione precedente | Nessuna eliminazione automatica. Il tree shaking esclude il componente inutilizzato; rimuovere in blocco il CSS aggiungerebbe rischio senza vantaggio misurato. |
| `review/`, script `review-*`, preparazione/audit asset | Preview delle sei reazioni, risultati, riproducibilità | Conservare. Nessun entrypoint review nel bundle di produzione. |
| `reference/`, `NEN_DIVINATION_V4_CODEX/`, documenti V2/V3, prompt in `assets/scene` | Riferimenti e documentazione storica/approvata | Conservare fuori dal bundle, inclusi i sorgenti degli effetti. |
| `src/tests`, `e2e`, fixture golden, package-lock, workflow Pages e configurazione Vite | Regressione, installazione e pubblicazione | Conservare tutti. Test aggiornati quando l’aspettativa precedente contraddice la V4 (dialoghi brevi e citazione rimossa). |
| `.verification`, `test-results`, `playwright-report`, `dist`, `node_modules` | Output rigenerabili locali | Già ignorati da Git; rimangono fuori dai commit. Nel report viene conservata una selezione di screenshot in `docs/v4/`. |
| `.env*` | Possibili configurazioni sensibili | Ignorare tutte, con sola eccezione `.env.example`. Nessun segreto introdotto. |

La pulizia riduce gli asset di produzione senza perdere sorgenti o cronologia. Il workflow continua a pubblicare solo `dist/` da `main`; nessun push/merge/deploy è stato eseguito. Il report finale registra dimensioni e verifica sotto `/nen-divination/`.
