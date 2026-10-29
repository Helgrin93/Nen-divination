# NEN DIVINATION — ART PASS V3 / PROMPT PER CODEX

> **Obiettivo:** portare tutte e sei le animazioni della divinazione a una qualità anime 2D convincente, senza modificare la scena, la UI o la logica del quiz già approvate.
>
> **Modello consigliato:** GPT-6.1 Sol, ragionamento **High**. Se la diagnosi della composizione o del rendering resta irrisolta dopo una verifica concreta, usare GPT-6 Astra **High** per quel problema specifico, non per rifare alla cieca l'intero progetto.
>
> **Vincolo:** NON eseguire `git push`, NON pubblicare in automatico. Mostrare il risultato e i materiali di verifica in locale.

## 0. Contesto e priorità

Il progetto esistente è `nen-divination`, una web app Vite responsive IT/EN ispirata a *Hunter × Hunter*. L'interfaccia del quiz, Wing, il tappeto con le crepe sul muro, le mani, la composizione del bicchiere, la scheda finale e la logica delle 24 domande sono già approvati: **non ridisegnarli**. La scena deve restare una singola illustrazione anime uniforme. Non introdurre effetti neon, fasci di energia, filtri appariscenti, 3D fotorealistico o video che modificano accidentalmente Wing, mani, vetro e ambiente.

L'utente ha provato tutte le animazioni in `http://localhost:5173/review/divination.html`: **Specializzazione è l'unica sostanzialmente convincente; le altre richiedono un salto di qualità artistica**. In particolare, Manipolazione è troppo simile a una PNG ruotata.

Prima di modificare il codice, leggi integralmente:
- `src/components/WaterScene.js`
- `src/components/divinationTimeline.js`
- `src/components/HandsMotion.js`
- `src/components/QuizScene.js`
- `src/styles/divination.css`
- `review/divination.html`, `review/divination.js`, `review/divination.css`
- `DIVINATION_IMPLEMENTATION.md`
- `assets/scene/divination-layer-spec.md`
- `assets/scene/divination-quality-notes.md`
- `assets/scene/divination-generation-prompts.md`
- `public/assets/divination/leaf-states-atlas.png`
- `public/assets/divination/overflow-atlas.png`
- `public/assets/divination/water-surface-clean.png`
- gli asset e il fondale originali in `public/assets/scene-v3/`.

Il codice pubblicato il 28/10/2026, nella funzione `drawLeaf` di `WaterScene.js`, trasla e ruota rigidamente il bitmap originale con trasformazioni Canvas (`translate`, `scale`, `rotate`). Per Manipolazione, `leafX`, `leafY` e l'angolo sono guidati essenzialmente da sinusoidi. `drawEmission()` usa un gradiente moltiplicativo; `drawSediment()` dispone molti residui con formule regolari; `drawOverflow()` applica colature/gocce estratte da un atlas a traiettorie predefinite. Questi sono **punti tecnici da analizzare e migliorare**, non una diagnosi visiva completa fatta eseguendo il browser. Non fingere di avere visto filmati che non hai riprodotto realmente.

## 1. Obiettivo qualitativo — prima i principi artistici

L'animazione deve apparire come **2D cel animation realizzata per questa precisa scena**, non un effetto software appoggiato sopra un'illustrazione statica. Ogni trasformazione deve nascere dal comportamento fisico/narrativo dell'acqua o della foglia. Preferire movimenti con anticipazione, accelerazione non costante, inerzia, assestamento e microvariazioni coerenti. Nessun moto oscillatorio ripetitivo o puramente sinusoidale che faccia pensare a un oggetto trascinato dal mouse.

**Qualità di compositing obbligatoria:** il vetro mantiene bordo e riflessi originali; gli effetti interni sono occlusi correttamente dal vetro; la superficie dell'acqua ha una prospettiva ellittica stabile; nessun secondo bicchiere, aureola, alone cromatico, rettangolo di sfondo, scia o salto dei pixel. Non coprire la foglia con filtri o riparazioni del fondale incoerenti. Il cambio dimensioni desktop/mobile non deve spostare i livelli.

