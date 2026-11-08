'use strict';

import React, { useState } from 'react';

import TeamList from './TeamList';
import GameHelpers from '../../shared/GameHelpers';
import { PHASE_COUNT, getPhase } from '../../shared/Phases';
import { pluralize } from '../../shared/StringUtil';
import UIActions from '../actions/UIActions';
import { playAgain } from '../backend/session';
import { errorMessage } from '../errorMessage';
import type { PageProps } from '../types';

const TOP_PLAYERS = 3;

export default (props: PageProps) => {
  const game = props.state.get('game');
  const userId = props.state.get('userId');
  const teams = GameHelpers.getTeams(game);
  const stats = GameHelpers.getGameStats(game);
  const myTeam = GameHelpers.getPlayer(game, userId)?.get('team');
  const [joining, setJoining] = useState(false);

  let headline = 'Game Over';
  let subhead: string | null = null;
  if (stats.winners.length === 1) {
    const winner = stats.teams[stats.winners[0]];
    headline = `${winner.name} Win!`;
    if (myTeam != null) {
      subhead = myTeam === winner.index ? 'Your team won!' : 'Better luck next time.';
    }
  } else if (stats.winners.length > 1) {
    headline = "It's a Tie!";
  }

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
    <div>
      <h1>{headline}</h1>
      {subhead && <div className="hint">{subhead}</div>}

      <table className="score-table">
        <thead>
          <tr>
            <th>Team</th>
            {Array.from({ length: PHASE_COUNT }, (_, i) => (
              <th key={i} title={getPhase(i).name}>R{i + 1}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {stats.teams.map((team) => (
            <tr key={team.index} className={stats.winners.includes(team.index) ? 'winner' : ''}>
              <td>{team.name}</td>
              {team.byPhase.map((points, i) => <td key={i}>{points}</td>)}
              <td className="total">{team.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="play-again-button" disabled={joining} onClick={onPlayAgain}>
        {joining ? 'Joining…' : nextGameCode ? 'Join the next game' : 'Play again'}
      </button>
      {nextGameCode && !joining && <div className="hint">A new game is ready. Same teams, fresh nouns.</div>}

      <div className="game-over-stats">
        {topPlayers.length > 0 && (
          <div className="category">
            <div className="category-title">Best Clue-Givers</div>
            <div className="category-content">
              <ol>
                {topPlayers.map((player) => (
                  <li key={player.id}>{player.name}: {pluralize(player.points, 'word')}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
        {stats.mostSkipped && (
          <div className="category">
            <div className="category-title">Most Skipped Noun</div>
            <div className="category-content">
              <span className="word">{stats.mostSkipped.word}</span>, skipped {pluralize(stats.mostSkipped.skips, 'time')}
              {stats.mostSkipped.playerName && <> (from {stats.mostSkipped.playerName})</>}
            </div>
          </div>
        )}
      </div>

      <TeamList
        dispatch={props.dispatch}
        joinable={false}
        showScore={true}
        teams={teams}
      />
    </div>
  );
};
