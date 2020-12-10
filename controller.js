const axios = require("axios");
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Asset = require('./models/Asset');
const { encryptPassword } = require("./utils");

const controller = {
  index: async (req, res) => {
    res.send('Hello world');
  },
  register: async (req, res) => {
    const { name, email, password } = req.body;

    if (await User.find({ name })) {
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
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ err: '유저가 존재하지 않습니다' });
    }

    if (user.password === encryptPassword(password)) {
      // 로그인 성공

      // 토큰 발행
      const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 5), // 5분
        data: { publicKey: 'publicKey' },
      }, 'secretKey');

      console.log(token);

    }

    // 로그인 시 publicKey, secretKey를 만들고
    // DB에 저장,
    // 클라이언트에게도 전달
  },
  buyCoin: async (req, res) => {
    // 1. 코인 가격을 coingecko API에서 가져온다
    const url = 'http://api.coingecko.com/api/v3/simple/price?ids=humanscape&vs_currencies=btc';
    const result = await axios.get(url);

    const price = result.data.humanscape.btc;

    console.log(price);

    // 2. 유저가 원하는 양만큼 가격을 곱해주고

    // 3. 유저의 asset의 money 를 minus update

    // 4. 유저의 asset에 구매한 코인을 추가

    // 마지막으로 결과(성공 or 실패)를 응답
    // res.json(result);
  }
};

module.exports = controller;
