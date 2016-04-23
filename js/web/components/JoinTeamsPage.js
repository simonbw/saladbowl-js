'use strict';

const React = require('react');
const Immutable = require('immutable');

const GameHelpers = require('../../shared/GameHelpers');
const TeamList = require('./TeamList');
const UpdateGame = require('../UpdateGame');

module.exports = (props) => {
  const game = props.state.get('game');
  var teams = GameHelpers.getTeams(game)
    .map((team) => {
      return team;
    });
  teams = teams.push(Immutable.fromJS({
    name: 'New Team...',
    index: teams.size,
    players: []
  }));

  function startGame() {
    UpdateGame.startGame();
  }

  return (
    <div>
      <h1>Join Teams</h1>
      <h2 className="game-id">{game.get('id')}</h2>
      <TeamList teams={teams} joinable={true} score={false}/>
      {GameHelpers.readyToStart(game) &&
      <button onClick={startGame}>Start Game</button>
      }
    </div>
  );
};
