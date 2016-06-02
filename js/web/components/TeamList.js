'use strict';
// @flow


const React = require('react');

const GameActions = require('../actions/GameActions');


module.exports = (props:Object) => {
  return (
    <div className="team-list">
      {props.teams.map((team, i) => {
        return (<Team
          dispatch={props.dispatch}
          joinable={props.joinable}
          key={i}
          showScore={props.showScore}
          team={team}
        />);
      }).toArray()}
    </div>
  );
};

function Team(props) {
  const dispatch = props.dispatch;
  const team = props.team;

  let onClick;
  let className = "team";
  if (props.joinable) {
    onClick = () => {
      dispatch(GameActions.joinTeam(team.get('index')));
    };
    className += ' joinable';
  }
  if (team.get('current')) {
    className += ' current';
  }

  let header;
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
  let className = '';
  if (player.get('current')) {
    className += ' current';
  }
  if (player.get('ready')) {
    className += ' ready';
  }
  return (<li className={className}>{player.get('name')}</li>);
}