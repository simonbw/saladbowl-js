var Random = require('./Random');
var StringUtil = require('./StringUtil');


/**
 * Used for making interesting team names.
 */
var TeamNames = module.exports;

/**
 * Get the name of the nth team for a game.
 *
 * @param gameId {string}
 * @param team {number}
 * @returns {string}
 */
TeamNames.get = function (gameId, team) {
  var seed = StringUtil.hash(gameId);
  var animal = shuffleAnimals(seed)[team % animals.length];
  var adjective = shuffleAdjectives(seed)[team % adjectives.length];
  return 'The ' + adjective + ' ' + animal;
};

/**
 * Return a randomly shuffled version of animals.
 * @param seed
 * @returns {*}
 */
function shuffleAnimals(seed) {
  seed = (seed * 13) | 0;
  return Random.seededShuffle(animals.slice(), seed);
}

/**
 * Return a randomly shuffled version of adjectives.
 * @param seed
 * @returns {*}
 */
function shuffleAdjectives(seed) {
  seed = (seed * 17) | 0;
  return Random.seededShuffle(adjectives.slice(), seed);
}

var animals = [
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

var adjectives = [
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