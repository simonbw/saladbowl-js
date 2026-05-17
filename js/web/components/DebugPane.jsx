'use strict';

import React from 'react';

import ActionTypes from '../../shared/ActionTypes.js';
import GameHelpers from '../../shared/GameHelpers';
import UIActions from '../actions/UIActions';

export default (props) => {
  const state = props.state;
  const dispatch = props.dispatch;

  if (state.get('ui').get('debug')) {
    return (
      <div className="debug">
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
