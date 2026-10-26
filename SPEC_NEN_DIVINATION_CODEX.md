# NEN DIVINATION — specifica completa per Codex

**Documento di implementazione — prototipo funzionante web responsive (PC e smartphone)**  
**Versione:** 1.0 | **Lingue:** italiano e inglese | **Stato:** pronto per il primo prototipo, con calibrazione *provvisoria* dei punteggi.

> **Istruzione primaria per Codex:** crea effettivamente l'intera applicazione descritta in questo documento, con file, codice, dati, animazioni, UI responsive, testi IT/EN, export e test. Non fermarti a un wireframe o a una spiegazione. Se una risorsa grafica è assente/non autorizzata, produci un fallback originale utilizzabile senza inventare immagini anime né bloccare l'app. Non alterare il contenuto delle 24 domande, i pesi, i tipi o il flusso narrativo. Non chiedere all'utente di riscrivere tutto. Documenta in README cosa manca per un rilascio pubblico.

## 0. Obiettivo e priorità

Una **piccola esperienza interattiva narrativa** ispirata alla prova di divinazione del Nen di *Hunter × Hunter*, non un comune personality quiz. L'utente è seduto idealmente davanti a **Wing**, che gli parla. Si risponde a sette domande ambientate con naturalezza nel mondo HxH, con massimo due domande bonus in caso di ambiguità, poi si tengono le mani intorno a un bicchiere per **4,5 secondi** premendo sullo schermo o col tasto sinistro del mouse. Nel bicchiere viene mostrato l'effetto Nen corrispondente al risultato. Si scopre il Nen principale e secondario, un radar a sei assi, informazioni, tre personaggi iconici con **ritratti autentici, mai creati da IA**, e pulsanti per scaricare/condividere una card.

**Priorità:** (P0) esperienza completa percorribile e punteggio corretto; (P0) estetica/composizione del reel con Wing e bicchiere; (P0) schermata finale vicinissima al mockup fornito; (P0) IT/EN e mobile; (P1) animazioni rifinite e asset veri autorizzati; (P1) condivisione PNG; (P2) suoni opzionali e affinamenti estetici.

## 1. Riferimenti visivi forniti

Se disponibili accanto a questo file, analizzare:

- `reference/reel-composition-reference.png`: **riferimento primario per la scena iniziale/quiz**: Wing (occhiali, camicia bianca) frontalmente dietro un tavolo caldo; bicchiere al centro in primo piano e foglia galleggiante; durante la prova compaiono due mani vicino al bicchiere. Il riferimento proviene dal reel inviato dall'utente, NON è un asset da distribuire automaticamente.
- `reference/result-design-reference.png`: **riferimento primario quasi pixel-level per la schermata risultato** (utente: «al 99% esattamente così»): sfondo blu-nero, bordi sottili, pannelli scuri, serif elegante per titolo del Nen, accenti teal per Conjuration, radar esagonale, spiegazione accordion, tre schede personaggio e tre CTA in basso. Questa immagine di design può contenere illustrazioni sintetiche: **usarla solo per la composizione**, non estrarne i ritratti dei personaggi.
- Se l'utente fornisce `reference/reel.mp4`, visionarlo: riprodurre la scena di Wing davanti al bicchiere, NON ricalcare la UI di Instagram (nessun pulsante social, caption, badge Reels, ecc.).

**Da non sbagliare:** Wing deve essere **visibile davanti all'utente** come nel reel, non una semplice foto in un box laterale. Il bicchiere sta **davanti a lui**, sul tavolo. Overlay delle domande tenue e leggibile, davanti alla scena; non una schermata completamente diversa. Durante il quiz Wing può muovere appena occhi/bocca/pose. Sul risultato, mantenere in alto **la stessa scena persistente** (Wing dietro, mani+calice davanti) nello stato finale dell'animazione, e mostrare le informazioni scorrendo sotto.

## 2. Tecnologia e requisiti di consegna

- **Vite + JavaScript ES modules + HTML5/CSS3** (TypeScript opzionale solo se migliora robustezza); **senza backend/database/login** per MVP; evitare framework pesanti e librerie anime superflue.
- Eseguibile con `npm install`, `npm run dev`, `npm run build`, `npm run preview`; pubblicabile su **GitHub Pages** (gestire `base` di Vite e asset path sotto repository) e eventualmente Netlify/Vercel.
- Layout responsive 320 px → grandi monitor; touch/mouse/pen + tastiera, compresi iOS Safari/Android Chrome e desktop Chrome/Firefox/Edge. Non richiede app store.
- Preferire **SVG + CSS** per grafica/animazioni e **SVG** per radar. Componenti testuali e pulsanti HTML semantici, non testo rasterizzato.
- Test automatici con Vitest per selezione domande, score, calibrazione, blocco di risultati casuali, bonus, localizzazione e determinismo di tie-break. Test minimo di flusso mobile e desktop con Playwright se ambiente lo consente.
- Zero API key obbligatorie. La logica delle domande funziona offline (ritratti da rete opzionali, con fallback); nessuna raccolta di dati personali.
- Asset origini e diritti descritti in `ASSETS.md`. Se mancano le immagini autentiche, lascia un ritratto neutro tipografico con nome, non personaggi fittizi generati.

## 3. Design system (rigoroso)

### 3.1 Aspetto

Tema dark, anime-inspired, sobrio e cinematografico, NON neon/cyberpunk esagerato, NON gradienti arcobaleno, NON luci che invadono lo schermo. Prendere colori, bordi, tipografia, spaziatura e gerarchia dal riferimento del risultato. Suggerimento palette:

| Elemento | Colore orientativo |
|---|---|
| Background principale | `#080E15` |
| Pannelli | `#0C1620` / `#101D28` |
| Border sottile | `#263947` |
| Titolo/testo chiaro | `#EDF1EF` |
| Secondario | `#AEBBC8` |
| Oro discreto etichette | `#C8B998` |
| **Enhancement** | `#D5AD70` ambra morbida |
| **Emission** | `#75A9CF` azzurro desaturato |
| **Transmutation** | `#B19AD8` lilla tenue |
| **Conjuration** | `#6AD7C7` verde acqua/teal **come nel mockup** |
| **Manipulation** | `#91BE9D` verde salvia |
| **Specialization** | `#C397B5` malva spento |

Usare **un solo accento Nen per schermata di risultato**, nei titoli, stroke del radar, micro-evidenze, bordo del CTA condivisione; non cambiare radicalmente i colori della stanza, del bicchiere o delle mani. Una sfumatura lievissima è consentita. Tutti e sei i risultati sono **equivalenti in spettacolarità**.

### 3.2 Desktop/mobile

- Desktop: scena superiore ampia (Wing e bicchiere come hero), poi box risultato con **descrizione a sinistra e radar a destra**, quindi accordion "Cosa significa", tre card personaggio affiancate e barra dei tre pulsanti.
- Mobile: Wing in alto dietro il bicchiere; dialogo + opzioni overlay sul tavolo con fondo traslucido abbastanza contrastato, zona tocco ampia; nel risultato titolo → descrizione → radar → dettagli → personaggi in colonna o carosello → pulsanti impilati.
- Header minimale: titolo/logo sobrio a sinistra, selettore **IT / EN in alto a destra**, SEMPRE accessibile, compreso il quiz.
- Tipografia: serif solo titoli/display, sans leggibile per testo. Ridurre motion con `prefers-reduced-motion`.
- Contrasto minimo WCAG AA per il testo; focus visibile, dimensione tap target circa 44 px.

## 4. Flusso completo ed esperienza narrativa

**Stati:** `intro` → `quiz` (7) → `bonus` (0..2, condizionali) → `concentration` → `waterEffect` → `result` → `replay`.

1. **Intro:** Wing di fronte al giocatore dietro il tavolo. Il calice con acqua e foglia è visibile. Breve messaggio: Wing introduce la lettura delle inclinazioni e la prova dell'acqua. Pulsante iniziale.
2. **Quiz:** 1 domanda per volta in overlay **non aggressivo**, preferibilmente nella zona centrale-inferiore senza oscurare il volto di Wing. Quattro risposte in pulsanti. Avanzamento 1/7, tasto indietro, nessuna risposta obbligatoriamente temporizzata. Conservare risposte se si torna indietro. Ordine random di domande e opzioni stabile nell'intero tentativo.
3. **Wing attivo, non invadente:** dopo la **quarta risposta** interrompe brevemente con **«Oh, interessante…»** / **«Oh, interesting…»** e cambia espressione (es. lieve sorriso, sopracciglio, sguardo incuriosito). Non rivelare alcun Nen né influenzare i punteggi. Aggiungere 2–3 micro-variazioni visive raramente, senza interrompere le scelte, con loop discreto occhi/blink/gesto della mano se asset lo permette. Non farlo parlare dopo ogni domanda. Evitare faccine/animazioni infantili.
4. **Calcolo dopo 7 domande:** se la differenza calibrata tra prime due categorie è **> 0.35**, niente bonus. Altrimenti Wing: «Interessante... La tua aura presenta caratteristiche contrastanti. Vorrei porti un'altra domanda.» / EN coerente. Se dopo l'ottava la differenza è ancora <= 0.35, proporre una **nona e ultima**. Se la differenza diventa >0.35, fermarsi prima. Mai superare **9 domande in totale**.
5. **Concentrazione:** Wing invita a portare le mani accanto al bicchiere. Se desktop: **tieni premuto tasto sinistro** in zona interattiva; smartphone: **tieni premuto il dito**. Progresso di **4.5 s** in una piccola barra vicino alle mani, senza effetti magici pacchiani. Il risultato è già determinato dal quiz; la pressione attiva solo la rivelazione (MAI random Nen). Se si rilascia prima, barra e concentrazione si azzerano con transizione lieve. Pause su `pointercancel`, perdita visibilità tab, `blur`; no trigger multipli. Anche Space/Enter possono funzionare come hold accessibile, e modalità reduced motion con pulsante alternativo.
6. **Reazione acqua:** animazione 2–3 s nella **stessa scena**, diversa per ciascun Nen (vedi §5); Wing reagisce con una sola frase sottile dopo che l'effetto si manifesta. Conservare lo **stato finale della scena**, senza sostituirlo all'improvviso con un altro bicchiere o un'immagine generica.
7. **Risultato:** sotto la scena superiore appare titolo grande `YOUR NEN TYPE / IL TUO TIPO DI NEN`, nome principale EN (come Enhancement, Conjuration), sottotitolo IT, descrizione caratteriale; affinità secondaria; radar esagonale; accordion «Cosa significa»; tre esempi personaggi con **immagini reali tratte da fonti anime/manga, non AI**; pulsanti **Salva risultato**, **Condividi**, **Riprova il quiz**.
8. **Riprova:** nuova estrazione/shuffle, azzerare risultato/pressione/stato; mantenere lingua preferita. Cambio IT/EN in qualsiasi fase non deve resettare il progresso.

