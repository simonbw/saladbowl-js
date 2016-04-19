const ActionTypes = require('../../shared/ActionTypes.js');
const UIActions = module.exports;


UIActions.updateField = (field, value) => {
  return {
    type: ActionTypes.UI.FIELD_CHANGED,
    field: field,
    value: value
  };
};