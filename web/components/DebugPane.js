var React = require('react');

module.exports = function (props) {
  var state = props.state;
  var style = {
    background: '#EEE',
    fontFamily: 'monospace',
    padding: '10px',
    textAlign: 'left',
    whiteSpace: 'pre-wrap'
  };
  return (
    <div style={style}>{JSON.stringify(state, null, 2)}</div>
  );
};
