# Verifica del prototipo

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
