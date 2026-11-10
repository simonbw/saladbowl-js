'use strict';

import React, { useState } from 'react';

import { pluralize } from '../../shared/StringUtil';
import GameHelpers from '../../shared/GameHelpers';
import UIActions from '../actions/UIActions';
import { playAgain } from '../backend/session';
import { errorMessage } from '../errorMessage';
import { Header, Name, Screen, Spacer, Tally, TeamDot, shortTeamName } from './ui';
import type { PageProps } from '../types';

const TOP_PLAYERS = 3;

export default (props: PageProps) => {
  const game = props.state.get('game');
  const stats = GameHelpers.getGameStats(game);
  const [joining, setJoining] = useState(false);

  let headline = 'Nobody scored';
  if (stats.winners.length === 1) {
    headline = `${stats.teams[stats.winners[0]].name} win`;
  } else if (stats.winners.length > 1) {
    headline = "It's a tie";
  }

  const teams = [...stats.teams].sort((a, b) => b.total - a.total);
  const topPlayers = stats.players.filter((player) => player.points > 0).slice(0, TOP_PLAYERS);
  const nextGameCode = game.get('nextGameCode');

  const onPlayAgain = async () => {
    setJoining(true);
    try {
      const code = await playAgain();
      window.location.href = '/' + code;
    } catch (error) {
      console.error('play again failed:', error);
      props.dispatch(UIActions.showError(errorMessage(error)));
      setJoining(false);
    }
  };

  return (
    <Screen>
      <Header/>
      <div className="headline">
        <span className="label">Game over</span>
        <h1 className="title">{headline}</h1>
      </div>

      <div className="final-scores">
        {teams.map((team) => {
          const won = stats.winners.includes(team.index);
          return (
            <div key={team.index} className={'final-team' + (won ? ' won' : '')}>
              <div className="final-team-head">
                <TeamDot index={team.index}/>
                <span className="final-team-name">{shortTeamName(team.name)}</span>
                {won && stats.winners.length === 1 && <span className="badge">Winner</span>}
                <span className="final-team-total">{team.total}</span>
              </div>
              <div className="final-team-detail">
                <Tally count={team.total}/>
                <span className="rounds">rounds {team.byPhase.join(' · ')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {topPlayers.length > 0 && (
        <section className="stat-section">
          <span className="label">Best clue-givers</span>
          <ol className="clue-givers">
            {topPlayers.map((player, i) => (
              <li key={player.id}>
                <span className="rank">{i + 1}</span>
                <Name>{player.name}</Name>
                <span className="clue-giver-count">{pluralize(player.points, 'word')}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {stats.mostSkipped && (
        <section className="stat-section most-skipped">
          <div className="slip slip-small"><span className="hand">{stats.mostSkipped.word}</span></div>
          <div>
            <span className="label">Most skipped</span>
            <p>
              {pluralize(stats.mostSkipped.skips, 'skip')}
              {stats.mostSkipped.playerName && <> · <Name>{stats.mostSkipped.playerName}</Name></>}
            </p>
          </div>
        </section>
      )}

      <Spacer/>
      <button className="btn btn-primary" disabled={joining} onClick={onPlayAgain}>
        {joining ? 'Joining…' : nextGameCode ? 'Join the next game' : 'Play again'}
      </button>
    </Screen>
  );
};
