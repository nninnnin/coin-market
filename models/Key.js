const mongoose = require('mongoose');
const { Schema } = mongoose;

const keySchema = new Schema({
  secretKey: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Key', keySchema);
