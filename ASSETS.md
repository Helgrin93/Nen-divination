# Origini e gestione degli asset

## Asset inclusi nel sito

| Asset | Origine | Stato |
| --- | --- | --- |
| Stanza, tavolo, bicchiere, foglia, mani | SVG originale in `src/components/WingScene.js` e CSS in `src/styles/scene.css` | Creati per il prototipo, nessun fotogramma copiato |
| Segnaposto Wing | Sagoma neutra con monogramma W nello stesso SVG | Fallback esplicito; non è un ritratto anime o una ricostruzione del personaggio |
| Ritratti dei 18 personaggi | Fallback tipografico, monogramma e simbolo dell’app | Immagini autentiche mancanti; `permissionStatus: 'missing'` |
| Simbolo, favicon e icone UI | SVG originali in `src/components/icons.js` e `public/favicon.svg` | Creati per il prototipo |
| Radar | SVG generato dai punteggi; canvas nella card PNG | Grafica originale |
| Font | Georgia / Times New Roman e Arial / Helvetica di sistema | Nessun font scaricato o ridistribuito |
| Testi delle domande e calibrazione | File JSON originali del pacchetto dell’utente | Importati senza modifiche |
| Schede personaggio | Nomi, categorie e descrizioni della specifica dell’utente | Il database delle immagini non decide il Nen |

Non sono state usate immagini generate con IA, immagini remote, scraping o API di ritratti. I dialoghi sono testi per l’app e non citazioni dell’opera.

## Materiale di riferimento, escluso dalla build

- `reference/reel-composition-reference.png`: fornito dall’utente; riferimento per la scena frontale. Nessun elemento dell’interfaccia Instagram viene riprodotto.
- `reference/reel-original.mp4`: fornito dall’utente; visionati fotogrammi della sequenza completa, inclusi mani e disgregazione della foglia. Non viene incorporato nel sito.
- `reference/result-design-reference.png`: fornito dall’utente; usato per palette, composizione e gerarchia. I ritratti non sono stati estratti.
- `.verification/`: screenshot, PNG e fotogrammi usati soltanto per QA locale, esclusi da Git e dalla build.

La presenza di un riferimento nel progetto non concede diritti di ridistribuzione. Prima di caricare un repository pubblico, escludere i riferimenti se il permesso non è verificato. La pubblicazione Pages carica soltanto `dist`, che non li contiene.

## Come aggiungere ritratti autorizzati

1. Procurare immagini autentiche dell’anime/manga con diritto d’uso verificato. Non estrarle dal mockup; non sostituirle con personaggi generati. AniList/Jikan possono aiutare nella ricerca ma non concedono automaticamente una licenza sulle immagini.
2. Salvare le 18 immagini locali in `public/assets/characters/<slug>.webp` e le pose trasparenti di Wing in `public/assets/wing/<pose>.png`.
3. In `src/data/characters.js` completare `portraitSrc`, `sourceUrl`, `credit` e `permissionStatus: 'authorized'`. Il percorso è relativo a `public`, senza slash iniziale, ad esempio `assets/characters/kurapika.webp`. `sourceUrl` deve identificare la fonte reale del ritratto; registrare anche gli estremi del permesso in questo documento.
4. In `src/data/wing.js` impostare `permissionStatus: 'authorized'`, fonte, credito e percorsi in `poses.neutral`, `poses.smile`, `poses.curious`, `poses.thinking`. Una sola posa neutra è sufficiente per il fallback delle altre espressioni.
5. L’app renderizza le immagini soltanto con stato `authorized`; errori di caricamento tornano ai segnaposto. Le immagini dei personaggi hanno `alt`, dimensioni stabili e caricamento lazy. L’immagine Wing resta nella posizione centrale dietro al bicchiere.
6. Aggiungere i crediti eventualmente richiesti dalla licenza in un elemento visibile o in una pagina dedicata prima del rilascio; i campi `credit` sono metadata predisposti, non una pagina di attribuzioni automatica.

Le tre schede sono fisse per categoria: Gon/Netero/Uvogin, Meruem/Zeno/Razor, Killua/Hisoka/Biscuit, Kurapika/Kite/Shizuku, Illumi/Morel/Shalnark e Chrollo/Neferpitou/Pakunoda. Kurapika resta Conjurer di base; il testo spiega la condizione degli occhi scarlatti.

Fonti di partenza indicate nella specifica: [VIZ](https://www.viz.com/hunter-x-hunter), [Madhouse](https://madhouse.co.jp/english/works/tv_hunter/), [AniList](https://docs.anilist.co/guide/graphql/), [termini AniList](https://docs.anilist.co/guide/terms-of-use), [Jikan](https://jikan.moe/). I link iniziali delle schede portano alla pagina ufficiale dell’opera, non a una presunta immagine autorizzata.

Hunter × Hunter e i relativi personaggi appartengono ai rispettivi titolari. Nessuna licenza sui personaggi è rivendicata dal prototipo.
