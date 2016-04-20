'use strict';

const React = require('react');

const UpdateGame = require('../UpdateGame');


module.exports = (props) => {
  return (
    <div className="team-list">
      {props.teams.map((team, i) => {
        return (<Team team={team} joinable={props.joinable} showScore={props.showScore} key={i}/>);
      }).toArray()}
    </div>
  );
};

function Team(props) {
  const team = props.team;

  var onClick;
  var className = "team";
  if (props.joinable) {
    onClick = () => {
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
        {team.get('players').map((player) => {
          return (<Player player={player} key={player.get('id')}/>);
        }).toArray()}
      </ol>
    </div>
  );
}

function Player(props) {
  const player = props.player;
  var className = '';
  if (player.get('current')) {
    className += ' current';
  }
  if (player.get('ready')) {
    className += ' ready';
  }
  return (<li className={className}>{player.get('name')}</li>);
}