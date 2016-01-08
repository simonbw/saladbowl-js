var processResponse = require('./processResponse');

/**
 * Redraw the page.
 * @param data
 */
function redraw(data) {
  $('#main-content').html(Handlebars.templates['index'](data));
}

/**
 * Get data for the page.
 */
function getData() {
  jQuery.get('/recent-games')
    .done(function (response) {
      redraw(processResponse(response));
    })
    .always(function () {
      setTimeout(getData, 1000);
    });
}

/**
 * Initialize the index page.
 */
module.exports.init = function () {
  getData();
};
