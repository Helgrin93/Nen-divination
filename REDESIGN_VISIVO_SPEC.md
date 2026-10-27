# NEN DIVINATION — REDESIGN ART DIRECTION & UX (V2)

**Precedenza**: questo documento sostituisce SOLO le scelte visive, di copy e di collocazione UI della specifica V1. Mantieni il codice e la logica dei punteggi, le 24 domande approvate, 96 vettori, i test quantitativi e i due bonus condizionali. Sviluppa nel repository esistente, non ricreare un progetto vuoto.

## A. Riferimenti: cosa usare e cosa NON copiare

| File | Ruolo |
|---|---|
| `reference/REEL_WING_01.jpeg`, `REEL_WING_02.jpeg`, `REEL_WING_03.jpeg` | Inquadratura di Wing e alcune sue espressioni/gesti; gli overlay Instagram vanno IGNORATI |
| `reference/REEL_COMPOSITION.png`, `REEL_CONTACT_SHEET.jpg` | Composizione generale e scene del reel |
| `reference/ANIME_HANDS_GLASS_REFERENCE.png` | Standard qualitativo per anatomia delle mani, riflessi del bicchiere, foglia e prospettiva del tavolo |
| `reference/RESULT_TARGET_EXACT.png` | **Vincolo di art direction prioritario per la scheda risultato**: ordine elementi, proporzioni, colori, pannelli, typography, radar, personaggi |
| `reference/OLD_DESIGN_DO_NOT_COPY.png` | **Esempio negativo**: non riprodurne grafica o struttura |

Gli screenshot servono da riferimento e NON sono sprite separati o una libreria di asset pronti. Non distribuirli come illustrazioni incorporate senza verificare l'autorizzazione. Se sono assenti livelli necessari, segnalare ciò che manca anziché sostituire con grafica primitiva.

## B. Concetto: visual novel anime, non sito aziendale

L'utente è seduto davanti a Wing. Lo guarda: Wing, con occhiali, capelli scuri e camicia, è al centro superiore; davanti a lui ci sono il tavolo, il bicchiere trasparente con acqua e foglia, e più avanti le mani dell'utente. La struttura della scena è stabile tra intro, quiz, prova. Le domande sono un overlay **interno** alla scena, non una card indipendente sotto l'hero. La grafica di scena richiama colori, line art e ombreggiature degli screenshot del reel (caldi, non dark fantasy). Quando appare il risultato, il layout passa alla composizione cinematic dark del mockup approvato.

**Priorità di fedeltà**: 1) Wing credibile e riconoscibile; 2) composizione scenica prospettica; 3) mani realistiche in stile anime; 4) bicchiere e foglia con riflessi; 5) UI non invasiva; 6) atmosfera e microanimazioni. Una W, un manichino o mani approssimate invalidano il criterio grafico anche se il quiz funziona.

## C. Intro e quiz — layout

- Header sottile: soltanto `Nen Divination` a sinistra e scelta `IT / EN` a destra, sempre attiva. Rimuovere sottotitolo/titolo duplicato, stepper e altre cornici esterne.
- Wing visibile quasi sempre al centro alto, dimensioni sufficienti per distinguere volto/occhiali/espressione. Non ridurlo a un badge/ritratto piccolo.
- Tavolo, bicchiere con foglia in piano prospettico nella metà inferiore. Durante le DOMANDE le mani possono non essere ancora intorno al bicchiere; entrano quando inizia la prova.
- Contenuto delle domande: piccolo indicatore `Domanda 1/7`, domanda **sotto Wing**, preferibilmente nell'area intermedia tra busto e bicchiere o sovrapposta in parte al tavolo; 4 pulsanti in una griglia responsive (desktop 2×2 se non nasconde elementi critici; mobile 1 colonna con contenitore scroll interno). Non mettere il pannello delle domande sotto una hero alta che costringa ad abbandonare Wing con lo scroll.
- Differenziare la **nuvoletta di Wing** (una o due frasi brevi, appare solo quando parla) dalla **card domanda** (testo del quiz). Può essere il nome `WING` discreto come etichetta; niente balloon enorme.
- Ai fini leggibilità, sfondo del box con superficie panna traslucida o scuro neutro traslucido, contrasto AA; nessun grosso gradiente noir che copra mezzo personaggio. No glassmorphism pesante.
- Sui piccoli smartphone, scegliere un ritaglio/`object-position` che conservi il volto e il bicchiere. Consentire scroll delle risposte/area specifica senza muovere via la scena intera; usare `100dvh`, safe-area inset, touch target di almeno ~44px, scroll corretto e label accessibili.

