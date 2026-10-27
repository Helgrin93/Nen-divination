# GUIDA PER REPERIRE ASSET HUNTER × HUNTER (SENZA PERSONAGGI GENERATI DA AI)

## Le migliori fonti da consultare

1. **Hunterpedia – Wing Image Gallery:** https://hunterxhunter.fandom.com/wiki/Wing/Image_Gallery — schermate/espressioni di Wing da varie versioni anime. Puoi cercare in particolare immagini 2011, neutro, sorriso/occhi chiusi, gesto/spiegazione. Le immagini del wiki NON sono automaticamente liberamente riutilizzabili solo perché sono accessibili online.
2. **Hunterpedia – raccolta gallerie personaggi:** https://hunterxhunter.fandom.com/wiki/Category:Image_Gallery — utile per ottenere immagini di personaggi riconoscibili. Verifica che lo stile sia omogeneo (preferibilmente anime 2011) e le classificazioni Nen prima di selezionare.
3. **AniList – API GraphQL:** https://docs.anilist.co/guide/graphql/ — schede e URL di copertine/immagini personaggio tramite API; ottima per inventariare i personaggi, ma NON è una licenza d'uso delle immagini. Per sviluppo, meglio importare asset locali selezionati e citare la provenienza invece di affidare ogni schermata alla rete.
4. **Jikan – MyAnimeList API non ufficiale:** https://jikan.moe/ — schede dei personaggi con immagini utilizzabili come riferimento tecnico, con verifica delle condizioni e dei diritti a monte.
5. **HXH Wiki (fan project):** https://www.hxhwiki.com/ — profili personaggi e riferimenti. Il sito dichiara esplicitamente che i diritti sui personaggi e gli asset restano ai rispettivi titolari.

## Cosa cercare realmente

**Wing, minimo 4 asset:**
- `assets/wing/wing-neutral.webp` — busto e volto frontali, camicia bianca, occhiali;
- `assets/wing/wing-smile.webp` — sorriso leggero;
- `assets/wing/wing-eyes-closed.webp` — occhi chiusi, sorridente;
- `assets/wing/wing-gesture.webp` — mano alzata o posizione interessata.

I quattro asset devono essere allineati (stesso ritaglio/aspect ratio, testa posizionata nello stesso punto) e possibilmente con background trasparente. Non bastano quattro immagini prese a caso con zoom e prospettive diverse: servono pulizia, ritagli e registrazione manuale. Le immagini screenshot con sottotitoli/overlay social NON devono essere usate come sprite diretti.

**Ambiente/oggetti:**
- `assets/scene/room.webp` — sfondo anime coerente con reel e scena;
- `assets/scene/table.webp` — tavolo (o incorporato nell'ambiente se statico);
- `assets/scene/glass-base.webp` — bicchiere trasparente, senza foglia se possibile;
- `assets/scene/water-mask.png` — maschera per la superficie dell'acqua, per cambiare livello/colore;
- `assets/scene/leaf.webp` — foglia isolata con trasparenza;
- `assets/scene/hand-left.webp`, `assets/scene/hand-right.webp` — mani in primo piano, allineate alla prospettiva della scena.

**18 ritratti personaggio**: tre per tipo Nen. Elenco iniziale dal progetto (controllare classificazioni canoniche):
- Enhancement: Gon Freecss, Isaac Netero, Uvogin.
- Emission: Meruem, Zeno Zoldyck, Razor.
- Transmutation: Killua Zoldyck, Hisoka Morow, Biscuit Krueger.
- Conjuration: Kurapika (*condizione occhi scarlatti e Specialization da distinguere*), Kite, Shizuku Murasaki.
- Manipulation: Illumi Zoldyck, Morel Mackernasey, Shalnark.
- Specialization: Chrollo Lucilfer, Neferpitou, Pakunoda.

Per ogni personaggio creare una **immagine locale** ad alta qualità, con proporzioni coerenti e buona leggibilità anche su mobile: es. `assets/characters/killua.webp`, ecc. Fare un file `ASSETS.md` con nome, URL origine, crediti, permessi, versione e data. Sono proposte di personaggi, non garanzia che tutte le associazioni siano incontestabili; verificarle prima del rilascio.

## Importante: diritti e qualità

- Il fatto che una galleria web offra immagini non autorizza automaticamente a redistribuirle su GitHub Pages. La licenza di un sito, di una API o del suo codice non significa che i frame anime siano liberi.
- **Non fare scraping massivo né hotlink diretto** a URL instabili. Se hai diritto di usare specifiche immagini, scaricale e salvale localmente in `public/assets/` o importale in `src/assets/`. Usa solo risorse provenienti da fonti identificabili.
- Per un prototipo solo locale puoi preparare i ritagli con cui provare il montaggio; prima di fare `git add .` su repository pubblico verifica se puoi pubblicare quei file.
- Codex non deve scaricare silenziosamente decine di immagini e dichiarare il lavoro completo; prima elenca asset, fonti e stato d'uso.
- Per le mani e il bicchiere, se il reperimento separato è difficile, valuta l'illustrazione personalizzata da un artista o una scomposizione autorizzata del riferimento in più livelli, mantenendo lo stile anime. Evitare disegni puramente CSS/SVG con anatomia approssimativa.

## Checklist pratica quando riprenderai

1. Estrai lo ZIP del redesign **direttamente nella cartella principale del tuo repository `nen-divination`**, così Codex vedrà `PROMPT_PER_CODEX.md`, `REDESIGN_VISIVO_SPEC.md`, `GUIDA_IMMAGINI_E_ASSET.md` e `reference/`.
2. Apri VS Code nella cartella repo, apri Codex e incolla il contenuto di `PROMPT_PER_CODEX.md` (oppure chiedigli esplicitamente di leggerlo interamente e applicarlo).
3. Fai inventariare prima gli asset già disponibili e quelli mancanti. Se non hai ancora i file Wing ritagliati, dedica prima una sessione a questo compito.
4. Verifica la sola schermata iniziale e una domanda, confrontando screenshot con i riferimenti. **Non approvare una W, un placeholder di persona o mani primitive.**
5. Completa la scena, poi la schermata finale e gli ultimi test. Solo dopo fai commit, push e verifica Actions.
