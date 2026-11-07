import ActionTypes from '../../shared/ActionTypes';
import type { Action } from '../types';

const UIActions = {
  updateField(field: string, value: any): Action {
    return {
      type: ActionTypes.UI.FIELD_CHANGED,
      field: field,
      value: value,
    };
  },
};

export default UIActions;
