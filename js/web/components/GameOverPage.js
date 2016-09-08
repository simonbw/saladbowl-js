'use strict';

const React = require('react');

const TeamList = require('./TeamList');
const GameHelpers = require('../../shared/GameHelpers');

module.exports = (props) => {
  const game = props.state.get('game');
  const teams = GameHelpers.getTeams(game);
  let mostSkipped = GameHelpers.getMostSkippedWord(game);
  mostSkipped = mostSkipped.set('player', GameHelpers.getPlayer(game, mostSkipped.get('playerId')));
  return (
    <div>
      <h1>Game Over</h1>
      <TeamList
        dispatch={props.dispatch}
        joinable={false}
        showScore={true}
        teams={teams}
      />
      <div className="game-over-stats">
        <div className="category">
          <div className="category-title">
            Most Skipped Noun
          </div>
          <div className="category-content">
            <span className="word">{mostSkipped.get('word')}</span> with {mostSkipped.get('skips')} skips.
          </div>
        </div>
      </div>
    </div>
  );
};