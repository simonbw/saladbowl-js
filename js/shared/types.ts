'use strict';

/**
 * @file Shared type aliases for the SaladBowl game state.
 */

import * as Immutable from 'immutable';

/**
 * The game state is a single Immutable.Map. Its contents are loosely typed.
 */
export type Game = Immutable.Map<string, any>;

/**
 * A Redux-style action. The `type` controls routing; other keys are payload.
 */
export type Action = { type: string; [key: string]: any };
