var expect = require('expect');
var Immutable = require('immutable');
var reducer = require('../../web/reducers/GameReducers');
var ActionTypes = require('../../shared/ActionTypes');

describe('GameReducers', function () {

  it('should error on incorrect actions', function () {
    var initialState = new Immutable.Map();
    expect(reducer(initialState, null)).toEqual(initialState, 'null should return default state');

    expect(function () {
      reducer(initialState, {});
    }).toThrow(Error, 'typeless action should throw error');

    expect(function () {
      reducer(initialState, {type: 'NOT_A_REAL_TYPE'});
    }).toThrow(Error, 'bad type should throw error');

  });

  it('should have initial state', function () {
    expect(reducer(null, null)).toExist();
  });

  it('should play through a full game', function () {
    var state = reducer(null, null);
    state = addPlayers(state);
    state = addWords(state);
    state = startGame(state);
    state = startRound(state);
    state.get('words').forEach(function (word) {
      expect(word.get('inBowl')).toEqual(true);
    });
    state = correctWord(state);
    state = skipWord(state);
  });
});


function addPlayers(state) {
  state = reducer(state, {
    type: ActionTypes.CLIENT.PLAYER_JOINED,
    player: {id: 1, name: 'Simon'}
  });
  expect(state.get('players').size).toEqual(1);
  state = reducer(state, {
    type: ActionTypes.CLIENT.PLAYER_JOINED,
    player: {id: 2, name: 'Lindsey'}
  });
  expect(state.get('players').size).toEqual(2);
  return state;
}


function addWords(state) {
  state = reducer(state, {
    type: ActionTypes.CLIENT.WORD_ADDED,
    playerId: 2,
    word: 'LindseyWord',
    index: 0
  });
  expect(state.get('words').size).toEqual(1);
  state = reducer(state, {
    type: ActionTypes.CLIENT.WORD_ADDED,
    playerId: 1,
    word: 'SimonWord',
    index: 1
  });
  expect(state.get('words').size).toEqual(2);
  return state;
}


function startGame(state) {
  state = reducer(state, {
    type: ActionTypes.CLIENT.GAME_STARTED
  });
  expect(state.get('started')).toEqual(true);
  return state;
}


function startRound(state) {
  state = reducer(state, {
    type: ActionTypes.CLIENT.ROUND_STARTED
  });
  expect(state.get('roundStarted')).toEqual(true);
  return state;
}


function correctWord(state) {
  state = reducer(state, {
    type: ActionTypes.CLIENT.WORD_CORRECT
  });
  return state;
}


function skipWord(state) {
  state = reducer(state, {
    type: ActionTypes.CLIENT.WORD_SKIPPED
  });
  return state;
}

