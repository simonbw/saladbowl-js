'use strict';

import React from 'react';
import * as Immutable from 'immutable';

import ActionTypes from '../../shared/ActionTypes';
import GameHelpers from '../../shared/GameHelpers';
import TeamList from './TeamList';
import ShareGame from './ShareGame';
import GameActions from '../actions/GameActions';
import { isPending } from '../reducers/UIReducers';
import type { Game } from '../../shared/types';
import type { PageProps } from '../types';

/** What still has to happen before the game can start. Empty when ready. */
function startBlockers(game: Game): string[] {
  const blockers: string[] = [];
  const players = game.get('players');
  if (players.size < 4) {
    blockers.push(`Need at least 4 players (${players.size} so far).`);
  }
  const writing = players
    .filter((player: any) => !GameHelpers.playerWordsAreValid(game, player.get('id')))
    .map((player: any) => player.get('name'));
  if (writing.size > 0) {
    blockers.push(`Waiting for ${writing.join(', ')} to add nouns.`);
  }
  const teams = GameHelpers.getTeams(game);
  if (teams.size < 2) {
    blockers.push('Need at least 2 teams. Tap "New Team..." to start one.');
  } else if (!teams.every((team: any) => team.get('players').size >= 2)) {
    blockers.push('Every team needs at least 2 players.');
  }
  return blockers;
}

export default (props: PageProps) => {
  const dispatch = props.dispatch;
  const game = props.state.get('game');
  const teams = GameHelpers.getTeams(game).push(Immutable.fromJS({
    name: 'New Team...',
    index: GameHelpers.getTeams(game).size,
    players: []
  }));
  const ready = GameHelpers.readyToStart(game);
  const blockers = ready ? [] : startBlockers(game);

  return (
    <div>
      <h1>Join Teams</h1>
      <div className="hint">Tap a team to join or switch to it.</div>
      <TeamList
        dispatch={props.dispatch}
        joinable={true}
        showScore={false}
        teams={teams}
      />
      {game.get('players').size >= 3 && (
        <button
          className="shuffle-teams-button"
          disabled={isPending(props.state.get('ui'), ActionTypes.SERVER.SHUFFLE_TEAMS)}
          onClick={() => dispatch(GameActions.shuffleTeams())}
        >
          Shuffle teams
        </button>
      )}
      {ready ? (
        <button
          disabled={isPending(props.state.get('ui'), ActionTypes.SERVER.START_GAME)}
          onClick={() => dispatch(GameActions.startGame())}
        >
          Start Game
        </button>
      ) : (
        <ul className="lobby-status">
          {blockers.map((blocker) => <li key={blocker}>{blocker}</li>)}
        </ul>
      )}
      <ShareGame code={game.get('id')}/>
    </div>
  );
};
