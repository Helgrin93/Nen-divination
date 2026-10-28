# Nen Divination

> **Sei divinazioni — 28 ottobre 2026:** ricostruite tutte le sequenze con atlas illustrati, maschere registrate e timeline indipendenti. Con Vite avviato, apri [l'anteprima diretta](http://localhost:5173/review/divination.html): selezione del tipo, replay, pausa e cursore temporale senza quiz. Dettagli, asset e verifiche in [DIVINATION_IMPLEMENTATION.md](DIVINATION_IMPLEMENTATION.md). Nessun push o deploy.

> **Correzione scena continua (27 ottobre):** ripristinati i quattro livelli originali di Wing sopra un unico fondale con tavolo, mani e calice arrotondato con stelo. Intro, quiz e divinazione condividono la stessa composizione; il risultato ne conserva il calice e l?effetto. Dettagli e prompt in [unified-scene-notes.md](assets/scene/unified-scene-notes.md).

> **V2 — revisione locale del 27 ottobre 2026.** Avvia con `npm.cmd run dev` e apri `http://localhost:5173/`. Fondale con tappeto e crepe dal nuovo riferimento, quattro espressioni di Wing con dissolvenza, sei effetti su canvas e risultato compatto con radar e schede personaggio. Mani e bicchiere conservati. Tenrai ha fornito nomi, ID e URL dei 18 personaggi; i ritratti non sono pubblicati perché i permessi sulle immagini restano non verificati. Vedi [ASSET_STATUS.md](ASSET_STATUS.md) per screenshot e limiti grafici.
>
> Ritagli locali ignorati da Git: per ricrearli, con Vite avviato, `npm.cmd run assets:scene`. Aggiorna i metadati Tenrai con `npm.cmd run assets:characters`. `npm.cmd run build:review` crea una build locale separata; la build normale esclude i ritagli e segnala gli asset mancanti. **Non pubblicare questa fase come V2 definitiva.**

Prototipo responsive ispirato alla prova dell’acqua di Hunter × Hunter, sviluppato con Vite, JavaScript, HTML, CSS e SVG. Funziona interamente nel browser, senza backend, registrazione o chiavi API.

Il flusso comprende incontro con Wing, sette domande, fino a due approfondimenti adattivi, concentrazione di **4,5 secondi**, sei reazioni dell’acqua e risultato con affinità secondaria, radar, personaggi e card PNG **1080 × 1350**.

## Avvio locale

Richiede **Node.js 22.12+**; Node.js 24 è la versione usata per la verifica. Apri un terminale nella cartella del progetto:

```sh
npm install
npm run dev
```

Apri l’indirizzo `Local` indicato da Vite, normalmente **http://localhost:5173**. Se quella porta è occupata, Vite ne propone una diversa.

**Windows PowerShell:** se `npm.ps1` viene bloccato dalle policy, usa `npm.cmd install` e `npm.cmd run dev`. Non occorre cambiare la policy di sistema.

Per provare la versione compilata:

```sh
npm run build
npm run preview
```

Apri l’indirizzo mostrato, normalmente **http://localhost:4173**. Non aprire `index.html` con doppio clic: i moduli richiedono un server HTTP.

## Prova su smartphone

1. Collega PC e telefono alla stessa rete Wi-Fi.
2. Esegui `npm run dev`; il server è già configurato con `--host 0.0.0.0`.
3. Apri sul telefono l’indirizzo **Network** stampato da Vite, ad esempio `http://192.168.1.20:5173`.
4. Se necessario, autorizza Node.js nel firewall per la rete privata. L’indirizzo `localhost` sul telefono indica il telefono stesso, quindi usa l’IP del PC.

Il quiz e il download PNG funzionano tramite HTTP locale. La condivisione nativa dipende dal browser e normalmente richiede HTTPS; quando non disponibile, il pulsante scarica la card PNG. Il sito pubblicato su GitHub Pages usa HTTPS.

Durante la prova tieni premuto sul pulsante vicino alle mani con il mouse sinistro o con un dito. Anche **Spazio** ed **Invio** funzionano quando il pulsante ha il focus. Se rilasci prima di 4,5 secondi, cambi scheda o la finestra perde il focus, la concentrazione si azzera. È sempre disponibile **Rivela senza tenere premuto**.

## Pubblicazione su GitHub Pages

Il progetto contiene già il workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). Pubblica esclusivamente `dist/`: il video e le immagini in `reference/` restano fuori dal sito.

