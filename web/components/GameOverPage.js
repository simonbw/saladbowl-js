var React = require('react');

var TeamList = require('./TeamList');
var GameHelpers = require('../GameHelpers');

module.exports = function (props) {
  var game = props.state.get('game');
  var teams = GameHelpers.getTeams(game);
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
            <span class="word">{mostSkipped.word}</span> with {mostSkipped.skips} skips.
          </div>
        </div>
      </div>
    </div>
  );
};