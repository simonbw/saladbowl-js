'use strict';

const React = require('react');

const GameHelpers = require('../../shared/GameHelpers');
const Timer = require('./Timer');
const GameActions = require('../actions/GameActions');

module.exports = (props) => {
  const state = props.state;
  if (!state.get('game').get('roundStarted')) {
    return (<ReadyPage state={state} dispatch={props.dispatch}/>);
  } else {
    return (<PlayingPage state={state} dispatch={props.dispatch}/>);
  }
};

const phases = [
  ['Describe it', 'Say anything but the word.'],
  ['Charades', 'Just don\'t make a sound.'],
  ['One Word', 'You only get one word.']
];

function ReadyPage(props) {
  const dispatch = props.dispatch;
  const game = props.state.get('game');
  let phaseName;
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
      <button onClick={() => dispatch(GameActions.startRound())}>Ready</button>
    </div>
  );
}

function PlayingPage(props) {
  const game = props.state.get('game');
  const word = game.get('words').get(game.get('wordIndex'));
  const phaseName = phases[game.get('phaseIndex')][0];
  const canSkip = GameHelpers.canSkip(game);
  const waitingForServer = props.state.get('ui').get('waitingForServer');
  return (
    <div>
      <h1>{phaseName}</h1>
      <Timer endTime={game.get('roundStartedAt') + game.get('secondsPerRound') * 1000}/>
      <div className="current-word word">
        {waitingForServer ? ' ' : word.get('word')}
      </div>
      <button
        className="correct-button"
        disabled={waitingForServer}
        onClick={() => props.dispatch(GameActions.correctWord())}
      >
        Correct
      </button>
      <button
        className="skip-button"
        onClick={() => props.dispatch(GameActions.skipWord())}
        disabled={waitingForServer || !canSkip}
      >
        {canSkip ? "Skip" : "Last Word"}
      </button>
    </div>
  );
}