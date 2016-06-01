'use strict';

const defaultGame = require('../js/shared/defaultGame');
const describe = require('mocha').describe;
const expect = require('expect');
const GameHelpers = require('../js/shared/GameHelpers');
const Immutable = require('immutable');
const it = require('mocha').it;


describe('GameHelpers', () => {
  it('getNextWordIndex should work', () => {
    let game = defaultGame;

    // No words available
    expect(() => {
      GameHelpers.getNextWordIndex(game);
    }).toThrow(Error);

    game = game.set('words', game.get('words')
      .push(Immutable.fromJS({word: 'word0', index: 0, inBowl: false}))
      .push(Immutable.fromJS({word: 'word1', index: 1, inBowl: false})));

    // Still no words in bowl
    expect(() => {
      GameHelpers.getNextWordIndex(game);
    }).toThrow(Error); // no words available

    game = game.set('words', game.get('words')
      .push(Immutable.fromJS({word: 'word2', index: 2, inBowl: true}))
      .push(Immutable.fromJS({word: 'word3', index: 3, inBowl: false}))
      .push(Immutable.fromJS({word: 'word4', index: 4, inBowl: false})));

    // there is only one word in the bowl so it should be chosen
    expect(GameHelpers.getNextWordIndex(game)).toEqual(2);
  });

  it('playerIsJoined should work', () => {
    let game = defaultGame;
    const userId = 'userId';
    expect(GameHelpers.playerIsJoined(game, userId)).toEqual(false);
    game = game.set('userId', userId);
    expect(GameHelpers.playerIsJoined(game, userId)).toEqual(false);
    game = game.set('players', game.get('players').push(Immutable.fromJS({id: 'notUserId'})));
    expect(GameHelpers.playerIsJoined(game, userId)).toEqual(false);
    game = game.set('players', game.get('players').push(Immutable.fromJS({id: userId})));
    expect(GameHelpers.playerIsJoined(game, userId)).toEqual(true);
  });

  it('getTeams should work', () => {
    let game = defaultGame
      .set('id', 'testid');
    const player1 = Immutable.fromJS({id: 'player1', team: 0});
    const player2 = Immutable.fromJS({id: 'player2', team: 0});
    const player3 = Immutable.fromJS({id: 'player3', team: 0});
    const player4 = Immutable.fromJS({id: 'player4', team: 0});
    const player5 = Immutable.fromJS({id: 'player5', team: 1});
    const player6 = Immutable.fromJS({id: 'player6', team: 1});
    game = game.set('players', game.get('players').push(player1, player2, player3, player4, player5, player6));
    expect(GameHelpers.getTeams(game).size).toEqual(2, 'There should be 2 teams');
    expect(GameHelpers.getTeams(game).get(0).get('players').size).toEqual(4, 'Team one should have 4 players');
    expect(GameHelpers.getTeams(game).get(1).get('players').size).toEqual(2, 'Team two should have 4 players');
  });

  it('getCurrentPlayer should work');

  it('getCurrentTeam should work');

  it('playerIsGuessing should work');

  it('getPlayerWords should work', () => {
    let game = defaultGame;
    const userId = 'testId';
    const word1 = Immutable.fromJS({playerId: userId, word: 'word1'});
    const word2 = Immutable.fromJS({playerId: userId, word: 'word2'});
    const word3 = Immutable.fromJS({playerId: 'someOtherPlayer', word: 'word3'});

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

  it('getPlayerIndex should work', () => {
    let game = defaultGame
      .set('userId', 'p2')
      .update('players', (players) => {
        return players
          .push(Immutable.fromJS({id: 'p1'}))
          .push(Immutable.fromJS({id: 'p2'}))
          .push(Immutable.fromJS({id: 'p3'}));
      });

    expect(GameHelpers.getPlayerIndex(game, 'p1')).toEqual(0);
    expect(GameHelpers.getPlayerIndex(game, 'p2')).toEqual(1);
    expect(GameHelpers.getPlayerIndex(game, 'p3')).toEqual(2);
  });

  it('readyToStart should work', () => {
    let game = defaultGame.set('id', 'testgame');
    expect(GameHelpers.readyToStart(game)).toEqual(false);
    game = game.update('words', (words) => {
      return words
        .push(Immutable.fromJS({word: 'word1', inBowl: true}))
        .push(Immutable.fromJS({word: 'word2', inBowl: true}))
        .push(Immutable.fromJS({word: 'word3', inBowl: true}))
        .push(Immutable.fromJS({word: 'word4', inBowl: true}));
    });
    expect(GameHelpers.readyToStart(game)).toEqual(false);
    game = game.update('players', (players) => {
      return players
        .push(Immutable.fromJS({id: 'p1', team: 0}))
        .push(Immutable.fromJS({id: 'p2', team: 0}))
        .push(Immutable.fromJS({id: 'p3', team: 1}))
        .push(Immutable.fromJS({id: 'p4', team: 1}));
    });
    expect(GameHelpers.readyToStart(game)).toEqual(true);
  });

  it('getMostSkippedWord should work', () => {
    const word1 = Immutable.fromJS({word: 'word1', skips: 3});
    const word2 = Immutable.fromJS({word: 'word2', skips: 5});
    const word3 = Immutable.fromJS({word: 'word3', skips: 1});
    const game = defaultGame.set('words', defaultGame.get('words').push(word1, word2, word3));

    expect(GameHelpers.getMostSkippedWord(game)).toEqual(word2);
    expect(GameHelpers.getMostSkippedWord(game).get('word')).toEqual('word2');
  });

});
