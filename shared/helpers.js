/**
 * All the handlebar helpers in one place.
 */

// All the modules containing helpers to load
var subModules = [
  require('./helpers/comparisonHelpers'),
  require('./helpers/gameHelpers'),
  require('./helpers/logicHelpers'),
  require('./helpers/mathHelpers'),
  require('./helpers/miscHelpers')
];

var helpers = {};
subModules.forEach(function (submodule) {
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
