var React = require('react');

var GameHelpers = require('../GameHelpers');
var LastCorrectWord = require('./LastCorrectWord');
var TeamList = require('./TeamList');


module.exports = function (props) {
  var game = props.state.get('game');
  var teams = GameHelpers.getTeams(game);
  var lastCorrectWord = game.get('words').get(game.get('lastCorrectWordIndex'));
  var wordsInBowl = GameHelpers.getWordsInBowl(game);

  return (
    <div>
      <h1>Waiting...</h1>
      <LastCorrectWord word={lastCorrectWord}/>
      <div>{wordsInBowl.size} words remaining</div>
      <TeamList teams={teams} showScore={true}/>
    </div>
  );
};