const express = require('express');
const { body, validationResult } = require('express-validator');
const controller = require('./controller');

const router = express.Router();

router.get('/', controller.index);

// 로그인
router.post('/login', controller.login);

// 회원가입
router.post(
  '/register',
  [
    body('name').isString().isLength({ min: 4, max: 12 }),
    body('email').isString().isEmail(),
    body('password').isLength({ min: 8, max: 16 }),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    controller.register(req, res);
  }
);

// API 요청하여 코인 가져오기 (fetch / axios)
// router.get('/coins', controller.coins);
// router.get('/coins/:coin_name', controller.coinPrice);

router.post('/coins/:coin_name/buy', controller.buyCoin);
// router.post('/coins/:coin_name/sell', controller.sellCoin);

// 나의 자산 조회
// router.get('/assets', controller.assets);

module.exports = router;
