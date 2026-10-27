# Verifica del prototipo

## Ripresa V2 — fondale ed espressioni, 27 ottobre 2026

- **25/25 test unitari superati.** Dataset, punteggi, selettori, bonus e state machine senza modifiche.
- **22 scenari browser applicabili verificati:** i 16 scenari del flusso esistente sono passati nella suite completa; il fallback della posa è passato e i cinque scenari visivi sono stati ripetuti con successo dopo aver corretto due aspettative del nuovo test (scelta casuale simulata e durata quasi nulla del movimento ridotto). La ripetizione mirata finale conta 6 superati e 4 esclusi; gli esclusi totali della suite sono 8, perché sei risultati e fallback sono verificati soltanto su desktop.
- Quattro pose caricate; cambio reale di espressione, stabilità al cambio lingua e alla navigazione indietro, geometria di Wing invariata e fallback al neutro quando una posa non si carica. Verificati Chrome desktop/tablet/mobile e WebKit mobile.
- Fondale con tappeto e crepe controllato negli screenshot intro, quiz e reazione in `.verification/v2/`. Nessun overflow nelle quattro dimensioni verificate; mani/calice conservati: SHA-256 del file usato in anteprima identico al riferimento originale.
- Build normale e `local-review` compilate e verificate sotto `/nen-divination/`, compresi flusso completo, richieste asset e PNG. La build normale esclude `assets/scene-v3/`; la build di revisione include solo muro e quattro pose di quella cartella.
- Fonte dei PNG di Wing non registrata; ritratti ancora mancanti. Il fondale è generato dal riferimento su richiesta dell'utente, non un fotogramma autentico. Nessuna pubblicazione effettuata.

## Revisione V2 — 27 ottobre 2026

- **22/22 test unitari superati:** 18 originali invariati e 4 per Tenrai (alias, ambiguità, ID, URL, errori e risposta incompleta).
- **21 scenari browser superati, 4 esclusi intenzionalmente:** Chromium desktop 1440 × 900, tablet 768 × 1024, mobile 390 × 844, piccolo mobile 320 × 568 e WebKit mobile. I sei effetti sono verificati insieme sul desktop; le altre viewport eseguono comunque flusso completo, hold, esportazione e replay. Il test di composizione piccolo mobile usa anche 320 × 700.
- Dopo la rifinitura della maschera foglia, ripetuto con successo il test dei sei risultati. Controlla cambiamenti effettivi dei pixel nell'acqua, mani invariate, rimozione della foglia originale in Specialization, canvas conservato al cambio lingua e ripristino dei pixel iniziali al replay.
- Build normale e `local-review` compilate e giocate sotto `/nen-divination/`, fino al risultato e al download PNG. La revisione carica il canvas con i riferimenti locali; la build normale non include tali immagini e segnala gli asset assenti.
- **Tenrai live verificato:** HTTP 200, 205 record, 18/18 identità abbinate. Nomi, ID MAL e URL osservati salvati in `src/data/characterImages.json`. AniList non necessario. Permessi immagini non verificati, nessun ritratto copiato in `public/`.
- Screenshot di risultato aggiornati in `.verification/`, compresi i sei effetti; intro, quiz e reazione in `.verification/v2/`. Scheda più compatta, titolo senza interruzioni a metà parola, personaggi scorrevoli su mobile e assenza di overflow orizzontale della pagina.
- Dataset, calibrazione, selettori e state machine senza modifiche, verificato con diff Git. Nessuna nuova calibrazione necessaria.
- Limiti: Wing statico, montaggio scenico provvisorio, mani non isolate, artefatti possibili nelle maschere acqua/foglia, ritratti non disponibili nell'app. I test non certificano la fedeltà finale al riferimento. Dettagli in [ASSET_STATUS.md](ASSET_STATUS.md).

Le sezioni seguenti conservano gli esiti storici delle revisioni precedenti.

## Storico: prima fase V2 — 26 ottobre 2026