1. Crea un repository GitHub, per esempio `nen-divination`.
2. Carica i file del progetto nel ramo **main**, inclusi `package-lock.json` e `.github/workflows/deploy-pages.yml`. Escludi `node_modules`, `dist`, `.verification`, `test-results` e `playwright-report`, già indicati in `.gitignore`. Puoi escludere anche `reference/` dal repository pubblico se non hai diritto di ridistribuire i riferimenti; non serve all’app.
3. Nel repository apri **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Apri **Actions → Deploy Nen Divination to GitHub Pages**. Il workflow parte a ogni push su `main`; puoi avviarlo anche con **Run workflow**.
5. Al completamento, apri l’URL restituito dal deployment, normalmente `https://TUO-USERNAME.github.io/nen-divination/`.

Il workflow usa Node.js 22, installa con `npm ci`, compila e pubblica `dist`. In produzione Vite usa `base: '/nen-divination/'`; durante lo sviluppo locale usa `/`.

Se preferisci Git da terminale, dopo aver creato un repository remoto **vuoto**:

```sh
git init
git add .
git commit -m "Add Nen Divination prototype"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/nen-divination.git
git push -u origin main
```

Controlla i file inclusi prima del primo commit, in particolare i riferimenti visivi. La pubblicazione non è stata eseguita automaticamente: il prototipo viene consegnato nel progetto locale.

