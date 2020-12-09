const axios = require("axios");
const User = require('./models/User');

const controller = {
  index: (req, res) => {
    res.send('Hello world');
  },
  register: (req, res) => {
    // logic
    // 유저의 asset에 1만달러를 추가한다

    const { id, email, password } = req.body;

    User.create({
      name: id,
      email: email,
      password: password,
      money: 10000
    });
  },
  login: () => {
    //
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
