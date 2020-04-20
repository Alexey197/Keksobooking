'use strict';

(function () {
  var templatePin = document.querySelector('#pin')
    .content.querySelector('.map__pin');
  var pinsContainer = document.querySelector('.map__pins');

  var renderPoint = function (apartment) {
    var pointElement = templatePin.cloneNode(true);

    pointElement.style = 'left: ' + apartment.location.x + 'px; top: ' + apartment.location.y + 'px;';
    pointElement.querySelector('img').src = apartment.author.avatar;
    pointElement.querySelector('img').alt = apartment.offer.title;
    return pointElement;
  };

  var fillFragment = function (array, fragment) {
    for (var i = 0; i < array.length; i++) {
      var newPin = renderPoint(array[i]);
      newPin.value = i;
      fragment.appendChild(newPin);
    }
    pinsContainer.appendChild(fragment);
  };

  var showAds = function () {
    var fragment = document.createDocumentFragment();
    fillFragment(window.data, fragment);
  };

  window.pins = {
    show: showAds
  };
})();
