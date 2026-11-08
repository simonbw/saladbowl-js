import ActionTypes from '../../shared/ActionTypes';
import type { Action, Dispatch } from '../types';

const ERROR_DURATION_MS = 7000;
const ANNOUNCEMENT_DURATION_MS = 3500;

let nextId = 1;

export interface Announcement {
  title: string;
  subtitle?: string;
  detail?: string;
}

const UIActions = {
  updateField(field: string, value: any): Action {
    return {
      type: ActionTypes.UI.FIELD_CHANGED,
      field: field,
      value: value,
    };
  },

  /** Show `message` in the error banner; it clears itself after a few seconds. */
  showError(message: string) {
    return (dispatch: Dispatch) => {
      const id = nextId++;
      dispatch({ type: ActionTypes.UI.SHOW_ERROR, error: { id, message } });
      setTimeout(() => dispatch(UIActions.dismissError(id)), ERROR_DURATION_MS);
    };
  },

  dismissError(id: number): Action {
    return { type: ActionTypes.UI.DISMISS_ERROR, id };
  },

  /** Flash a full-screen announcement; tap to dismiss, or it fades on its own. */
  showAnnouncement(announcement: Announcement) {
    return (dispatch: Dispatch) => {
      const id = nextId++;
      dispatch({ type: ActionTypes.UI.SHOW_ANNOUNCEMENT, announcement: { id, ...announcement } });
      setTimeout(() => dispatch(UIActions.dismissAnnouncement(id)), ANNOUNCEMENT_DURATION_MS);
    };
  },

  dismissAnnouncement(id: number): Action {
    return { type: ActionTypes.UI.DISMISS_ANNOUNCEMENT, id };
  },
};

export default UIActions;
