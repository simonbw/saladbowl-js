var React = require('react');

var GameHelpers = require('../GameHelpers');
var ActionTypes = require('../../shared/ActionTypes.js');

module.exports = function (props) {
  var state = props.state;
  var dispatch = props.dispatch;

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
    var style = {
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