### 4.1 Esempi dialoghi Wing (localizzare tutti)

| Evento | Italiano | English |
|---|---|---|
| Intro | «Benvenuto. Prima della prova dell'acqua, vorrei capire qualcosa di te.» | “Welcome. Before the water divination test, I'd like to learn a little about you.” |
| Quiz start | «Rispondi d'istinto. Non esistono risposte giuste o sbagliate.» | “Answer instinctively. There are no right or wrong answers.” |
| Dopo domanda 4 | **«Oh, interessante…»** | **“Oh, interesting…”** |
| Prima bonus 8 | «La tua aura mostra caratteristiche contrastanti... Un'altra domanda.» | “Your aura shows contrasting traits... One more question.” |
| Prima bonus 9 | «Ora capisco meglio... Ma vorrei chiarire un ultimo dettaglio.» | “I understand a little better now... One last detail.” |
| Prima divinazione | «Ora concentrati. Avvicina le mani al bicchiere e mantieni il Nen.» | “Now focus. Bring your hands close to the glass and maintain your Nen.” |
| Durante hold | «Mantieni la concentrazione...» | “Maintain your focus...” |
| Dopo effetto | «Ecco... La tua affinità si è manifestata.» | “There... Your affinity has revealed itself.” |
| Bottone | «Inizia la prova» | “Begin the test” |
| Progress | «Domanda {n} di {total}» | “Question {n} of {total}” |
| CTA hold | «Tieni premuto» | “Press and hold” |
| Riprendi | «Riprova a concentrarti» | “Try focusing again” |

**Importante:** Wing è un personaggio di HxH; non dichiarare che frasi scritte per l'app sono citazioni canoniche. Solo testo, non serve sintesi vocale. Eventuale suono basso può essere opzionale e mute di default.

## 5. Sei categorie, effetti dell'acqua e persistenza nella scena

La prova canonica con foglia/bicchiere determina le sei categorie; il cambiamento del gusto per Transmutation non sarebbe visibile, quindi il feedback grafico è un'indicazione narrativa; **lo specifico effetto di Specialization non è universalmente uguale per ogni Specialista** (la foglia secca/distrutta è una manifestazione adatta ispirata all'opera).

| Nen ID | Label EN | Label IT | Animazione sobria | Stato finale persistente |
|---|---|---|---|---|
| `enhancement` | Enhancement | Potenziamento | Acqua vibra lievemente, livello sale e trabocca di poco | Livello pienissimo/gocce al bordo |
| `emission` | Emission | Emissione | Acqua muta colore gradualmente (es. blu → viola tenue) | Acqua colorata |
| `transmutation` | Transmutation | Trasmutazione | Piccole bolle e bagliori caldi, minuscoli cristalli che si dissolvono; testo «L'acqua è diventata dolce» / “The water tastes sweet” | Acqua limpida con lievi riflessi, etichetta che conferma il gusto |
| `conjuration` | Conjuration | Materializzazione | Compaiono impurità minuscole/cristalli o scaglie sospese | Particelle distribuite nell'acqua |
| `manipulation` | Manipulation | Manipolazione | La foglia si muove, oscilla e ruota sulla superficie | Foglia in posizione finale ruotata/spostata |
| `specialization` | Specialization | Specializzazione | **Foglia annerisce progressivamente, secca, si sfalda e cade in piccoli frammenti all'interno dell'acqua** | Piccoli frammenti neri sospesi/in immersione; foglia in gran parte scomparsa |

**Vietato**: oscurare tutta la stanza, shockwave, flash, tremolii di schermo, fulmini vistosi o rumori forti per Specialization. Tutti i sei risultati devono essere di intensità visiva confrontabile. Effetti contigui al calice e foglia; durata 2–3 s, transizione morbida. La `WaterScene` ha stesso layout, assets e coordinate per tutti: cambia solo `effectState`. Se movimento ridotto, applicare subito il final state e comunicare l'effetto con testo.

## 6. Nen chart: radar esagonale vs esagono canonico

**Radar delle inclinazioni caratteriali** a sei assi, disegnato con SVG: griglia sottile a esagoni concentrici, un poligono semitrasparente che mostra il profilo del quiz, etichette e sei numeri. Layout e comportamento come nel design reference. Ordinare i vertici secondo la vicinanza canonica dell'esagono Nen, dall'alto in senso orario:

`Enhancement → Emission → Manipulation → Specialization → Conjuration → Transmutation`.

**Non confondere due concetti**: il radar visualizza **compatibilità caratteriale relativa del questionario**, non la percentuale di efficacia tecnica dell'aura. La seconda affinità mostra il secondo punteggio migliore in termini di personalità, che non coincide necessariamente con il secondo Nen canonico più efficiente.

Per display: a partire dai punteggi **calibrati** calcolare

```js
const low = Math.min(...Object.values(scores));
const high = Math.max(...Object.values(scores));
const radar = Object.fromEntries(types.map(type => [
  type, high === low ? 50 : Math.round(20 + 80 * (scores[type] - low) / (high - low))
]));
```

Il Nen vincente mostra 100, il minimo 20: **scala relativa, non probabilità misurata**. Nel radar **mostrare il simbolo `%` come richiesto dall’utente**, accompagnato dal titolo «Compatibilità relativa (quiz) / Relative quiz affinity» e da una spiegazione sempre raggiungibile: «Percentuali indicative normalizzate: il valore massimo è 100%, non rappresentano probabilità né efficacia canonica dell’aura / Relative normalized values: the highest is 100%; these are not probabilities or canonical Nen proficiency». Non devono sommare a 100. Mostrare il Nen secondario sotto il titolo.

## 7. Quiz: 24 domande, quattro risposte e regole di estrazione

**TUTTO il testo del quiz è incluso qui sotto**, bilingue, con pesi per ognuna delle 96 risposte. `questions_scoring.json` nel pacchetto è la stessa fonte machine-readable. Conservare ID fissi (`q01_1`, ecc.): cambiare ordine delle risposte **non** cambia ID o punteggio. Pesi 3/2/1 alle tre categorie più coerenti, 0 alle altre; nessuna categoria predefinita.

### 7.1 Le sei aree (4 domande ciascuna)

1. `decisioni` — decisioni e strategia (`q01`–`q04`)
2. `emozioni` — emozioni e temperamento (`q05`–`q08`)
3. `relazioni` — relazioni e fiducia (`q09`–`q12`)
4. `imprevisti` — imprevisti e adattabilità (`q13`–`q16`)
5. `ambizioni` — ambizioni e motivazioni (`q17`–`q20`)
6. `conflitti` — conflitti e rivalità (`q21`–`q24`)

Estrazione di 7 domande:

- Sorteggia **una domanda da ciascuna delle 6 aree**.
- Sorteggia una **settima** tra le restanti 18, bilanciando nel tempo l'area extra (uniforme sulle 6 aree, poi una delle sue 3 domande rimanenti).
- Mescola le 7 domande con Fisher-Yates.
- Per ogni domanda mescola le 4 risposte **una volta all'inizio del tentativo**, in modo indipendente; non rigenerare shuffle tornando indietro e non ricreare per cambio lingua.
- Non esporre le categorie Nen nei dati di UI delle opzioni, tooltip o attributi DOM se evitabile. Non premiare `A,A,A...` né penalizzarla artificialmente.
- Bonus: selezionare tra le **domande non usate** quella che statisticamente separa meglio i due punteggi principali, ma mantenere copertura varia delle aree e non ripetere domande. Misura semplice di discrimine per una domanda `q`: `spread(q) = max(weights[a] - weights[b]) - min(weights[a] - weights[b])` su quattro opzioni, dove a/b sono i due Nen in testa. Con valori calibrati preferire il `spread` dopo standardizzazione. In parità preferire un'area meno campionata, infine ID stabile.

### 7.2 Punteggi: calcolo e calibrazione

Ogni opzione contiene vettore `{ enhancement, emission, transmutation, conjuration, manipulation, specialization }`, valori 0..3. Somma grezza non basta: alcune aree/questionari favorirebbero Conjuration/Manipulation perché le risposte coerenti compaiono più spesso. Correggere il *baseline* di **ogni domanda** prima di sommare:

```js
const types = ['enhancement','emission','transmutation','conjuration','manipulation','specialization'];
function rawCenteredScores(questions, selectedOptionIds) {
  const sum = Object.fromEntries(types.map(t => [t, 0]));
  for (const q of questions) {
    const selected = q.options.find(o => o.id === selectedOptionIds[q.id]);
    if (!selected) throw new Error('Missing answer: ' + q.id);
    for (const t of types) {
      const baseline = q.options.reduce((s,o) => s + o.weights[t], 0) / 4;
      sum[t] += selected.weights[t] - baseline;
    }
  }
  return sum;
}
```

Poi **normalizzare le sei categorie con la deviazione standard del modello nullo** e applicare piccoli offset di calibrazione precomputati. La calibrazione serve a ottenere vincite simili quando le risposte sono **uniformi e casuali**, NON impone pari probabilità su persone vere e NON dichiara accuratezza psicologica.

```js
const calibration = /* valori di score_calibration.json, riportati qui */;
function calibratedScores(centered) {
  return Object.fromEntries(types.map(t => [
    t, centered[t] / calibration.sd[t] + calibration.offset[t]
  ]));
}
```

**Regole bonus:** dopo 7 risposte trova top e runner-up; se `top - second <= 0.35` (punteggio calibrato), Wing offre l'ottava; dopo l'ottava ricalcola, se ancora `<=0.35`, offre la nona. Dopo la nona procede comunque. La soglia è provvisoria e va ri-verificata con le risposte definitive e test UX. Per le domande bonus mantenere gli stessi baseline e sd calibrati inizialmente su sette domande: su otto/nove il numero di risposte aumenta la certezza grezza; per rendere confrontabile il margine normalizzare la **somma centrata** con un fattore `sqrt(7 / n)` prima di dividere per `sd` (n=8 o 9), mantenendo gli offset.

**Spareggio deterministico** anche dopo 9: classifica per punteggio calibrato, poi numero di risposte con peso 3 per quella categoria, poi numero con peso 2, poi priorità tecnica ID alfabetico solo come ultima soluzione (mai cambiare risultato per `Math.random`). Mostrare comunque che l'affinità secondaria è vicina e non fingere certezza. Nessun Nen di default.

**Se si cambiano opzioni o pesi**: ri-eseguire la calibrazione del file e i test con un seed nuovo e un campione di validazione indipendente prima di pubblicare; **non aggiornare a mano i numeri del radar**.

### 7.3 Dataset integrale bilingue con 96 vettori

**Abbreviazioni nei commenti per i progettisti:** H = Enhancement, E = Emission, T = Transmutation, C = Conjuration, M = Manipulation, S = Specialization. Il dataset JSON seguente non usa le abbreviazioni ma tutti e sei i nomi completi. Non tradurre Heavens Arena né i nomi delle categorie in EN; in italiano mostrare facoltativamente la traduzione tra parentesi.

