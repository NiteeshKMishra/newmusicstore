const { mongoose } = require('./mongoose');
const validate = require('validator');

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 6,
    unique: true,
    validate: {
      validator: validate.isAlphanumeric,
      message: `{Value} should not contain any special chracter`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validate.isEmail,
      message: `{Value} is not a valid Email.`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Items'
  }]
});



var Users = mongoose.model('Users', UserSchema);

module.exports = { Users }