var React = require('react');

module.exports = function (props) {
  var lastCorrectWord = props.word;

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