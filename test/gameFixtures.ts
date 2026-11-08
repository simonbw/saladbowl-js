import ActionTypes from '../js/shared/ActionTypes';
import reducer from '../js/shared/reducers/GameReducers';
import type { Game } from '../js/shared/types';

/** Four players (p0..p3, alternating teams 0/1), `wordsPerPlayer` nouns each, game started. */
export function startedGame(id = 'TEST', wordsPerPlayer = 1): Game {
  let game = reducer(null, null).set('id', id).set('wordsPerPlayer', wordsPerPlayer);
  for (let p = 0; p < 4; p++) {
    game = reducer(game, { type: ActionTypes.CLIENT.PLAYER_JOINED, player: { id: 'p' + p, name: 'P' + p, team: p % 2 } });
    game = reducer(game, {
      type: ActionTypes.CLIENT.WORDS_UPDATED,
      playerId: 'p' + p,
      words: Array.from({ length: wordsPerPlayer }, (_, i) => ({ word: `p${p}w${i}`, playerWordIndex: i })),
    });
  }
  return reducer(game, { type: ActionTypes.CLIENT.GAME_STARTED });
}
