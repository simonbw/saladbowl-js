'use strict';

import React from 'react';

export default (props) => {
  const lastCorrectWord = props.word;

  if (lastCorrectWord) {
    return (
      <div>
        Last correct word was <span className="word">{lastCorrectWord.get('word')}</span>
      </div>
    );
  } else {
    return <noscript/>;
  }
};
