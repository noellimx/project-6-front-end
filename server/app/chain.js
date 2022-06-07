const ARROW_LEFT = "38";
const ARROW_RIGHT = "37";
const ARROW_DOWN = "40";
const ARROW_UP = "39";

const ARROWS = [ARROW_DOWN, ARROW_LEFT, ARROW_UP];

const MODE_EASY = 1;
const MODE_TEST = 1;

const LENGTHS = {
  [MODE_EASY]: 10,
  [MODE_TEST]: 4,
};

const COLOR_GREEN = ARROW_DOWN;
const COLOR_BLUE = ARROW_LEFT;
const COLOR_RED = ARROW_RIGHT;
const COLOR_BLACK = ARROW_UP;
const COLORS = {
  [ARROW_DOWN]: COLOR_GREEN,
  [ARROW_LEFT]: COLOR_BLUE,
  [ARROW_RIGHT]: COLOR_RED,
  [ARROW_UP]: COLOR_BLACK,
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

const shuffleChain = (_chain) => {
  const chain = [..._chain];
  const le = chain.length;
  for (let i = 0; i < le; i += 1) {
    const j = Math.floor(Math.random() * (le - i)) + i;
    [chain[j], chain[i]] = [chain[i], chain[j]];
  }

  return chain;
};

const VARIANCE = 5;

const getRandomChain = (difficulty = MODE_TEST, variance = VARIANCE) => {
  console.log(`[getRandomChain]`);
  const min = LENGTHS[difficulty];
  const range = getRandomInt(variance);

  const length = min + range;

  const cutoffs = [
    getRandomInt(length),
    getRandomInt(length),
    getRandomInt(length),
  ];
  cutoffs.sort();
  console.log(`[getRandomChain] cut ${cutoffs}`);

  // HACK
  const [_, neatchain] = cutoffs.reduceRight(
    ([remainingL, queue], here, idx) => {
      console.log(` - - - - - - - `);
      console.log([remainingL, queue]);
      const q = [...queue];
      while (remainingL > here) {
        q.push(ARROWS[idx]);

        remainingL -= 1;
      }

      return [remainingL, [...q]];
    },
    [length, []]
  );

  const randomchain = shuffleChain(neatchain);

  return randomchain;
};

const CHAIN_DELIMITER = ",";
const chainToString = (chain) => {
  return chain.join(CHAIN_DELIMITER);
};

const stringToChain = (stringChain) => {
  return stringChain.split(CHAIN_DELIMITER);
};

const valueOfChainString = (chainString) => {
  return stringToChain(chainString).length;
};
export { getRandomChain, chainToString, stringToChain, valueOfChainString };
