const { queryPagePromise, queryPromise } = require("../../db");
const { commonPromiseRs } = require("../../utils");

// 分页获取用户列表
async function getUserList(req, res) {
  // 分页数据
  const start = req.query.start;
  const limit = req.query.limit;
  let sql = ` from t_user where username != 'admin' order by addtime desc `;
  const { error, result } = await commonPromiseRs(
    queryPagePromise(sql, `select * ${sql}`, [start, limit])
  );
  res.sd(error, result);
}
/**
 * 停用某个账号
 * @param {*} req
 * @param {*} res
 */
async function lockUser(req, res) {
  const { username } = req.body;
  let sql = `update t_user set available = 0 where username = ?`;
  const { error, result } = await commonPromiseRs(queryPromise(sql, username));
  res.sd(error, result);
}
/**
 * 启用某个账号
 * @param {*} req
 * @param {*} res
 */
async function unlockUser(req, res) {
  const { username } = req.body;
  let sql = `update t_user set available = 1 where username = ?`;
  const { error, result } = await commonPromiseRs(queryPromise(sql, username));
  res.sd(error, result);
}
/**
 * 删除用户
 * @param {*} req
 * @param {*} res
 */
async function delUser(req, res) {
  const { userId } = req.body;
  // 1. 删除关联信息
  let sql1 = `delete from t_movie_collect where userId = ?`;
  await commonPromiseRs(queryPromise(sql1, userId));
  // 2. 删除用户信息
  let sql = `delete from t_user where id = ?`;
  const { error, result } = await commonPromiseRs(queryPromise(sql, userId));
  res.sd(error, result);
}

/**
 * 批量删除用户
 * @param {*} req
 * @param {*} res
 */
async function delUserBatch(req, res) {
  const { ids } = req.body;

  console.log("ids==>", ids);
  res.sendSucc("当前接口还未完成...ok");
}

/**
 * 条件查询用户列表
 */
async function findUserByParams(req, res) {
  const { username, available } = req.query;
  let whereStr = "";
  let fromSql = ` from t_user where ${whereStr} order by addtime desc`;
  // 模糊查询
  if (username) {
    whereStr += `and username like'%${username}%'`;
  }
  if (available) {
    whereStr += `and available = ${available}`;
  }
  // 去掉第一个and
  if (!whereStr) {
    whereStr = whereStr.substring(4);
  }

  const { error, result } = await commonPromiseRs(
    queryPagePromise(fromSql, `select * ${fromSql}`, available)
  );
  res.sd(error, result);
}

module.exports = {
  getUserList,
  lockUser,
  unlockUser,
  delUser,
  delUserBatch,
  findUserByParams,
};
