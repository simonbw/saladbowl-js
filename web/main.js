require('./templates');

var helpers = require('../shared/helpers');

helpers.registerAll(Handlebars);

// Make all templates available as partials
for (var templateName in Handlebars.templates) {
  if (Handlebars.templates.hasOwnProperty(templateName)) {
    Handlebars.registerPartial(templateName, Handlebars.templates[templateName]);
  }
}


// make the timer work
$(function () {
  /**
   * Return the number of milliseconds remaining in the round.
   *
   * @returns {number}
   */
  function getTimeRemaining(game) {
    var duration = game.phases[game.currentPhase].duration;
    var timeSinceStart = (Date.now() - game.startedAt);
    var timeout = duration - timeSinceStart;
    return timeout > 0 ? timeout : 0;
  }

  /**
   * Format milliseconds to look good.
   *
   * @param milliseconds
   */
  function formatClock(milliseconds) {
    var seconds = milliseconds / 1000;
    var whole = Math.floor(seconds);
    var part = seconds - whole;
    part = Math.floor(part * 100);
    return whole + ':' + part;
  }

  if (window.game && game.started) {
    setTimeout(function () {
      alert('TIME UP!');
      $.get('/game/' + game._id + '/next-team', function () {
        location.reload();
      });
    }, getTimeRemaining(window.game));

    setInterval(function () {
      $('#timer').html(formatClock(getTimeRemaining(game)));
    }, 1 / 60);
  }

  // Join Teams
  $('.team.joinable').click(function (team) {
    var team = $(this).data('team-id');
    $.post('/game/' + game._id + '/join-team', {'team': team}, function (data) {
      location.reload();
    });
    console.log('Joining Team', team);
  });
});