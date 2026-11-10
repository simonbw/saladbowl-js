'use strict';

import React from 'react';

import UIActions from '../actions/UIActions';
import type { PageProps } from '../types';

export default (props: PageProps) => {
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
    return (
      <div className="debug-toggle" onClick={() => dispatch(UIActions.updateField('debug', true))}>
        debug
      </div>
    )
  }

};