- Audit iniziale: 18/18 test preesistenti superati prima delle modifiche.
- Dopo redesign: 21/21 test unitari superati (18 invariati + 3 sull'importatore Jikan).
- Browser: 17 scenari superati, 3 saltati intenzionalmente perché i sei risultati sono già coperti sul desktop. Chromium desktop/mobile, touch reale simulato via CDP e WebKit mobile; screenshot di intro/quiz/reazione salvati in `.verification/v2/`.
- Nuovi controlli: domanda dentro la scena, immagini caricate, assenza dello stepper, selezione e ordine stabili col cambio lingua, quarta risposta raggiungibile con scroll interno, nessun overflow pagina, geometria di Wing invariata tra intro/quiz/intermezzo. Verifica aggiuntiva tablet 768×1024.
- Build normale e build `local-review` compilate e giocate sotto `/nen-divination/`. I quattro ritagli della build locale vengono caricati correttamente; nessun riferimento privato entra nella build normale.
- Nessuna modifica a dataset, calibrazione e motore del quiz (verificato con diff Git). Nessuna nuova calibrazione necessaria.
- **Jikan live non verificabile:** timeout HTTPS; zero ritratti importati. I test dell'importatore usano risposte controllate.
- **Fedeltà visiva non completata:** Wing statico, fondale adattato, asset separati mancanti, divinazione e risultato ancora V1. Vedi [ASSET_STATUS.md](ASSET_STATUS.md). La build normale senza gli asset mostra un avviso, non la scena dell'anteprima.

Le sezioni successive documentano la verifica della V1; non attestano la fedeltà grafica della V2.

## Calcolo e simulazione

Costanti originali `score_calibration.json`, dataset originale `questions_scoring.json`. Nessuna modifica ai pesi o alla soglia 0,35. Seed della calibrazione: `20261026`; seed indipendente della regressione: `20261117`.

`npm run test:simulation` esegue 30.000 tentativi uniformi completi, con selezione bilanciata delle aree, opzioni mescolate e domande bonus adattive realmente applicate.

| Tipo | Vittorie nel modello uniforme |
| --- | ---: |
| Enhancement | 16,453% |
| Emission | 16,607% |
| Transmutation | 16,693% |
| Conjuration | 17,557% |
| Manipulation | 17,130% |
| Specialization | 15,560% |

Tutti i valori sono entro ±2 punti percentuali da 16,667%. Partite terminate dopo sette domande: **19.218**; dopo otto: **7.013**; dopo nove: **3.769**. Nessun tentativo supera nove domande.

I 6.000 profili sintetici (1.000 per tipo, scegliendo le opzioni con il peso più alto per il tipo bersaglio) raggiungono il bersaglio con queste frequenze: Enhancement 99,5%; Emission 99,3%; Transmutation 100%; Conjuration 100%; Manipulation 99,6%; Specialization 100%.

Questi sono controlli del software e del modello nullo, **non misure di validità psicologica o di accuratezza su persone reali**. La tolleranza ammette i piccoli squilibri della scelta adattiva. Non è stata ricalibrata la tabella per avvicinare artificialmente la simulazione alle percentuali attese.

## Copertura automatica

- 18 test Vitest: integrità del dataset, testi IT/EN, Heavens Arena, sei aree, area extra uniforme, bonus standardizzato e deterministico, personaggi, baseline, costanti, scaling 7/8/9, spareggi, radar, risultato indipendente da `Math.random`, indietro, risposte conservate, reazione dopo la quarta, invalidazione dei bonus, replay e preferenza lingua.
- Playwright: desktop 1440 × 900, mobile 390 × 844, mobile 320 × 568 e WebKit mobile. Le rivelazioni vengono testate tutte su desktop; il flusso completo e l’esportazione vengono ripetuti per ogni viewport/motore.
- Pressione reale mouse e touch Chromium, pressione da tastiera, rilascio anticipato, pointercancel, tasto destro, blur e alternativa con movimento ridotto.
- Stessa scena DOM conservata, sei tipi ottenuti dalle risposte, effetti finali, tre schede, cambio lingua, ritorno e replay.
- PNG con dimensioni lette dall’header binario, download, fallback condivisione e flusso offline dopo il caricamento.
- Build Vite e avvio della build sotto `/nen-divination/`, controllando richieste HTTP e assenza dei file di riferimento.

Gli screenshot in `.verification/` sono output locali di controllo e non sono asset pubblicati. L’assenza di overflow orizzontale viene verificata a ogni viewport.

Esecuzione sul prototipo: **18/18 test unitari superati**. I **13 scenari browser applicabili** sono stati verificati con successo, inclusa la ripetizione mirata del flusso WebKit dopo la correzione di un selettore del test. I tre casi “sei rivelazioni” sulle viewport mobili sono esclusi intenzionalmente, perché il caso completo viene già eseguito su desktop; ciascuna viewport mobile esegue comunque flusso, esportazione e hold. La verifica della build sotto il percorso Pages è superata.

## Limiti della verifica

Il test WebKit usa il motore di Playwright su Windows, non un iPhone fisico. Android Chrome e Safari iOS su dispositivi reali, il pannello nativo del sistema per la condivisione e un deployment effettivo sull’account GitHub dell’utente richiedono una verifica successiva. Non sono stati aggiunti account o credenziali.

I ritratti autentici autorizzati sono assenti. Composizione e gerarchia sono implementate, ma la fedeltà dei personaggi al reel/mockup non può essere verificata senza asset approvati. Vedi `ASSETS.md`.
