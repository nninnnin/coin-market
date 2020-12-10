const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  asset: {
    type: Schema.Types.ObjectId,
    ref: 'Asset'
  },
  key: String
});

module.exports = mongoose.model('User', userSchema);
