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
  var AVATAR = {path: 'img/avatars/user0', ext: '.png'};
  var PIN_SIZE = {width: 50, height: 70};
  var mapWidth = document.querySelector('.map__pins').clientWidth;

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
          description: window.utils.getRandomArray(ADS_DESCRIPTIONS),
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

  window.data = ads;
})();
