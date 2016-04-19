'use strict';

const React = require('react');
const ReactRedux = require('react-redux');

const AddWordsPage = require('./AddWordsPage');
const CurrentPlayerPage = require('./CurrentPlayerPage');
const DebugPane = require('./DebugPane');
const GameHelpers = require('../../shared/GameHelpers');
const GameOverPage = require('./GameOverPage');
const GuessingPlayerPage = require('./GuessingPlayerPage');
const JoinGamePage = require('./JoinGamePage');
const JoinTeamsPage = require('./JoinTeamsPage');
const Random = require('../../shared/Random');
const GameActions = require('../actions/GameActions');
const WaitingPlayerPage = require('./WaitingPlayerPage');

/**
 *
 * @constructor
 */
function GameComponent(props) {
  const dispatch = props.dispatch;
  const state = props.state;
  const game = state.get('game');
  const userId = state.get('userId');
  const ui = state.get('ui');


  if (!game.get('id')) {
    return (<div>Game Not Found</div>);
  }

  // Choose which page to show.
  let page;
  if (!GameHelpers.playerIsJoined(game, userId)) {
    if (game.get('started')) {
      page = (<div>You cannot join a game once it has started.</div>)
    } else {
      page = (<JoinGamePage state={state} dispatch={dispatch}/>);
    }
  } else if (!GameHelpers.playerWordsAreValid(game, userId)) {
    page = (<AddWordsPage state={state} dispatch={dispatch}/>);
  } else if (!game.get('started')) {
    page = (<JoinTeamsPage state={state} dispatch={dispatch}/>);
  } else if (game.get('ended')) {
    page = (<GameOverPage state={state} dispatch={dispatch}/>);
  } else if (GameHelpers.getCurrentPlayer(game).get('id') == userId) {
    page = (<CurrentPlayerPage state={state} dispatch={dispatch}/>);
  } else if (GameHelpers.playerIsGuessing(game, userId)) {
    page = (<GuessingPlayerPage state={state} dispatch={dispatch}/>);
  } else {
    page = (<WaitingPlayerPage state={state} dispatch={dispatch}/>);
  }

  const errors = [];
  if (ui.get('connected') === false) {
    errors.push(<div key={0} className="error">Disconnected</div>);
  }
  if (ui.get('synced') == false) {
    errors.push(<div key={1} className="error">Out Of Sync</div>);
  }

  return (
    <div>
      {errors.length > 0 &&
      <div className="errors">{errors}</div>
      }
      {page}
      {window.DEBUG_MODE &&
      <DebugPane state={state} dispatch={dispatch}/>
      }
    </div>
  );
}


/**
 *
 * @param state
 * @returns {{state: *}}
 */
function mapStateToProps(state) {
  return {
    'state': state
  };
}

module.exports = ReactRedux.connect(mapStateToProps)(GameComponent);
