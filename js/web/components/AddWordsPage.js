'use strict';

const React = require('react');

const ActionTypes = require('../../shared/ActionTypes');
const UpdateGame = require('../UpdateGame.js');
const Validation = require('../../shared/Validation.js');

/**
 *
 */
module.exports = (props) => {
  const dispatch = props.dispatch;
  const game = props.state.get('game');
  const ui = props.state.get('ui');

  const onWordChange = (wordNumber, e) => {
    const value = e.target.value;
    const field = 'word' + wordNumber;
    console.log('wordChanged', field, value);
    dispatch({
      type: ActionTypes.UI.FIELD_CHANGED,
      field: field,
      value: value
    });
  };

  function getWords() {
    const words = [];
    for (var i = 0; i < game.get('wordsPerPlayer'); i++) {
      words.push(ui.get('word' + i));
    }
    return words;
  }

  function addWords(e) {
    // TODO: Disable form
    e.preventDefault();
    UpdateGame.saveWords(getWords().map((word, i) => ({word: word, playerWordIndex: i})));
  }

  const inputs = [];
  for (var i = 0; i < game.get('wordsPerPlayer'); i++) {
    inputs.push(<input key={i} autoFocus={i == 0} onChange={onWordChange.bind(this, i)} type="text"/>);
  }

  const disabled = !getWords().every(Validation.validateWord);

  return (
    <div>
      <form onSubmit={addWords}>
        <h1>Add Words</h1>
        {inputs}
        <button disabled={disabled} type="submit">Add</button>
      </form>
    </div>
  );
};