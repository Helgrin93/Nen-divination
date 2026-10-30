# Nen Divination V4 — come consegnarlo a Codex

## Prima di iniziare

L'app attuale deve restare funzionante e pubblicata sul ramo `main`. Questo pacchetto fornisce **istruzioni** e **riferimenti grafici**, non sostituisce il codice del progetto.

1. Estrai lo ZIP che contiene questa cartella.
2. Copia **l'intera cartella** `NEN_DIVINATION_V4_CODEX` nella cartella principale del repository locale `nen-divination`. Non cancellare o sovrascrivere i file esistenti.
3. Apri la cartella `nen-divination` in VS Code, avvia Codex.
4. Incolla il seguente messaggio:

   > Leggi integralmente `NEN_DIVINATION_V4_CODEX/NEN_DIVINATION_FINAL_POLISH_V4.md` e tutti i riferimenti `NEN_DIVINATION_V4_CODEX/references/`. Si tratta dell'incarico definitivo di rifinitura V4. Prima fai audit e crea un branch `final-polish-v4` **se la working tree è pulita**, poi esegui tutte le fasi del documento con test e commit di fase. Preserva i componenti già approvati e NON effettuare push né merge su `main`. Al termine consegnami `V4_FINAL_REPORT.md`, screenshot comparativi e istruzioni di verifica locale.

5. Controlla le modifiche in locale prima di pubblicarle. `main` non deve essere aggiornato automaticamente da Codex.

## Legenda dei riferimenti

- `references/RADAR_V4_APPROVATO.png`: **riferimento primario** per estetica radar, medaglioni, kanji, percentuali e layout.
- `references/ESAGONO_CANONICO_COLORI_POSIZIONI.png`: **autorità** per posizione/categoria/colore dell'esagono.
- `references/RADAR_ATTUALE_PROBLEMA_LABEL.png`: esempio del problema da risolvere, con etichette troppo vicine alla griglia.
- `references/MOBILE_QUIZ_ATTUALE_DA_RIFINIRE.png`: situazione mobile attuale: **non rifare da zero**, alzare la vignetta verso Wing.
- `references/INTERMEZZO_WING_STILE_APPROVATO.png`: riferimento per lo stile dell'intermezzo (senza riprodurre la posizione del pulsante che copre il bicchiere).
- `references/BONUS_COMMENTO_DA_SEPARARE.png`: frase bonus attualmente unita alla domanda: separare in un intermezzo.
- `references/SCHEDA_RISULTATO_LAYOUT_APPROVATO.png`: riferimento della **sola parte inferiore** (pannelli, descrizioni, radar, personaggi, azioni). **NON sostituire la scena superiore della build attuale**: mani e bicchiere reali dell'app devono restare.

## Attenzione alle immagini dei personaggi

I mockup illustrano l'obiettivo estetico, ma i 30 ritratti delle card devono provenire da immagini di personaggi autentici con fonti e possibilità d'uso verificate. Il pacchetto **non contiene 30 immagini autorizzate**. L'uso di un URL Tenrai/di un archivio non equivale a una licenza.

## Compatibilità Windows PowerShell

Se `npm` viene bloccato dalle policy di PowerShell, usa `npm.cmd` nei comandi di installazione/build/test. Non è necessario modificare la Execution Policy.
