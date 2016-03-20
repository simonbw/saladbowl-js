var React = require('react');

var UpdateGame = require('../UpdateGame');
var GameHelpers = require('../GameHelpers');

module.exports = function (props) {
  var state = props.state;
  if (!state.get('game').get('roundStarted')) {
    return (<ReadyPage state={state}/>);
  } else {
    return (<PlayingPage state={state}/>);
  }
};


var phases = [
  ['Describe it', 'Say anything but the word.'],
  ['Charades', 'Just don\'t make a sound.'],
  ['One Word', 'You only get one word.']
];

/**
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
function ReadyPage(props) {
  var game = props.state.get('game');
  try {
    var phaseName = phases[game.get('phaseIndex')][0];
  } catch (e) {
    console.log(game.get('phaseIndex'), phases);
    throw e;
  }
  var instructions = phases[game.get('phaseIndex')][1];
  return (
    <div>
      <h1>{phaseName}</h1>
      <div className="phase-instructions">{instructions}</div>
      <button onClick={UpdateGame.startRound}>Ready</button>
    </div>
  );
}

/**
 *
 * @param props
 * @returns {XML}
 * @constructor
 */
function PlayingPage(props) {
  var game = props.state.get('game');
  var word = game.get('words').get(game.get('wordIndex'));
  var phaseName = phases[game.get('phaseIndex')][0];
  var instructions = phases[game.get('phaseIndex')][1];
  return (
    <div>
      <h1 className="phase-instructions">{phaseName}</h1>
      <div className="current-word word">{word.get('word')}</div>
      <button className="correct-button" onClick={UpdateGame.correctWord}>Correct</button>
      <button className="skip-button" onClick={UpdateGame.skipWord}>Skip</button>
    </div>
  );
}
