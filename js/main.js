'use strict';

var USER_COUNT = 8;
var TYPE_APARTMENTS = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIME = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var MAX_ROOMS = 5;
var MAX_GUESTS = 10;
var LOCATION_Y = [130, 630];
var AVATAR = {path: 'img/avatars/user0', ext: '.png'};
var PIN_SIZE = {width: 50, height: 70};

var map = document.querySelector('.map');
var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var mapWidth = mapPins.clientWidth;

// Возвращает массив строк случайной длины
var getRandomArray = function (arr) {
  var startIndex = window.getRandomValue(0, arr.length - 1);
  var endIndex = window.getRandomValue(startIndex, arr.length - 1);
  return arr.slice(startIndex, endIndex + 1);
};

var getApartments = function (count) {
  var apartmentsArray = [];

  for (var i = 0; i < count; i++) {
    apartmentsArray.push({
      author: {
        avatar: AVATAR.path + (i + 1) + AVATAR.ext
      },

      offer: {
        title: 'Заголовок',
        address: '600, 350',
        price: 42,
        type: TYPE_APARTMENTS[window.getRandomValue(0, TYPE_APARTMENTS.length - 1)],
        rooms: window.getRandomValue(1, MAX_ROOMS),
        guests: window.getRandomValue(1, MAX_GUESTS),
        checkin: CHECK_TIME[window.getRandomValue(0, CHECK_TIME.length - 1)],
        checkout: CHECK_TIME[window.getRandomValue(0, CHECK_TIME.length - 1)],
        features: FEATURES[window.getRandomValue(0, FEATURES.length - 1)],
        description: 'Описание',
        photos: getRandomArray(PHOTOS)
      },

      location: {
        x: window.getRandomValue(10, mapWidth) - PIN_SIZE.width / 2,
        y: window.getRandomValue(LOCATION_Y[0], LOCATION_Y[1]) - PIN_SIZE.height
      }
    }
    );
  }

  return apartmentsArray;
};

var renderPoint = function (apartment) {
  var pointElement = templatePin.cloneNode(true);

  pointElement.style = 'left: ' + apartment.location.x + 'px; top: ' + apartment.location.y + 'px;';
  pointElement.querySelector('img').src = apartment.author.avatar;
  pointElement.querySelector('img').alt = apartment.offer.title;

  return pointElement;
};

var createDOMPoints = function (count) {
  var apartments = getApartments(USER_COUNT);
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < count; i++) {
    fragment.appendChild(renderPoint(apartments[i]));
  }

  mapPins.appendChild(fragment);
};

var initApp = function () {
  map.classList.remove('map--faded');
  getApartments(USER_COUNT);
  createDOMPoints(USER_COUNT);
};

initApp();
