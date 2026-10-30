# NEN DIVINATION — FINAL POLISH V4

**Documento operativo unico per Codex — 30 ottobre 2026**  
**Repository esistente:** `https://github.com/helgrin93/nen-divination`  
**Versione pubblica:** `https://helgrin93.github.io/nen-divination/`

> **MANDATO:** completare la rifinitura di un'app che funziona già e di cui il proprietario approva circa il 90%. NON è un incarico di redesign generale, né di riscrittura da zero. Rispetta precisamente le scelte qui sotto. Esegui l'intero lavoro in fasi, con checkpoint e test, senza attendere ulteriori prompt salvo blocchi reali dovuti a file/permessi mancanti. NON effettuare push o merge su `main`.

## 0. Prima di toccare il codice

1. Leggi `README.md`, `package.json`, `SPEC_NEN_DIVINATION_CODEX.md`, gli eventuali documenti V2/V3, l'implementazione corrente e i riferimenti di questo pacchetto (`references/`). **In caso di conflitto prevale questa V4**, ma solo sugli aspetti espressamente modificati.
2. Verifica `git status`; non cancellare modifiche preesistenti né assumere di avere il repository pulito. Se il branch è `main` e la working tree è pulita, crea `final-polish-v4` prima di lavorare. Se non è pulita, preserva le modifiche e descrivi come gestirle in sicurezza; non usare `git reset --hard`.
3. Fai una breve mappa di componenti, dati e test effettivamente presenti. Tra i possibili punti d'intervento: `src/components/NenRadar.js`, `ResultView.js`, `CharacterCards.js`, `QuizScene.js`, `WingScene.js`, `WaterScene.js`, `src/game/wingReactions.js`, `src/data/wing.js`, `characters.js`, `nenTypes.js`, `translations.js`, `src/game/share.js`, `src/styles/`, `e2e/`. Verifica nomi e percorsi prima di modificarli.
4. Definisci un piano di quattro fasi e una baseline di test (`npm run build`, test e test E2E disponibili). Non cambiare il sistema di punteggio alla cieca.
5. Salvaguarda il risultato approvato: **la scena superiore post-divinazione con mani, bicchiere e animazione finale rimane quella della build attuale**. Non sostituirla con la parte superiore di alcun mockup.

### Vincoli assoluti

- Conserva Wing riconoscibile, il tappeto decorativo dietro di lui con crepe nel muro, la composizione anime uniforme, il tavolo e le mani approvate. Non reintrodurre collage, elementi tagliati, iniziali/avatar, effetti neon o nuove decorazioni non richieste.
- Mantieni il titolo `Nen Divination`, selettore `IT / EN`, due lingue, layout delle risposte bianche con lettere A–D, il flusso di 7 domande + fino a 2 bonus, la pressione di circa 4,5 secondi, la logica dei risultati e il deploy Vite/GitHub Pages.
- Non usare l'intero mockup come immagine piatta: radar, testi, punteggi, card e pulsanti devono essere componenti reali, adattivi e accessibili.
- Non creare ritratti AI dei personaggi canonici. Usare ritratti autentici con origine tracciabile e rispetto delle condizioni d'uso; non presumere che un URL pubblico conceda diritti di ripubblicazione.
- Evita modifiche estese senza motivo. Se un difetto dipende da un asset grafico, preferisci correggere l'asset/layer invece di mascherarlo con CSS fragile.

## 1. RADAR NEN: fedeltà, leggibilità, design APPROVATO

**Riferimenti obbligatori**:
- `references/RADAR_V4_APPROVATO.png` — nuovo design approvato con cerchi/kanji, etichette e percentuali.
- `references/ESAGONO_CANONICO_COLORI_POSIZIONI.png` — ordine canonico e colori, che prevalgono su qualsiasi altra figura.
- `references/RADAR_ATTUALE_PROBLEMA_LABEL.png` — problema precedente delle scritte troppo vicine alla griglia.

