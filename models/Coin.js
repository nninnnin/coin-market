const mongoose = require('mongoose');
const { Schema } = mongoose;

// 거래소가 가지고 있는 코인들
const coinSchema = new Schema({
  coinName: String,
  amount: Number,
});

module.exports = mongoose.model('Coin', coinSchema);
