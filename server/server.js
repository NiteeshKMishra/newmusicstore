require('../config/config');
const { passport } = require('./utils/passport');
const { sendMail } = require('./utils/sendmail');

const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const session = require('express-session');
const axios = require('axios');
const path = require('path');
const http = require('http');
const uuid = require('uuid/v4');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT;

const { Users } = require('../models/users');
const { Items } = require('../models/items');

app.use(session({
  genid: (req) => {
    return uuid();
  },
  secret: 'node',
  saveUninitialized: true,
  resave: false
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));


/** Socket IO configuration */

var server = http.createServer(app);
var io = socketIO(server);
io.on('connection', (socket) => {
  console.log("New Client Connected")

  socket.on('saveuser', (data, callback) => {
    data.cart = [];
    Users.insertMany(data).then((user) => {
      if (user) {
        callback('done');
      }
    }).catch((err) => {
      callback(err.errmsg);
    })
  });

  socket.on('forgetcred', (data, callback) => {
    Users.findOne({ email: data.email }).then((user) => {
      if (user) {
        sendMail(data.email, user.username, user.password).then((msg) => {
          callback(msg)
        }).catch((err) => {
          callback(err);
        });
      }
      else {
        callback('Your Email was not found')
      }
    }).catch((err) => {
      callback(err);
    })
  });

  socket.on('changepassword', (data, callback) => {
    Users.findOneAndUpdate({ email: data.email, password: data.oldpassword }, { $set: { password: data.newpassword } }, { new: true }).then((user, err) => {
      if (err) {
        callback(err)
      }
      else if (!user) {
        callback('Invalid')
      }
      else {
        callback('done');
      }
    })
  });


  socket.on('addtocart', (data, callback) => {
    if (!globaluser) {
      callback('nouser')
    }
    else {
      Users.findById(globaluser._id).then((user, err) => {
        var flag = false;
        if (user) {
          for (var cart of user.cart) {
            if (cart._id == data._id) {
              cart.quantity = cart.quantity + 1
              flag = true;
            }
          }
          if (flag === false) {
            Users.findByIdAndUpdate(globaluser._id, { $push: { cart: { _id: data._id, quantity: data.quantity } } }, { new: true }).then((users, err) => {
              if (err) {
                callback('error')
              }
              else {
                callback('done')
              }
            })
          }
          else {
            Users.findByIdAndUpdate(globaluser._id, { $set: { cart: user.cart } }, { new: true }).then((users, err) => {
              if (err) {
                callback('error')
              }
              else {
                callback('done')
              }
            })
          }
        }
      })

    }
  });

  socket.on('disconnect', () => {
    console.log('Client Disconnected')
  });

});

/** End Point Routes */

app.get('/', (req, res) => {
  globaluser = req.user;
  Items.find({}).then((movies) => {
    res.render('index.ejs', { movies });
  }).catch((err) => {
  })
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/login',
  failureRedirect: '/',
  failureFlash: false
}));

app.get('/login', (req, res) => {
  globaluser = req.user;
  Items.find({}).then((movies) => {
    res.render('user.ejs', { user: req.user, movies });
  }).catch((err) => {
  })
});

app.get('/checkout', (req, res) => {
  var itemArray = [];
  var count = 0;
  Users.findById(req.user._id).then((user, err) => {
    if (user) {
      user.cart.forEach(carts => {
        Items.findById(carts._id).then((items, err) => {
          if (items) {
            var quan = carts.quantity
            items["quantity"] = quan;
            itemArray.push(items)
            count = count + 1;
          } else {
            itemArray = []
            count = count + 1;
          }
          if (count === user.cart.length) {
            res.render('checkout.ejs', { user: req.user, items: itemArray })
          }
        })
      });
    }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  Items.find({}).then((movies) => {
    res.render('index.ejs', { movies });
  }).catch((err) => {
  })
});

app.get('/aboutus', (req, res) => {
  res.render('aboutus.ejs')
})

app.get('/payment', (req, res) => {
  res.render('payment.ejs', { user: req.user });
})

server.listen(PORT, () => {
  console.log(`Server is up at Port ${PORT}`);
});