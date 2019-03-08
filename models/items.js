const { mongoose } = require('./mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  imagepath: {
    type: String,
    required: true
  }
});

const Items = mongoose.model('Items', ItemSchema);

module.exports.Items = Items;