```json
{
  "version": "1.0.0-provisional",
  "types": [
    "enhancement",
    "emission",
    "transmutation",
    "conjuration",
    "manipulation",
    "specialization"
  ],
  "dimensions": [
    "decisioni",
    "emozioni",
    "relazioni",
    "imprevisti",
    "ambizioni",
    "conflitti"
  ],
  "questions": [
    {
      "id": "q01",
      "number": 1,
      "dimension": "decisioni",
      "it": "Durante l’Esame Hunter arrivi a un bivio. Un percorso è breve ma sconosciuto, l’altro è più lungo e apparentemente sicuro. Cosa scegli?",
      "en": "During the Hunter Exam, you reach a fork. One route is short but unknown; the other is longer and seems safer. Which do you choose?",
      "options": [
        {
          "id": "q01_1",
          "it": "Scelgo quello breve. Preferisco affrontare subito ciò che mi aspetta.",
          "en": "I take the short route. I would rather face whatever lies ahead.",
          "weights": {
            "enhancement": 3,
            "emission": 2,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q01_2",
          "it": "Osservo i due percorsi e cerco indizi prima di scegliere.",
          "en": "I inspect both routes and look for clues before deciding.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 1
          }
        },
        {
          "id": "q01_3",
          "it": "Prendo la strada più interessante, anche se non è la più conveniente.",
          "en": "I take the more intriguing route, even if it is less practical.",
          "weights": {
            "enhancement": 0,
            "emission": 1,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 2
          }
        },
        {
          "id": "q01_4",
          "it": "Cerco di capire quale percorso sceglierebbero gli altri candidati.",
          "en": "I try to figure out which route the other candidates would choose.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 3,
            "specialization": 1
          }
        }
      ]
    },
    {
      "id": "q02",
      "number": 2,
      "dimension": "decisioni",
      "it": "Durante una missione trovi uno scrigno apparentemente incustodito. Potrebbe contenere ciò che cerchi, ma qualcosa ti insospettisce. Come procedi?",
      "en": "During a mission, you find a seemingly unguarded chest. It might contain what you need, but something feels wrong. What do you do?",
      "options": [
        {
          "id": "q02_1",
          "it": "Cerco di capire se ci siano trappole prima di toccarlo.",
          "en": "I check for traps before touching it.",
          "weights": {
            "enhancement": 0,
            "emission": 1,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q02_2",
          "it": "Lo apro. Non sono arrivato fin qui per tirarmi indietro.",
          "en": "I open it. I did not come this far to back down.",
          "weights": {
            "enhancement": 3,
            "emission": 2,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q02_3",
          "it": "Provo a scoprire cosa contiene senza aprirlo direttamente.",
          "en": "I try to find out what is inside without opening it directly.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 3,
            "conjuration": 2,
            "manipulation": 0,
            "specialization": 1
          }
        },
        {
          "id": "q02_4",
          "it": "Valuto se posso raggiungere il mio obiettivo anche ignorandolo.",
          "en": "I assess whether I can reach my goal without opening it.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 1,
            "manipulation": 3,
            "specialization": 2
          }
        }
      ]
    },
    {
      "id": "q03",
      "number": 3,
      "dimension": "decisioni",
      "it": "Stai per affrontare un avversario sconosciuto alla Heavens Arena. Come imposti il combattimento?",
      "en": "You are about to face an unknown opponent at Heavens Arena. How do you approach the fight?",
      "options": [
        {
          "id": "q03_1",
          "it": "Cerco di provocarlo per scoprire come reagisce.",
          "en": "I provoke them to see how they react.",
          "weights": {
            "enhancement": 0,
            "emission": 2,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 1,
            "specialization": 0
          }
        },
        {
          "id": "q03_2",
          "it": "Studio la sua postura e aspetto di capire il suo stile.",
          "en": "I study their stance and wait to understand their style.",
          "weights": {
            "enhancement": 0,
            "emission": 1,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q03_3",
          "it": "Prendo l’iniziativa e metto subito alla prova la sua forza.",
          "en": "I take the initiative and test their strength right away.",
          "weights": {
            "enhancement": 2,
            "emission": 3,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q03_4",
          "it": "Cambio ritmo e movimenti per impedirgli di leggermi.",
          "en": "I vary my pace and movements so they cannot read me.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 1,
            "specialization": 2
          }
        }
      ]
    },
    {
      "id": "q04",
      "number": 4,
      "dimension": "decisioni",
      "it": "Il tuo maestro di Nen ti concede un’ora per imparare una tecnica che non hai mai provato. Come sfrutti il tempo?",
      "en": "Your Nen master gives you one hour to learn a technique you have never attempted. How do you use the time?",
      "options": [
        {
          "id": "q04_1",
          "it": "La ripeto finché non riesco a eseguirla correttamente.",
          "en": "I repeat it until I can perform it correctly.",
          "weights": {
            "enhancement": 3,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 1,
            "specialization": 0
          }
        },
        {
          "id": "q04_2",
          "it": "Cerco un metodo personale, anche diverso da quello insegnato.",
          "en": "I look for my own method, even if it differs from what I was taught.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 2,
            "specialization": 3
          }
        },
        {
          "id": "q04_3",
          "it": "Scompongo la tecnica e ne studio ogni passaggio.",
          "en": "I break the technique down and study every step.",
          "weights": {
            "enhancement": 0,
            "emission": 1,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q04_4",
          "it": "Faccio diversi tentativi per scoprire un approccio più efficace.",
          "en": "I experiment with different approaches to find one that works better.",
          "weights": {
            "enhancement": 2,
            "emission": 1,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        }
      ]
    },
    {
      "id": "q05",
      "number": 5,
      "dimension": "emozioni",
      "it": "Un candidato all’Esame Hunter comincia a prendere in giro un tuo compagno davanti a tutti. Come reagisci?",
      "en": "A Hunter Exam candidate starts mocking one of your teammates in front of everyone. How do you react?",
      "options": [
        {
          "id": "q05_1",
          "it": "Intervengo immediatamente e gli dico di smetterla.",
          "en": "I step in immediately and tell them to stop.",
          "weights": {
            "enhancement": 2,
            "emission": 3,
            "transmutation": 0,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 1
          }
        },
        {
          "id": "q05_2",
          "it": "Rispondo con una provocazione ancora più pungente.",
          "en": "I respond with an even sharper provocation.",
          "weights": {
            "enhancement": 0,
            "emission": 2,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 1
          }
        },
        {
          "id": "q05_3",
          "it": "Cerco di evitare che la situazione degeneri.",
          "en": "I try to prevent the situation from escalating.",
          "weights": {
            "enhancement": 1,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q05_4",
          "it": "Aspetto il momento giusto per affrontarlo lontano dagli altri.",
          "en": "I wait for the right moment to confront them away from the others.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 1,
            "manipulation": 3,
            "specialization": 2
          }
        }
      ]
    },
    {
      "id": "q06",
      "number": 6,
      "dimension": "emozioni",
      "it": "Fallisci una prova dell’Esame Hunter per pochissimo. Qual è la tua reazione?",
      "en": "You narrowly fail one of the Hunter Exam trials. How do you react?",
      "options": [
        {
          "id": "q06_1",
          "it": "Mi arrabbio, ma la delusione mi spinge a riprovarci.",
          "en": "I get angry, but the disappointment drives me to try again.",
          "weights": {
            "enhancement": 2,
            "emission": 3,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q06_2",
          "it": "Ripenso agli errori e cerco di capire dove ho sbagliato.",
          "en": "I reflect on my mistakes and try to understand what went wrong.",
          "weights": {
            "enhancement": 0,
            "emission": 1,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q06_3",
          "it": "Accetto il risultato: alla prossima occasione sarò più forte.",
          "en": "I accept the result. Next time, I will be stronger.",
          "weights": {
            "enhancement": 3,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 0,
            "specialization": 1
          }
        },
        {
          "id": "q06_4",
          "it": "Cambio completamente approccio. Forse stavo seguendo la strada sbagliata.",
          "en": "I change my approach entirely. Maybe I was on the wrong path.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 1,
            "specialization": 2
          }
        }
      ]
    },
    {
      "id": "q07",
      "number": 7,
      "dimension": "emozioni",
      "it": "Durante un allenamento, il tuo maestro di Nen ti dice che non sei ancora pronto per affrontare un vero combattimento. Come reagisci?",
      "en": "During training, your Nen master says you are not ready for a real fight yet. How do you react?",
      "options": [
        {
          "id": "q07_1",
          "it": "Voglio dimostrargli il prima possibile che si sbaglia.",
          "en": "I want to prove them wrong as soon as possible.",
          "weights": {
            "enhancement": 2,
            "emission": 3,
            "transmutation": 0,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 1
          }
        },
        {
          "id": "q07_2",
          "it": "Gli chiedo quali siano precisamente le mie debolezze.",
          "en": "I ask them to identify my weaknesses precisely.",
          "weights": {
            "enhancement": 1,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q07_3",
          "it": "Non condivido necessariamente il suo giudizio e voglio discuterne.",
          "en": "I do not necessarily agree, and I want to discuss their judgment.",
          "weights": {
            "enhancement": 0,
            "emission": 2,
            "transmutation": 0,
            "conjuration": 1,
            "manipulation": 3,
            "specialization": 0
          }
        },
        {
          "id": "q07_4",
          "it": "Non mostro la delusione e continuo ad allenarmi per conto mio.",
          "en": "I hide my disappointment and continue training on my own.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 1,
            "manipulation": 2,
            "specialization": 3
          }
        }
      ]
    },
    {
      "id": "q08",
      "number": 8,
      "dimension": "emozioni",
      "it": "Durante una prova nella foresta senti qualcosa di pericoloso avvicinarsi. Anche gli altri candidati cominciano ad agitarsi. Come ti comporti?",
      "en": "During a trial in the forest, you hear something dangerous approaching. The other candidates are starting to panic. What do you do?",
      "options": [
        {
          "id": "q08_1",
          "it": "Ammetto di avere paura, ma continuo ad avanzare.",
          "en": "I admit I am scared, but I keep moving forward.",
          "weights": {
            "enhancement": 3,
            "emission": 2,
            "transmutation": 0,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 1
          }
        },
        {
          "id": "q08_2",
          "it": "Cerco di capire da dove provenga il pericolo.",
          "en": "I try to work out where the danger is coming from.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 1,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q08_3",
          "it": "Faccio una battuta per alleggerire la tensione.",
          "en": "I crack a joke to ease the tension.",
          "weights": {
            "enhancement": 1,
            "emission": 2,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q08_4",
          "it": "Prendo l’iniziativa per impedire che il gruppo perda il controllo.",
          "en": "I take charge to keep the group from losing control.",
          "weights": {
            "enhancement": 1,
            "emission": 2,
            "transmutation": 0,
            "conjuration": 0,
            "manipulation": 3,
            "specialization": 0
          }
        }
      ]
    },
    {
      "id": "q09",
      "number": 9,
      "dimension": "relazioni",
      "it": "Un candidato che non conosci ti propone di collaborare durante la prossima prova dell’Esame Hunter. Come reagisci?",
      "en": "An unfamiliar candidate suggests teaming up for the next Hunter Exam trial. How do you respond?",
      "options": [
        {
          "id": "q09_1",
          "it": "Accetto volentieri. Insieme potremmo avere più possibilità.",
          "en": "I gladly accept. We might have a better chance together.",
          "weights": {
            "enhancement": 3,
            "emission": 2,
            "transmutation": 0,
            "conjuration": 0,
            "manipulation": 1,
            "specialization": 0
          }
        },
        {
          "id": "q09_2",
          "it": "Gli faccio qualche domanda prima di decidere se fidarmi.",
          "en": "I ask a few questions before deciding whether to trust them.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 1
          }
        },
        {
          "id": "q09_3",
          "it": "Propongo un’alleanza limitata alla prossima prova.",
          "en": "I suggest an alliance limited to the next trial.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 3,
            "specialization": 1
          }
        },
        {
          "id": "q09_4",
          "it": "Accetto, ma preferisco non rivelare subito le mie intenzioni.",
          "en": "I agree, but I would rather not reveal my intentions yet.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 2,
            "conjuration": 0,
            "manipulation": 1,
            "specialization": 3
          }
        }
      ]
    },
    {
      "id": "q10",
      "number": 10,
      "dimension": "relazioni",
      "it": "Un tuo compagno di missione ti confida un segreto che potrebbe complicare il lavoro della squadra. Cosa fai?",
      "en": "A teammate shares a secret that could complicate your team’s mission. What do you do?",
      "options": [
        {
          "id": "q10_1",
          "it": "Mantengo la parola data: si è fidato di me.",
          "en": "I keep my word. They trusted me.",
          "weights": {
            "enhancement": 3,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 0,
            "specialization": 1
          }
        },
        {
          "id": "q10_2",
          "it": "Cerco di capire perché abbia deciso di raccontarmelo.",
          "en": "I try to understand why they chose to tell me.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 1,
            "conjuration": 3,
            "manipulation": 0,
            "specialization": 2
          }
        },
        {
          "id": "q10_3",
          "it": "Gli spiego che dobbiamo trovare un modo per tutelare anche la squadra.",
          "en": "I explain that we must also find a way to protect the team.",
          "weights": {
            "enhancement": 2,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 1,
            "manipulation": 3,
            "specialization": 0
          }
        },
        {
          "id": "q10_4",
          "it": "Tengo il segreto, ma valuto con maggiore attenzione le sue azioni.",
          "en": "I keep the secret, but pay closer attention to their actions.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 1,
            "manipulation": 2,
            "specialization": 3
          }
        }
      ]
    },
    {
      "id": "q11",
      "number": 11,
      "dimension": "relazioni",
      "it": "Durante una missione Hunter il gruppo deve scegliere un leader. Quale ruolo preferisci?",
      "en": "On a Hunter mission, the group must choose a leader. What role would you prefer?",
      "options": [
        {
          "id": "q11_1",
          "it": "Mi offro di guidare il gruppo, se penso di esserne capace.",
          "en": "I offer to lead if I think I can do the job.",
          "weights": {
            "enhancement": 1,
            "emission": 2,
            "transmutation": 0,
            "conjuration": 0,
            "manipulation": 3,
            "specialization": 0
          }
        },
        {
          "id": "q11_2",
          "it": "Preferisco che guidi la persona più preparata.",
          "en": "I prefer the most capable person to lead.",
          "weights": {
            "enhancement": 2,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 1,
            "specialization": 0
          }
        },
        {
          "id": "q11_3",
          "it": "Non mi interessa comandare: voglio essere libero di agire a modo mio.",
          "en": "I do not care about being in charge. I want the freedom to act my way.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 2,
            "conjuration": 0,
            "manipulation": 1,
            "specialization": 3
          }
        },
        {
          "id": "q11_4",
          "it": "Cerco di definire un piano comune prima ancora di scegliere chi comanda.",
          "en": "I try to establish a common plan before choosing a leader.",
          "weights": {
            "enhancement": 0,
            "emission": 1,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        }
      ]
    },
    {
      "id": "q12",
      "number": 12,
      "dimension": "relazioni",
      "it": "Un rivale che hai sempre considerato arrogante ti salva da una situazione pericolosa. Come reagisci?",
      "en": "A rival you have always considered arrogant saves you from danger. How do you react?",
      "options": [
        {
          "id": "q12_1",
          "it": "Lo ringrazio sinceramente. Quando potrò, ricambierò.",
          "en": "I thank them sincerely. I will return the favor when I can.",
          "weights": {
            "enhancement": 3,
            "emission": 2,
            "transmutation": 0,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 1
          }
        },
        {
          "id": "q12_2",
          "it": "Gli chiedo perché abbia deciso di aiutarmi.",
          "en": "I ask why they decided to help me.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 1,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q12_3",
          "it": "Gli faccio una battuta: non voglio mostrarmi troppo riconoscente.",
          "en": "I make a joke. I do not want to seem too grateful.",
          "weights": {
            "enhancement": 0,
            "emission": 2,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 1
          }
        },
        {
          "id": "q12_4",
          "it": "Accetto il suo aiuto, ma questo non significa che ora mi fidi di lui.",
          "en": "I accept their help, but that does not mean I trust them now.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 1,
            "manipulation": 2,
            "specialization": 3
          }
        }
      ]
    },
    {
      "id": "q13",
      "number": 13,
      "dimension": "imprevisti",
      "it": "Gli esaminatori cambiano improvvisamente le regole di una prova Hunter pochi minuti prima dell’inizio. Cosa fai?",
      "en": "The examiners suddenly change the rules of a Hunter trial minutes before it begins. What do you do?",
      "options": [
        {
          "id": "q13_1",
          "it": "Mi irrito, ma mi preparo ad affrontare la nuova sfida.",
          "en": "I get irritated, but prepare to face the new challenge.",
          "weights": {
            "enhancement": 2,
            "emission": 3,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q13_2",
          "it": "Rivedo il mio piano alla luce delle nuove regole.",
          "en": "I review my plan in light of the new rules.",
          "weights": {
            "enhancement": 1,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q13_3",
          "it": "Sono incuriosito: la prova potrebbe essere più divertente del previsto.",
          "en": "I am intrigued. The trial might be more fun than expected.",
          "weights": {
            "enhancement": 2,
            "emission": 1,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q13_4",
          "it": "Cerco di capire se il cambiamento nasconda qualche opportunità.",
          "en": "I try to see whether the change presents an opportunity.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 3,
            "specialization": 2
          }
        }
      ]
    },
    {
      "id": "q14",
      "number": 14,
      "dimension": "imprevisti",
      "it": "Durante un combattimento Nen, il tuo avversario mostra un’abilità completamente diversa da quella che ti aspettavi. Come reagisci?",
      "en": "During a Nen battle, your opponent reveals an ability completely different from what you expected. How do you react?",
      "options": [
        {
          "id": "q14_1",
          "it": "Mantengo la distanza finché non ne comprendo il funzionamento.",
          "en": "I keep my distance until I understand how it works.",
          "weights": {
            "enhancement": 0,
            "emission": 1,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q14_2",
          "it": "Cerco di colpirlo prima che possa utilizzare nuovamente la tecnica.",
          "en": "I try to strike before they can use the technique again.",
          "weights": {
            "enhancement": 2,
            "emission": 3,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q14_3",
          "it": "Fingo di aver capito la sua abilità per osservare la sua reazione.",
          "en": "I pretend to have figured it out to see how they react.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 1,
            "specialization": 2
          }
        },
        {
          "id": "q14_4",
          "it": "Abbandono il piano iniziale e provo qualcosa di inaspettato.",
          "en": "I abandon my original plan and try something unexpected.",
          "weights": {
            "enhancement": 0,
            "emission": 2,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 1,
            "specialization": 0
          }
        }
      ]
    },
    {
      "id": "q15",
      "number": 15,
      "dimension": "imprevisti",
      "it": "Uno strumento indispensabile alla tua missione si rompe nel momento peggiore. Cosa fai?",
      "en": "A tool that is vital to your mission breaks at the worst possible moment. What do you do?",
      "options": [
        {
          "id": "q15_1",
          "it": "Cerco di sostituirlo con ciò che ho a disposizione.",
          "en": "I find a substitute using whatever I have at hand.",
          "weights": {
            "enhancement": 2,
            "emission": 0,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 1
          }
        },
        {
          "id": "q15_2",
          "it": "Controllo il guasto per capire se posso ripararlo.",
          "en": "I inspect the damage to see whether I can fix it.",
          "weights": {
            "enhancement": 1,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q15_3",
          "it": "Riorganizzo la missione eliminando le parti che richiedono quello strumento.",
          "en": "I reorganize the mission to avoid relying on that tool.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 3,
            "specialization": 1
          }
        },
        {
          "id": "q15_4",
          "it": "Chiedo aiuto a un compagno: non devo risolvere tutto da solo.",
          "en": "I ask a teammate for help. I do not have to solve everything alone.",
          "weights": {
            "enhancement": 3,
            "emission": 2,
            "transmutation": 0,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 1
          }
        }
      ]
    },
    {
      "id": "q16",
      "number": 16,
      "dimension": "imprevisti",
      "it": "Una tempesta cancella le tracce che stavi seguendo nella foresta dell’Esame Hunter. Come ritrovi la strada?",
      "en": "A storm washes away the trail you were following in the Hunter Exam forest. How do you find your way?",
      "options": [
        {
          "id": "q16_1",
          "it": "Mi affido al mio orientamento e continuo ad avanzare.",
          "en": "I trust my sense of direction and keep going.",
          "weights": {
            "enhancement": 3,
            "emission": 2,
            "transmutation": 0,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 1
          }
        },
        {
          "id": "q16_2",
          "it": "Cerco punti di riferimento e ricostruisco il percorso.",
          "en": "I look for landmarks and reconstruct the route.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 1,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q16_3",
          "it": "Esploro una direzione alternativa che prima avevo escluso.",
          "en": "I explore an alternative direction I had ruled out earlier.",
          "weights": {
            "enhancement": 1,
            "emission": 0,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 2
          }
        },
        {
          "id": "q16_4",
          "it": "Mi fermo e organizzo le risorse prima di decidere come muovermi.",
          "en": "I stop, organize supplies, and then decide how to proceed.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 3,
            "specialization": 1
          }
        }
      ]
    },
    {
      "id": "q17",
      "number": 17,
      "dimension": "ambizioni",
      "it": "Hai finalmente ottenuto la licenza Hunter. Quale sarebbe la tua prima grande impresa?",
      "en": "You have finally earned your Hunter License. What would be your first big undertaking?",
      "options": [
        {
          "id": "q17_1",
          "it": "Mettere alla prova le mie capacità affrontando una sfida impegnativa.",
          "en": "Test my abilities by tackling a demanding challenge.",
          "weights": {
            "enhancement": 3,
            "emission": 2,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q17_2",
          "it": "Esplorare un luogo misterioso che nessuno conosce davvero.",
          "en": "Explore a mysterious place no one truly understands.",
          "weights": {
            "enhancement": 1,
            "emission": 0,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 2
          }
        },
        {
          "id": "q17_3",
          "it": "Indagare su qualcosa che da tempo suscita la mia curiosità.",
          "en": "Investigate something that has intrigued me for a long time.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 1
          }
        },
        {
          "id": "q17_4",
          "it": "Inseguire un obiettivo personale che non ho mai raccontato a nessuno.",
          "en": "Pursue a private goal I have never shared with anyone.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 1,
            "manipulation": 2,
            "specialization": 3
          }
        }
      ]
    },
    {
      "id": "q18",
      "number": 18,
      "dimension": "ambizioni",
      "it": "Puoi trascorrere un intero mese ad allenare il tuo Nen senza interruzioni. Come organizzi l’allenamento?",
      "en": "You can spend an entire uninterrupted month training your Nen. How do you structure it?",
      "options": [
        {
          "id": "q18_1",
          "it": "Mi concentro su una tecnica e lavoro per perfezionarla.",
          "en": "I focus on one technique and work to perfect it.",
          "weights": {
            "enhancement": 3,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 1,
            "specialization": 0
          }
        },
        {
          "id": "q18_2",
          "it": "Sperimento continuamente nuovi esercizi e possibilità.",
          "en": "I keep experimenting with new exercises and possibilities.",
          "weights": {
            "enhancement": 1,
            "emission": 2,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q18_3",
          "it": "Tengo traccia dei progressi e correggo ogni debolezza.",
          "en": "I track my progress and address each weakness.",
          "weights": {
            "enhancement": 0,
            "emission": 1,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q18_4",
          "it": "Stabilisco un metodo tutto mio e seguo i miei ritmi.",
          "en": "I create my own routine and train at my own pace.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 2,
            "specialization": 3
          }
        }
      ]
    },
    {
      "id": "q19",
      "number": 19,
      "dimension": "ambizioni",
      "it": "L’Associazione Hunter ti offre quattro missioni. Quale sceglieresti?",
      "en": "The Hunter Association offers you four missions. Which one do you choose?",
      "options": [
        {
          "id": "q19_1",
          "it": "Proteggere una persona importante durante un viaggio pericoloso.",
          "en": "Protect an important person during a dangerous journey.",
          "weights": {
            "enhancement": 3,
            "emission": 2,
            "transmutation": 0,
            "conjuration": 0,
            "manipulation": 1,
            "specialization": 0
          }
        },
        {
          "id": "q19_2",
          "it": "Indagare su misteriose sparizioni in una città isolata.",
          "en": "Investigate mysterious disappearances in an isolated city.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 1,
            "conjuration": 3,
            "manipulation": 0,
            "specialization": 2
          }
        },
        {
          "id": "q19_3",
          "it": "Infiltrarti in un’organizzazione criminale senza farti scoprire.",
          "en": "Infiltrate a criminal organization without being detected.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 2,
            "specialization": 1
          }
        },
        {
          "id": "q19_4",
          "it": "Recuperare un antico manufatto custodito in un luogo pieno di trappole.",
          "en": "Recover an ancient artifact hidden in a place full of traps.",
          "weights": {
            "enhancement": 1,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        }
      ]
    },
    {
      "id": "q20",
      "number": 20,
      "dimension": "ambizioni",
      "it": "Scopri di possedere un talento molto raro, che pochi altri Hunter hanno dimostrato. Come lo sfrutti?",
      "en": "You discover you have a rare talent that very few Hunters have shown. How do you use it?",
      "options": [
        {
          "id": "q20_1",
          "it": "Mi alleno per portarlo al massimo delle sue possibilità.",
          "en": "I train to push it to its fullest potential.",
          "weights": {
            "enhancement": 3,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 1,
            "specialization": 0
          }
        },
        {
          "id": "q20_2",
          "it": "Cerco modi insoliti per utilizzarlo, anche diversi da quelli previsti.",
          "en": "I look for unusual uses, including ones nobody intended.",
          "weights": {
            "enhancement": 0,
            "emission": 1,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 2
          }
        },
        {
          "id": "q20_3",
          "it": "Lo studio attentamente per comprenderne i limiti.",
          "en": "I study it closely to understand its limits.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 1,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q20_4",
          "it": "Preferisco non rivelarlo finché non ne avrò davvero bisogno.",
          "en": "I would rather keep it secret until I truly need it.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 1,
            "manipulation": 2,
            "specialization": 3
          }
        }
      ]
    },
    {
      "id": "q21",
      "number": 21,
      "dimension": "conflitti",
      "it": "Dopo un combattimento alla Heavens Arena, il tuo avversario sostiene che hai vinto soltanto per fortuna. Come rispondi?",
      "en": "After a fight at Heavens Arena, your opponent claims you only won by luck. How do you respond?",
      "options": [
        {
          "id": "q21_1",
          "it": "Gli propongo una rivincita: voglio dimostrare quanto valgo.",
          "en": "I offer a rematch. I want to prove what I can do.",
          "weights": {
            "enhancement": 2,
            "emission": 3,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q21_2",
          "it": "Sorrido. Non ho bisogno di convincerlo.",
          "en": "I smile. I do not need to convince them.",
          "weights": {
            "enhancement": 2,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 1,
            "manipulation": 0,
            "specialization": 3
          }
        },
        {
          "id": "q21_3",
          "it": "Gli spiego cosa ha sbagliato durante il combattimento.",
          "en": "I explain what they did wrong during the fight.",
          "weights": {
            "enhancement": 0,
            "emission": 1,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q21_4",
          "it": "Lo stuzzico un po’: voglio vedere quanto riesco a farlo innervosire.",
          "en": "I tease them a little to see how much I can rile them up.",
          "weights": {
            "enhancement": 0,
            "emission": 2,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 1,
            "specialization": 0
          }
        }
      ]
    },
    {
      "id": "q22",
      "number": 22,
      "dimension": "conflitti",
      "it": "Durante una missione, un compagno ignora il piano concordato e agisce per conto proprio. Cosa fai?",
      "en": "During a mission, a teammate ignores the agreed plan and acts on their own. What do you do?",
      "options": [
        {
          "id": "q22_1",
          "it": "Gli chiedo spiegazioni: forse ha notato qualcosa che mi sfugge.",
          "en": "I ask for an explanation. Maybe they noticed something I missed.",
          "weights": {
            "enhancement": 1,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 3,
            "manipulation": 2,
            "specialization": 0
          }
        },
        {
          "id": "q22_2",
          "it": "Mi arrabbio e gli ricordo che avevamo preso un accordo.",
          "en": "I get angry and remind them that we had an agreement.",
          "weights": {
            "enhancement": 2,
            "emission": 3,
            "transmutation": 0,
            "conjuration": 0,
            "manipulation": 1,
            "specialization": 0
          }
        },
        {
          "id": "q22_3",
          "it": "Adatto rapidamente il mio piano alla nuova situazione.",
          "en": "I quickly adapt my plan to the new situation.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 2,
            "conjuration": 1,
            "manipulation": 3,
            "specialization": 0
          }
        },
        {
          "id": "q22_4",
          "it": "Se la sua idea funziona, non ho problemi a seguirla.",
          "en": "If their idea works, I have no problem going along with it.",
          "weights": {
            "enhancement": 3,
            "emission": 0,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 2
          }
        }
      ]
    },
    {
      "id": "q23",
      "number": 23,
      "dimension": "conflitti",
      "it": "Un avversario molto più forte di te blocca l’unica uscita. Non sembra intenzionato a lasciarti passare. Cosa tenti?",
      "en": "A much stronger opponent blocks the only exit and does not intend to let you through. What do you try?",
      "options": [
        {
          "id": "q23_1",
          "it": "Cerco di distrarlo e sfruttare un’occasione per passare.",
          "en": "I try to distract them and seize an opportunity to slip past.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 3,
            "conjuration": 0,
            "manipulation": 2,
            "specialization": 1
          }
        },
        {
          "id": "q23_2",
          "it": "Lo affronto comunque: voglio scoprire se posso batterlo.",
          "en": "I fight them anyway. I want to find out whether I can win.",
          "weights": {
            "enhancement": 2,
            "emission": 3,
            "transmutation": 1,
            "conjuration": 0,
            "manipulation": 0,
            "specialization": 0
          }
        },
        {
          "id": "q23_3",
          "it": "Gli parlo per capire cosa desidera realmente.",
          "en": "I talk to them to understand what they actually want.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 3,
            "specialization": 1
          }
        },
        {
          "id": "q23_4",
          "it": "Osservo l’ambiente per trovare un vantaggio che possa ribaltare la situazione.",
          "en": "I study my surroundings for an advantage that could turn things around.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 2,
            "conjuration": 3,
            "manipulation": 1,
            "specialization": 0
          }
        }
      ]
    },
    {
      "id": "q24",
      "number": 24,
      "dimension": "conflitti",
      "it": "Durante uno scontro, un avversario ti propone improvvisamente una tregua. Come reagisci?",
      "en": "In the middle of a fight, your opponent suddenly offers a truce. How do you react?",
      "options": [
        {
          "id": "q24_1",
          "it": "Accetto se penso che possa evitare uno scontro inutile.",
          "en": "I accept if it can prevent an unnecessary fight.",
          "weights": {
            "enhancement": 3,
            "emission": 0,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 1,
            "specialization": 0
          }
        },
        {
          "id": "q24_2",
          "it": "Pretendo di conoscere le sue condizioni prima di decidere.",
          "en": "I demand to know their terms before deciding.",
          "weights": {
            "enhancement": 0,
            "emission": 1,
            "transmutation": 0,
            "conjuration": 2,
            "manipulation": 3,
            "specialization": 0
          }
        },
        {
          "id": "q24_3",
          "it": "Mi mostro disponibile, ma cerco di capire cosa stia nascondendo.",
          "en": "I seem open to it, but try to find out what they are hiding.",
          "weights": {
            "enhancement": 0,
            "emission": 0,
            "transmutation": 3,
            "conjuration": 1,
            "manipulation": 0,
            "specialization": 2
          }
        },
        {
          "id": "q24_4",
          "it": "Rifiuto: non mi fido di chi cambia intenzioni nel mezzo di uno scontro.",
          "en": "I refuse. I do not trust someone who changes their mind mid-fight.",
          "weights": {
            "enhancement": 0,
            "emission": 3,
            "transmutation": 0,
            "conjuration": 1,
            "manipulation": 0,
            "specialization": 2
          }
        }
      ]
    }
  ]
}
```