Riferimenti tecnici: [deployment Vite](https://vite.dev/guide/static-deploy.html), [workflow GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Anteprima delle sei divinazioni

Con `npm run dev`, aprire `http://localhost:5173/review/divination.html`. La pagina di sviluppo permette selezione diretta dei sei tipi, avvio/ripetizione, pausa/ripresa, cursore temporale, lingua IT/EN e inquadratura risultato. I preset aprono finestre desktop o mobile. La pressione di 4,5 secondi rimane disponibile.

Le trasformazioni complesse usano atlas illustrati con alpha; movimenti e increspature sono programmatici. Tutte le sequenze conservano lo stato finale nell'app. Dettagli, asset, file modificati e verifiche: [DIVINATION_IMPLEMENTATION.md](DIVINATION_IMPLEMENTATION.md). Screenshot temporali e video reali: `node scripts/review-divination.mjs` con Vite avviato; output in `.verification/divination-v3/`. La pagina e i controlli sono esclusi dalla build di produzione.

## Esecuzione dei test

```sh
npm test
npm run test:simulation
npm run build
npm run test:build
npm run test:e2e
```

- **Vitest:** dataset originale, copertura delle sei aree, shuffle, punteggio centrato, calibrazione, normalizzazione 7/8/9, spareggi, bonus, navigazione e localizzazione.
- **Simulazione:** 30.000 partite complete con seed indipendente `20261117`, bonus adattivi reali e 6.000 profili sintetici. Fallisce se una categoria si discosta di oltre due punti percentuali da 16,67% o se un profilo non può raggiungere la sua categoria.
- **Playwright:** flusso completo a 1440 × 900, 768 × 1024, 390 × 844 e 320 × 568; WebKit mobile; hold, cancellazione, tastiera, eventi touch nativi su Chromium; sei rivelazioni con verifica dei pixel canvas; uso offline, download, lingua, indietro e replay.
- **Build:** `test:build` serve `dist` sotto `/nen-divination/`, completa il quiz ed esporta un PNG. Verifica richieste asset e assenza dei riferimenti privati. Per la build locale: `node scripts/verify-build.mjs --review`.

Per i test browser, la prima volta:

```sh
npx playwright install chromium webkit
```

Su Windows la configurazione usa **Google Chrome** per i progetti Chromium; installalo se assente. WebKit viene installato dal comando precedente. Negli altri sistemi usa Chromium di Playwright. I test `e2e` avviano il server, o riutilizzano quello già in ascolto sulla porta 5173. Lascialo senza modifiche durante la verifica.

Screenshot e PNG di verifica vengono salvati in `.verification/`, esclusa da Git e dal deployment. I risultati quantitativi e i limiti sono descritti in [VALIDATION.md](VALIDATION.md).

## Punteggio e contenuti

`questions_scoring.json` e `score_calibration.json` sono importati direttamente: le 24 domande, le 96 opzioni, gli ID e i pesi del pacchetto restano invariati. Per tentativo viene estratta una domanda per area, più una settima da un’area uniforme; domande e risposte vengono mescolate una sola volta. La lingua non modifica l’estrazione o le risposte.

Il punteggio sottrae la media di ogni domanda, applica `sqrt(7/n)`, divide per la deviazione standard fornita e aggiunge l’offset originale. Con margine fra le prime due categorie ≤ 0,35 vengono selezionate fino a due domande bonus con il maggior potere discriminante standardizzato. Le parità si risolvono per numero di pesi 3, poi pesi 2, infine ID alfabetico. La pressione non decide il Nen.

Il radar segue l’ordine Enhancement → Emission → Manipulation → Specialization → Conjuration → Transmutation. Le percentuali sono relative, normalizzate fra 20% e 100%: non sono probabilità, non devono sommare a 100 e non misurano l’efficienza canonica dell’aura.

Il file originale `scoring_simulation_summary.json` descrive una simulazione precedente alla calibrazione: è conservato come materiale consegnato, ma **non** è usato dall’app e non rappresenta i risultati dei test del prototipo.

## Grafica e asset mancanti

Sono stati analizzati i riferimenti in `reference/` e il video `reel-original.mp4`. L'anteprima locale usa un montaggio di Wing e del riferimento anime con mani e calice; il canvas conserva l'effetto finale fra divinazione e risultato. La scheda riprende tema scuro, pannelli sottili, serif, accento del tipo, radar, accordion e azioni del mockup, con spaziature compatte e una fascia personaggi scorrevole su mobile.

**La fedeltà visiva non è completa:** Wing usa quattro PNG allineati già presenti nel progetto, ma la loro provenienza non è registrata. Il muro con tappeto e crepe è stato generato con imagegen su richiesta dell'utente; le mani non hanno livelli indipendenti e il piede del calice è già tagliato nel riferimento. Nessuna lettera sostituisce Wing. Il catalogo locale contiene i 18 personaggi identificati tramite Tenrai, ma i permessi delle loro immagini non sono verificati: le schede segnalano i ritratti mancanti. Nessun nuovo volto generato o ritratto estratto dal mockup in questa revisione.

Per aggiungere immagini autorizzate, segui [ASSETS.md](ASSETS.md). L'app legge i metadati dal JSON locale e non interroga Tenrai durante il quiz. La card PNG resta una sintesi 1080 × 1350, senza ritratti né immagini esterne; non è una cattura della schermata finale.

Prima di un rilascio pubblico con personaggi riconoscibili servono immagini autentiche con permessi verificati, crediti e una verifica visiva su dispositivi fisici iOS/Android. I test WebKit/Chromium emulati non sostituiscono questa verifica. La calibrazione rimane provvisoria e ludica; non è stata misurata su persone reali. L’audio opzionale non è incluso.

## Privacy e funzionamento offline

Nessuna analytics, nessun account, nessun cookie e nessuna richiesta a servizi esterni. Viene salvata soltanto la preferenza `lang=it|en` in localStorage; risposte e risultati restano in memoria e si perdono ricaricando. I link alle fonti vengono aperti soltanto su richiesta.

Una pagina già caricata può completare quiz ed esportazione senza rete. Non è presente un service worker: una prima visita o un ricaricamento offline richiedono che il server sia raggiungibile o che il browser disponga già delle risorse in cache.

Fan project non ufficiale, senza affiliazione ai titolari di Hunter × Hunter. Le frasi di Wing sono scritte per l’esperienza, non presentate come citazioni canoniche.
