'use strict';

const React = require('react');

module.exports = (props) => {
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