'use strict';

const React = require('react');

const TeamList = require('./TeamList');
const GameHelpers = require('../../shared/GameHelpers');

module.exports = (props) => {
  const game = props.state.get('game');
  const teams = GameHelpers.getTeams(game);
  var mostSkipped = GameHelpers.getMostSkippedWord(game);
  mostSkipped = mostSkipped.set('player', GameHelpers.getPlayer(game, mostSkipped.get('playerId')));
  return (
    <div>
      <h1>Game Over</h1>
      <TeamList teams={teams} showScore={true}/>
      <div className="game-over-stats">
        <div className="category">
          <div className="category-title">
            Most Skipped Word
          </div>
          <div className="category-content">
            <span className="word">{mostSkipped.get('word')}</span> with {mostSkipped.get('skips')} skips.
          </div>
        </div>
      </div>
    </div>
  );
};