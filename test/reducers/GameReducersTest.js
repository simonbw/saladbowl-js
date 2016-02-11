var expect = require('expect');
var Immutable = require('immutable');
var reducer = require('../../web/reducers/GameReducers');
var ActionTypes = require('../../shared/ActionTypes');

describe('GameReducers', function () {

  it('should error on incorrect actions', function () {
    var state = new Immutable.Map();
    expect(reducer(state, null)).toEqual(state, 'null should return default state');
    expect(reducer(state, {})).toEqual(state, 'empty action should return default state');
    expect(reducer(state, {type: 'NOT_A_REAL_TYPE'})).toEqual(state, 'unknown type should return default state');
  });

  it('should have initial state', function () {
    expect(reducer(null, null)).toExist();
  });

  it('should add players and their words', function () {
    var game = reducer(null, null)
      .set('wordsPerPlayer', 4);
    game = addPlayer(game, 1, 'p1');
    expect(game.get('players').size).toEqual(1);
    game = addPlayer(game, 2, 'p2');
    expect(game.get('players').size).toEqual(2);
    game = addPlayer(game, 3, 'p3');
    expect(game.get('players').size).toEqual(3);
    expect(game.get('words').size).toEqual(12, 'should add all player words'); // 3 players * 4 words / Player
  });

  it('should update words', function () {
    var game = reducer(null, null);
    game = addPlayer(game, 1, 'p1');
    game = addPlayer(game, 2, 'p2');
    game = updateWord(game, 'word2', 1, 2);
    expect(game.get('words').get(2).get('word')).toEqual('word2');
  });

  it('should play through a full game', function () {
    var game = reducer(null, null)
      .set('wordsPerPlayer', 4);
    for (var p = 0; p < 4; p++) {
      game = addPlayer(game, p, 'p' + p);
    }
    expect(game.get('players').size).toEqual(4);
    expect(game.get('words').size).toEqual(16);
    for (var p = 0; p < 4; p++) {
      for (var w = 0; w < 3; w++) {
        var word = 'p' + p + 'w' + w;
        game = updateWord(game, word, p, p * 4 + w);
      }
    }
    expect(game.get('words').get(6).get('word')).toEqual('p1w2');

    //game = startGame(game);
    //game = startRound(game);
    //game.get('words').forEach(function (word) {
    //  expect(word.get('inBowl')).toEqual(true, 'All words should be in bowl');
    //});
    //game = correctWord(game);
    //game = skipWord(game);
  });
});


function addPlayer(game, id, name) {
  return reducer(game, {
    type: ActionTypes.CLIENT.PLAYER_JOINED,
    player: {id: id, name: name}
  });
}


function updateWord(game, word, playerId, wordIndex) {
  return reducer(game, {
    type: ActionTypes.CLIENT.WORD_UPDATED,
    playerId: playerId,
    word: word,
    wordIndex: wordIndex
  });
}


function startGame(game) {
  return reducer(game, {
    type: ActionTypes.CLIENT.GAME_STARTED
  });
}


function startRound(game) {
  return reducer(game, {
    type: ActionTypes.CLIENT.ROUND_STARTED
  });
}


function correctWord(game) {
  return reducer(game, {
    type: ActionTypes.CLIENT.WORD_CORRECT
  });
}


function skipWord(game) {
  return reducer(game, {
    type: ActionTypes.CLIENT.WORD_SKIPPED
  });
}

