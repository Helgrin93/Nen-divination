# Livelli necessari per le sei divinazioni

Stato al commit `a23403b`: **materiale insufficiente per superare la verifica di qualità dei prototipi**. Questo documento specifica la consegna grafica; non dichiara implementate le sei animazioni.

## Materiale verificato

| File esistente | Dimensioni | Trasparenza misurata | Utilità e limite |
| --- | --- | --- | --- |
| `public/assets/divination/water-clean.png` | 1536 × 1024 | 0 pixel trasparenti o semitrasparenti | Fondale completo con foglia rimossa. Nella sua impronta resta una forma marrone allungata; non è una superficie pulita sufficiente per spostare visibilmente la foglia. Acqua, vetro e riflessi restano fusi. |
| `public/assets/divination/table-clean.png` | 1536 × 1024 | 0 pixel trasparenti o semitrasparenti | Fondale senza mani. Contiene ancora foglia, acqua e calice; non separa i materiali. Il renderer approvato delle mani continua a usarlo senza modifiche. |
| `public/assets/divination/hands-poses.png` | 1254 × 1254 | 969.543 pixel trasparenti, 600.843 semitrasparenti | Atlante delle tre pose già approvate. Si conserva integralmente; non è un asset per l'acqua. |

`public/assets/scene-v3/unified-goblet-scene.png` è il riferimento immutabile 1536 × 1024, completamente opaco. Contiene già foglia, acqua, vetro, riflessi e ambiente nello stesso raster.

Il confronto di `water-clean.png` con il riferimento rileva differenze RGB in 1.564.983 dei 1.572.864 pixel (99,50%; scarto medio per canale 2,40/255). Nell'area della bocca `(660,580,220,85)` lo scarto medio è 10,76/255. Questo non dimostra da solo uno spostamento geometrico: conferma che il file è un ridisegno completo e non una cancellazione esatta dei soli pixel della foglia. Il difetto determinante per la Manipolazione è la sagoma residua, visibile nel confronto ingrandito.

## Consegna prioritaria: Potenziamento e Manipolazione

Preferire un sorgente a livelli PSD, KRA o ORA registrato sulla scena approvata. Da questo esportare PNG RGBA sRGB a **1536 × 1024**, con origine in alto a sinistra `(0,0)`. La somma dei livelli al tempo zero deve ricostruire il bicchiere approvato, con lo stesso livello iniziale. Non ridisegnare Wing, tappeto, mani, stanza o tavolo fuori dall'area bagnata del Potenziamento.

| Livello richiesto | Contenuto | Serve a |
| --- | --- | --- |
| `cup-underlay.png` | Ricostruzione locale dietro acqua e foglia, senza la foglia né la sua ombra/impronta; sostituisce solo l'area concordata del bicchiere. Continuità del colore e della rifrazione con la scena. | Eliminare gli elementi impressi nel fondale prima di animarli. |
| `glass-back.png` | Parte posteriore del bordo e riflessi che devono stare dietro l'acqua. Trasparenza fuori dai tratti dipinti. | Conservare la profondità dietro superficie e foglia. |
| `water-body.png` | Volume dell'acqua con rifrazione e ombreggiatura anime, senza contorni del vetro, foglia o riflessi appartenenti al vetro. | Alzare realmente il livello; successivamente colorare soltanto il liquido. |
| `water-surface.png` | Superficie pulita senza foglia, con la prospettiva del riferimento, separata dai riflessi fissi del bordo. | Superficie che sale e increspature locali coerenti con il movimento della foglia. |
| `glass-front.png` | Bordo anteriore, spessore del vetro e riflessi frontali, separati dal liquido. | Occludere foglia, acqua e impurità senza colorare o duplicare il vetro. |
| `leaf.png` | Foglia originale scontornata, incluse nervature e picciolo; nessun alone d'acqua, vetro o sfondo nel bordo alpha. | Movimento controllato sulla superficie; base per l'appassimento successivo. |
| `overflow` | Sequenza illustrata di colature asimmetriche aderenti alla coppa, dai primi veli alla separazione delle gocce. Forme irregolari, luce e spessore coerenti con il vetro. | Evitare i due semplici tratti procedurali dell'implementazione attuale. |
| `droplets` | Piccola sequenza di distacco, caduta e impatto, con posizioni e tempi indicati. | Accelerazione delle gocce, impatto sul tavolo, assenza di gocce congelate a fine effetto. |
| `table-wet.png` | Macchia bagnata irregolare e sottili riflessi coerenti con le venature originali; trasparente fuori dall'impronta. | Stato finale del Potenziamento, senza una semplice ellisse sovrapposta. |
| Maschere | Interno del liquido; superficie; bordo anteriore; riflessi del vetro; piede del calice; impronte di occlusione delle mani esistenti. | Impedire sbordi, aloni, colature davanti al piede o alterazioni delle mani. |

Le maschere esistenti in `sceneGeometry.js` restano il riferimento di registrazione. Si possono derivare maschere di supporto dal disegno approvato: non è necessario chiedere nuovi disegni per ogni maschera. La separazione dei materiali, invece, deve essere controllata su un sorgente a livelli o dipinta e verificata appositamente; una maschera non ricostruisce automaticamente il colore dietro una foglia o un riflesso.

Le sequenze possono essere PNG full-frame oppure atlas ritagliati. Per ogni frame ritagliato consegnare `sourceRect`, `sceneRect` e `durationMs`: `sceneRect` rimane sempre nello spazio 1536 × 1024. Nessun auto-centering, ridimensionamento indipendente o ritaglio senza offset. Le fasi di colatura e impatto devono terminare; l'ultimo frame mantiene superficie al bordo e tavolo bagnato, senza gocce sospese.

