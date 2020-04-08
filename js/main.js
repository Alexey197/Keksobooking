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
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65 + 22 - 6; // button + ::after - translate

var templatePin = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var mapWidth = mapPins.clientWidth;
var templateCard = document.querySelector('#card').content.querySelector('.map__card');
var popupPhotos = templateCard.querySelector('.popup__photos');
var popupPhoto = popupPhotos.querySelector('.popup__photo');
var mapFiltersContainer = document.querySelector('.map__filters-container');

var getApartments = function (count) {
  var apartments = [];

  for (var i = 0; i < count; i++) {
    apartments.push({
      author: {
        avatar: AVATAR.path + window.utils.getRandomValue(1, USER_COUNT) + AVATAR.ext
      },
      offer: {
        title: 'Заголовок',
        address: '600, 350',
        price: 42,
        type: TYPE_APARTMENTS[window.utils.getRandomValue(0, TYPE_APARTMENTS.length - 1)],
        rooms: window.utils.getRandomValue(1, MAX_ROOMS),
        guests: window.utils.getRandomValue(1, MAX_GUESTS),
        checkin: CHECK_TIME[window.utils.getRandomValue(0, CHECK_TIME.length - 1)],
        checkout: CHECK_TIME[window.utils.getRandomValue(0, CHECK_TIME.length - 1)],
        features: window.utils.getRandomArray(FEATURES),
        description: 'Описание',
        photos: window.utils.getRandomArray(PHOTOS)
      },
      location: {
        x: window.utils.getRandomValue(10, mapWidth) - PIN_SIZE.width / 2,
        y: window.utils.getRandomValue(LOCATION_Y[0], LOCATION_Y[1]) - PIN_SIZE.height
      }
    }
    );
  }

  return apartments;
};

var ads = getApartments(USER_COUNT);

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
  mapPins.appendChild(fragment);
};

var showAds = function () {
  map.classList.remove('map--faded');

  var fragment = document.createDocumentFragment();
  fillFragment(ads, fragment);
};

// находим карту
var map = document.querySelector('.map');

// находим формы и поля ввода
var adForm = document.querySelector('.ad-form');
var formInputs = adForm.querySelectorAll('input, select');
var mapFilters = document.querySelector('.map__filters');
var addressInput = adForm.querySelector('#address');

// главная метка
var mapPinMain = map.querySelector('.map__pin--main');

// отключение полей и селектов, затемнение карты и формы
// флаг активации страницы
var pageIsActive = false;

var disablePage = function () {
  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');
  formInputs.forEach(function (item) {
    item.disabled = true;
  });

  pageIsActive = false;
};

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');
  formInputs.forEach(function (item) {
    item.disabled = false;
  });

  addressInput.readOnly = true;

  pageIsActive = true;

  showAds();
};

var getMainPinCoordinates = function () {
  var mainPin = {
    x: parseInt(mapPinMain.style.left.slice(0, -2), 10) + Math.round(MAIN_PIN_WIDTH / 2),
    y: parseInt(mapPinMain.style.top.slice(0, -2), 10)
  };

  // если страница активна, y по острому концу, если нет - y в середине метки
  mainPin.y += pageIsActive ? MAIN_PIN_HEIGHT : Math.round(mapPinMain.clientHeight / 2);

  return mainPin;
};

var setAddress = function () {
  var pin = getMainPinCoordinates();
  addressInput.value = pin.x + ', ' + pin.y;
};

var mapPinMainMousedownHandler = function (evt) {
  if (evt.button === 0) {
    if (!pageIsActive) {
      activatePage();
    }
    setAddress();
  }
};

var mapPinMainEnterPresshandler = function (evt) {
  if (!pageIsActive) {
    window.utils.isEnterEvent(evt, activatePage);
  }
};

mapPinMain.addEventListener('mousedown', mapPinMainMousedownHandler);
mapPinMain.addEventListener('keydown', mapPinMainEnterPresshandler);

var roomNumberSelect = adForm.querySelector('#room_number');
var capacitySelect = adForm.querySelector('#capacity');

disablePage();
setAddress();

var validateCapacity = function () {
  capacitySelect.setCustomValidity('');

  if (roomNumberSelect.value === '100' && capacitySelect.value !== 0) {
    capacitySelect.setCustomValidity('Нельзя заселиться во дворец');
  }

  if (parseInt(roomNumberSelect.value, 10) < capacitySelect.value) {
    capacitySelect.setCustomValidity('Гостей не должно быть больше, чем комнат');
  }
};

var formChangeHandler = function (evt) {
  if (evt.target === capacitySelect || evt.target === roomNumberSelect) {
    validateCapacity();
  }
};

validateCapacity();
adForm.addEventListener('change', formChangeHandler);

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

// создание DOM-элемента карточки и наполнение ее контентом
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

// создание коллекции карточек
var createCardsCollection = function () {
  var cards = [];
  for (var i = 0; i < ads.length; i++) {
    cards[i] = cardApElement(ads[i]);
  }
  return cards;
};

// обработка показа и скрытия карточек
var cards = createCardsCollection();
// переменная для открытой в настоящий момент карточки
var currentCard;
// вставляет переданную из массива карточку на карту, обзывает её текущей и вешает обработчики

// обработчики нажатий
// на ESC при открытой карточке
var popupCloseEscHandler = function (evt) {
  window.utils.isEscEvent(evt, closeCurrentCard);
};

var popupCloseClickHandler = function () {
  closeCurrentCard();
};

var mapPinsClickHandler = function (evt) {
  if (evt.target.classList.contains('map__pin') && !evt.target.classList.contains('map__pin--main')) {
    showCard(cards[evt.target.value]);
  }
  if (evt.target.parentNode.classList.contains('map__pin') && !evt.target.parentNode.classList.contains('map__pin--main')) {
    showCard(cards[evt.target.parentNode.value]);
  }
};

var showCard = function (cardToShow) {
  if (currentCard) {
    closeCurrentCard();
  }

  map.insertBefore(cardToShow, mapFiltersContainer);
  currentCard = cardToShow;

  var popupCloseButton = currentCard.querySelector('.popup__close');
  popupCloseButton.addEventListener('click', popupCloseClickHandler);
  document.addEventListener('keydown', popupCloseEscHandler);
};

// удаляет из DOM открытую карточку, подчищает обработчики
var closeCurrentCard = function () {
  map.removeChild(currentCard);

  var popupCloseButton = currentCard.querySelector('.popup__close');
  popupCloseButton.removeEventListener('click', popupCloseClickHandler);
  document.removeEventListener('keydown', popupCloseEscHandler);
  currentCard = '';
};

mapPins.addEventListener('click', mapPinsClickHandler);
