'use strict';

import React from 'react';

import ActionTypes from '../../shared/ActionTypes';
import GameHelpers from '../../shared/GameHelpers';
import * as Validation from '../../shared/Validation';
import GameActions from '../actions/GameActions';
import { isPending } from '../reducers/UIReducers';
import { BowlIcon, CodeChip, Header, Icon, Name, Screen, Spacer, TeamDot } from './ui';
import type { Game } from '../../shared/types';
import type { PageProps } from '../types';

/** The first thing still stopping the game from starting, or null when it's ready. */
function startBlocker(game: Game): string | null {
  const players = game.get('players');
  const writing = players
    .filter((player: any) => !GameHelpers.playerWordsAreValid(game, player.get('id')))
    .map((player: any) => player.get('name'));
  if (writing.size > 0) {
    return `Waiting for ${writing.join(', ')}`;
  }
  if (players.size < 4) {
    return `Need at least 4 players (${players.size} so far)`;
  }
  const teams = GameHelpers.getTeams(game);
  if (teams.size < 2) {
    return 'Need at least 2 teams';
  }
  if (!teams.every((team: any) => team.get('players').size >= 2)) {
    return 'Every team needs at least 2 players';
  }
  return null;
}

/** The lobby: pick a team, wait for everyone's slips, start. */
export default (props: PageProps) => {
  const { dispatch, state } = props;
  const game = state.get('game');
  const ui = state.get('ui');
  const userId = state.get('userId');
  const teams = GameHelpers.getTeams(game);
  const myTeam = GameHelpers.getPlayer(game, userId)?.get('team');
  const ready = GameHelpers.readyToStart(game);
  const blocker = ready ? null : startBlocker(game);

  const slipsIn = game.get('words').filter((word: any) => Validation.validateWord(word.get('word'))).size;
  const slipsTotal = game.get('players').size * game.get('wordsPerPlayer');

  return (
    <Screen>
      <Header right={<CodeChip code={game.get('id')}/>}/>
      <h1 className="title">Pick a team</h1>
      <div className="teams">
        {teams.map((team: any) => (
          <TeamCard
            key={team.get('index')}
            mine={team.get('index') === myTeam}
            onJoin={() => dispatch(GameActions.joinTeam(team.get('index')))}
            team={team}
            userId={userId}
          />
        )).toArray()}
        <div className="team-actions">
          <button type="button" className="btn btn-dashed" onClick={() => dispatch(GameActions.joinTeam(teams.size))}>
            <Icon.Plus/> New team
          </button>
          {game.get('players').size >= 3 && (
            <button
              type="button"
              className="btn btn-outline"
              disabled={isPending(ui, ActionTypes.SERVER.SHUFFLE_TEAMS)}
              onClick={() => dispatch(GameActions.shuffleTeams())}
            >
              <Icon.Shuffle/> Shuffle teams
            </button>
          )}
        </div>
      </div>
      <Spacer/>
      <div className="bowl-status">
        <BowlIcon/>
        <div>
          <p className="bowl-status-main">{slipsIn} of {slipsTotal} slips in the bowl</p>
          {blocker && <p className="bowl-status-sub">{blocker}</p>}
        </div>
      </div>
      <button
        className="btn btn-primary"
        disabled={!ready || isPending(ui, ActionTypes.SERVER.START_GAME)}
        onClick={() => dispatch(GameActions.startGame())}
      >
        Start game
      </button>
    </Screen>
  );
};

function TeamCard(props: { team: any; mine: boolean; onJoin: () => void; userId: string }) {
  const { team, mine } = props;
  return (
    <section className={'team-card' + (mine ? ' mine' : '')}>
      <div className="team-card-head">
        <TeamDot index={team.get('index')}/>
        <h2>{team.get('name')}</h2>
        {mine
          ? <span className="team-card-note">Your team</span>
          : <button type="button" className="btn-pill" onClick={props.onJoin}>Join</button>}
      </div>
      {team.get('players').size > 0 && (
        <ul className="player-chips">
          {team.get('players').map((player: any) => (
            <PlayerChip key={player.get('id')} player={player} you={player.get('id') === props.userId}/>
          )).toArray()}
        </ul>
      )}
    </section>
  );
}

/** A player's name on a slip. Dashed while they're still writing nouns; faded while offline. */
export function PlayerChip(props: { player: any; you?: boolean }) {
  const { player, you } = props;
  const classes = ['player-chip'];
  if (you) {
    classes.push('you');
  } else if (!player.get('ready')) {
    classes.push('writing');
  }
  if (!player.get('connected') && !you) {
    classes.push('offline');
  }
  return (
    <li className={classes.join(' ')}>
      <Name>{player.get('name')}</Name>
      {you && <span className="chip-note">you</span>}
      {!you && !player.get('ready') && <span className="chip-note">writing…</span>}
    </li>
  );
}
