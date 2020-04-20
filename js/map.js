'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 65 + 22 - 6; // button + ::after - translate
  var mapPins = document.querySelector('.map__pins');

  var mapFiltersContainer = document.querySelector('.map__filters-container');


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

    window.pins.show();
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

  // переменная для открытой в настоящий момент карточки
  var cards = window.cards;
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

  disablePage();
  setAddress();
})();
