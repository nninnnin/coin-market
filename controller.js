const axios = require("axios");
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Asset = require('./models/Asset');
const Keys = require('./models/Key');
const { encryptPassword } = require("./utils");

const coinMeta = {
  'bitcoin': 'btc',
  'ripple': 'xrp',
  'bitcoin-cash': 'bch',
  'ethereum': 'eth'
};

const controller = {};

controller.index = async (req, res) => {
  res.send('Hello world');
};

controller.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (await User.findOne({ name })) {
    return res.json('User already exists');
  }

  const asset = await Asset.create({
    usd: 10000
  });

  await User.create({
    name: name,
    email: email,
    password: encryptPassword(password),
    asset: asset,
  });

  res.sendStatus(200);
};

controller.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ err: '유저가 존재하지 않습니다' });
  }

  const secretKey = 'secretKey';
  const publicKey = 'publicKey';

  if (user.password === encryptPassword(password)) {
    return res.json({ err: '패스워드가 올바르지 않습니다' });
  }

  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 5),
    data: { publicKey },
  }, secretKey);
};

controller.coins = async (req, res) => {
  // ?
};

controller.coinPrice = async (req, res) => {
  const { coin_name } = req.params;

  const url = `http://api.coingecko.com/api/v3/simple/price?ids=${coin_name}&vs_currencies=usd`;
  const result = await axios.get(url);

  console.log(result);

  res.json(result);
};

controller.buyCoin = async (req, res) => {
  const { coin_name } = req.params;
  const { quantity } = req.query;

  const user = await User.findOne({ email: req.user.email });
  const userAsset = await Asset.findOne({ _id: user.asset });

  // 코인 가격을 coingecko API에서 가져온다
  const url = `http://api.coingecko.com/api/v3/simple/price?ids=${coin_name}&vs_currencies=usd`;
  const result = await axios.get(url);

  const usdPrice = result.data[coin_name].usd;

  console.log(usdPrice);

  const totalPrice = quantity * usdPrice;

  // 코인을 살 돈이 있는지 확인
  if (userAsset.usd < totalPrice) {
    return res.json({ err: '코인을 구매할 USD 잔고가 부족합니다' });
  }

  // USD 감소
  userAsset.usd -= totalPrice;

  // 코인 증가
  const coinSymbol = coinMeta[coin_name];

  if (!userAsset[coinSymbol]) {
    userAsset.coinSymbol = quantity;
  } else {
    userAsset[coinSymbol] += quantity;
  }

  // 반영
  await userAsset.save();

  res.sendStatus(200);
};

controller.sellCoin = async (req, res) => {
  const { coin_name } = req.params;
  // 코인별 id 정리 (coingecko API 요청 시 ids라는 이름으로 받아들이는 코인별 id)
  // 비트코인 - 'bitcoin'
  // 리플 - 'ripple'
  // 비트코인 캐시 - 'bitcoin-cash'
  // 이더리움 - 'ethereum'

  const { quantity } = req.query;

  const user = await User.findOne({ email: req.user.email });
  const userAsset = await Asset.findOne({ _id: user.asset });

  // 먼저 유저가 판매 가능한 코인을 가지고 있는지 있는지 Asset 확인
  const coinSymbol = coinMeta[coin_name];

  if (!userAsset[coinSymbol] || userAsset[coinSymbol] < quantity) {
    return res.json({ err: '판매에 충분한 코인을 보유하고 있지 않습니다' })
  }

  // 판매하려는 코인의 현재 가격을 가져온다
  const url = `http://api.coingecko.com/api/v3/simple/price?ids=${coin_name}&vs_currencies=usd`;
  const result = await axios.get(url);

  const usdPrice = result.data[coin_name].usd;

  console.log(usdPrice);

  // usd 잔고 증가
  const usdProfit = usdPrice * quantity;
  userAsset.usd += usdProfit;

  // 코인 잔고 감소
  userAsset[coinSymbol] -= quantity;

  // userAsset 증감 반영
  await userAsset.save();
};

controller.assets = async(req, res) => {
  const { _id } = req.user;

  const user = await User.findOne({ _id });

  const userAsset = await Asset.findOne({ _id: user.asset });

  console.log(userAsset);

  res.json(userAsset);
};

module.exports = controller;
