var expect = require('expect');
var Immutable = require('immutable');

var defaultGame = require('../shared/defaultGame');
var GameHelpers = require('../web/GameHelpers');


describe('GameHelpers', function () {
  it('getNextWordIndex should work', function () {
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

  it('playerIsJoined should work', function () {
    var game = defaultGame;
    var userId = 'userId';
    expect(GameHelpers.playerIsJoined(game, userId)).toEqual(false);
    game = game.set('userId', userId);
    expect(GameHelpers.playerIsJoined(game, userId)).toEqual(false);
    game = game.set('players', game.get('players').push(Immutable.fromJS({id: 'notUserId'})));
    expect(GameHelpers.playerIsJoined(game, userId)).toEqual(false);
    game = game.set('players', game.get('players').push(Immutable.fromJS({id: userId})));
    expect(GameHelpers.playerIsJoined(game, userId)).toEqual(true);
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

  it('getCurrentTeam should work');

  it('playerIsGuessing should work');

  it('getPlayerWords should work', function () {
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
  });

  it('playerWordsAreValid should work');

  it('getPlayerIndex should work', function () {
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
  });

  it('readyToStart should work', function () {
    var game = defaultGame.set('id', 'testgame');
    expect(GameHelpers.readyToStart(game)).toEqual(false);
    game = game.update('words', function (words) {
      return words
        .push(Immutable.fromJS({word: 'word1', inBowl: true}))
        .push(Immutable.fromJS({word: 'word2', inBowl: true}))
        .push(Immutable.fromJS({word: 'word3', inBowl: true}))
        .push(Immutable.fromJS({word: 'word4', inBowl: true}));
    });
    expect(GameHelpers.readyToStart(game)).toEqual(false);
    game = game.update('players', function (players) {
      return players
        .push(Immutable.fromJS({id: 'p1', team: 0}))
        .push(Immutable.fromJS({id: 'p2', team: 0}))
        .push(Immutable.fromJS({id: 'p3', team: 1}))
        .push(Immutable.fromJS({id: 'p4', team: 1}));
    });
    expect(GameHelpers.readyToStart(game)).toEqual(true);
  });

  it('getMostSkippedWord should work', function () {
    var word1 = Immutable.fromJS({word: 'word1', skips: 3});
    var word2 = Immutable.fromJS({word: 'word2', skips: 5});
    var word3 = Immutable.fromJS({word: 'word3', skips: 1});
    var game = defaultGame.update('words', function (words) {
      return words.push(word1, word2, word3)
    });

    expect(GameHelpers.getMostSkippedWord(game)).toEqual(word2);
  });

});
