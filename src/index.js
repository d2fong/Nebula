const assign = require('lodash.assign');
const uniq = require('lodash.uniq');

const { stemmer } = require('porter-stemmer');

let textCharacterization = (text, opts) => {
  let { stopWords, flaggedWords, useStemming } = opts;
  let delimiterRegex = /[\t \n\r\f!\\#$%&()*+,.<=>?@[^\\\]`_{|}~\\'"]/;
  let filterWords = new Set([...stopWords, flaggedWords]);
  let wordPairMap = new Map();

  let words = uniq(text.split(delimiterRegex).filter( word => !filterWords.has(word) ).map( word => stemmer(word) ) );


  for( let i = 0; i < words.length - 1; i++ ){
    for( let j = 1; j < words.length -1; j++ ){
      let wordPair = new Set(words[i], words[j]);
      if( wordPairMap.has(wordPair) ){
        wordPairMap.set(wordPair, wordPairMap.get(wordPair) + 1);
      } else {
        wordPairMap.set(wordPair, 1);
      }
    }
  }

  return words;
};


let defaults = {
  stopWords: [],
  flaggedWords: [],
  delimiters: [],
  useStemming: true
};

let entry = (text, opts) => {
  opts = assign({}, defaults, opts);
  console.log(textCharacterization(text, opts));
};

entry(`
signal transduction involved in cell cycle checkpoint. signal transduction involved in DNA integrity checkpoint. signal transduction involved in mitotic cell cycle checkpoint. signal transduction involved in mitotic DNA integrity checkpoint. positive regulation of cell cycle arrest. G1 DNA damage checkpoint. mitotic DNA damage checkpoint. signal transduction involved in DNA damage checkpoint. signal transduction involved in mitotic DNA damage checkpoint. intracellular signal transduction involved in G1 DNA damage checkpoint. mitotic G1/S transition checkpoint. mitotic G1 DNA damage checkpoint. signal transduction involved in mitotic G1 DNA damage checkpoint. DNA damage response, signal transduction by p53 class mediator resulting in cell cycle arrest
`, {});