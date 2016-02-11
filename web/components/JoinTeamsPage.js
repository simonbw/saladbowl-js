var React = require('react');
var GameHelpers = require('../GameHelpers');

module.exports = function (props) {
  var game = props.game;
  var teams = GameHelpers.getTeams(game);
  var teamComponents = teams.map(function (team) {
    return (<Team team={team}/>);
  });
  return (
    <div>
      <h1>Join Teams</h1>
      <div>
      </div>
      <button>Start Game</button>
    </div>
  );
};

function Team(props) {
  var team = props.team;
  return (
    <div>
      <h2>Team Name</h2>
    </div>
  )
}