### 7.4 Costanti di calibrazione (da importare come oggetto `calibration`)

```json
{
  "sd": {
    "enhancement": 3.010188,
    "emission": 2.627689,
    "transmutation": 3.02099,
    "conjuration": 3.285003,
    "manipulation": 2.814902,
    "specialization": 2.596852
  },
  "offset": {
    "enhancement": 0.020458,
    "emission": 0.020503,
    "transmutation": -0.018908,
    "conjuration": -0.048419,
    "manipulation": 0.014878,
    "specialization": 0.011487
  }
}
```

### 7.5 Risultato della calibrazione sul modello nullo (sintetico)

| Nen | Frequenza su 160.000 risposte casuali uniformi dopo calibrazione |
|---|---:|
| enhancement | 16.676% |
| emission | 16.646% |
| transmutation | 16.626% |
| conjuration | 16.647% |
| manipulation | 16.684% |
| specialization | 16.721% |

Soglia ambiguità proposta: `0.35`; frequenza stimata di avvio dell'ottava domanda: **35.9%** con risposte uniformi. Questi numeri sono **in-sample**, quindi validare su un secondo seed; non sono dati di persone reali.


## 8. Personaggi iconici: 3 per ogni Nen, 18 totali, con immagini autentiche

**OBBLIGATORIO:** mostrare un ritratto riconoscibile di ciascun personaggio tratto da **immagini esistenti dell'anime o manga, e legittimamente utilizzabili**, **non** far generare a un modello AI copie o imitazioni dei personaggi. Non estrarre le tre miniature dal mockup AI di riferimento. Nessun volto sintetico. Se non hai ancora diritti/asset permessi, usa un placeholder grafico neutro, nome leggibile, link alla fonte e badge "immagine da aggiungere", così il prototipo resta funzionante.