**Strategia ibrida preferita:**
- **Sprite/frame illustrati** o deformazioni raster/mesh per cambiamenti di forma complessi (foglia che flette, acqua che trabocca, bordi che si seccano).
- **Codice** solo per posizionamenti, timing, interpolazioni, maschere, occlusione, piccole onde e composizione.
- Eventuali asset prodotti con AI sono ammessi **solo come materiali di partenza**: devono essere rifiniti, coerenti con le immagini esistenti, registrati su coordinate fisse, con trasparenze pulite e senza cambi di identità/stile fra frame. Se non hai uno strumento di generazione immagini a disposizione, NON dichiarare di averlo usato: prepara prompt/brief precisi e integra gli asset esistenti dove possibile.
- Se un asset non è idoneo, sostituiscilo invece di compensare con più effetti CSS.

## 2. Sei reazioni, con richieste specifiche

### A. MANIPOLAZIONE — massima priorità artistica

**Problema:** oggi la foglia sembra una PNG ruotata su un piano rigido.

**Risultato desiderato:** la foglia viene effettivamente mossa dal Nen, **galleggia** e reagisce all'acqua. Non deve girare come un'icona.

- Mantieni la foglia sulla superficie ellittica, a scala/prospettiva credibile; non affondarla né farla uscire dai bordi del vetro.
- Crea **almeno 6–10 pose chiave coerenti** della medesima foglia, con lieve torsione e flessione della lamina, microcambi di silhouette e inclinazione; preserva nervature, silhouette di base, spessore, tinta e illuminazione. Non generare una foglia diversa a ogni frame.
- Anima un avvio graduale, poi una traslazione curva non troppo ampia, una variazione di orientamento organica e un assestamento finale. La rotazione può esistere, **ma non può essere l'unico effetto**. Vieta spin continui, giri su se stessa da icona, sinusoidi con frequenza evidente e oscillazioni fuori controllo.
- Aggiungi piccoli movimenti di beccheggio/rollio o deformazione *sottile* coerenti con la foglia galleggiante; usa 2.5D mesh/warp, morph di sprite o frame-by-frame. La deformazione deve essere stabile e non gelatinosa.
- L'acqua deve rispondere al **punto di contatto della foglia**: piccola scia/onde tenui che nascono dove la foglia passa e si smorzano, anziché tre cerchi uniformi indipendenti dal movimento.
- Effetto finale leggibile e immobile (o lievemente assestato), senza reset brusco.

**Criterio di accettazione:** guardando un breve filmato senza nome del Nen, l'utente vede una vera foglia che galleggia e viene spinta da una forza invisibile; non una texture ruotata con `ctx.rotate()`.

### B. POTENZIAMENTO

L'acqua **aumenta di volume**, sale fisicamente fino all'orlo e poi trabocca.
- La superficie sale lungo la geometria vera del bicchiere, con menisco coerente e lieve tensione superficiale prima del traboccamento; non basta spostare una striscia di texture.
- Straripamento asimmetrico: una o due piccole correnti aderiscono esternamente al vetro con forme e larghezze che evolvono nel tempo. Non incollare una colatura sempre identica in 2–3 fasi.
- Gocce nascono dall'estremità delle colature, accelerano e impattano sul tavolo. Gli impatti sono piccoli, sobri, coerenti con lo stile anime. A fine animazione restano livello alto e leggera superficie bagnata, **non** gocce sospese.
- Se l'atlas corrente di colature appare troppo brillante/fotorealistico, ridisegnalo/rifiniscilo con il tratto cel-shaded della scena.

### C. EMISSIONE

L'acqua cambia **colore**, non la stanza né la foglia.
- Diffusione morbida e non uniforme ma controllata nella massa del liquido; evita il semplice rettangolo/gradiente in modalità `multiply` che sembra un filtro.
- Mantieni riflessi, rifrazione stilizzata, trasparenza e bordi del bicchiere coerenti.
- L'effetto deve essere immediatamente riconoscibile senza saturazioni esagerate. A fine animazione il colore deve rimanere nel bicchiere.

