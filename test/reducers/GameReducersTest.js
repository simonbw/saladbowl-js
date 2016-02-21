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
      .set('wordsPerPlayer', 4)
      .set('id', 'testGameId');
    for (var p = 0; p < 4; p++) {
      game = addPlayer(game, p, 'p' + p);
    }
    expect(game.get('players').size).toEqual(4);
    expect(game.get('words').size).toEqual(16);
    for (var p = 0; p < 4; p++) {
      for (var w = 0; w < 4; w++) {
        var word = 'p' + p + 'w' + w;
        game = updateWord(game, word, p, w);
      }
    }
    expect(game.get('words').get(6).get('word')).toEqual('p1w2');

    game = joinTeam(game, 0, 0);
    game = joinTeam(game, 1, 0);
    game = joinTeam(game, 2, 1);
    game = joinTeam(game, 3, 1);

    game = startGame(game);

    game = startRound(game);

    expect(game.get('words').every(function (word) {
      return word.get('inBowl');
    })).toEqual(true, 'All words should be in bowl ' + JSON.stringify(game, null, 2));

    game = correctWord(game);

    for (var i = 0; i < 100; i++) {
      game = skipWord(game);
    }
    for (var i = 0; i < 15; i++) {
      game = correctWord(game);
    }

    game.get('id');
  });
});


function addPlayer(game, id, name) {
  return reducer(game, {
    type: ActionTypes.CLIENT.PLAYER_JOINED,
    player: {id: id, name: name}
  });
}

function joinTeam(game, playerId, team) {
  return reducer(game, {
    type: ActionTypes.CLIENT.TEAM_JOINED,
    playerId: playerId,
    team: team
  });
}

function updateWord(game, word, playerId, playerWordIndex) {
  return reducer(game, {
    type: ActionTypes.CLIENT.WORD_UPDATED,
    playerId: playerId,
    word: word,
    playerWordIndex: playerWordIndex
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