**Microreazioni di Wing**: forme visive neutro, sorriso lieve, occhi chiusi sorridenti, interessato/gesto. Inserire i cambi di posa solo se si dispone di sprite veri e allineati; altrimenti mostrare l'asset autentico neutro, senza simulare l'espressione con HTML. Dopo la **quarta risposta** Wing esclama `Oh, interessante…` (EN `Oh, interesting…`). Un'altra reazione breve è opzionale più avanti, non ad ogni risposta. Per bonus: `Le tue risposte sono piuttosto contrastanti. Vorrei farti ancora una domanda.`; per un secondo bonus, frase coerente. Nessun dialogo artificioso «l'aura ti ha scelto» o profezie. Usare animazioni lente discrete e rispetto `prefers-reduced-motion`.

**Copy intro**:
- IT: Wing «Prima di iniziare, vorrei farti alcune domande. Rispondi sinceramente.» + pulsante `Inizia`.
- EN: Wing «Before we begin, I'd like to ask you a few questions. Answer honestly.» + pulsante `Start`.

**Stringhe da eliminare in EN E IT (non ricompaiano in tooltip, share copy o altre schermate)**:
- `La divinazione dell'acqua` come sottotitolo del logo
- `Ogni aura ha una natura`, `La tua deve ancora rivelarsi`
- `Sette domande, una foglia sull'acqua, il primo passo per conoscere il tuo Nen`
- `Heavens Arena - sala di allenamento` o diciture di luogo in overlay scenico
- `L'incontro`, `La prova`, `La rivelazione` come progress-step
- equivalenti EN, slogan di marketing, toni enfatici/mistici non richiesti.

Nota: `Heavens Arena` resta così anche nelle domande italiane #3 e #21; la #7 contiene `il tuo maestro di Nen`, NON Wing; la #19 è quella delle **quattro missioni offerte dall'Associazione Hunter** con le opzioni aggiornate nel dataset approvato. Confrontare con la specifica V1, non reinventare domande né cambiare punteggi.

## D. Concentrazione e water divination

Tavolo e inquadratura stabili; mani del giocatore in primo piano e **bene disegnate come nel riferimento**, disposte intorno al bicchiere. Hold 4,5 secondi mouse/touch con supporto tastiera; progresso discreto, niente esplosioni o scintille pacchiane. Dopo hold riprodurre l'effetto già determinato dai punti:

- Enhancement: livello dell'acqua sale/trabocca;
- Emission: cambia colore dell'acqua;
- Transmutation: sapore dell'acqua muta, effetto visivo moderato e breve battuta di Wing;
- Conjuration: particelle/materia nel bicchiere;
- Manipulation: foglia si muove/gira;
- Specialization: foglia si scurisce, appassisce e si frammenta, con frammenti che affondano.

Non sostituire all'improvviso il bicchiere con un'altra immagine quando arriva il risultato: mantenere coerenza con lo stato finale. Tutti gli effetti hanno durata/intensità comparabili.

## E. RESULT — copia la composizione del riferimento con UI vera

Seguire `reference/RESULT_TARGET_EXACT.png`, non una generica «schermata dark».

**Hero superiore**: due mani alte, rifinite e realistiche in stile anime, abbracciano un bicchiere trasparente centrato; mano destra e sinistra coerenti e con ombre; foglia/acqua mostrano esattamente la reazione Nen appena avvenuta. Background scuro e superficie del tavolo discreta. Perfezionare ritagli dei livelli, riflessi e shadowing. **Non disegnare mani con poligoni CSS, emoji o linee SVG semplificate.** Un'immagine statica autentica/illustrata di buona qualità, con livelli animati sopra, è migliore di una illustrazione procedurale brutta.

