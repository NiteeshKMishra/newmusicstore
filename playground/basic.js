
// const { Items } = require('../models/items');

// var item = new Items({
//   name: 'Saher(2000)',
//   price: 100,
//   category: 'Music',
//   imagepath: '/images/jagjit.jpg'
// });

// item.save().then((item) => {
//   console.log(item)
// }).catch((err) => {
//   console.log(err);
// });
// var val = { _id: 123, name: 'Niteesh' };
// var newval = JSON.stringify(val)
// //JSON.parse(val);
// console.log(val);
// console.log(newval)
var item = {
  _id: '5c81fd695fa15d219c4f7204',
  name: 'EarPhones',
  price: 500,
  category: 'Accessories',
  imagepath: '/images/earphone.jpg',
  __v: 0
}
item["quantity"] = "3"

console.log(item);
