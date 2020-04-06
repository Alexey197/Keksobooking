'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.utils = {
    getRandomValue: function (min, max) {
      var rand = min + Math.random() * (max + 1 - min);
      return Math.floor(rand);
    },
    getRandomArray: function (arr) {
      var startIndex = this.getRandomValue(0, arr.length - 1);
      var endIndex = this.getRandomValue(startIndex, arr.length - 1);
      return arr.slice(startIndex, endIndex + 1);
    },
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    }
  };
})();
