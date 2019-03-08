const { Items } = require('../models/items');

var item = new Items({
  name: 'Sholay(1975)',
  price: 150,
  category: 'Movies',
  imagepath: '/images/sholay.jpg'
});

item.save().then((item) => {
  console.log(item)
}).catch((err) => {
  console.log(err);
});
