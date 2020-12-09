const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  money: Number,
});

module.exports = mongoose.model('User', userSchema);
