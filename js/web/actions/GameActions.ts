import ActionTypes from '../../shared/ActionTypes';
import type { Action } from '../types';

const GameActions = {
  /**
   * Send a join game action.
   */
  joinGame(name: string): Action {
    return {
      type: ActionTypes.SERVER.JOIN_GAME,
      name: name,
    };
  },

  /**
   * Send a bunch of save word actions.
   */
  saveWords(words: any): Action {
    return {
      type: ActionTypes.SERVER.SAVE_WORDS,
      words: words,
    };
  },

  /**
   * Join a team.
   */
  joinTeam(team: any): Action {
    return {
      type: ActionTypes.SERVER.JOIN_TEAM,
      team: team,
    };
  },

  /**
   * Deal everyone onto random, evenly sized teams.
   */
  shuffleTeams(): Action {
    return {
      type: ActionTypes.SERVER.SHUFFLE_TEAMS,
    };
  },

  /**
   * Start the game.
   */
  startGame(): Action {
    return {
      type: ActionTypes.SERVER.START_GAME,
    };
  },

  /**
   * Start the round.
   */
  startRound(): Action {
    return {
      type: ActionTypes.SERVER.START_ROUND,
    };
  },

  /**
   * Skip the current word.
   */
  skipWord(): Action {
    return {
      type: ActionTypes.SERVER.SKIP_WORD,
    };
  },

  /**
   * Correctly guessed the current word.
   */
  correctWord(): Action {
    return {
      type: ActionTypes.SERVER.CORRECT_WORD,
    };
  },

  /**
   * Take back the last "Correct" (a mis-tap).
   */
  undoCorrect(): Action {
    return {
      type: ActionTypes.SERVER.UNDO_CORRECT,
    };
  },

  /**
   * Skip the current player.
   */
  skipPlayer(playerId: string): Action {
    return {
      type: ActionTypes.SERVER.SKIP_PLAYER,
      playerId: playerId,
    };
  },
};

export default GameActions;
