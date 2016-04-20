'use strict';

const React = require('react');

const GameHelpers = require('../../shared/GameHelpers');
const Timer = require('./Timer');
const UpdateGame = require('../UpdateGame');

module.exports = (props) => {
  const state = props.state;
  if (!state.get('game').get('roundStarted')) {
    return (<ReadyPage state={state}/>);
  } else {
    return (<PlayingPage state={state}/>);
  }
};


const phases = [
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
  const game = props.state.get('game');
  var phaseName;
  try {
    phaseName = phases[game.get('phaseIndex')][0];
  } catch (e) {
    console.log(game.get('phaseIndex'), phases);
    throw e;
  }
  const instructions = phases[game.get('phaseIndex')][1];
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
  const game = props.state.get('game');
  const word = game.get('words').get(game.get('wordIndex'));
  const phaseName = phases[game.get('phaseIndex')][0];
  return (
    <div>
      <h1>{phaseName}</h1>
      <Timer endTime={game.get('roundStartedAt') + game.get('secondsPerRound') * 1000}/>
      <div className="current-word word">{word.get('word')}</div>
      <button className="correct-button" onClick={UpdateGame.correctWord}>Correct</button>
      <button className="skip-button" onClick={UpdateGame.skipWord}>Skip</button>
    </div>
  );
}
