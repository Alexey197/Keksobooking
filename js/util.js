'use strict';

(function () {
  window.getRandomValue = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };
})();
