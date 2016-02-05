var MathUtil = require('../shared/MathUtil');

var GameHelpers = module.exports;


/**
 *
 * @param state
 * @returns {number}
 */
GameHelpers.getNextWord = function (state) {
  var words = state.get('words');
  var h = state.hashCode();
  for (var i = 0; i < words.size; i++) {
    var index = MathUtil.mod(i + h, words.size);
    var word = words.get(index);
    if (!word) {
      throw new Error('Word should exist:' + index + '(' + i + '+' + String(h) + '%' + words.size + ')');
    }
    if (word.get('inBowl')) {
      return index;
    }
  }
  throw new Error('No next word available');
};
