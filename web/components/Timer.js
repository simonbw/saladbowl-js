var React = require('react');

var DELAY = 50;

function currentTime() {
  return Date.now();
}

/**
 *
 */
module.exports = React.createClass({
  propTypes: {
    endTime: React.PropTypes.number
  },

  getInitialState: function () {
    return {remaining: currentTime() - this.props.endTime};
  },

  componentDidMount: function () {
    this.timerInterval = setInterval(this.tick, DELAY);
  },

  componentWillUnmount: function () {
    clearInterval(this.timerInterval);
  },

  tick: function () {
    var remaining = currentTime() - this.props.endTime;
    this.setState({remaining: remaining});
  },

  render: function () {
    return (
      <div>{this.state.remaining.toFixed(1)}</div>
    );
  }
});