### D. MATERIALIZZAZIONE

Compaiono **impurità/depositi dentro l'acqua**, non scintille, emoji, coriandoli o polvere fuori dal bicchiere.
- Predisponi 3–5 famiglie di microresidui illustrate con differenze sobrie di forma e dimensione, non ripetizioni ovvie dell'identica sprite.
- Comparsa graduale e non uniforme in profondità, con parallax minimo, sedimento che scende/ruota lentamente, alcuni residui che si fermano o restano sospesi.
- Evita griglie o distribuzioni modulari evidenti (`i * costante % n` senza jitter deterministico coerente); niente movimento fisico impossibile.
- Preserva l'occlusione e i riflessi del vetro, senza residui sul bordo anteriore.

### E. TRASMUTAZIONE

Il **sapore** dell'acqua cambia (esempio di Killua), mentre l'aspetto rimane sostanzialmente uguale. Questa è una scelta canonica, non un bug.
- Mantieni l'acqua limpida. Se necessarie, minime increspature iniziali e poi quiete, senza bolle luminose o cambi cromatici inventati.
- Lascia che sia Wing a rendere riconoscibile l'evento con una breve battuta IT/EN naturale (ad esempio: «È diventata dolce.» / «It tastes sweet.»), associata alla corretta fase della timeline.
- Per dare soddisfazione visiva, lavora sul **timing cinematografico** (silenzio, piccola reazione, focus) invece di inventare un effetto contrario al manga.

### F. SPECIALIZZAZIONE

**Preserva la versione esistente**, che l'utente trova già convincente.
- Mantieni la manifestazione specifica della foglia che si secca/appassisce, si scurisce, si frammenta e si disgrega, come nel caso di Neferpitou; non presentarla come comportamento universale di ogni Specialista.
- Cambia solo eventuali glitch di continuità, mascheratura o sovrapposizione. Non rigenerare automaticamente l'atlas che funziona.

## 3. Pipeline grafica: prima correggi i materiali, poi il timing

1. **Audit e baseline.** Con la pagina `review/divination.html`, registra ciascun effetto attuale con Playwright o altro metodo reale. Salva frame a 0%, 25%, 50%, 75%, 100% e una breve clip per ciascuno, sia desktop sia mobile. Crea una tabella con difetti *osservati*, causa probabile e soluzione. Conserva una copia di confronto. Non dichiarare «qualità verificata» basandoti solo sui test JS.
2. **Asset sorgente.** Valuta se il raster `unified-goblet-scene.png` può essere separato in foglia pulita, superficie senza foglia, interno acqua, bordo/riflessi davanti e colature esterne. Documenta coordinate native, maschere, alpha e margini. Non modificare l'illustrazione del personaggio o la stanza.
3. **Sprite della foglia.** Genera o prepara pose coerenti della **stessa foglia**, preferibilmente una sequenza PNG trasparente o un atlante con frame registrati tutti sullo stesso pivot. Puoi usare Krita/OpenToonz o tool di image generation + ritocco. Prevedi interpolazione/warp solo dove migliora la fluidità; non limitarti a `rotate`/`scale` di un solo PNG.
4. **Acqua.** Correggi l'estrazione della superficie per eliminare qualunque impronta fantasma. Costruisci onde molto delicate che reagiscano agli eventi; la trasparenza del vetro è più importante dei riflessi aggiunti.
5. **Nuovo compositing.** Riusa Canvas 2D se sufficiente; valuta un renderer mesh/WebGL solo se la deformazione della foglia richiede davvero triangolazione di vertici. **Non migrare a PixiJS solo per il gusto di cambiare libreria.** Se migri, presenta prima pro/contro e fai un piccolo test sull'unica scena di Manipolazione.
6. **Performance.** Precarica asset e atlas, evita flash e duplicazioni, usa `requestAnimationFrame` e `devicePixelRatio` ragionevole, ottimizza frame/texture per iPhone e desktop; non usare immagini video pesanti per ogni tipo. Non generare file di test enormi destinati alla build GitHub Pages.
7. **Stato finale.** Ogni effetto deve restare visibile dopo la fine, senza ultimo frame nero, reset, salti o overlay scomparsi. Funzionamento con press-and-hold e risultati esistenti invariato.

