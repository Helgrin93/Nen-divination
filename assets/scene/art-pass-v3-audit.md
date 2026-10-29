# Art pass V3 — baseline osservata

Prima di modificare il renderer sono state registrate dodici clip reali, una per effetto su 1440×900 e 390×844, e catturati i frame esatti 0/25/50/75/100%. Materiale conservato in `.verification/divination-art-v3/baseline/`, insieme al sorgente precedente e agli hash degli asset. Le clip sono state riprodotte e decodificate; `desktop-video-contact.png`, `mobile-video-contact.png` e i file `*-video-playback.json` documentano i punti ispezionati. I valori seguenti distinguono ciò che si vede dalla causa dedotta dal codice.

| Effetto | Riscontro visivo nei frame/clip | Causa nel renderer | Correzione prevista |
| --- | --- | --- | --- |
| Manipolazione | Nervature e lamina restano rigide mentre l'orientamento cambia molto; le onde non seguono la scia. La superficie scoperta appare uniforme. | Un solo bitmap, rotazione rigida di 137°, traiettoria sinusoidale; tre anelli con origine indipendente. | Dieci pose della stessa texture deformata con mesh, intercalazioni registrate, percorso con accelerazione/inerzia e onde nei punti di contatto. |
| Potenziamento | Superficie simile a una striscia sollevata; rivoli sottili e brillanti, cambiamento di silhouette limitato. | Traslazione della superficie raster, due disegni di colatura, gocce con origini prefissate. | Superficie completa rimappata nel volume, menisco, otto disegni cel rifiniti e registrati; gocce nate dall'estremità effettiva. |
| Emissione | La coppa assume una tinta progressiva abbastanza uniforme, simile a un filtro. | Rettangolo con gradiente moltiplicativo sotto la maschera. | Maschere illustrate di diffusione irregolare nel volume e sprite del liquido che conserva la luminanza originale. |
| Materializzazione | Puntini poco leggibili, con spaziature ripetute nei dettagli ingranditi; profondità debole. | Posizioni modulari, sette sprite simili, pochi gruppi di traiettorie. | Cinque famiglie illustrate, distribuzione deterministica non periodica, profondità e assestamenti individuali. |
| Trasmutazione | L'acqua resta limpida e il messaggio compare nella seconda parte; le increspature sono regolari. | Tre onde cicliche per l'intera sequenza. | Un impulso iniziale che si estingue, pausa visiva e battuta breve di Wing alla fase corretta. |
| Specializzazione | Scurimento, rottura e piccoli frammenti formano una sequenza coerente. | Atlante illustrato e tempi esistenti. | Conservazione integrale; confronto esatto dei canvas nei cinque punti temporali. |

## Sorgenti e composizione

Riferimento immutabile: 1536×1024. Il canvas coincide con il rettangolo della scena; ritaglio locale `(443,560,650,442)` in unità 1000×680. La foglia originale occupa circa `(713,613,113,28)` nello spazio nativo. La riparazione alpha resta a `(650,600)`, 240×60. Il vetro non viene rigenerato. La superficie segue l'ellisse locale centrata in `(500,105)`; le maschere del bordo e dei riflessi precedono le colature esterne.

Scelta del motore: Canvas 2D. La mesh è usata nella preparazione delle pose, con 16×7 celle triangolate e pivot fisso; il runtime riproduce un atlante. Questo evita una nuova libreria, triangolazione per frame e filtri globali. Gli asset AI restano materiali di partenza: alpha pulito, ritagli e registrazione avvengono prima della pubblicazione. Nessuna modifica alla UI o agli asset approvati della scena.
