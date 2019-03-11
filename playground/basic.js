const { Users } = require('../models/users');
Users.findById("5c8097cc8a1ba52260813f2f").then((users, err) => {
  if (users) {
    console.log(users.cart[0] === undefined);
  }
});