### 8.1 Personaggi concordati

| Nen | Personaggio / slug | Breve testo IT | Short text EN |
|---|---|---|---|
| Enhancement | **Gon Freecss** / `gon` | Con Jajanken concentra il Nen nei colpi e valorizza la propria forza. | His Jajanken channels Nen into powerful strikes, amplifying his strength. |
| Enhancement | **Isaac Netero** / `netero` | Maestro di enorme disciplina: un esempio di allenamento e potenziamento portati all'estremo. | A master of discipline whose training pushed enhancement to extraordinary heights. |
| Enhancement | **Uvogin** / `uvogin` | Membro della Brigata Fantasma: esprime il potenziamento attraverso devastante forza fisica. | A Phantom Troupe member who embodies Enhancement through overwhelming physical power. |
| Emission | **Meruem** / `meruem` | Re delle formichimere con un'aura eccezionale, classificato come Emitter nelle informazioni successive dell'autore. | The Chimera Ant King, whose extraordinary aura is classified as Emission in later author materials. |
| Emission | **Zeno Zoldyck** / `zeno` | Assassino esperto che proietta la propria aura in tecniche dalla forma di drago. | A veteran assassin who projects aura into dragon-shaped techniques. |
| Emission | **Razor** / `razor` | Utilizza aura separata dal corpo, nota per potenti attacchi e per Greed Island. | Uses aura away from his body, known for formidable attacks on Greed Island. |
| Transmutation | **Killua Zoldyck** / `killua` | Trasforma le proprietà della sua aura per imitare l'elettricità. | Gives his aura electricity-like properties. |
| Transmutation | **Hisoka Morow** / `hisoka` | Il suo Bungee Gum combina proprietà elastiche e adesive. | His Bungee Gum combines elastic and adhesive properties. |
| Transmutation | **Biscuit Krueger** / `biscuit` | Hunter e mentore esperta: padroneggia l'aura e un addestramento rigoroso. | An expert Hunter and mentor with deep aura mastery and rigorous training. |
| Conjuration | **Kurapika** / `kurapika` | Materializza catene con funzioni specifiche; con gli occhi scarlatti accede anche a Emperor Time. | Conjures chains with specialized functions; his Scarlet Eyes also unlock Emperor Time. |
| Conjuration | **Kite** / `kite` | Tramite Crazy Slots materializza armi diverse secondo regole precise. | Through Crazy Slots, conjures various weapons under specific rules. |
| Conjuration | **Shizuku Murasaki** / `shizuku` | Materializza Blinky, un aspirapolvere con abilità particolari. | Conjures Blinky, a vacuum cleaner with unusual properties. |
| Manipulation | **Illumi Zoldyck** / `illumi` | Usa aghi per manipolare persone e alterarne il comportamento. | Uses needles to manipulate people and influence their actions. |
| Manipulation | **Morel Mackernasey** / `morel` | Controlla il fumo nelle tecniche strategiche di Deep Purple. | Controls smoke through strategic Deep Purple techniques. |
| Manipulation | **Shalnark** / `shalnark` | Con Black Voice controlla bersagli tramite un dispositivo. | Black Voice lets him control targets through a device. |
| Specialization | **Chrollo Lucilfer** / `chrollo` | Skill Hunter gli permette di rubare e usare abilità altrui, rispettando condizioni. | Skill Hunter lets him steal and use others' abilities under specific conditions. |
| Specialization | **Neferpitou** / `neferpitou` | Nen unico, incluso il controllo tramite marionette; la sua divinazione secca la foglia. | Uses singular abilities, including puppet-like control; their divination dries the leaf. |
| Specialization | **Pakunoda** / `pakunoda` | Accede ai ricordi e può trasferire informazioni tramite i proiettili della memoria. | Reads memories and can transfer information through memory bullets. |

