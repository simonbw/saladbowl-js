var React = require('react');
var Immutable = require('immutable');

var GameHelpers = require('../GameHelpers');
var TeamList = require('./TeamList');
var UpdateGame = require('../UpdateGame');

module.exports = function (props) {
  var game = props.state.get('game');
  var teams = GameHelpers.getTeams(game)
    .map(function (team) {
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
      <TeamList teams={teams} joinable={true} score={false} />
      <button disabled={!GameHelpers.readyToStart(game)} onClick={startGame}>Start Game</button>
    </div>
  );
};
