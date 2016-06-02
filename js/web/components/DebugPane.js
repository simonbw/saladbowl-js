'use strict';
// @flow


const React = require('react');

const ActionTypes = require('../../shared/ActionTypes.js');
const GameHelpers = require('../../shared/GameHelpers');
const UIActions = require('../actions/UIActions');

module.exports = (props:Object) => {
  const state = props.state;
  const dispatch = props.dispatch;

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
      <div style={style} onClick={() => dispatch(UIActions.updateField('debug', true))}>
        debug
      </div>
    )
  }

};
