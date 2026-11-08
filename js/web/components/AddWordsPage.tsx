'use strict';

import React from 'react';

import ActionTypes from '../../shared/ActionTypes';
import GameActions from '../actions/GameActions';
import * as Validation from '../../shared/Validation';
import { isPending } from '../reducers/UIReducers';
import ShareGame from './ShareGame';
import type { PageProps } from '../types';

/**
 *
 */
export default (props: PageProps) => {
  const dispatch = props.dispatch;
  const game = props.state.get('game');
  const ui = props.state.get('ui');
  const pending = isPending(ui, ActionTypes.SERVER.SAVE_WORDS);

  const onWordChange = (
    wordNumber: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch({
      type: ActionTypes.UI.FIELD_CHANGED,
      field: 'word' + wordNumber,
      value: e.target.value
    });
  };

  function getWords() {
    const words: any[] = [];
    for (let i = 0; i < game.get('wordsPerPlayer'); i++) {
      words.push(ui.get('word' + i));
    }
    return words;
  }

  function addWords(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) {
      return;
    }
    const words = getWords().map((word, i) => ({word: word.trim(), playerWordIndex: i}));
    dispatch(GameActions.saveWords(words));
  }

  const inputs: React.ReactNode[] = [];
  for (let i = 0; i < game.get('wordsPerPlayer'); i++) {
    inputs.push(
      <input
        key={i}
        autoFocus={i == 0}
        disabled={pending}
        maxLength={Validation.MAX_WORD_LENGTH}
        onChange={(e) => onWordChange(i, e)}
        placeholder={'Noun ' + (i + 1)}
        type="text"
        value={ui.get('word' + i) ?? ''}
      />
    );
  }

  const disabled = pending || !getWords().every(Validation.validateWord);

  return (
    <div>
      <form onSubmit={addWords}>
        <h1>Add Nouns</h1>
        <div className="hint">People, places, things, characters… anything everyone might know.</div>
        {inputs}
        <button disabled={disabled} type="submit">{pending ? 'Adding…' : 'Add to the bowl'}</button>
      </form>
      <ShareGame code={game.get('id')}/>
    </div>
  );
};
