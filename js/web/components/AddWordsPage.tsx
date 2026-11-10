'use strict';

import React, { useLayoutEffect, useRef, useState } from 'react';

import ActionTypes from '../../shared/ActionTypes';
import GameActions from '../actions/GameActions';
import * as Validation from '../../shared/Validation';
import { isPending } from '../reducers/UIReducers';
import { fitLine, whenHandFontReady } from '../penFit';
import { pluralize } from '../../shared/StringUtil';
import { BowlIcon, CodeChip, Header, Screen, Spacer } from './ui';
import type { PageProps } from '../types';

const INPUT_FIT = { max: 30, min: 17 };

/** Write your nouns on slips and put them in the bowl. */
export default (props: PageProps) => {
  const dispatch = props.dispatch;
  const game = props.state.get('game');
  const ui = props.state.get('ui');
  const pending = isPending(ui, ActionTypes.SERVER.SAVE_WORDS);
  const count = game.get('wordsPerPlayer');

  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(ui.get('word' + i) ?? '');
  }

  const addWords = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) {
      return;
    }
    dispatch(GameActions.saveWords(words.map((word, i) => ({ word: word.trim(), playerWordIndex: i }))));
  };

  const inBowl = game.get('words').filter((word: any) => Validation.validateWord(word.get('word'))).size;
  const disabled = pending || !words.every(Validation.validateWord);

  return (
    <Screen>
      <Header right={<CodeChip code={game.get('id')}/>}/>
      <form className="screen-form" onSubmit={addWords}>
        <h1 className="title">Write your nouns</h1>
        <div className="slip-inputs">
          {words.map((word, i) => (
            <SlipInput
              key={i}
              autoFocus={i === 0}
              disabled={pending}
              label={`Noun ${i + 1}`}
              onChange={(value) => dispatch({ type: ActionTypes.UI.FIELD_CHANGED, field: 'word' + i, value })}
              value={word}
            />
          ))}
        </div>
        <Spacer/>
        <div className="bowl-status center">
          <BowlIcon size={34}/>
          <span>{pluralize(inBowl, 'slip')} in the bowl</span>
        </div>
        <button className="btn btn-primary" disabled={disabled} type="submit">{pending ? 'Adding…' : 'Put them in the bowl'}</button>
      </form>
    </Screen>
  );
};

interface SlipInputProps {
  autoFocus: boolean;
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

/** A slip to write one noun on. Long nouns shrink (and thicken) to fit, like the slips in play. */
function SlipInput(props: SlipInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState(0);
  const [, refit] = useState(0); // bumped when the hand font loads, so widths are measured in it

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    const measure = () => {
      const style = getComputedStyle(el);
      setWidth(el.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 2);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    whenHandFontReady().then(() => refit((n) => n + 1));
    return () => observer.disconnect();
  }, []);

  const fit = props.value && width > 0 ? fitLine(props.value, width, INPUT_FIT) : null;
  return (
    <label className="slip-input-label">
      <span className="sr-only">{props.label}</span>
      <input
        ref={ref}
        autoFocus={props.autoFocus}
        className="slip-input hand"
        disabled={props.disabled}
        maxLength={Validation.MAX_WORD_LENGTH}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder="A person, place or thing"
        style={fit ? { fontSize: fit.size, fontWeight: fit.weight } : undefined}
        type="text"
        value={props.value}
      />
    </label>
  );
}