**Coordinate logiche IMMUTABILI in tutti i risultati**, dall'alto in senso orario:

| Vertice (angolo radar) | Tipo EN | Tipo IT | Kanji | Colore identitario |
|---|---|---|---|---|
| ore 12 / alto | Enhancement | Potenziamento | 強 | verde |
| ore 2 / alto-destra | Transmutation | Trasmutazione | 変 | viola |
| ore 4 / basso-destra | Conjuration | Materializzazione | 具 | rosso |
| ore 6 / basso | Specialization | Specializzazione | 特 | blu |
| ore 8 / basso-sinistra | Manipulation | Manipolazione | 操 | bianco / grigio chiaro |
| ore 10 / alto-sinistra | Emission | Emissione | 放 | giallo |

Queste posizioni **non ruotano e non vengono riordinate per mostrare il Nen principale in cima**. Cambiano soltanto i sei valori, il poligono interno, il titolo del risultato e l'accento del tipo principale. Ogni vertice ospita un piccolo medaglione con kanji e colore corretto; nome e percentuale stanno **fuori** dal contorno dell'esagono, a distanza sufficiente, senza toccare linee, altri testi o bordi del pannello. L'area di disegno deve includere spazio per etichette, specialmente `Transmutation` e `Specialization` su smartphone. Test a 320, 375, 390, 430, 768, 1280 e 1440 px; non ridurre la leggibilità sotto una dimensione ragionevole e non tagliare le percentuali.

La griglia e il poligono rimangono vettoriali/SVG e dinamici; il riempimento usa una tinta coerente con il **Nen principale**. I valori rimangono quelli realmente prodotti dal quiz; le percentuali sono *affinità del quiz*, non valori di efficienza Nen canonica. **Rimuovere del tutto la piccola icona (i)/asterisco e tooltip «compatibilità relativa / teoria di Hisoka» sotto il radar**, senza aggiungere un nuovo disclaimer invadente; non dichiarare però che il test sia ufficiale o scientificamente infallibile.

