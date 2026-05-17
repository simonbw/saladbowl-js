'use strict';

import React from 'react';
import * as Immutable from 'immutable';

import GameHelpers from '../../shared/GameHelpers';
import TeamList from './TeamList';
import GameActions from '../actions/GameActions';

export default (props) => {
  const dispatch = props.dispatch;
  const game = props.state.get('game');
  let teams = GameHelpers.getTeams(game)
    .map((team) => {
      return team;
    });
  teams = teams.push(Immutable.fromJS({
    name: 'New Team...',
    index: teams.size,
    players: []
  }));

  return (
    <div>
      <h1>Join Teams</h1>
      <h2 className="game-id">GameID: {game.get('id')}</h2>
      <TeamList
        dispatch={props.dispatch}
        joinable={true}
        showScore={false}
        teams={teams}
      />
      {GameHelpers.readyToStart(game) &&
      <button onClick={() => dispatch(GameActions.startGame())}>Start Game</button>
      }
    </div>
  );
};
