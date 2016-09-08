'use strict';

const React = require('react');

const GameActions = require('../actions/GameActions');


module.exports = (props) => {
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
  const classNames = ['team'];
  if (props.joinable) {
    onClick = () => {
      dispatch(GameActions.joinTeam(team.get('index')));
    };
    classNames.push('joinable');
  }
  if (team.get('current')) {
    classNames.push('current');
  }

  let header;
  if (props.showScore) {
    header = (<h2>{team.get('name')} {team.get('points').size}</h2>);
  } else {
    header = (<h2>{team.get('name')}</h2>);
  }

  return (
    <div className={classNames.join(' ')} onClick={onClick}>
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
  const classNames = [];
  if (player.get('current')) {
    classNames.push('current');
  }
  if (player.get('ready')) {
    classNames.push('ready');
  }
  if (player.get('connected')) {
    classNames.push('connected');
  }
  if (player.get('active')) {
    classNames.push('active');
  }
  return (<li className={classNames.join(' ')}>{player.get('name')}</li>);
}