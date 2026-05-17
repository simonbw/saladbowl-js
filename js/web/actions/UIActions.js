import ActionTypes from '../../shared/ActionTypes.js';

const UIActions = {};


UIActions.updateField = (field, value) => {
  return {
    type: ActionTypes.UI.FIELD_CHANGED,
    field: field,
    value: value
  };
};

export default UIActions;
