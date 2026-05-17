'use strict';

import React from 'react';
import type * as Immutable from 'immutable';

import GameActions from '../actions/GameActions';
import type { Dispatch } from '../types';

type Team = Immutable.Map<string, any>;

interface TeamListProps {
  teams: Immutable.Collection.Indexed<Team>;
  dispatch: Dispatch;
  joinable: boolean;
  showScore: boolean;
}

export default (props: TeamListProps) => {
  return (
    <div className="team-list">
      {props.teams.map((team: Team, i: number) => {
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

interface TeamProps {
  dispatch: Dispatch;
  joinable: boolean;
  showScore: boolean;
  team: Team;
}

function Team(props: TeamProps) {
  const dispatch = props.dispatch;
  const team = props.team;

  let onClick: (() => void) | undefined;
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

  let header: React.ReactNode;
  if (props.showScore) {
    header = (<h2>{team.get('name')} {team.get('points').size}</h2>);
  } else {
    header = (<h2>{team.get('name')}</h2>);
  }

  return (
    <div className={classNames.join(' ')} onClick={onClick}>
      {header}
      <ol className="player-list">
        {team.get('players').map((player: Team) => {
          return (<Player player={player} key={player.get('id')}/>);
        }).toArray()}
      </ol>
    </div>
  );
}

interface PlayerProps {
  player: Team;
}

function Player(props: PlayerProps) {
  const player = props.player;
  const classNames: string[] = [];
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
