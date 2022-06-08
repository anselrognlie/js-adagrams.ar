const kLetterCounts = {
  A: 9,
  N: 6,
  B: 2,
  O: 8,
  C: 2,
  P: 2,
  D: 4,
  Q: 1,
  E: 12,
  R: 6,
  F: 2,
  S: 4,
  G: 3,
  T: 6,
  H: 2,
  U: 4,
  I: 9,
  V: 2,
  J: 1,
  W: 2,
  K: 1,
  X: 1,
  L: 4,
  Y: 2,
  M: 2,
  Z: 1,
};

const kLetterScores = {
  A: 1,
  E: 1,
  I: 1,
  O: 1,
  U: 1,
  L: 1,
  N: 1,
  R: 1,
  S: 1,
  T: 1,
  D: 2,
  G: 2,
  B: 3,
  C: 3,
  M: 3,
  P: 3,
  F: 4,
  H: 4,
  V: 4,
  W: 4,
  Y: 4,
  K: 5,
  J: 8,
  X: 8,
  Q: 10,
  Z: 10
};

const kHandSize = 10;
const kLongBonus = 8;
const kLongWordMinLength = 7;


const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const buildPool = (letterCounts) => {
  const pool = [];
  for (const letter in letterCounts) {
    const count = letterCounts[letter];
    pool.push(...Array(count).fill(letter));
  }

  return pool;
};

const shuffleInPlace = (pool) => {
  for (let pos = 0; pos < pool.length - 1; ++pos) {
    const moveFrom = getRandomInt(pool.length - pos);
    const temp = pool[pos];
    pool[pos] = pool[pos + moveFrom];
    pool[pos + moveFrom] = temp;
  }
};

const drawLettersForHandSize = (handSize, letterCounts) => {
  const pool = buildPool(letterCounts);

  shuffleInPlace(pool)

  return pool.slice(0, handSize);
};

const makeFrequencyMap = (from) => {
  const map = {};

  for (const rawLetter of from) {
    const letter = rawLetter.toUpperCase();
    const count = map[letter] || 0;
    map[letter] = count + 1;
  }

  return map;
};

const isMapSubset = (outer, inner) => {
  for (const [letter, count] of Object.entries(inner)) {
    if (!outer.hasOwnProperty(letter) || outer[letter] < count) {
      return false;
    }
  }

  return true;
};

const scoreWordUsingLetterScores = (word, letterScores, bonusLength, lengthBonus) => {
  let score = 0;

  if (word.length >= bonusLength) {
    score = lengthBonus;
  }
  
  // for (const letter of word) {
  //   const lookup = letter.toUpperCase();
  //   score += letterScores[lookup];
  // }

  // does anyone seriously think this is more legible than the above code?
  score = word.split('').reduce(
    (score, letter) => score + letterScores[letter.toUpperCase()], score);

  return score;
};

const getShortestWordUnlessUsesWholeHand = (words, handSize) => {
  let highWord = null;
  for (const word of words) {
    if (word.length == handSize) {
      highWord = word;
      break;
    }

    if (!highWord || word.length < highWord.length) {
      highWord = word;
    }
  }

  return highWord;
};

const getHighestScoreAndWords = (words) => {
  let highScore = -1;
  let highWords = [];

  for (const word of words) {
    const score = scoreWord(word);

    if (score > highScore) {
      highScore = score;
      highWords = [ word ];
    } else if (score == highScore) {
      highWords.push(word);
    }
  }

  return { highScore, highWords };
};

const highestWordScoreWithHandSize = (words, handSize) => {
  const { highScore: score, highWords } = getHighestScoreAndWords(words);

  const word = getShortestWordUnlessUsesWholeHand(highWords, handSize);

  return { word, score };
};

export const drawLetters = () => {
  return drawLettersForHandSize(kHandSize, kLetterCounts);
};

export const usesAvailableLetters = (input, lettersInHand) => {
  const inputCounts = makeFrequencyMap(input);
  const handCounts = makeFrequencyMap(lettersInHand);

  return isMapSubset(handCounts, inputCounts);
};

export const scoreWord = (word) => {
  return scoreWordUsingLetterScores(
    word, 
    kLetterScores,
    kLongWordMinLength, 
    kLongBonus
  );
};

export const highestScoreFrom = (words) => {
  return highestWordScoreWithHandSize(words, kHandSize);
};
