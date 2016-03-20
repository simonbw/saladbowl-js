var React = require('react');
var ReactRedux = require('react-redux');

var AddWordsPage = require('./AddWordsPage');
var CurrentPlayerPage = require('./CurrentPlayerPage');
var DebugPane = require('./DebugPane');
var GameHelpers = require('../GameHelpers');
var GameOverPage = require('./GameOverPage');
var GuessingPlayerPage = require('./GuessingPlayerPage');
var JoinGamePage = require('./JoinGamePage');
var JoinTeamsPage = require('./JoinTeamsPage');
var Random = require('../../shared/Random');
var UpdateGame = require('../UpdateGame');
var WaitingPlayerPage = require('./WaitingPlayerPage');

/**
 *
 * @constructor
 */
function GameComponent(props) {
  var dispatch = props.dispatch;
  var state = props.state;
  var game = state.get('game');
  var userId = state.get('userId');
  var ui = state.get('ui');


  if (!game.get('id')) {
    return (<div>Game Not Found</div>);
  }

  // Choose which page to show.
  var page;
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

  return (
    <div>
      {page}
      <DebugPane state={state} dispatch={dispatch}/>
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
