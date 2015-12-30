require('./templates');

var helpers = require('../shared/helpers');

helpers.registerAll(Handlebars);

// Make all templates available as partials
for (var templateName in Handlebars.templates) {
  if (Handlebars.templates.hasOwnProperty(templateName)) {
    Handlebars.registerPartial(templateName, Handlebars.templates[templateName]);
  }
}

// Make some stuff globally accessible for debugging
window.SALADBOWL = {
};

