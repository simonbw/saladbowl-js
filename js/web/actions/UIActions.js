'use strict';
// @flow


const ActionTypes = require('../../shared/ActionTypes.js');
const UIActions = module.exports;


UIActions.updateField = (field:string, value:any) => {
  return {
    type: ActionTypes.UI.FIELD_CHANGED,
    field: field,
    value: value
  };
};