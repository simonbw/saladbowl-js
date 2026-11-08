'use strict';

import React from 'react';
import type * as Immutable from 'immutable';

interface LastCorrectWordProps {
  word?: Immutable.Map<string, any>;
}

export default (props: LastCorrectWordProps) => {
  const lastCorrectWord = props.word;

  if (lastCorrectWord) {
    return (
      <div>
        Last correct word was <span className="word">{lastCorrectWord.get('word')}</span>
      </div>
    );
  } else {
    return null;
  }
};