La scena originale è quasi piena: l'escursione visibile disponibile è circa 10 pixel nativi. Non abbassare arbitrariamente il livello iniziale per rendere l'effetto più evidente; la leggibilità su smartphone deve venire soprattutto dal traboccamento illustrato e dalla superficie bagnata.

## Materiale successivo, dopo la verifica dei primi due prototipi

| Effetto | Materiale aggiuntivo | Criterio canonico richiesto |
| --- | --- | --- |
| Emissione | Nessun nuovo disegno se volume e riflessi sono separati correttamente. Il colore può essere applicato al solo livello del liquido. | Cambia progressivamente il colore dell'acqua; restano invariati vetro, foglia e ambiente. |
| Trasmutazione | Nessun nuovo sprite. Messaggio di Wing, in entrambe le lingue, che riferisce il cambiamento di sapore. | Liquido dall'aspetto naturale: niente bolle, scintille o altri fenomeni presentati come prova visiva del gusto. |
| Materializzazione | Piccolo atlante di impurità irregolari con varianti di forma, tono e profondità. | Comparsa distribuita nel volume, con occlusioni e profondità; evitare cristalli tutti uguali o un semplice effetto particellare luminoso. |
| Specializzazione | Stati della stessa foglia: perdita di turgore, scurimento, bordi fragili, rottura e frammenti corrispondenti alla sagoma iniziale. | Manifestazione di Neferpitou indicata esplicitamente nel dialogo, senza attribuirla a tutti gli Specialisti. |

Il requisito «riconoscibile senza leggerne il nome» non può valere per il gusto senza contraddire il requisito canonico della Trasmutazione. In questo caso il risultato si comunica con il dialogo di Wing: l'acqua deve restare visivamente naturale.

## Renderer e ordine dei livelli

Scelta tecnica proposta: **Canvas 2D**, mantenendo il canvas e le coordinate native già corretti. Il disegno di sprite/atlas è supportato da [`drawImage`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage), mentre maschere e compositing locale sono supportati dalle [operazioni di composizione](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation). È una scelta progettuale per questa scena limitata, da confermare con misure sui prototipi, non un benchmark già eseguito.

[PixiJS 8](https://pixijs.com/8.x/guides/components/renderers) offre rendering GPU WebGL/WebGPU. Potrà servire se emergerà un costo di rendering misurabile, ma non separa automaticamente acqua e vetro in un raster già fuso. Aggiungerlo ora non risolve il blocco grafico e comporta un cambio di renderer non ancora giustificato. Nessuna nuova dipendenza installata.

Ordine previsto: sfondo approvato → ricostruzione locale → vetro posteriore → volume e impurità → superficie → foglia/frammenti → vetro anteriore → colature esterne → gocce/macchia con occlusioni di piede e mani. I livelli di Wing e delle mani rimangono quelli esistenti.

## Ripresa del lavoro e verifica

1. Validare la ricomposizione ferma contro la scena: nessuna variazione fuori dal bicchiere e dalle regioni esplicitamente animate.
2. Realizzare soltanto Potenziamento e Manipolazione nella pagina di sviluppo già esistente `review/divination.html`, con selezione diretta, riavvio e ricerca temporale deterministica. In produzione la pagina e i controlli devono restare assenti.
3. Catturare inizio, metà e fine più video Playwright in tempo reale su desktop 1440 × 900 e mobile 390 × 844. Verificare la silhouette della foglia in movimento e la leggibilità del traboccamento senza etichette.
4. Ispezionare i video confrontandoli con il riferimento anime: ombreggiatura cel, riflessi aderenti al vetro, massa del liquido, foglia che resta sul piano dell'acqua. I test di pixel non sostituiscono questa valutazione.
5. Soltanto se entrambi superano la verifica visiva, estendere agli altri quattro. Mantenere pressione di 4,5 secondi, reazione iniziale discreta, posa approvata e stato finale persistente; raccordare il timer di rivelazione alla durata effettiva senza cambiare il layout del risultato.

Riferimenti locali ispezionati: `reference/ANIME_HANDS_GLASS_REFERENCE.png` e `reference/REEL_CONTACT_SHEET.jpg`. Il primo mostra un calice con riflessi anime aderenti alla coppa; il secondo usa un bicchiere diverso e non è un atlas riutilizzabile nella scena approvata. Questi riferimenti non forniscono i livelli di produzione mancanti.

## Audit ripetibile e stato della consegna

Con il server Vite già avviato:

```powershell
npm.cmd run dev
# In un secondo terminale:
node scripts/audit-divination-layers.mjs
```

È possibile usare un'altra origine locale tramite `DIVINATION_AUDIT_URL`. Lo script legge gli asset, misura dimensioni/alpha/differenze, registra gli hash e salva `.verification/divination-layer-audit/audit.json` e `source-comparison.png`. Non modifica i PNG né i renderer.

**Fermo agli asset mancanti**, secondo la richiesta. Non sono stati prodotti nuovi prototipi, sei anteprime funzionanti, screenshot temporali o video delle sei trasformazioni: registrarli ora significherebbe documentare le animazioni precedenti o effetti sostitutivi non accettabili. Nessuna modifica a `WaterScene.js`, Wing, CSS, mani, domande, punteggi, grafica finale o dipendenze. Nessun push.
