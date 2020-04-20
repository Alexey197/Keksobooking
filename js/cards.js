'use strict';

(function () {
  var templateCard = document.querySelector('#card').content.querySelector('.map__card');
  var popupPhotos = templateCard.querySelector('.popup__photos');
  var popupPhoto = popupPhotos.querySelector('.popup__photo');

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
    var ads = window.data;
    for (var i = 0; i < ads.length; i++) {
      cards[i] = cardApElement(ads[i]);
    }
    return cards;
  };

  // обработка показа и скрытия карточек
  var cards = createCardsCollection();

  window.cards = cards;
})();
