const { Items } = require('../models/items');

var item = new Items({
  name: 'Saher(2000)',
  price: 100,
  category: 'Music',
  imagepath: '/images/jagjit.jpg'
});

item.save().then((item) => {
  console.log(item)
}).catch((err) => {
  console.log(err);
});
