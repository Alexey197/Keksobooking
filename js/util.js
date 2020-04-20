'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var getRandomInteger = function (max, min) {
    min = min ? Math.ceil(min) : 0;
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getRandomArray = function (arr) {
    var startIndex = getRandomInteger(0, arr.length - 1);
    var endIndex = getRandomInteger(startIndex, arr.length - 1);
    return arr.slice(startIndex, endIndex + 1);
  };

  var getRandomValue = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  window.utils = {
    randomInteger: getRandomInteger,
    randomArray: getRandomArray,
    randomValue: getRandomValue,
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    }
  };
})();
