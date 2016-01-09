var Sounds = module.exports;

Sounds.init = function () {
  Sounds.clips = {};
  var extension;
  if ((new Audio).canPlayType('audio/ogg')) {
    extension = '.ogg';
  } else {
    extension = '.wav';
  }
  Sounds.timeUp = new Audio('/sounds/time-up' + extension);
  Sounds.correctWord = new Audio('/sounds/correct-word' + extension);
  Sounds.skipWord = new Audio('/sounds/skip-word' + extension);
};