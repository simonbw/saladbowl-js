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
  var ui = state.get('ui');


  if (!game.get('id')) {
    return (<div>Game Not Found</div>);
  }

  // Choose which page to show.
  var page;
  if (!GameHelpers.userIsJoined(game)) {
    if (game.get('started')) {
      page = (<div>You cannot join a game once it has started.</div>)
    } else {
      page = (<JoinGamePage game={game} ui={ui} dispatch={dispatch}/>);
    }
  } else if (!GameHelpers.userWordsAreValid(game)) {
    page = (<AddWordsPage game={game} ui={ui} dispatch={dispatch}/>);
  } else if (!game.get('started')) {
    page = (<JoinTeamsPage game={game} ui={ui} dispatch={dispatch}/>);
  } else if (!game.get('ended')) {
    page = (<GameOverPage game={game} ui={ui} dispatch={dispatch}/>);
  } else if (GameHelpers.userIsCurrentPlayer(game)) {
    page = (<CurrentPlayerPage game={game} ui={ui} dispatch={dispatch}/>);
  } else if (GameHelpers.userIsGuessing(game)) {
    page = (<GuessingPlayerPage game={game} ui={ui} dispatch={dispatch}/>);
  } else {
    page = (<WaitingPlayerPage game={game} ui={ui} dispatch={dispatch}/>);
  }

  return (
    <div>
      {page}
      <DebugPane state={state}/>
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
