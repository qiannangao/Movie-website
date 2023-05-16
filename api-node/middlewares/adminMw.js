const { getUsername } = require('../utils/jwt');
/**
 * 验证是否是admin用户的中间件
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = function(req,res,next){
  const token = req.get('Authorization');
  // 1. 验证身份，必须admin才有权限获取
  if (!checkAdmin(token)) return next(new Error('非法操作，您不是admin用户！'));
  next();
}


/**
 * 验证admin超级管理员身份
 * @param {*} token 
 * @returns 
 */
function checkAdmin(token) {
  // 从token中解析出username
  const username = getUsername(token);
  // 不是超级管理员
  return username === 'admin';
}
