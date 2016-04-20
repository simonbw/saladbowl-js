'use strict';

const React = require('react');

const GameHelpers = require('../../shared/GameHelpers');
const Timer = require('./Timer');
const LastCorrectWord = require('./LastCorrectWord');
const TeamList = require('./TeamList');


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
      <div>{wordsInBowl.size} words remaining</div>
      <TeamList teams={teams} showScore={true}/>
    </div>
  );
};