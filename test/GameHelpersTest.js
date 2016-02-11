var expect = require('expect');
var Immutable = require('immutable');

var defaultGame = require('../shared/DefaultGame');
var GameHelpers = require('../web/GameHelpers');


describe('GameHelpers', function () {
  it('getNextIndex should work');

  it('userIsJoined should work', function () {
    var game = defaultGame;
    expect(GameHelpers.userIsJoined(game)).toEqual(false);
    game = game.set('userId', 'testId');
    expect(GameHelpers.userIsJoined(game)).toEqual(false);
    game = game.set('players', game.get('players').push(Immutable.fromJS({id: 'notTestId'})));
    expect(GameHelpers.userIsJoined(game)).toEqual(false);
    game = game.set('players', game.get('players').push(Immutable.fromJS({id: 'testId'})));
    expect(GameHelpers.userIsJoined(game)).toEqual(true);
  });

  it('getTeams should work', function () {
    var game = defaultGame;
    var player1 = Immutable.fromJS({id: 'player1', team: 0});
    var player2 = Immutable.fromJS({id: 'player2', team: 0});
    var player3 = Immutable.fromJS({id: 'player3', team: 1});
    game = game.set('players', game.get('players').push(player1, player2, player3));
    expect(GameHelpers.getTeams(game).size).toEqual(2);
  });

  it('getCurrentPlayer should work');

  it('userIsCurrentPlayer should work');

  it('userIsGuessing should work');

  it('getPlayerWords should work', function () {
    var game = defaultGame;
    var userId = 'testId';
    game = game.set('userId', userId);
    expect(GameHelpers.getPlayerWords(game, userId).size).toEqual(0);
    var word1 = Immutable.fromJS({playerId: userId, word: 'word1'});
    var word2 = Immutable.fromJS({playerId: userId, word: 'word2'});
    var word3 = Immutable.fromJS({playerId: 'someOtherPlayer', word: 'word3'});
    game = game.set('words', game.get('words').push(word1));
    expect(GameHelpers.getPlayerWords(game, userId).size).toEqual(1);
    expect(GameHelpers.getPlayerWords(game, userId).get(0).get('word')).toEqual('word1');
    game = game.set('words', game.get('words').push(word2));
    expect(GameHelpers.getPlayerWords(game, userId).size).toEqual(2);
    game = game.set('words', game.get('words').push(word3));
    expect(GameHelpers.getPlayerWords(game, userId).size).toEqual(2);
  });

  it('getUserWords should work');

  it('getPlayerIndex should work');

  it('getUserPlayerIndex should work');
});