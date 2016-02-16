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
  var index = (StringUtil.hash(gameId) + team) % animals.length;
  return 'The ' + animals[index];
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
  'Snakes',
  'Turtles',
  'Umbrellabirds',
  'Walruses',
  'Xatus',
  'Yaks',
  'Zebras'
];