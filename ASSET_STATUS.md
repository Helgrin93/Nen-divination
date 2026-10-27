# Nen Divination V2 — stato della revisione locale

Aggiornato il **27 ottobre 2026**. La scena di divinazione e la scheda risultato V2 sono integrate nell'anteprima; la fedeltà grafica finale resta incompleta per gli asset elencati sotto. Nessun push o deploy eseguito.

## Ripresa: muro con tappeto e quattro espressioni

Su richiesta dell'utente, il muro dietro Wing mostra un tappeto con bordi teal, verde, ocra e rosso e piccole crepe che spuntano ai lati. `public/assets/scene-v3/wall-rug.png` è un fondale senza personaggi, generato con imagegen dal riferimento allegato; prompt completo in `assets/scene/wall-rug.prompt.md`. È un livello separato: file e animazioni di mani, bicchiere e foglia restano invariati, così come layout delle risposte e risultato.

Collegati i quattro PNG trasparenti già presenti in `public/assets/scene-v3/`: neutro, sorriso, occhi chiusi e gesto. Dissolvenza di 240 ms, disattivata con movimento ridotto. Le reazioni occasionali preesistenti mantengono la stessa espressione cambiando lingua, selezionando una risposta o tornando indietro. Se una posa manca, resta visibile quella neutra. Provenienza dei quattro PNG ancora da registrare: non sono certificati come fotogrammi autentici.

La build normale esclude ora anche `assets/scene-v3/`, che Vite avrebbe altrimenti copiato automaticamente da `public/`. La build `local-review` include il fondale e le quattro pose, senza i due file sorgente inutilizzati `composition-source.png` e `background-source.png`.

## Correzione definitiva delle risposte quiz

Applicate le indicazioni testuali del 27 ottobre: quattro riquadri bianchi traslucidi, angoli arrotondati, lettere A–D a sinistra con separatore verticale sottile e testo scuro. Due colonne su desktop con spazio per il bicchiere, una colonna con scroll interno su smartphone. Hover e selezione chiari e sobri; rimossa anche la spunta colorata dalla risposta selezionata. Domanda nella vignetta bianca con triangolino verso Wing. L'allegato mostrava risposte scure con simboli: per le risposte prevale l'esplicita richiesta testuale di eliminarli. Scena, animazioni e scheda finale conservate.

## Scheda finale compatta

Applicata la richiesta del 27 ottobre: mantenere la composizione di `reference/RESULT_TARGET_EXACT.png`, con minore sviluppo verticale e le stesse mani della divinazione.

- Hero più basso; stessa immagine, stesso canvas ed effetto finale conservati dalla prova al risultato.
- Titolo serif luminoso senza parole spezzate; descrizione e seconda affinità a sinistra, radar a destra su desktop/tablet.
- Radar con valori reali e colori delle sei categorie; una sola spiegazione espandibile dei punteggi relativi.
- Pannelli e spaziature ridotti. “Cosa significa” resta espandibile; la descrizione dell'effetto è già sul bicchiere e non viene duplicata nel pannello.
- Tre schede personaggio affiancate su desktop; fascia orizzontale scorrevole con tastiera/touch su mobile, per evitare tre schede impilate molto alte.
- Azioni Salva/Condividi affiancate e Riprova su seconda riga nei telefoni. Tutto il testo rimane DOM; radar SVG interattivo/accessibile.

Il riferimento resta una guida compositiva: le mani sono quelle della scena anime disponibile, come richiesto; i ritratti non sono stati copiati dal mockup. L'ordine degli assi radar e i dati del quiz restano invariati.

## Divinazione integrata

`WaterScene.js` anima acqua e foglia su canvas sopra `ANIME_HANDS_GLASS_REFERENCE.png`. Sei effetti: aumento dell'acqua, colore, riflessi per il sapore, cristalli, rotazione della foglia, annerimento e frammentazione. Durata 2,5 s; hold di 4,5 s preservato per mouse, touch e tastiera, con annullamento e alternativa accessibile. Movimento ridotto rispettato.

La foglia viene isolata con una maschera; la zona d'acqua sottostante viene interpolata da pixel vicini dello stesso riferimento. Non sono immagini generate AI. È una soluzione provvisoria: mancano livelli puliti, la ricostruzione può lasciare artefatti e le mani sono già presenti durante il quiz, senza ingresso indipendente.

## Catalogo Tenrai — importazione riuscita

Il 27 ottobre l'[endpoint richiesto](https://api.tenrai.org/v1/anime/11061/characters) ha risposto **HTTP 200 con 205 personaggi**. Tutti i **18 personaggi previsti** sono stati abbinati senza ambiguità. Jikan è stato sostituito nell'importatore; AniList non è stato necessario perché Tenrai è disponibile.

