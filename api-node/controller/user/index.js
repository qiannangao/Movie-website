const { queryPromise } = require('../../db');
const { commonPromiseRs } = require('../../utils');
const jwt = require('jsonwebtoken');
// 上传文件的文件夹
const { jwtSecretKey, V_UPLOAD_BASE_PATH } = require('../../config');
const { getUsername } = require('../../utils/jwt');

/**
 * 登录
 * @param {*} req 
 * @param {*} res 
 */
async function login(req, res) {
  const { username, password } = req.body;
  let sql = 'select * from t_user where username = ? and password = ?';

  const { error, result } = await commonPromiseRs(queryPromise(sql, [username, password]));
  if (error) {
    res.sendFail(error);
  } else {
    if (result.length === 0) {
      res.sendFail('用户名或密码错误！');
    } else {
      // 判断账号是否被停用
      const available = result[0].available;
      if (available == '0') {
        return res.sendFail('您的账号已被停用，请联系管理员！');
      }
      // 避免敏感信息泄露
      delete result[0].password;
      // 登录成功，返回jwtToken
      const token = jwt.sign({ username: username }, jwtSecretKey, { algorithm: 'HS256', expiresIn: '24h' });
      const resInfo = {
        userInfo: result[0],
        token
      }
      res.sendSucc(resInfo);
    }
  }
}

/**
 * 注册
 * @param {*} req 
 * @param {*} res 
 */
async function register(req, res, next) {
  const { username, password } = req.body;
  // 1. 检测用户名
  const { error, result } = await commonPromiseRs(checkUsername(username));
  if (result.length > 0) {
    // TODO: 处理async无法被错误中间件处理的bug
    return next(new Error(`用户名\\${username}\\已存在`));
  }
  // 注册用户
  let sql = `INSERT INTO t_user (username,password) values (?,?)`;
  const { error: insertErr, result: insertRs } = await commonPromiseRs(queryPromise(sql, [username, password]));
  res.sd(insertErr, insertRs);
}

/**
 * 更新用户信息
 * TODO: 过滤
 */
async function updateUserInfo(req, res) {
  const { id, nikename, sex, avatar, tel, summary, birthday } = req.body;
  let sql = `update t_user set nikename=?,sex=?,avatar=?,tel=?,summary=?,birthday=? where id = ?`;
  const { error, result } = commonPromiseRs(queryPromise(sql, [nikename, sex, avatar, tel, summary, birthday, id]));
  res.sd(error, result);
}

/**
 * 重置密码
 */
async function resetPassword(req, res, next) {
  const { username, password, newPassword } = req.body;
  if (username.toLowerCase() === 'admin') {
    return next(new Error('已报警：臭小子，超级管理员的密码可不是你能改滴！'));
  }
  // 验证旧密码
  let checkSql = `select * from t_user where username = ? and password = ?`;
  const { error, result } = await commonPromiseRs(queryPromise(checkSql, [username, password]));
  if (error || result.length === 0) {
    return res.sendFail('旧的用户名或密码错误!');
  }
  // 更新密码
  let sql = `update t_user set  password = ? where username = ?`;
  const { error: e1, result: r1 } = await commonPromiseRs(queryPromise(sql, [newPassword, username]));
  res.sd(e1, r1);
}

/**
 * 检测用户名是否存在
 * @param {*} username 
 * @returns 
 */
async function checkUsername(username) {
  let sql = `select * from t_user where username = ?`;
  const { error, result } = await commonPromiseRs(queryPromise(sql, username));
  return result;
}
/**
 * 根据token获取用户信息
 */
async function getUserInfo(req, res) {
  const token = req.get('Authorization');
  // 从token中解析出username
  const username = getUsername(token);
  let sql = `select * from t_user where username = ?`;
  const { error, result } = await commonPromiseRs(queryPromise(sql, username, true));
  if (!error) {
    delete result.password;
  }
  res.sd(error, result);
}

/**
 * 上传头像
 */
async function uploadAvatar(req, res) {
  const token = req.get('Authorization');
  const { file } = req;
  const originalname = Buffer.from(req.file.originalname, 'latin1').toString('utf-8');
  // 从jwt解析出用户名
  const username = getUsername(token);
  // 拼接回显路径
  const avatar = V_UPLOAD_BASE_PATH + file.filename;

  let sql = `update t_user set avatar = ? where username = ?`;
  const { error, result } = await commonPromiseRs(queryPromise(sql, [avatar, username]));
  if (error) {
    return res.sendFail(error);
  }
  // 构建成功的数据
  res.sendSucc({
    avatar,
    msg: `上传文件\\${originalname}\\成功！大小为：${file.size}b`
  })
}


module.exports = {
  login,
  register,
  updateUserInfo,
  resetPassword,
  getUserInfo,
  uploadAvatar
}