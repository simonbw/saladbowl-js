'use strict';

/**
 * @file Shared type aliases for the SaladBowl web client.
 */

import * as Immutable from 'immutable';

/**
 * The whole client state is a single Immutable.Map (keys: game, ui, userId).
 * Its contents are loosely typed.
 */
export type AppState = Immutable.Map<string, any>;

/**
 * A Redux-style action. The `type` controls routing; other keys are payload.
 */
export type Action = { type: string; [key: string]: any };

/**
 * The store's dispatch. Accepts plain actions and thunks; loosely typed.
 */
export type Dispatch = (action: any) => any;

/**
 * Props shared by the page/section components.
 */
export interface PageProps {
  state: AppState;
  dispatch: Dispatch;
}