Il catalogo `src/data/characterImages.json` contiene nomi curati e nomi restituiti, ID MAL, URL fonte e immagine effettivi, provider, data, crediti e stato dei permessi. Le associazioni Nen in `src/data/characters.js` non sono importate dall'API e non sono cambiate.

| Nen | Personaggi e ID MAL verificati nella risposta |
| --- | --- |
| Enhancement | Gon Freecss 30; Isaac Netero 14489; Uvogin 5836 |
| Emission | Meruem 23277; Zeno Zoldyck 59; Razor 22518 |
| Transmutation | Killua Zoldyck 27; Hisoka Morow 31; Biscuit Krueger 13898 |
| Conjuration | Kurapika 28; Kite 20594; Shizuku Murasaki 5833 |
| Manipulation | Illumi Zoldyck 57; Morel Mackernasey 29806; Shalnark 5832 |
| Specialization | Chrollo Lucilfer 58; Neferpitou 12300; Pakunoda 5835 |

Shalnark è restituito come **Ryuseih, Shalnark**: aggiunto questo alias esatto, senza cambiare il nome visualizzato. Kurapika conserva la nota sugli occhi scarlatti; Shizuku resta nel catalogo al posto di Shoot del mockup.

### Immagini e permessi

I [termini Tenrai, §§3 e 6](https://tenrai.org/terms) consentono la memorizzazione delle risposte API, ma non concedono una licenza sulle immagini di terzi. La risposta non fornisce permessi specifici sui 18 ritratti. Tutti sono quindi `permissionStatus: unverified`; **nessun ritratto è stato scaricato in `public/assets/characters/`**, che contiene soltanto `.gitkeep`.

Gli URL sono metadati verificati, non immagini automaticamente abilitate nell'app. Nessun hotlink o chiamata all'API durante il quiz. La qualità/stile dei ritratti non è ancora stata verificata visivamente. Per un ritratto utilizzabile, registrare fonte e permesso in `ASSETS.md`, salvarlo localmente e compilare `portraitSrc` e `permissionStatus: authorized` nel catalogo curato.

Aggiornamento metadati: `npm.cmd run assets:characters`. Non richiede chiavi. Errori di rete, risposte vuote/incomplete o identità ambigue conservano il catalogo precedente. L'eventuale comando esplicito `--download-preview` mantiene i download soltanto nella cartella privata `.verification`; non attribuisce permessi e non pubblica immagini.

## Asset scenici effettivi e limiti

| Asset | Stato attuale |
| --- | --- |
| Wing | Quattro PNG preesistenti in `public/assets/scene-v3/`, integrati nell'anteprima locale; fonte e permessi non registrati. Il vecchio ritaglio resta disponibile ma non è montato. |
| Espressioni Wing | Neutro, sorriso, occhi chiusi e gesto, allineati nello stesso contenitore; dissolvenza e fallback al neutro. |
| Stanza | Fondale continuo `unified-goblet-scene.png`: muro con tappeto e crepe, tavolo, mani e calice nella stessa prospettiva. Generato con imagegen dai riferimenti del progetto. |
| Mani, calice e tavolo | Integrati nel fondale continuo; calice arrotondato con stelo e piede. Il vecchio riquadro anime ? conservato come riferimento, ma non montato nell?app. |
| Acqua/foglia | Maschere canvas e ricostruzione locale provvisoria; non asset trasparenti consegnabili. |
| Ritratti | 18 identità/URL recuperati; zero file autorizzati disponibili. |
| Result mockup | Solo guida visiva; nessun testo o ritratto estratto. |

Non si dichiara raggiunta la fedeltà anime finale. La provenienza dei PNG di Wing deve essere completata prima di qualsiasi uso pubblico. I vecchi SVG V1 restano nei sorgenti storici ma non sono montati nel flusso attuale.

## Verifica e anteprima

Screenshot aggiornati in `.verification/`: `desktop-result.png`, `tablet-result.png`, `mobile-result.png`, `small-mobile-result.png`, `mobile-webkit-result.png` e `effect-<tipo>.png`. Intro/quiz/reazione in `.verification/v2/`. Tutti esclusi da Git. Esiti dei controlli in `VALIDATION.md`.

- `npm.cmd run dev`: anteprima locale, normalmente http://localhost:5173/.
- `npm.cmd run assets:scene`: ricrea i montaggi privati con Vite già avviato.
- `npm.cmd run build:review`: build di revisione in `.verification/v2/dist`, con prefisso `/nen-divination/` e asset locali.
- `node scripts/verify-build.mjs --review`: verifica flusso e download PNG della build di revisione.
- `npm.cmd run build`: esclude i riferimenti privati e mostra un avviso per gli asset scenici assenti; **non è una release grafica V2 pronta da pubblicare**.

Dataset, 96 vettori, calibrazione, bonus e state machine sono invariati. Resta da completare il set di asset autorizzati e controllare la fedeltà visiva finale con l'utente.
