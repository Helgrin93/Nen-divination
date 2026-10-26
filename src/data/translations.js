export const translations = {
  it: {
    skip: 'Vai all’esperienza',
    tagline: 'LA DIVINAZIONE DELL’ACQUA', chapter: 'UN INCONTRO CON WING', room: 'HEAVENS ARENA · SALA DI ALLENAMENTO',
    eyebrow: 'OGNI AURA HA UNA NATURA.', title: 'La tua deve ancora', titleEm: 'rivelarsi.',
    intro: 'Benvenuto. Prima della prova dell’acqua, vorrei capire qualcosa di te.',
    introNote: 'Sette domande. Una foglia sull’acqua. Il primo passo per conoscere il tuo Nen.',
    begin: 'Inizia la prova', duration: 'CIRCA 3 MINUTI', six: '6 AFFINITÀ DA SCOPRIRE',
    instinct: 'Rispondi d’istinto. Non esistono risposte giuste o sbagliate.',
    interesting: 'Oh, interessante…', interestingNote: 'Continuiamo. C’è ancora qualcosa che vorrei sapere.',
    bonus8: 'La tua aura mostra caratteristiche contrastanti… Un’altra domanda.', bonus9: 'Ora capisco meglio… Ma vorrei chiarire un ultimo dettaglio.',
    question: 'Domanda', of: 'di', bonus: 'UN ULTIMO SGUARDO ALLA TUA AURA', back: 'Indietro', next: 'Continua', selected: 'Risposta selezionata',
    step1: 'L’incontro', step2: 'La prova', step3: 'La rivelazione',
    focusTitle: 'Lascia parlare la tua aura.', focus: 'Ora concentrati. Avvicina le mani al bicchiere e mantieni il Nen.',
    hold: 'Tieni premuto', holdHelp: 'Tieni premuto per 4,5 secondi con il dito, il mouse o la barra spaziatrice.', holding: 'Mantieni la concentrazione…', reset: 'Riprova a concentrarti.',
    accessible: 'Rivela senza tenere premuto', revealTitle: 'L’acqua sta cambiando.', revealing: 'Osserva il bicchiere…', revealed: 'Ecco… La tua affinità si è manifestata.',
    resultLabel: 'IL TUO TIPO DI NEN', secondary: 'AFFINITÀ SECONDARIA', close: 'Le tue due affinità sono molto vicine.',
    relative: 'Compatibilità relativa (quiz)', relativeNote: 'Percentuali indicative normalizzate: il valore massimo è 100%. Non rappresentano probabilità né efficacia canonica dell’aura e non devono sommare a 100.',
    means: 'COSA SIGNIFICA', characters: 'PERSONAGGI ESEMPIO', save: 'Salva risultato', share: 'Condividi', replay: 'Riprova il quiz',
    missing: 'Ritratto da aggiungere', source: 'Fonte ufficiale', mentorFallback: 'Ritratto originale non disponibile',
    saved: 'La tua card PNG è pronta.', shared: 'Risultato condiviso.', cancelled: 'Condivisione annullata.', downloaded: 'Condivisione non disponibile: card PNG scaricata.', exportError: 'Non è stato possibile creare la card. Riprova.',
    ludic: 'Quiz ludico ispirato alla teoria di Hisoka: non è un metodo canonico o scientifico per determinare la personalità.',
    fan: 'Fan project non ufficiale. Nessuna affiliazione con i titolari di Hunter × Hunter.', privacy: 'Nessun account, nessun tracciamento. Solo la lingua viene salvata su questo dispositivo.',
    traitsNote: 'I tratti del quiz sono un’interpretazione ludica della teoria di Hisoka, distinti dalle abilità dell’aura.',
    shareNote: 'Affinità relative del quiz · Non è una misura scientifica', saveBusy: 'Creo la card…',
  },
  en: {
    skip: 'Skip to experience',
    tagline: 'THE WATER DIVINATION', chapter: 'AN ENCOUNTER WITH WING', room: 'HEAVENS ARENA · TRAINING ROOM',
    eyebrow: 'EVERY AURA HAS A NATURE.', title: 'Yours is waiting', titleEm: 'to be revealed.',
    intro: 'Welcome. Before the water divination test, I’d like to learn a little about you.',
    introNote: 'Seven questions. A leaf on the water. Your first step towards understanding your Nen.',
    begin: 'Begin the test', duration: 'ABOUT 3 MINUTES', six: '6 AFFINITIES TO DISCOVER',
    instinct: 'Answer instinctively. There are no right or wrong answers.',
    interesting: 'Oh, interesting…', interestingNote: 'Let’s continue. There is still something I would like to know.',
    bonus8: 'Your aura shows contrasting traits… One more question.', bonus9: 'I understand a little better now… One last detail.',
    question: 'Question', of: 'of', bonus: 'ONE LAST LOOK AT YOUR AURA', back: 'Back', next: 'Continue', selected: 'Selected answer',
    step1: 'The encounter', step2: 'The test', step3: 'The revelation',
    focusTitle: 'Let your aura speak.', focus: 'Now focus. Bring your hands close to the glass and maintain your Nen.',
    hold: 'Press and hold', holdHelp: 'Hold for 4.5 seconds using your finger, mouse or space bar.', holding: 'Maintain your focus…', reset: 'Try focusing again.',
    accessible: 'Reveal without holding', revealTitle: 'The water is changing.', revealing: 'Watch the glass…', revealed: 'There… Your affinity has revealed itself.',
    resultLabel: 'YOUR NEN TYPE', secondary: 'SECONDARY AFFINITY', close: 'Your two affinities are very close.',
    relative: 'Relative quiz affinity', relativeNote: 'Relative normalized values: the highest is 100%. These are not probabilities or canonical Nen proficiency and do not need to add up to 100.',
    means: 'WHAT IT MEANS', characters: 'EXAMPLE CHARACTERS', save: 'Save result', share: 'Share', replay: 'Retake quiz',
    missing: 'Portrait to be added', source: 'Official source', mentorFallback: 'Original portrait unavailable',
    saved: 'Your PNG card is ready.', shared: 'Result shared.', cancelled: 'Sharing cancelled.', downloaded: 'Sharing is unavailable: PNG card downloaded.', exportError: 'The card could not be created. Please try again.',
    ludic: 'A playful quiz inspired by Hisoka’s theory, not a canonical or scientific personality assessment.',
    fan: 'Unofficial fan project. Not affiliated with the owners of Hunter × Hunter.', privacy: 'No account, no tracking. Only your language is saved on this device.',
    traitsNote: 'The quiz traits are a playful interpretation of Hisoka’s theory, separate from aura abilities.',
    shareNote: 'Relative quiz affinity · Not a scientific assessment', saveBusy: 'Creating your card…',
  },
};

export function preferredLanguage(storage, browserLanguage = 'it') {
  try {
    const saved = storage?.getItem('lang');
    if (saved === 'it' || saved === 'en') return saved;
  } catch { /* Storage can be unavailable in private browsing. */ }
  return browserLanguage.toLowerCase().startsWith('en') ? 'en' : 'it';
}
