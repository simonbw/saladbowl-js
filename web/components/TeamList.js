var React = require('react');

var UpdateGame = require('../UpdateGame');


module.exports = function (props) {
  return (
    <div className="team-list">
      {props.teams.map(function (team, i) {
        return (<Team team={team} joinable={props.joinable} showScore={props.showScore} key={i}/>);
      }).toArray()}
    </div>
  );
};

function Team(props) {
  var team = props.team;

  var onClick;
  var className = "team";
  if (props.joinable) {
    onClick = function () {
      UpdateGame.joinTeam(team.get('index'));
    };
    className += ' joinable';
  }
  if (team.get('current')) {
    className += ' current';
  }

  var header;
  if (props.showScore) {
    header = (<h2>{team.get('name')} {team.get('points').size}</h2>);
  } else {
    header = (<h2>{team.get('name')}</h2>);
  }

  return (
    <div className={className} onClick={onClick}>
      {header}
      <ol className="player-list">
        {team.get('players').map(function (player) {
          return (<Player player={player} key={player.get('id')}/>);
        }).toArray()}
      </ol>
    </div>
  );
}

function Player(props) {
  var player = props.player;
  var className = '';
  if (player.get('current')) {
    className += ' current';
  }
  if (player.get('ready')) {
    className += ' ready';
  }
  return (<li className={className}>{player.get('name')}</li>);
}