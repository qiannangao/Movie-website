const jwt = require('jsonwebtoken');
const { jwtSecretKey } = require('../config');
// 加密类型
const algorithms = ['HS256'];

const getUsername = function (token) {
  try {
    if (token.split(' ')[0] === 'Bearer') {
      const tokenStr = token.split(' ')[1];
      const decoded = jwt.verify(tokenStr,jwtSecretKey,algorithms);
      // 解析出username
      let username = decoded.username;
      return username;
    }
    throw new Error('token应该以Bearer开头.');
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = {
  getUsername
}