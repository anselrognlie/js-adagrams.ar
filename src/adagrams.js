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

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const shuffleInPlace = (pool) => {
  for (let pos = 0; pos < pool.length - 1; ++pos) {
    const moveFrom = getRandomInt(pool.length - pos);
    const temp = pool[pos];
    pool[pos] = pool[pos + moveFrom];
    pool[pos + moveFrom] = temp;
  }
};

const drawLettersForHandSize = (handSize) => {
  const pool = [];
  for (const letter in kLetterCounts) {
    const count = kLetterCounts[letter];
    for (let i = 0;i < count; ++i) {
      pool.push(letter);
    }
  }

  shuffleInPlace(pool)

  const hand = [];
  for (let i = 0; i < handSize; ++i) {
    hand.push(pool[i]);
  }

  return hand;
};

export const drawLetters = () => {
  // const c = new MyClass();
  // console.log(c.getValue());
  // console.log(MyClass.getDescription());

  return drawLettersForHandSize(kHandSize);
};

const makeFrequencyMap = (from) => {
  const map = {};

  for (let i = 0; i < from.length; ++i) {
    const letter = from[i].toUpperCase();
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

export const usesAvailableLetters = (input, lettersInHand) => {
  const inputCounts = makeFrequencyMap(input);
  const handCounts = makeFrequencyMap(lettersInHand);

  return isMapSubset(handCounts, inputCounts);
};

const kLongBonus = 8;
const kLongWordMinLength = 7;

export const scoreWord = (word) => {
  let score = 0;

  for (const letter of word) {
    const lookup = letter.toUpperCase();
    score += kLetterScores[lookup];
  }

  if (word.length >= kLongWordMinLength) {
    score += kLongBonus;
  }

  return score;
};

export const highestScoreFrom = (words) => {
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

  let highWord = null;
  for (const word of highWords) {
    if (word.length == kHandSize) {
      highWord = word;
      break;
    }

    if (!highWord || word.length < highWord.length) {
      highWord = word;
    }
  }

  return { word: highWord, score: highScore };
};
