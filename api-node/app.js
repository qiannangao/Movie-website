const express = require('express');
const app = express();
const path = require('path');
const moveRouter = require('./routes/movie');
const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');
const responseMw = require('./middlewares/response');
// cors
const cors = require('cors');
// jwt
const { expressjwt } = require("express-jwt");
const { jwtSecretKey, port } = require('./config')
// 转换body中间件
const bodyParser = require('body-parser');

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
// 响应中间件
app.use(responseMw);
// 设置静态路径
app.use('/static',express.static(path.join(__dirname, 'public')));
// jwt验证
app.use(expressjwt({ secret: jwtSecretKey, algorithms: ["HS256"] }).unless({ path: [/\/movie/, /\/user\/(login|register|resetPassword)/] }));

// 电影接口api
app.use('/movie', moveRouter);
app.use('/user', userRouter);
app.use('/admin', adminRouter);
// 404
app.use('/*', (req, res) => {
  res.send({
    code: 404,
    success: false,
    data: {},
    message: '请求404，请检查请求路径是否正确。'
  })
})

// 统一错误处理中间件
// 发送请求的header必须携带: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
app.use((err, req, res, next) => {
  let code = 500;
  if (err.name === 'UnauthorizedError') {
    code = 401;
  }
  res.send({
    code,
    success: false,
    data: {},
    message: err.message
  });
})

app.listen(port, () => {
  console.log('server is running ....');
})