'use strict';

const React = require('react');

const GameActions = require('../actions/GameActions.js');
const GameHelpers = require('../../shared/GameHelpers');
const LastCorrectWord = require('./LastCorrectWord');
const TeamList = require('./TeamList');
const Timer = require('./Timer');


module.exports = (props) => {
  const game = props.state.get('game');
  const teams = GameHelpers.getTeams(game);
  const lastCorrectWord = game.get('words').get(game.get('lastCorrectWordIndex'));
  const wordsInBowl = GameHelpers.getWordsInBowl(game);

  return (
    <div>
      <h1>You Are Guessing</h1>
      {game.get('roundStarted') &&
      <Timer endTime={game.get('roundStartedAt') + game.get('secondsPerRound') * 1000}/>
      }
      <LastCorrectWord word={lastCorrectWord}/>
      { /*TODO: Pluralize "words"*/ }
      <div>{wordsInBowl.size} words remaining</div>
      <TeamList
        dispatch={props.dispatch}
        joinable={false}
        showScore={true}
        teams={teams}
      />
      {!game.get('roundStarted') && !GameHelpers.isCurrentPlayerConnected(game) &&
      <button
        className="skip-player-button"
        onClick={() => props.dispatch(GameActions.skipPlayer(GameHelpers.getCurrentPlayer(game).get('id')))}
      >
        SKIP PLAYER
      </button>
      }
    </div>
  );
};