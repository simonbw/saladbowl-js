var expect = require('expect');
var Immutable = require('immutable');

var defaultGame = require('../shared/defaultGame');
var GameHelpers = require('../web/GameHelpers');


describe('GameHelpers', function () {
  it('getNextIndex should work', function () {
    var game = defaultGame;

    // No words available
    expect(function () {
      GameHelpers.getNextWordIndex(game);
    }).toThrow(Error);

    game = game.update('words', function (words) {
      return words
        .push(Immutable.fromJS({word: 'word0', inBowl: false}))
        .push(Immutable.fromJS({word: 'word1', inBowl: false}));
    });

    // Still no words in bowl
    expect(function () {
      GameHelpers.getNextWordIndex(game);
    }).toThrow(Error); // no words available

    game = game.update('words', function (words) {
      return words
        .push(Immutable.fromJS({word: 'word2', inBowl: true}))
        .push(Immutable.fromJS({word: 'word3', inBowl: false}))
        .push(Immutable.fromJS({word: 'word4', inBowl: false}));
    });

    // there is only one word in the bowl so it should be chosen
    expect(GameHelpers.getNextWordIndex(game)).toEqual(2);
  });

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
    var game = defaultGame
      .set('id', 'testid');
    var player1 = Immutable.fromJS({id: 'player1', team: 0});
    var player2 = Immutable.fromJS({id: 'player2', team: 0});
    var player3 = Immutable.fromJS({id: 'player3', team: 0});
    var player4 = Immutable.fromJS({id: 'player4', team: 0});
    var player5 = Immutable.fromJS({id: 'player5', team: 1});
    var player6 = Immutable.fromJS({id: 'player6', team: 1});
    game = game.set('players', game.get('players').push(player1, player2, player3, player4, player5, player6));
    expect(GameHelpers.getTeams(game).size).toEqual(2, 'There should be 2 teams');
    expect(GameHelpers.getTeams(game).get(0).get('players').size).toEqual(4, 'Team one should have 4 players');
    expect(GameHelpers.getTeams(game).get(1).get('players').size).toEqual(2, 'Team two should have 4 players');
  });

  it('getCurrentPlayer should work');

  it('userIsCurrentPlayer should work');

  it('userIsGuessing should work');

  it('getPlayerWords getUserWords should work', function () {
    var game = defaultGame;
    var userId = 'testId';
    var word1 = Immutable.fromJS({playerId: userId, word: 'word1'});
    var word2 = Immutable.fromJS({playerId: userId, word: 'word2'});
    var word3 = Immutable.fromJS({playerId: 'someOtherPlayer', word: 'word3'});

    game = game.set('userId', userId);
    expect(GameHelpers.getPlayerWords(game, userId).size).toEqual(0);

    game = game.set('words', game.get('words').push(word1));
    expect(GameHelpers.getPlayerWords(game, userId).size).toEqual(1);
    expect(GameHelpers.getPlayerWords(game, userId).get(0).get('word')).toEqual('word1');

    game = game.set('words', game.get('words').push(word2));
    expect(GameHelpers.getPlayerWords(game, userId).size).toEqual(2);

    game = game.set('words', game.get('words').push(word3));
    expect(GameHelpers.getPlayerWords(game, userId).size).toEqual(2);
    expect(GameHelpers.getUserWords(game).size).toEqual(2);
  });

  it('getPlayerIndex and getUserPlayerIndex should work', function () {
    var game = defaultGame
      .set('userId', 'p2')
      .update('players', function (players) {
        return players
          .push(Immutable.fromJS({id: 'p1'}))
          .push(Immutable.fromJS({id: 'p2'}))
          .push(Immutable.fromJS({id: 'p3'}));
      });

    expect(GameHelpers.getPlayerIndex(game, 'p1')).toEqual(0);
    expect(GameHelpers.getPlayerIndex(game, 'p2')).toEqual(1);
    expect(GameHelpers.getPlayerIndex(game, 'p3')).toEqual(2);
    expect(GameHelpers.getUserPlayerIndex(game)).toEqual(1);
  });
})
;