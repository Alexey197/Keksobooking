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
var templateCard = document.querySelector('#card').content.querySelector('.map__card');
var popupPhotos = templateCard.querySelector('.popup__photos');
var popupPhoto = popupPhotos.querySelector('.popup__photo');
// var popupFeatures = templateCard.querySelectorAll('.popup__features');
var mapFiltersContainer = document.querySelector('.map__filters-container');

// Возвращает массив строк случайной длины
var getRandomArray = function (arr) {
  var startIndex = window.getRandomValue(0, arr.length - 1);
  var endIndex = window.getRandomValue(startIndex, arr.length - 1);
  return arr.slice(startIndex, endIndex + 1);
};

var getApartments = function (count) {
  var apartments = [];

  for (var i = 0; i < count; i++) {
    apartments.push({
      author: {
        avatar: AVATAR.path + window.getRandomValue(1, USER_COUNT) + AVATAR.ext
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
        features: getRandomArray(FEATURES),
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

  return apartments;
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

var typeApartmentsTranslator = function (data) {
  var type = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  return type[data];
};

var getRemoveChildren = function (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
};

var createPhotoElement = function (photo) {
  var photoElement = popupPhoto.cloneNode(true);
  photoElement.src = photo;
  return photoElement;
};

var createFeatures = function (features, arr) {
  features.innerHTML = '';
  arr.forEach(function (item) {
    var newFeature = document.createElement('li');
    newFeature.className = 'popup__feature';
    newFeature.classList.add('popup__feature--' + item);
    features.appendChild(newFeature);
  });
};

var cardApElement = function (apartment) {
  getRemoveChildren(popupPhotos);
  var fragment = document.createDocumentFragment();
  var cardElement = templateCard.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = apartment.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = apartment.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = apartment.offer.price + ' ₽/ночь';
  cardElement.querySelector('.popup__type').textContent = typeApartmentsTranslator(apartment.offer.type);
  cardElement.querySelector('.popup__text--capacity').textContent = apartment.offer.rooms + ' комннаты для ' + apartment.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'заезд после ' + apartment.offer.checkin + ' выезд до ' + apartment.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = apartment.offer.description;
  cardElement.querySelector('.popup__avatar').src = apartment.author.avatar;
  apartment.offer.photos.forEach(function (item) {
    fragment.appendChild(createPhotoElement(item));
  });
  cardElement.querySelector('.popup__photos').appendChild(fragment);
  createFeatures(cardElement.querySelector('.popup__features'), apartment.offer.features);
  return cardElement;
};

var createCardAd = function (card) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(cardApElement(card));
  map.insertBefore(fragment, mapFiltersContainer);
};

var initApp = function () {
  map.classList.remove('map--faded');
  getApartments(USER_COUNT);
  createDOMPoints(USER_COUNT);
  var ads = getApartments(USER_COUNT);
  createCardAd(ads[0]);
};

initApp();