**Sezione centrale**, riprodotta nel riferimento:
- `YOUR NEN TYPE` / versione IT coerente; **nome principale in inglese** gigantesco, serif, lievemente luminoso, variabile per il Nen. Conjuration accent teal come mockup; altri 5 accenti sobri;
- sottotitolo italiano tipo `Materializzazione` e testo di personalità; evitare percentuali inventate;
- card `AFFINITÀ SECONDARIA`, con seconda categoria realmente calcolata;
- grafico **radar a 6 assi** con percentuali/score dei sei Nen, solo punteggi caratteriali normalizzati, non affinità canonica di combattimento. Verificare labels leggibili desktop e mobile, niente sovrapposizioni;
- `COSA SIGNIFICA` accordion con testo specifico categoria;
- `PERSONAGGI ESEMPIO`: 3 cards con ritratti autentici anime, nomi e descrizioni; niente ritratti AI, lettere come avatar, immagini inventate o errori canonici. Il riferimento figura Kurapika, Kite, Shoot; **non copiare automaticamente l'elenco dal disegno di esempio: controllare le classificazioni**. Nella specifica V1 i personaggi per Conjuration sono Kurapika (specificare Specialization quando occhi scarlatti), Kite, Shizuku; verificare contro fonti canoniche aggiornate e segnalare dubbi;
- CTA `Salva risultato`, `Condividi`, `Riprova il quiz`; mantengono funzioni reali (export PNG e share Web Share API/fallback).

**Mobile**: titolo leggibile, radar in seconda sezione con labels che non escono dai bordi; cards personaggi in colonna o carosello accessibile; pulsanti verticali, inalterata la gerarchia; nessun testo incorporato in screenshot statico.

## F. Dati, i18n e vincoli tecnici

- Mantenere Vite JS ES modules e il workflow GitHub Pages esistente. Le immagini in `public/assets/` hanno path compatibili con `import.meta.env.BASE_URL` o gli import del bundler; no `src="/assets/..."` assoluti non compatibili con sottopercorso GitHub Pages.
- Centralizzare stringhe IT/EN e aggiornarle integralmente. Il selettore lingua resta disponibile in ogni stato e non resetta le risposte. Cambi lingua non devono alterare seed, punteggi, ordine o risultati.
- Ogni immagine ha alt ragionevole o `alt=""` se decorativa; tutte le azioni sono navigabili con tastiera e leggibili da screen reader, `aria-live` soltanto per aggiornamenti importanti, focus ben visibile.
- Se uno sprite manca: niente immagini AI e niente sostituzioni da lettera; segnalare nel report `ASSET_STATUS.md` se il layout non può essere considerato completo. La strategia P0 è mostrare l'asset canonico disponibile anche se statico, eventualmente con crop, non simulare animazioni brutte.
- Non fare pubblicazione automatica né push mentre si lavora senza istruzione dell'utente.
- Produrre screenshot di confronto e checklist prima/dopo. La fedeltà è un criterio d'accettazione manuale dell'utente, non basta il test di compilazione.

## G. Criteri di accettazione

1. Wing è chiaramente Wing; non esistono più avatar con W o placeholder equivalenti.
2. La stanza, le mani, il tavolo e il bicchiere evocano lo stile anime dei riferimenti e non hanno l'aspetto di disegni CSS rudimentali.
3. Nessun sottotitolo cringe/stepper/etichetta Heavens Arena sopra Wing.
4. Intro brevissima; domande e risposte inserite nella scena con overlay non aggressivo, visibili insieme a Wing e bicchiere.
5. Wing esprime occasionalmente emozioni e reagisce dopo la quarta risposta.
6. Il test rimane funzionante e bilingue con identici punteggi e bonus.
7. Il risultato replica l'esatta gerarchia compositiva del riferimento, con diverse palette Nen sobrie, radar corretto e 3 ritratti autentici per Nen.
8. Mobile, desktop, test, export, condivisione, GitHub Pages ancora funzionanti.
9. Documentati tutti gli asset con provenienza e stato di licenza; non dichiarare automaticamente libere immagini trovate online.
