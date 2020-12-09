const express = require('express');
const app = express();
const port = 8000;

const router = require('./routes.js');

app.use('/', router);

// app.get(주소, 할일)

// 1. 요청을 url에 보낸다
// 2. 서버에 정의된 로직에 의해서 해당 url에 해당하는 작업을 실행하게 된다
// 3. 요청한 클라이언트 에게 알맞은 응답(response)를 보내주게 된다

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
