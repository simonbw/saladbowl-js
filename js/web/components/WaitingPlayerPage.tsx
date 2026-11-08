'use strict';

import React from 'react';

import GameHelpers from '../../shared/GameHelpers';
import { pluralize } from '../../shared/StringUtil';
import Timer from './Timer';
import LastCorrectWord from './LastCorrectWord';
import TeamList from './TeamList';
import { PhaseBanner, TurnStatus } from './TurnInfo';
import type { PageProps } from '../types';


export default (props: PageProps) => {
  const game = props.state.get('game');
  const teams = GameHelpers.getTeams(game);
  const lastCorrectWord = game.get('words').get(game.get('lastCorrectWordIndex'));
  const wordsInBowl = GameHelpers.getWordsInBowl(game);
  const teamName = GameHelpers.getCurrentTeam(game).get('name');

  return (
    <div>
      <PhaseBanner game={game}/>
      <h1>{teamName} Are Up</h1>
      <TurnStatus state={props.state} dispatch={props.dispatch} guessing={false}/>
      {game.get('roundStarted') &&
      <Timer endTime={game.get('roundStartedAt') + game.get('secondsThisRound') * 1000}/>
      }
      <LastCorrectWord word={lastCorrectWord}/>
      <div className="words-remaining">{pluralize(wordsInBowl.size, 'word')} remaining</div>
      <TeamList
        dispatch={props.dispatch}
        joinable={false}
        showScore={true}
        teams={teams}
      />
    </div>
  );
};
