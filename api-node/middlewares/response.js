/**
 * 定义统一返回类型
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = function (req, res, next) {
  res.sendPromise = function (p) {
    p.then(ok => res.sendSucc(ok)).catch(err => res.sendFail(err));
  }
  res.sd = function (error, result) {
    error ? res.sendFail(error) : res.sendSucc(result);
  }
  res.sendSucc = function (result) {
    res.json({
      code: 200,
      data: result||null,
      message: null,
      success: true
    })
  }
  res.sendFail = function (error, code) {
    res.json({
      code: code || 200,
      data: null,
      message: error,
      success: false,
    })
  }
  next();
}