## 4. Modalità revisione e QA

Mantieni e migliora `http://localhost:5173/review/divination.html` con controlli: tipo Nen, play/ripeti, pausa, slider temporale, confronto prima/dopo (facoltativo), mobile/desktop, stato finale. Verifica soprattutto i frame intermedi, che sono quelli in cui l'effetto artificiale si nota di più.

**Per ciascuno dei sei effetti:**
- [ ] L'animazione inizia, evolve e termina senza errori.
- [ ] Il fenomeno è riconoscibile senza il testo del risultato, **eccetto Trasmutazione** che dipende intenzionalmente dalla battuta di Wing.
- [ ] Nessuna deformazione casuale del bicchiere o del vetro, nessuna foglia duplicata, nessuna texture fantasma.
- [ ] La scena conserva esattamente lo stile anime della baseline.
- [ ] Non si vedono sprite appoggiati con bordo/illuminazione incompatibili.
- [ ] Frame coerenti su 390×844 e 1440×900, senza cropping e traslazioni sbagliate.
- [ ] Pause/seek/replay riproducibili: stesso tempo = stesso frame e nessun accumulo di particelle.
- [ ] Prestazioni fluide su un telefono reale o emulazione ragionevole; rispettare `prefers-reduced-motion`.
- [ ] Esito e stato finale persistono nella scheda finale.

Se il test visivo fallisce, non nascondere il problema dietro una descrizione positiva: prepara una nuova versione dell'asset o della timeline. Mantieni le clip di confronto **fuori da `public/` e da Git**, a meno che non siano piccole risorse effettivamente necessarie.

## 5. Cosa NON fare

- Non cambiare il disegno approvato di Wing, tavolo, tappeto, mani, vetro, luci ambientali o UI.
- Non modificare le 24 domande, le traduzioni, la logica dei bonus, i punteggi, il radar o la scheda finale (salvo sincronizzazione dell'ultimo frame animato).
- Non utilizzare risposte colorate, icone di tipo Nen o animazioni decorative non richieste durante il quiz.
- Non usare filtri globali, glow, linee azzurre verso il bicchiere, particelle fantasy, effetti 3D o animazioni da presentazione.
- Non rigenerare Specializzazione se non ci sono difetti verificati.
- Non dichiarare disponibili software, generatori di immagini o strumenti che nell'ambiente Codex non sono realmente accessibili.
- Non fare push, merge o deploy senza richiesta esplicita.

## 6. Consegna richiesta a Codex

Concludi il lavoro implementando e testando **tutte e sei le animazioni**, non solo documentando idee. Indica:
1. Causa concreta dei difetti della versione precedente, distinguendo riscontri visivi da lettura del codice.
2. Asset sostituiti/aggiunti e rispettive dimensioni, origine, stato di alpha.
3. File di codice modificati e scelta del motore di rendering.
4. Dove vedere i sei effetti in anteprima e percorso delle clip/frame di confronto locali.
5. Risultati di `npm.cmd test`, `npm.cmd run build`, `npm.cmd run test:build` ed E2E pertinenti.
6. **Limitazioni residue reali**, se presenti. Se la qualità desiderata non è raggiungibile con gli asset attuali, indica precisamente i PNG/frame da generare (numero di frame, dimensioni, pivot, prospettiva, maschere) anziché sostituirli con effetti mediocri.

**Ordine interno consigliato:** audit → Manipolazione (priorità più alta) → Potenziamento → Emissione → Materializzazione → Trasmutazione → regressione di Specializzazione → QA mobile/desktop. È una sequenza di sviluppo, non un permesso per fermarsi dopo la prima categoria.

**Criterio di riuscita complessivo:** si deve percepire un breve momento di anime con sei trasformazioni coerenti e particolari, non un'immagine statica con oggetti PNG spostati sopra.
