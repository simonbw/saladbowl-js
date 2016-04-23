'use strict';

const React = require('react');

const GameHelpers = require('../../shared/GameHelpers');
const ActionTypes = require('../../shared/ActionTypes.js');

module.exports = (props) => {
  const state = props.state;
  const dispatch = props.dispatch;

  function showDebug() {
    dispatch({
      type: ActionTypes.UI.FIELD_CHANGED,
      field: 'debug',
      value: true
    });
  }

  if (state.get('ui').get('debug')) {
    return (
      <div className="debug-bar">
        <pre>
          {JSON.stringify(state, null, 2)}
        </pre>
      </div>
    );
  } else {
    const style = {
      margin: '20px',
      fontSize: '8px'
    };
    return (
      <div style={style} onClick={showDebug}>
        debug
      </div>
    )
  }

};