Mantieni lo stile scuro, sofisticato e non pacchiano della scheda finale. **Non modificare la parte superiore della schermata risultato** (mani, bicchiere e stato finale dell'effetto).

## 2. PERSONAGGI: pool 30, card 3+2, ritratti veri, descrizioni approvate

Per ciascuna categoria Nen la pool deve contenere **5 personaggi** (30 totali). Mostra inizialmente **3 card**, nello stile attuale della scheda finale; sotto inserisci un controllo discreto **«Mostra altri 2 personaggi»** / **«Mostra meno»** (`EN: Show 2 more characters / Show less`). L'apertura mostra le altre 2 card senza cambiare le tre iniziali, con transizione breve e morbida; rispetta `prefers-reduced-motion`; layout mobile a colonna. Non far saltare la pagina in modo imprevedibile; gestisci altezza/focus/accessibilità con `aria-expanded` e pulsante semantico. All'interno della card: immagine autentica, nome e descrizione della tecnica; nessuna lettera sostitutiva usata come immagine definitiva.

**Titolo sezione:** `Alcuni personaggi che hanno questo tipo di Nen:` / `Some characters with this Nen type:`. Non usare `Personaggi esempi`.

Le descrizioni IT qui sotto sono **TESTO EDITORIALE GIÀ APPROVATO**. Riportale senza inventare alternative, mantenendo la stessa lunghezza. Inserisci traduzioni inglesi naturali e fedeli, conservando nomi propri e nomi delle tecniche. Non generare descrizioni durante l'esecuzione: sono dati statici/localizzati nel repository. Le card devono rimanere associate al tipo corretto, con classificazioni verificabili e casi speciali (Kurapika) trattati con accuratezza.

### 2.1 Potenziamento / Enhancement

**Gon Freecss** — Con Jajanken concentra l'aura nel pugno per sferrare colpi devastanti. La tecnica comprende anche attacchi a distanza e lame d'aura.

**Isaac Netero** — Con Hyakushiki Kannon evoca un gigantesco Bodhisattva dalle numerose braccia, capace di sferrare attacchi a velocità straordinaria.

**Uvogin** — Con Big Bang Impact concentra un'enorme quantità di aura nel pugno, sprigionando una potenza distruttiva. Possiede forza e resistenza eccezionali.

**Phinks Magcub** — Con Ripper Cyclotron aumenta la potenza dei propri pugni ruotando il braccio. Ogni rotazione accumula aura, permettendogli di sferrare colpi dalla forza devastante.

**Palm Siberia** — Con Black Widow utilizza i propri capelli per creare una corazza resistente, concentrando l'aura negli attacchi. Possiede inoltre Wink Blue, che le permette di osservare bersagli a distanza.

### 2.2 Emissione / Emission

**Meruem** — Grazie ad Aura Synthesis accresce la propria aura nutrendosi di altri utilizzatori di Nen. Dopo aver assorbito Pouf e Youpi, acquisisce anche capacità derivate dalle loro abilità.

**Zeno Zoldyck** — Modella la propria aura a forma di drago, utilizzandola per attaccare, trasportare persone o scatenare una pioggia di colpi con Dragon Dive.

**Razor** — Concentra l'aura in sfere dalla potenza devastante. Con 14 Devils crea inoltre creature di Nen che può comandare durante il combattimento.

**Leorio Paradinight** — Può proiettare il proprio pugno a distanza attraverso l'aura, colpendo un bersaglio senza raggiungerlo fisicamente. La sua tecnica è influenzata dalle sue conoscenze mediche.

**Knov** — Con Hide and Seek apre portali verso una dimensione composta da numerose stanze, utilizzandola per trasportare persone, nascondersi e organizzare operazioni strategiche.

### 2.3 Trasmutazione / Transmutation

**Killua Zoldyck** — Trasforma la propria aura in elettricità, utilizzandola per paralizzare gli avversari e potenziare velocità e riflessi attraverso Godspeed.

**Hisoka Morow** — Con Bungee Gum conferisce alla propria aura le proprietà della gomma e della colla, sfruttandone elasticità e adesività in combattimento.

**Biscuit Krueger** — Con Magical Esthetician richiama Cookie, una massaggiatrice di Nen che utilizza speciali lozioni d'aura per alleviare la fatica e accelerare il recupero.

**Machi Komacine** — Trasforma la propria aura in fili estremamente resistenti, utilizzandoli per immobilizzare nemici, creare trappole e ricucire ferite, persino riattaccando parti del corpo.

**Feitan Portor** — Con Pain Packer trasforma il dolore subito in potenza offensiva. La tecnica Rising Sun genera un sole rovente, il cui calore aumenta con le ferite ricevute.

### 2.4 Materializzazione / Conjuration

**Kurapika** — Materializza cinque catene, ciascuna con una funzione specifica. Quando i suoi occhi diventano scarlatti, accede alla Specializzazione e può utilizzare Emperor Time.

**Kite** — Con Crazy Slots materializza armi differenti attraverso una roulette casuale. Non può scegliere quale arma ottenere, una limitazione che ne aumenta il potere.

**Shizuku Murasaki** — Materializza Blinky, un aspirapolvere capace di risucchiare enormi quantità di materiali, ma incapace di aspirare esseri viventi e oggetti creati con il Nen.

**Knuckle Bine** — Con Hakoware presta aura all'avversario e accumula interessi attraverso una creatura Nen. Se il debito supera l'aura disponibile, il bersaglio viene costretto allo Zetsu.

**Genthru** — Con Countdown applica bombe Nen ai bersagli, attivabili dopo precise condizioni. Utilizza anche Little Flower per provocare esplosioni a contatto con le mani.

### 2.5 Manipolazione / Manipulation

**Illumi Zoldyck** — Attraverso aghi infusi di Nen controlla il comportamento e i movimenti delle persone, arrivando a trasformarle in marionette completamente obbedienti.

**Morel Mackernasey** — Con Deep Purple controlla il fumo prodotto dalla sua pipa, creando soldati, copie e strutture utili per ingannare e intrappolare gli avversari.

**Shalnark** — Con Black Voice controlla i bersagli tramite antenne e un telefono cellulare. Può anche manipolare il proprio corpo attraverso una modalità automatica.

**Kalluto Zoldyck** — Manipola frammenti di carta attraverso il proprio ventaglio, trasformandoli in armi taglienti. Può inoltre utilizzarli per sorvegliare persone e ascoltare conversazioni a distanza.

**Shaiapouf** — Con Spiritual Message analizza le emozioni attraverso le proprie scaglie, capaci anche di ipnotizzare. Con Beelzebub divide il corpo in numerose copie controllabili.

### 2.6 Specializzazione / Specialization

**Chrollo Lucilfer** — Con Skill Hunter ruba le abilità Nen altrui, conservandole in un libro e utilizzandole personalmente dopo aver soddisfatto precise condizioni.

**Neferpitou** — Con Doctor Blythe cura ferite gravissime, mentre Terpsichora controlla il suo corpo come una marionetta, rendendone i movimenti incredibilmente rapidi e letali.

**Pakunoda** — Può leggere i ricordi attraverso il contatto fisico e, con Memory Bomb, trasferire informazioni direttamente nella mente di altre persone tramite proiettili di Nen.

**Neon Nostrade** — Con Lovely Ghostwriter scrive inconsapevolmente poesie che predicono eventi futuri. Le sue profezie contengono anche avvertimenti che possono aiutare a evitare sventure.

**Meleoron** — Con Perfect Plan diventa completamente impercettibile trattenendo il respiro. Attraverso God's Accomplice può estendere questa capacità a una persona con cui mantiene il contatto.

### 2.7 Immagini e catalogo

- Riutilizza il catalogo Tenrai già presente, con ID e URL dei primi 18; recupera dati e URL corretti dei 12 nuovi usando Tenrai o altra fonte affidabile. **Non associare il tipo Nen in base a un'API anime**: mantieni il mapping editoriale controllato nel progetto.
- Verifica a runtime e in test che ogni immagine corrisponda al personaggio giusto, che non sia spezzata e che non risulti 404, 403, HTML o errore CORS/di hotlink. Registra la fonte, non nascondere problemi dietro avatar generici.
- L'accessibilità e l'usabilità non devono dipendere dall'immagine: alt descrittivi, nomi e testi presenti anche se l'host esterno non risponde.
- Le API e le gallerie non concedono automaticamente diritto di redistribuzione: non scaricare/ripubblicare come asset locali senza autorizzazione o licenza. Se qualche ritratto non può essere legalmente pubblicato, segnala puntualmente l'impedimento e alternative lecite; niente falsi claim di permesso.
- La scelta dei tre iniziali e dei due aggiuntivi deve essere stabile nella singola scheda, anche dopo espansione, salvataggio e condivisione. Non rimescolare al click; il design della scheda esportata mostra **soltanto tre personaggi**.

## 3. WING: dialoghi, intermezzi e animazioni coerenti

**Problema visto negli screenshot:** frasi occasionali come `Oh, interessante…` o `Le tue risposte sono piuttosto contrastanti...` sono incollate nella vignetta della domanda; invece devono essere intermezzi separati. Riferimenti: `INTERMEZZO_WING_STILE_APPROVATO.png`, `BONUS_COMMENTO_DA_SEPARARE.png`.

Comportamento approvato **MISTO**:

1. La vignetta di domanda deve contenere SOLO `WING`, indice (`Domanda 3/7`, `8/8` ecc.) e **testo della domanda**; le risposte rimangono nei quattro riquadri bianchi con A–D, senza icone colorate.
2. **Commenti brevi e occasionali:** alla fine della risposta scompaiono con eleganza domanda e risposte; Wing passa a un'espressione coerente (sorriso, occhi chiusi, curiosità, lieve gesto) e compare una vignetta bianca separata con una breve frase (`Oh, interessante…`, `Capisco…`, `Mh, curioso…`, varianti sobrie). Avanzamento **automatico dopo ~3 secondi**, senza `Continua` e senza skip per questi intermezzi. Non mostrare commenti dopo ogni domanda. Garantire almeno una reazione dopo la quarta risposta, con varietà e niente ripetizioni immediate.
3. **Spiegazioni importanti:** intro, introduzione alle bonus quando i punteggi sono vicini, passaggio alla prova dell'acqua o rivelazione: mostra una vignetta separata ma con **pulsante Continua**, per lasciare tempo al giocatore di leggere. Posizionalo senza coprire il bicchiere o il volto di Wing.
4. Tutte le reazioni/azioni siano IT/EN con frasi brevi, naturali e niente slogan poetici o 'cringe'; niente testo `Heavens Arena - sala di allenamento`, `La divinazione dell'acqua` come sottotitolo, né `L'incontro / La prova / La rivelazione`.
5. Sulla rivelazione della **Specializzazione**: **rimuovi la citazione a Neferpitou dalle battute di Wing e dai commenti sulla reazione**, senza eliminare il personaggio dal suo catalogo o alterare l'effetto della foglia. Non aggiungere frasi che lo identifichino indirettamente.
6. Le espressioni/pose devono avere timing coordinato alle battute e niente flicker, immagini intermedie vuote, salti di scala o Wing che scompare per un frame. Precarica le varianti; lascia il layer di Wing persistente quando cambiano le domande, se compatibile con l'architettura.
7. **Gomiti di Wing:** correggi la sovrapposizione fra busto/braccia e bordo del tavolo: devono sembrare **appoggiati sul tavolo**, non dietro in modo innaturale. Correggi profondità, occlusioni o asset con precisione; preserva faccia, postura generale, sfondo, tappeto, mani del giocatore e prospettiva.

## 4. QUIZ MOBILE — gerarchia, posizione vignette, pulsante concentrazione

Riferimento: `MOBILE_QUIZ_ATTUALE_DA_RIFINIRE.png`.

La scena su mobile è **già pulita e funzionale**: NON rifare il layout da zero. Il difetto è che la vignetta con la domanda viene mostrata **sotto le mani**, troppo lontana dalla bocca di Wing. Sposta la vignetta **più in alto**, verso il busto/bocca di Wing, idealmente come sovrimpressione ben leggibile senza coprirne gli occhi e senza occultare inutilmente il bicchiere. Il triangolino della vignetta deve puntare visivamente a Wing. Le quattro risposte bianche sotto mantengono lo stile attuale e restano scorrevoli/visibili, con spazio tattile adeguato. Compatibilità con safe area iPhone, tastiera, landscape, testi lunghi e bonus.

Valuta la posizione del comando `Tieni premuto` per la divinazione: deve risultare immediato e raggiungibile con il pollice, senza zone morte o attivazioni involontarie; conserva la pressione continua di circa 4,5 secondi. Se la posizione attuale supera i test, mantienila: **non cambiare qualcosa che funziona soltanto perché è nella checklist**. Gestisci pointer/touch, cambio tab, interruzione e feedback di progresso. Registra esito decisionale.

Verifica in particolare viewport 320×700, 375×812, 390×844, 430×932, un tablet e desktop. **Testa realmente sul browser mobile o con emulazione Playwright**, non soltanto ridimensionando il desktop; controlla sovrapposizioni di vignette, mani, Wing, bicchiere, risposte, pulsanti e scroll.

## 5. ACQUA E DIVINAZIONE — controlli finali delle sei reazioni

Mantieni l'estetica anime, la scena e l'architettura V3 che già funzionano; evita di rifare per principio ogni animazione. Riesamina tutti e sei gli effetti nel viewer di sviluppo e nella produzione:

- **Potenziamento — PRIORITÀ ALTA:** l'acqua che trabocca è troppo chiara/trasparente e stilisticamente distinta dall'acqua interna. Uniforma tinta, opacità, rifrazione e contorni; l'acqua che esce deve apparire una prosecuzione **dello stesso liquido**. La superficie/il livello d'acqua disegnato nello sprite di base resta immobile: **non può restare la superficie originale congelata mentre un nuovo livello sale o trabocca**. Prepara una base pulita/mascherata e un livello interno animabile; sequenza coerente: livello sale → tensione superficiale → supera il bordo → colature e gocce aderenti al vetro. Nessun doppio livello d'acqua o duplicazione del calice. Controlla il risultato su ogni viewport, soprattutto smartphone.
- **Emissione:** cambio di colore dell'acqua, con trasparenze/riflessi corretti, senza colorare il vetro o lo sfondo.
- **Trasmutazione:** cambia il sapore dell'acqua; effetti visivi sobri o quasi assenti sono corretti: Wing può descrivere il risultato senza inventare fenomeni spettacolari.
- **Materializzazione:** impurità dentro il liquido a profondità credibili, non particelle piatte fuori dalla maschera.
- **Manipolazione:** foglia realmente viva con movimento e lieve deformazione ondulatoria, non un PNG semplicemente ruotato; onda superficiale coerente con il movimento, sempre nella superficie.
- **Specializzazione:** mantenere l'effetto della foglia che appassisce, annerisce e si disintegra, già apprezzato, salvo problemi verificabili. Non menzionare Neferpitou nel dialogo di Wing.

L'animazione deve lasciare lo **stato finale visibile anche nella scena superiore della schermata dei risultati**, senza cambiare il relativo asset/inquadratura. Le mani di concentrazione devono restare anatomiche, senza laser/lineette blu. Non introdurre effetti 3D o fotorealistici che stonino con il cel-shading. Se servono asset 2D migliori, usa sprite coerenti con la scena (anche AI per gli **effetti**, non per i ritratti canonici), con texture/layer adeguati; non fare dichiarazioni di completamento prive di verifica visiva.

**Test:** per ciascun Nen cattura almeno frame iniziale, intermedio e finale, più una breve sequenza/video se fattibile. Verifica che tutti gli strati siano allineati dentro il calice anche dopo scrolling, resize, mobile e cambio DPR. Controlla la pagina di review già presente (`review/divination.html` o equivalente) e mantienila funzionante.

## 6. TESTI GENERALI: Nen, domande, risposte, spiegazioni della divinazione

- Rivedi **tutte le 24 domande e le 4 risposte ciascuna** per grammatica, naturalezza, pertinenza a *Hunter × Hunter*, diversità, chiarezza e testi IT/EN. Conserva la selezione approvata: domanda 7 parla de **«il tuo maestro Nen»**, non Wing; usa **Heavens Arena** anche in italiano; domanda 19 riguarda quattro missioni differenti dell'Associazione Hunter (protezione di persona importante, sparizioni in città isolata, infiltrazione criminale, recupero di manufatto in luogo pieno di trappole). Evita cliché e frasi eccessivamente teatrali.
- Questa è una **revisione editoriale conservativa**: non ricalibrare arbitrariamente i 96 vettori di punteggio né cambiare significato di una risposta senza aggiornare in modo motivato il relativo scoring. Se riscrivi semanticamente una risposta, verifica e testa coerenza dei punteggi, distribuzione dei risultati, tie-break e le 2 bonus. Nessuna risposta deve far emergere un Nen solo per la lettera scelta.
- Rivedi e completa le descrizioni dei **sei tipi/poteri Nen** nella schermata finale: spiegazione tecnica corretta e interessante, con spazio comparabile a quello della descrizione caratteriale, senza minitestimonianze di due parole. Distingui **tratti caratteriali del quiz** e **capacità Nen**; non inventare poteri specifici universali per la Specializzazione. Mantieni equilibrio nella lunghezza e leggibilità mobile.
- Rivedi frasi che descrivono cosa accade all'acqua/foglia durante e dopo la rivelazione: valutane utilità, posizione e possibile sovrapposizione al bicchiere. Mantieni solo quelle che chiariscono davvero un fenomeno e non coprono l'animazione. La descrizione deve suonare come Wing, non come tooltip tecnico. IT/EN sempre.
- Niente citazioni a Neferpitou nella rivelazione della Specializzazione; **Neferpitou resta nella sezione personaggi** con la descrizione approvata.

## 7. CONDIVISIONE INSTAGRAM — formato story e link al quiz

Obiettivo: l'utente vuole condividere il risultato **soprattutto sulle Instagram Stories** e invitare gli amici a provare il gioco al link `https://helgrin93.github.io/nen-divination/`.

1. Conserva le funzioni attuali `Salva risultato`, `Condividi`, `Riprova il quiz`; aggiungi se utile un'esportazione **Story 1080×1920 (9:16)** pulita, con nome Nen, radar leggibile, breve descrizione, **solo 3 personaggi**, e spazio visivo per un successivo sticker Link. Non schiacciare tutto il layout desktop in verticale; progettare il template dedicato.
2. Mantieni l'eventuale export esistente (es. 1080×1350) se funziona; non rompere la condivisione attuale.
3. Il link non può essere reso cliccabile dentro un PNG. Aggiungi una funzione `Copia link al quiz` e/o testo istruttivo leggero per usare lo **sticker Link nell'editor di Instagram Stories**. Non promettere posting diretto automatico a Instagram se browser/API non lo supportano. Valuta Web Share API con file immagini su HTTPS, fallback download e copia URL.
4. La generazione PNG deve funzionare anche quando i ritratti arrivano da host remoti: verifica canvas tainted/CORS, fallback robusti e limiti documentati; non simulare la presenza di immagini che non sono state effettivamente esportate.
5. Test su iOS Safari e Android Chrome, compresi permessi Web Share, file PNG e formato della story senza tagli dei testi dietro alle UI di Instagram.

## 8. PULIZIA DEL REPOSITORY — solo dopo test funzionali

Il proprietario vuole un repository ordinato e professionale, non pieno di file temporanei. Però NON cancellare documenti, test o asset solo perché il nome è vecchio.

1. Inventaria file tracciati, entrypoint, import e riferimenti effettivi; distingue `runtime`, `test`, `reference/documentazione`, `scratch/temporaneo`.
2. Individua file davvero obsoleti/duplicati, asset non referenziati, schermate di review obsolete e script non più utilizzati. **Prima di eliminare** prepara `V4_CLEANUP_AUDIT.md` con motivazione e conseguenza; preferisci spostare fuori dal bundle runtime o archiviare se c'è dubbio. Non eliminare gli asset originali degli effetti o i riferimenti necessari a rigenerarli.
3. Non eliminare `.github/workflows`, test regressione, package-lock, README, `.gitignore`, file necessari a Vite, traduzioni e asset di produzione. Aggiorna README spiegando come avviare, testare, fare review, pubblicare, e come gestire immagini esterne.
4. Assicurati che `.gitignore` escluda `node_modules/`, `dist/`, `.env*` con eccezione `.env.example`, test-results, playwright-report, .verification e derivati temporanei; non includere segreti. Non alterare `main` o cancellare la cronologia Git.
5. Verifica bundle, build, test, percorsi relativi a `/nen-divination/`, immagini disponibili e funzionamento GitHub Pages.

## 9. Fasi operative — UN UNICO INCARICO, non 15 prompt separati

**Fase A — stabilità, contenuti e dialoghi**: backup tramite branch; revisioni editoriali; 30 personaggi e traduzioni, intermezzi Wing, correzione gomiti e osservazioni UI. Commit di fase.

**Fase B — radar e risultato**: nuovo radar coi kanji e posizioni fisse; 3+2 personaggi; card risultato; descrizioni Nen; conserva la scena animata superiore. Confronto screenshot e commit di fase.

**Fase C — divinazione, mobile e Instagram**: migliora acqua del Potenziamento e verifica sei Nen; correggi posizioni della vignetta su mobile; prova il pulsante di concentrazione; Story 9:16 e copy link. Screenshot/prove, commit di fase.

**Fase D — QA e pulizia**: verifica funzionalità end-to-end, i due idiomi, tutte e sei le categorie, bonus, export, a11y, performance, documentazione e audit file; rimuovi solo quanto giustificato; commit di fase.

Puoi adottare un ordine tecnico leggermente diverso quando una dipendenza lo richiede, ma registra la ragione. **Non interromperti per chiedere conferma tra fasi** a meno di impedimento reale, requisito impossibile o decisione artistica che richiede un nuovo asset non disponibile. Non lasciare metà app nella vecchia UI e metà nella nuova. Non eseguire `git push` né merge su `main`.

## 10. Criteri oggettivi di accettazione (obbligatori)

- [ ] Nessun cambiamento nella scena superiore del risultato: mani, calice e stato finale identici alla build approvata, salvo correzioni del renderer acqua realmente necessarie.
- [ ] Radar con sei vertici, simboli, colori e posizioni fisse; etichette senza collisioni su desktop/mobile; valori reali e poligono dinamico.
- [ ] Tooltip/asterisco di Hisoka sotto il radar assente.
- [ ] Pool di 30 personaggi esatta, mapping appropriato, descrizioni IT approvate e traduzioni EN; 3 card visibili, 2 espandibili, animazione corretta; titolo sezione approvato.
- [ ] Nessuna W/avatar AI per i ritratti; immagini reali verificate ove legalmente utilizzabili, con log della fonte e fallback accessibile.
- [ ] Dialoghi brevi di Wing separati dalle domande, automatici ~3s; dialoghi lunghi/bonus con Continua; nessun commento duplicato nella vignetta della domanda e nessun flicker.
- [ ] Riferimento a Neferpitou eliminato dalle parole di Wing durante Specializzazione; personaggio ancora nel catalogo.
- [ ] Gomiti di Wing visivamente appoggiati sul tavolo senza compromettere la scena.
- [ ] Su mobile vignetta domanda alzata vicino al busto di Wing, risposte bianche preservate, nessuna sovrapposizione problematica.
- [ ] Tutte le sei animazioni funzionanti, stile coerente; Potenziamento con un solo livello d'acqua interno realmente animato e trabocco visibile e coerente.
- [ ] Spiegazioni di potere Nen e testi dell'acqua revisionati; 24 domande/risposte controllate; scoring conservato salvo correzioni motivate e testate.
- [ ] Export story 1080×1920 e link copiabile, senza promessa di link cliccabile incorporato nell'immagine.
- [ ] Test unitari, E2E e build produzione superati oppure errori documentati con causa concreta; screenshot desktop e mobile per sei risultati, bonus, intermezzi, concentrazione e condivisione.
- [ ] Audit di pulizia e README aggiornato; nessun file indispensabile rimosso; GitHub Pages pronto ma NON pubblicato automaticamente.

## 11. Resoconto finale che devi fornire

Crea `V4_FINAL_REPORT.md` con:
- riepilogo per ciascuno dei punti 1–15 della checklist originaria, indicando cosa è cambiato;
- elenco dei 30 personaggi e stato delle immagini (URL/fonti/permessi/laddove non verificabili);
- screenshot delle schermate finale con radar per almeno due Nen diversi (comprese posizioni fisse), mobile, intermezzo Wing, Potenziamento e export Instagram;
- comandi e risultati dei test (`npm run build`, `npm test`/script effettivi, `npm run test:e2e`, ecc.);
- file modificati, commit per fase, elementi eventualmente in sospeso;
- come avviare localmente e testare l'app **senza effettuare push**.

**Regola finale: le nuove funzionalità non devono peggiorare il 90% che il proprietario ha già approvato. Qualità, coerenza e test prevalgono sulla quantità di codice scritto.**
