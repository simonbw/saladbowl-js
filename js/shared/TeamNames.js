'use strict';
// @flow

const Random = require('./Random');
const StringUtil = require('./StringUtil');


/**
 * Used for making interesting team names.
 */
const TeamNames = module.exports;

/**
 * Get the name of the nth team for a game.
 */
TeamNames.get = (gameId:string, team:number):string => {
  const seed = StringUtil.hash(gameId);
  const animal = shuffleAnimals(seed)[team % animals.length];
  const adjective = shuffleAdjectives(seed)[team % adjectives.length];
  return 'The ' + adjective + ' ' + animal;
};

/**
 * Return a randomly shuffled version of animals.
 */
function shuffleAnimals(seed:number):Array<string> {
  seed = (seed * 13) | 0;
  return Random.seededShuffle(animals.slice(), seed);
}

/**
 * Return a randomly shuffled version of adjectives.
 */
function shuffleAdjectives(seed:number):Array<string> {
  seed = (seed * 17) | 0;
  return Random.seededShuffle(adjectives.slice(), seed);
}

const animals = [
  'Albatrosses',
  'Baboons',
  'Cougars',
  'Dogs',
  'Elephants',
  'Foxes',
  'Goats',
  'Hyenas',
  'Iguanas',
  'Jackalopes',
  'Kangaroos',
  'Lemurs',
  'Meerkats',
  'Narwhals',
  'Orangutans',
  'Penguins',
  'Quail',
  'Sloths',
  'Turtles',
  'Umbrellabirds',
  'Walruses',
  'Xatus',
  'Yaks',
  'Zebras'
];

const adjectives = [
  'African',
  'Brilliant',
  'Charming',
  'Dilapidated',
  'Erudite',
  'Fastidious',
  'Gargantuan',
  'Handsome',
  'Illegitimate',
  'Jingoistic',
  'Keen',
  'Lethargic',
  'Mystic',
  'Noble',
  'Organic',
  'Perturbing',
  'Queasy',
  'Snarky',
  'Tumultuous',
  'Ubiquitous',
  'Wise',
  'Xenophobic',
  'Yellow',
  'Zesty'
];