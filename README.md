# Nen Divination

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

Il progetto contiene già il workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Pubblica esclusivamente `dist/`: il video e le immagini in `reference/` restano fuori dal sito.

1. Crea un repository GitHub, per esempio `nen-divination`.
2. Carica i file del progetto nel ramo **main**, inclusi `package-lock.json` e `.github/workflows/deploy.yml`. Escludi `node_modules`, `dist`, `.verification`, `test-results` e `playwright-report`, già indicati in `.gitignore`. Puoi escludere anche `reference/` dal repository pubblico se non hai diritto di ridistribuire i riferimenti; non serve all’app.
3. Nel repository apri **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Apri **Actions → Deploy Nen Divination to GitHub Pages**. Il workflow parte a ogni push su `main`; puoi avviarlo anche con **Run workflow**.
5. Al completamento, apri l’URL restituito dal deployment, normalmente `https://TUO-USERNAME.github.io/nen-divination/`.

Il workflow installa con `npm ci`, esegue i test unitari e la simulazione, compila e pubblica `dist`. Il progetto usa `base: './'` e nessun routing lato client: gli asset funzionano anche sotto il nome del repository senza modificare la configurazione.

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

## Test

```sh
npm test
npm run test:simulation
npm run build
npm run test:build
npm run test:e2e
```

- **Vitest:** dataset originale, copertura delle sei aree, shuffle, punteggio centrato, calibrazione, normalizzazione 7/8/9, spareggi, bonus, navigazione e localizzazione.
- **Simulazione:** 30.000 partite complete con seed indipendente `20261117`, bonus adattivi reali e 6.000 profili sintetici. Fallisce se una categoria si discosta di oltre due punti percentuali da 16,67% o se un profilo non può raggiungere la sua categoria.
- **Playwright:** flusso completo a 1440 × 900, 390 × 844 e 320 × 568; WebKit mobile; hold, cancellazione, tastiera, eventi touch nativi su Chromium; sei rivelazioni; uso offline dopo il caricamento; download e fallback condivisione; lingua, indietro e replay.
- **Build:** `test:build` serve `dist` sotto `/nen-divination/`, gioca le prime domande e verifica richieste asset e assenza dei riferimenti dal sito.

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

Sono stati analizzati entrambi i riferimenti PNG e il video `reference/reel-original.mp4`. La composizione è ripresa con scena frontale, tavolo caldo, foglia, bicchiere e mani; il risultato riprende tema scuro, pannelli sottili, serif, accento del tipo, radar, accordion e tre CTA del mockup. La scena SVG rimane montata fra le fasi e conserva l’effetto finale.

**Non è una riproduzione visiva al 99%:** il pacchetto non contiene asset autentici autorizzati di Wing o dei personaggi. Wing è rappresentato da un segnaposto frontale neutro con monogramma W; i personaggi da schede tipografiche esplicitamente etichettate. Non sono stati generati volti anime né estratti ritratti dal mockup. I movimenti del segnaposto sono sobri; espressioni e pose autentiche richiedono asset approvati.

Per aggiungere immagini, segui [ASSETS.md](ASSETS.md). I campi `permissionStatus`, `portraitSrc` e `poses` sono già predisposti; immagini mancanti o non caricate tornano al fallback. La card PNG non include ritratti e non richiede immagini esterne.

Prima di un rilascio pubblico con personaggi riconoscibili servono immagini autentiche con permessi verificati, crediti e una verifica visiva su dispositivi fisici iOS/Android. I test WebKit/Chromium emulati non sostituiscono questa verifica. La calibrazione rimane provvisoria e ludica; non è stata misurata su persone reali. L’audio opzionale non è incluso.

## Privacy e funzionamento offline

Nessuna analytics, nessun account, nessun cookie e nessuna richiesta a servizi esterni. Viene salvata soltanto la preferenza `lang=it|en` in localStorage; risposte e risultati restano in memoria e si perdono ricaricando. I link alle fonti vengono aperti soltanto su richiesta.

Una pagina già caricata può completare quiz ed esportazione senza rete. Non è presente un service worker: una prima visita o un ricaricamento offline richiedono che il server sia raggiungibile o che il browser disponga già delle risorse in cache.

Fan project non ufficiale, senza affiliazione ai titolari di Hunter × Hunter. Le frasi di Wing sono scritte per l’esperienza, non presentate come citazioni canoniche.
