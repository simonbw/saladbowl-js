/**
 * All the handlebar helpers in one place.
 */

var comparison = require('./helpers/comparison');
var logic = require('./helpers/logic');
var math = require('./helpers/math');
var misc = require('./helpers/misc');

var helpers = {};
[comparison, logic, math, misc].forEach(function (submodule) {
  for (var helper in submodule) {
    if (submodule.hasOwnProperty(helper)) {
      helpers[helper] = submodule[helper];
    }
  }
});

/**
 * Register all helpers with a Handlebars instance.
 *
 * @param Handlebars
 */
function registerAll(Handlebars) {
  for (var helper in helpers) {
    if (helpers.hasOwnProperty(helper)) {
      Handlebars.registerHelper(helper, helpers[helper]);
    }
  }
}


module.exports = {
  registerAll: registerAll
};