**Nota accuratezza:** Kurapika è di base Conjurer, e la sua condizione degli occhi va spiegata senza confonderlo con uno Specialista permanente. Le categorie possono avere aggiornamenti nelle tavole dell'autore; il database anime usato per le **immagini** non deve decidere la categoria Nen.

### 8.2 Come reperire immagini reali senza ricorrere all'AI

**Approccio raccomandato per il prototipo:** un file **curato** `src/data/characters.js` o `characters.json` con `slug`, `name`, `nenType`, `portraitSrc`, `sourceUrl`, `credit`, `permissionStatus`, `description.it/en`. Per ciascuno dei 18, scegliere **manualmente** un ritratto anime autentico, controllare che rappresenti proprio quel personaggio e verificare condizioni d'uso/licenza. Se l'utente carica immagini per cui ha autorizzazione, salvarle in `/public/assets/characters/{slug}.webp` (NON fare scraping generalizzato). Per Wing identico processo con `/public/assets/wing/{pose}.png` (espressioni: neutral/smile/curious/thinking) se disponibili.

**Fonte di metadata e scoperta, non automaticamente di diritti di ripubblicazione:**

1. **AniList GraphQL API**: https://docs.anilist.co/guide/graphql/ ; termini: https://docs.anilist.co/guide/terms-of-use ; ricerca personaggio per nome e `image.large` + link esterno. Per MVP non serve richieste live ogni visita; usare discovery/curation. Controllare limiti/rate/TOS; la risposta API e la licenza delle immagini non sono la stessa cosa.
2. **Jikan (API non ufficiale MyAnimeList)**: https://jikan.moe/ ; repository: https://github.com/jikan-me/jikan-rest ; `GET https://api.jikan.moe/v4/characters?q=<NAME>` per cercare metadata e immagini, con rate limits/cache e verifica manuale degli omonimi. Il codice dell'API open source **non concede** automaticamente diritti sulle immagini degli anime.
3. **Materiali ufficiali** per verificare ritratti e autorità dei personaggi: https://madhouse.co.jp/english/works/tv_hunter/ e https://www.viz.com/hunter-x-hunter . Immagini ufficiali non equivalgono a immagini libere da ripubblicare; accertare permesso/licenza prima del deployment pubblico.

Esempio query di scoperta AniList (non usare come licenza):

```js
const query = `query ($name: String) {
  Character(search: $name) {
    id
    name { full }
    image { large }
    siteUrl
  }
}`;
const response = await fetch('https://graphql.anilist.co', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables: { name: 'Kurapika' } })
});
// Verificare identità e diritto d'uso prima di salvare/renderizzare la risorsa.
```

**Fallback:** se portrait mancante, errore CORS/404 o permesso non verificato, mostrare card elegante con nome + simbolo Nen e testo, senza immagine finta e senza crash. Aggiungere `loading="lazy"`, `alt`, `onerror`, layout che non salta. Non dare per scontato il permesso al solo perché un'immagine è pubblicamente accessibile. Non inventare URL di immagini.

## 9. Scheda finale: contenuti e interazioni

Dopo la divinazione, la stessa scena rimane nello stato conclusivo in cima, senza stacchi. Subito sotto un pannello principale:

- Etichetta `IL TUO TIPO DI NEN / YOUR NEN TYPE`.
- Nome tipo dominante EN enorme (es. `CONJURATION`), sottotitolo IT `Materializzazione`.
- Descrizione dei tratti Hisoka in **2–4 frasi** per tipo, distinta da cosa fa tecnicamente la categoria.
- Piccola card `AFFINITÀ SECONDARIA / SECONDARY AFFINITY`, tipo runner-up calcolato.
- Radar esagonale a destra su desktop e sotto il testo su mobile; animare il poligono da centro a forma in 500–800 ms, senza lampeggi.
- Accordion `COSA SIGNIFICA / WHAT IT MEANS` espanso di default o collassato se mobile molto stretto: funzione dell'aura, esempio acqua, nota sui tratti.
- `PERSONAGGI ESEMPIO / EXAMPLE CHARACTERS`: **esattamente tre** personaggi corrispondenti al Nen principale con immagini autentiche quando autorizzate e descrizione di 2 righe.
- Footer: `SALVA RISULTATO / SAVE RESULT`, `CONDIVIDI / SHARE`, `RIPROVA IL QUIZ / RETAKE QUIZ`.

**Condivisione**: creare un PNG leggibile dimensione almeno 1080×1350 con nome Nen, sottotipo, esagono, colore accent e branding originale dell'app; opzione story 1080×1920 secondaria. Non serve esportare *tutta* la pagina; la share card è più compatta. `navigator.share({files:[...]})` solo se supportato + `navigator.canShare`; fallback automatico `download PNG` e se necessario copia breve testo/link alla pagina. Export funzionale anche su desktop. Test con font caricati, retina scaling, background e `Blob`. Evitare canvas tainted se si includono immagini cross-origin senza CORS/permesse: per MVP **card condivisibile senza ritratti** o con asset locali autorizzati.

**Descrizioni compatte da localizzare (lato personalità/abilità):**

| Nen | Personalità IT | Personalità EN | Abilità IT | Ability EN |
|---|---|---|---|---|
| Enhancement | Diretto, sincero, tenace; tende ad affrontare le sfide senza girarci troppo intorno. | Straightforward, honest and determined; tends to face challenges directly. | Potenzia le proprietà naturali del corpo e degli oggetti. | Enhances the natural properties of the body and objects. |
| Emission | Reattivo, impaziente e spontaneo; decide in fretta e difende con energia le sue posizioni. | Quick to react, impatient and spontaneous; makes decisions fast. | Mantiene e proietta aura anche lontano dal corpo. | Projects and maintains aura away from the body. |
| Transmutation | Creativo, imprevedibile, giocoso e difficile da leggere. | Creative, unpredictable, playful and hard to read. | Modifica le proprietà dell'aura affinché imiti altre sostanze o effetti. | Gives aura properties resembling other substances or effects. |
| Conjuration | Attento ai dettagli, prudente e meticoloso; preferisce comprendere prima di agire. | Detail-oriented, cautious and meticulous; prefers to understand before acting. | Materializza oggetti e strumenti tramite l'aura. | Conjures objects and tools through aura. |
| Manipulation | Logico, indipendente e risoluto; tende a seguire metodi e tempi propri. | Logical, independent and resolute; likes to work at their own pace. | Influenza o controlla persone, oggetti e sostanze tramite l'aura. | Influences or controls people, objects and substances with aura. |
| Specialization | Individualista, riservato e carismatico; poco incline a seguire classificazioni comuni. | Individualistic, reserved and charismatic; rarely fits a conventional mold. | Comprende effetti che non rientrano nelle altre cinque categorie. | Covers abilities outside the other five categories. |

