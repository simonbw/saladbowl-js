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
  var hash = StringUtil.hash(gameId);
  var animalIndex = (hash * 7 + team) % animals.length;
  var adjectiveIndex = (hash * 13 + team) % adjectives.length;
  return 'The ' + adjectives[adjectiveIndex] + ' ' + animals[animalIndex];
};

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
  'Tumuluous',
  'Ubiquitous',
  'Wise',
  'Xenophobic',
  'Yellow',
  'Zesty'
];