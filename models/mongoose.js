const mongoose = require('mongoose');

const { ObjectID } = require('mongodb');

mongoose.connect("mongodb://localhost:27017/MusicLibrary", { useNewUrlParser: true }, (err) => {
  if (err) {
    throw err;
  }
  console.log('Successfully Connected to DataBase');
});

module.exports = {
  mongoose, ObjectID
}