**Aggiungere disclaimer piccolo:** «Quiz ludico ispirato alla teoria di Hisoka: non è un metodo canonico o scientifico per determinare la personalità.» / EN. Esplicitare "Fan project non ufficiale; nessuna affiliazione con i titolari di Hunter × Hunter". Usare i marchi e i personaggi con cautela in un deployment pubblico.

## 10. Accessibilità e dettagli implementativi

- `pointerdown` sulla superficie glass-hold: `setPointerCapture` se supportato, salva timestamp `performance.now`, aggiorna con `requestAnimationFrame`, usa `pointerup`/`pointercancel`/`lostpointercapture`; reset al rilascio precoce; prevenire context menu/scroll **solo nella zona hold** con `touch-action: none`, senza compromettere scroll pagina.
- **Prima di premere** mostra due mani a riposo/istruzioni; **durante** spostale verso i lati del bicchiere, barra tra/accanto alle mani; **a pressione completa** le mani restano, l'acqua reagisce.
- Supporto tastiera: keydown Space/Enter come inizio, keyup come rilascio (evitare autorepeat), `aria-live="polite"` per i messaggi e `role="progressbar"` per percentuale hold senza aggiornamenti screen-reader continui; button HTML focusabile e attivazione accessibile alternativa se hold non praticabile.
- Cache lingua in localStorage `lang=it|en` (rispettare preferenza browser all'inizio, default italiano); non persistere dati quiz salvo esplicita utilità, nessuna analytics obbligatoria.
- Cookie banner NON necessario se non usiamo cookie/analytics non essenziali; indicare eventuale fetch a servizi esterni nella nota privacy.
- Render responsive, test 320×568 e 390×844 e 1440×900; CSS safe-area iPhone.
- Gestire tutte le fasi e unmount evitando listener/timer duplicati, race/focus issues, Strict Mode se React scelto.
- Nessuna risorsa che costringa a registrarsi, pagare o possedere un API key.

## 11. Struttura repository suggerita

```text
nen-divination/
  index.html
  package.json
  vite.config.js
  README.md
  ASSETS.md
  SPEC_NEN_DIVINATION_CODEX.md
  public/
    assets/
      characters/       # immagini autentiche autorizzate, se disponibili
      wing/             # immagini autentiche autorizzate del personaggio/espressioni
      scene/            # illustrazioni originali bicchiere/tavolo/mani
  src/
    main.js
    styles.css
    data/
      questions.js       # o JSON import di questions_scoring.json
      characters.js
      nenTypes.js
      translations.js
      scoreCalibration.js
    game/
      questionPicker.js
      scoring.js
      bonusPicker.js
      stateMachine.js
      share.js
    components/
      WingScene.js
      QuestionOverlay.js
      WaterGlass.js
      HoldInteraction.js
      ResultView.js
      NenRadar.js
      CharacterCards.js
    tests/
      scoring.test.js
      questions.test.js
      navigation.test.js
  reference/             # opzionale; NON pubblicare reference/ sul sito
```

## 12. Criteri di accettazione obbligatori per il primo prototipo

1. `npm run dev` apre app funzionante senza errori in browser desktop e mobile.
2. La scena **mostra Wing frontalmente** davanti all'utente, **bicchiere/tavolo in primo piano**, domande su overlay discreto, come nel reel (se mancano asset Wing reali, fallback originale dichiarato in README, niente pseudo-Wing AI).
3. Delle 24 domande ne vengono mostrate 7 (una per area e la settima da un'area sorteggiata); ogni domanda ha 4 opzioni **IT/EN** e nell'italiano c'è scritto **Heavens Arena**, non Torre Celeste.
4. Domande/opzioni mescolate, ma stabili nel tentativo, anche se si torna indietro o si cambia lingua. Le risposte restano selezionate.
5. Dopo la quarta risposta Wing dice **«Oh, interessante…»** / “Oh, interesting…” con un cambio espressione lieve, non rivela il Nen; 2–3 micro-reazioni discrete.
6. Bonus Wing: 8ª e, se ancora ambiguità, 9ª; mai oltre 9. Bonus scelta per distinguere le categorie in testa, non random puro. Zero bonus se gap ampio.
7. Scoring sui 96 vettori configurati, centering e calibrazione; le categorie casuali risultano distribuite in maniera ragionevolmente uniforme nei test di regressione, nessuna risposta A fissa favorisce un tipo.
8. Hold mouse sinistro / dito **4,5s**, barra vicina alle mani, stop/reset corretto, tastiera e riduzione del movimento.
9. **Sei animazioni** coerenti e sobrie con stato finale persistente, compresa Specialization con la **foglia annerita che si disintegra dentro l'acqua**, senza effetti di stanza, ed Emission con colore acqua, Transmutation dolce.
10. Risultato quasi uguale al **reference design**: dark, elegante, sezione titolo+descrizione a sinistra e radar a destra desktop, tre card con personaggi, CTA save/share/replay; mobile leggibile.
11. **Colore accent diverso per ciascun Nen**, sempre discreto, mai neon esagerato.
12. Selezione di 3 personaggi **corretti** per Nen principale con immagine autentica autorizzata quando disponibile, e descrizione IT/EN; mai sostituirli con immagini generate AI.
13. Scheda PNG generata e scaricabile; Web Share API ove supportata, fallback robusto.
14. `npm run build` senza errori; funzionante su GitHub Pages con routing relativo e `base` corretto.
15. Nessuna dichiarazione ingannevole di "percentuale scientifica" o identità Nen reale; no tracking non autorizzato.

## 13. Test quantitativi già preparati (limiti e riproducibilità)

Il dataset incluso ha 24×4=**96 opzioni**. Una simulazione uniforme casuale, con una domanda da ciascuna area + una aggiuntiva e **seed 20261026**, serve a verificare squilibri dello strumento: percentuali teoriche attese 16,67% per ogni Nen nel modello nullo. **Non sono state misurate persone, quindi non rappresentano accuratezza reale**. I numeri di calibrazione sono riportati qui sotto e in `score_calibration.json`.

**Raccomandazione di verifica:** implementare una simulazione di regressione `npm run test:simulation` con almeno 30.000 tentativi uniformi con seed **diverso** dalla calibrazione, validando entro una tolleranza (~2 punti percentuali) le percentuali finali; simulare anche profili sintetici con preferenze non uniformi per controllare che diversi profili di risposta possano portare a ciascuno dei sei risultati. Aggiungere test per parità esatta e per eventuale bonus doppio. In caso di revisione dei pesi, ripetere tutta la calibrazione su campione separato.

**Nota:** un algoritmo non può dedurre con precisione canonica un Nen dalla personalità; i punteggi sono una convenzione di design ispirata alla descrizione di Hisoka. Meglio un'esperienza divertente e riproducibile che una falsa pretesa di rigore scientifico.

### 13.1 Test indipendenti eseguiti sulla versione consegnata

- Con un **secondo seed indipendente** e **50.000 quiz con sette risposte uniformemente casuali**, ogni Nen è emerso tra **16,42% e 16,87%**; l'ottava domanda sarebbe stata attivata circa nel **36,03%** dei casi.
- Con **25.000 ulteriori quiz completi** e bonus adattivi applicati realmente: Enhancement **16,35%**, Emission **16,42%**, Transmutation **17,14%**, Conjuration **17,05%**, Manipulation **17,18%**, Specialization **15,86%**. Sono terminate a 7 domande il **63,85%** delle partite, a 8 il **23,36%**, a 9 il **12,79%**.
- Questi risultati confermano un **bilanciamento ragionevole in modelli casuali**, non la validità psicologica del quiz. La selezione adattiva genera una piccola differenza tra Nen: si può rifinire in una versione successiva sulla base di veri feedback utenti.

## 14. Fonti e controlli su canone / servizi

- Hunter × Hunter ufficiale VIZ: https://www.viz.com/hunter-x-hunter
- Produzione anime (Madhouse): https://madhouse.co.jp/english/works/tv_hunter/
- Documentazione AniList: https://docs.anilist.co/guide/graphql/
- Termini AniList: https://docs.anilist.co/guide/terms-of-use
- API Jikan/MyAnimeList non ufficiale: https://jikan.moe/ e https://github.com/jikan-me/jikan-rest
- Controllare attribuzioni Nen successive al 2022 (diagramma dell'autore) prima di eventuali cambiamenti alle 18 schede; evitare di assumere che il risultato di un database anime sia autorevole per il Nen.

**Nota finale a Codex:** realizza il prototipo adesso, con asset grafici originali CSS/SVG per tavolo/bicchiere/mani e integrazione di asset character/Wing autentici autorizzati solo se disponibili. Non trasformare questo documento in una lista di richieste da porre all'utente. Eventuali parti che dipendono da licenze devono restare punti documentati senza impedire di giocare, completare il test e vedere i sei risultati.
