const express = require('express');
const router = express.Router();

const controller = require('./controller');

router.get('/', controller.index);

// 로그인
router.post('/login', controller.login);

// 회원가입
router.post('/register', controller.register);

// API 요청하여 코인 가져오기 (fetch / axios)
// router.get('/coins', controller.coins);
// router.get('/coins/:coin_name', controller.coinPrice);

router.post('/coins/:coin_name/buy', controller.buyCoin);
// router.post('/coins/:coin_name/sell', controller.sellCoin);

// 나의 자산 조회
// router.get('/assets', controller.assets);

module.exports = router;

// nninnnin7
