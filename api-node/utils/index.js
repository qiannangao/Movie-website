const path = require('path');
/**
 * 统一的promise类型结果处理,
 * 返回 {error: ? , result: ?}类型
 */
function commonPromiseRs(promise) {
  // 分别处理成功和失败
  return promise.then(res => ({ error: null, result: res }))
    .catch(error => ({ error, result: null }));
}
/**
 * 
 * @param {*} p  只需要传递基于项目的基本路径，就可以自动找到
 * @returns 
 */
function resolvePath(p) {
  return path.join(__dirname, '../', p);
}
module.exports = {
  commonPromiseRs,
  resolvePath
}

