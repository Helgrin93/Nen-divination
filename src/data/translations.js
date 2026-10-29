export const translations = {
  it: {
    skip: 'Vai all’esperienza',
    sceneLabel: 'Wing davanti a te, dietro al tavolo con bicchiere e foglia',
    sceneMissing: 'Gli asset della scena non sono ancora disponibili in questa build.',
    intro: 'Prima di iniziare, vorrei farti alcune domande. Rispondi sinceramente.',
    begin: 'Inizia',
    instinct: 'Rispondi d’istinto. Non esistono risposte giuste o sbagliate.',
    interesting: 'Oh, interessante…', interestingNote: 'Continuiamo. C’è ancora qualcosa che vorrei sapere.',
    understood: 'Capisco…', letsSee: 'Vediamo…', curious: 'Mh, curioso…', veryGood: 'Molto bene.',
    bonus8: 'Le tue risposte sono piuttosto contrastanti. Vorrei farti ancora una domanda.', bonus9: 'Ora capisco meglio. Vorrei chiarire un ultimo dettaglio.',
    question: 'Domanda', of: 'di', bonus: 'UN ULTIMO SGUARDO ALLA TUA AURA', back: 'Indietro', next: 'Continua', selected: 'Risposta selezionata',
    focusTitle: 'Ora concentrati.', focus: 'Avvicina le mani al bicchiere e mantieni il Nen.',
    hold: 'Tieni premuto', holdHelp: 'Tieni premuto per 4,5 secondi con il dito, il mouse o la barra spaziatrice.', holding: 'Mantieni la concentrazione…', reset: 'Riprova a concentrarti.',
    accessible: 'Rivela senza tenere premuto', revealTitle: 'L’acqua sta cambiando.', revealing: 'Osserva il bicchiere…', revealed: 'Ecco… La tua affinità si è manifestata.',
    resultLabel: 'IL TUO TIPO DI NEN', secondary: 'AFFINITÀ SECONDARIA', close: 'Le tue due affinità sono molto vicine.',
    relative: 'Compatibilità relativa (quiz)', relativeNote: 'Percentuali indicative normalizzate: il valore massimo è 100%. Non rappresentano probabilità né efficacia canonica dell’aura e non devono sommare a 100.',
    power: 'POTERE NEN', means: 'COSA SIGNIFICA', characters: 'Alcuni personaggi che hanno questo tipo di Nen:', save: 'Salva risultato', share: 'Condividi', replay: 'Riprova il quiz',
    missing: 'Immagine non disponibile', source: 'Fonte', mentorFallback: 'Ritratto originale non disponibile',
    saved: 'La tua card PNG è pronta.', shared: 'Risultato condiviso.', cancelled: 'Condivisione annullata.', downloaded: 'Condivisione non disponibile: card PNG scaricata.', exportError: 'Non è stato possibile creare la card. Riprova.',
    ludic: 'Quiz ludico ispirato alla teoria di Hisoka: non è un metodo canonico o scientifico per determinare la personalità.',
    fan: 'Fan project non ufficiale. Nessuna affiliazione con i titolari di Hunter × Hunter.', privacy: 'Nessun account, nessun tracciamento. Solo la lingua viene salvata su questo dispositivo.',
    traitsNote: 'I tratti del quiz sono un’interpretazione ludica della teoria di Hisoka, distinti dalle abilità dell’aura.',
    shareNote: 'Affinità relative del quiz · Non è una misura scientifica', saveBusy: 'Creo la card…',
  },
  en: {
    skip: 'Skip to experience',
    sceneLabel: 'Wing facing you, behind the table with a glass and leaf',
    sceneMissing: 'Scene assets are not yet available in this build.',
    intro: 'Before we begin, I’d like to ask you a few questions. Answer honestly.',
    begin: 'Start',
    instinct: 'Answer instinctively. There are no right or wrong answers.',
    interesting: 'Oh, interesting…', interestingNote: 'Let’s continue. There is still something I would like to know.',
    understood: 'I see…', letsSee: 'Let’s see…', curious: 'Hmm, curious…', veryGood: 'Very good.',
    bonus8: 'Your answers are quite mixed. I’d like to ask you one more question.', bonus9: 'I understand better now. One last detail.',
    question: 'Question', of: 'of', bonus: 'ONE LAST LOOK AT YOUR AURA', back: 'Back', next: 'Continue', selected: 'Selected answer',
    focusTitle: 'Now focus.', focus: 'Bring your hands close to the glass and maintain your Nen.',
    hold: 'Press and hold', holdHelp: 'Hold for 4.5 seconds using your finger, mouse or space bar.', holding: 'Maintain your focus…', reset: 'Try focusing again.',
    accessible: 'Reveal without holding', revealTitle: 'The water is changing.', revealing: 'Watch the glass…', revealed: 'There… Your affinity has revealed itself.',
    resultLabel: 'YOUR NEN TYPE', secondary: 'SECONDARY AFFINITY', close: 'Your two affinities are very close.',
    relative: 'Relative quiz affinity', relativeNote: 'Relative normalized values: the highest is 100%. These are not probabilities or canonical Nen proficiency and do not need to add up to 100.',
    power: 'NEN ABILITY', means: 'WHAT IT MEANS', characters: 'Some characters who share this Nen type:', save: 'Save result', share: 'Share', replay: 'Retake quiz',
    missing: 'Image unavailable', source: 'Source', mentorFallback: 'Original portrait unavailable',
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
