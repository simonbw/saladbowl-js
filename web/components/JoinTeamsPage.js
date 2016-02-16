var React = require('react');
var Immutable = require('immutable');

var GameHelpers = require('../GameHelpers');
var UpdateGame = require('../UpdateGame');

module.exports = function (props) {
  var game = props.game;
  var teams = GameHelpers.getTeams(game);
  teams = teams.push(Immutable.fromJS({
    name: 'New Team...',
    index: teams.size,
    players: []
  }));
  return (
    <div>
      <h1>Join Teams</h1>
      <div className="team-list">
        {teams.map(function (team, i) {
          return (<Team team={team} key={i}/>);
        }).toArray()}
      </div>
      <button>Start Game</button>
    </div>
  );
};

function Team(props) {
  var team = props.team;

  function onClick() {
    UpdateGame.joinTeam(team.get('index'));
  }

  return (
    <div className="team joinable" onClick={onClick}>
      <h2>{team.get('name')} Join</h2>
      <ol className="player-list">
        {team.get('players').map(function (player) {
          return (<Player player={player} key={player.get('id')} />);
        }).toArray()}
      </ol>
    </div>
  );
}

function Player(props) {
  var player = props.player;
  return (<li>{player.get('id')} - {player.get('name')}</li>);
}