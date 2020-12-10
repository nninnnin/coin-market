const mongoose = require('mongoose');
const { Schema } = mongoose;

// 각 유저의 보유 잔고 (달러, 코인)
const assetSchema = new Schema({
  usd: Number,
  btc: Number,
  xrp: Number,
  bch: Number,
  eth: Number,
});

module.exports = mongoose.model('Asset', assetSchema);
