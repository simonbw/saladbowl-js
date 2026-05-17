'use strict';

import React from 'react';

import GameHelpers from '../../shared/GameHelpers';
import Timer from './Timer';
import LastCorrectWord from './LastCorrectWord';
import TeamList from './TeamList';
import type { PageProps } from '../types';


export default (props: PageProps) => {
  const game = props.state.get('game');
  const teams = GameHelpers.getTeams(game);
  const lastCorrectWord = game.get('words').get(game.get('lastCorrectWordIndex'));
  const wordsInBowl = GameHelpers.getWordsInBowl(game);

  return (
    <div>
      <h1>Waiting...</h1>
      {game.get('roundStarted') &&
      <Timer endTime={game.get('roundStartedAt') + game.get('secondsThisRound') * 1000}/>
      }
      <LastCorrectWord word={lastCorrectWord}/>
      <div>{wordsInBowl.size} words remaining</div>
      <TeamList
        dispatch={props.dispatch}
        joinable={false}
        showScore={true}
        teams={teams}
      />
    </div>
  );
};
