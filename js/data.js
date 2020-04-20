'use strict';

(function () {
  var USER_COUNT = 8;
  var TYPE_APARTMENTS = ['palace', 'flat', 'house', 'bungalo'];
  var CHECK_TIME = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];

  var ADS_DESCRIPTIONS =
    [
      'Отличное место со всеми удобствами',
      'Потрясающие виды, тихое и удобное расположение',
      'Много магазинов, хорошая транспортная доступность',
      'Вид на соседний дом и убаюкивающие звуки автострады',
      'Заманчивое предложение, по этой цене только сегодня, трансфер от аэропорта включен в стоимость'
    ];

  var MAX_ROOMS = 5;
  var MAX_GUESTS = 10;
  var LOCATION_Y = [130, 630];
  var AVATAR = {
    path: 'img/avatars/user',
    preNumber: '0',
    ext: '.png'};

  var PIN_SIZE = {
    width: 50,
    height: 70};

  var mapWidth = document.querySelector('.map__pins').clientWidth;

  var chooseRandomFromArray = function (array) {
    var randomIndex = window.utils.randomInteger(array.length - 1);
    return {
      value: array[randomIndex],
      index: randomIndex
    };
  };

  // var getRandomInteger = function (max, min) {
  //   min = min ? Math.ceil(min) : 0;
  //   max = Math.floor(max);
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // };

  var generateAvatarLinks = function (amount) {
    var notChosen = []; // массив с цифрами от 0 до amount-1 для генерации неповторяющихся адресов картинок аватарок
    var avatarLinks = [];

    // заполняем notChosen цифрами от 0 до amount-1
    for (var j = 0; j < amount; j++) {
      notChosen[j] = j + 1;
    }

    // заполняем массив адресами картинок в случайном порядке
    for (var i = 0; i < amount; i++) {
      var randomNumber = chooseRandomFromArray(notChosen);

      notChosen.splice(randomNumber.index, 1);
      // 'img/avatars/user01.png'
      avatarLinks[i] = AVATAR.path + (AVATAR.preNumber + randomNumber.value).slice(-2) + AVATAR.ext;
    }

    return avatarLinks;
  };

  var getApartments = function (count) {
    var apartments = [];
    var avatarLinks = generateAvatarLinks(count);

    for (var i = 0; i < count; i++) {
      apartments.push({
        author: {
          avatar: avatarLinks[i]
        },
        offer: {
          title: 'Заголовок',
          address: '600, 350',
          price: 42,
          type: TYPE_APARTMENTS[window.utils.randomInteger(0, TYPE_APARTMENTS.length - 1)],
          rooms: window.utils.randomInteger(1, MAX_ROOMS),
          guests: window.utils.randomInteger(1, MAX_GUESTS),
          checkin: CHECK_TIME[window.utils.randomInteger(0, CHECK_TIME.length - 1)],
          checkout: CHECK_TIME[window.utils.randomInteger(0, CHECK_TIME.length - 1)],
          features: window.utils.randomArray(FEATURES),
          description: window.utils.randomArray(ADS_DESCRIPTIONS),
          photos: window.utils.randomArray(PHOTOS)
        },
        location: {
          x: window.utils.randomInteger(10, mapWidth) - PIN_SIZE.width / 2,
          y: window.utils.randomInteger(LOCATION_Y[0], LOCATION_Y[1]) - PIN_SIZE.height
        }
      }
      );
    }

    return apartments;
  };

  var ads = getApartments(USER_COUNT);

  window.data = ads;
})();
