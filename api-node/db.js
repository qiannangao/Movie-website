const mysql = require('mysql')
const configFile = require('./config')
const pool = mysql.createPool(configFile.mysql)
/**
 * 数据库连接池
 * @param {*} sql 
 * @param {*} values 
 * @param {*} callback 
 */
function query(sql, values, callback) {
  pool.getConnection(function (err, connection) {
    if (err) throw new Error(err);
    //Use the connection
    connection.query(sql, values, function (err, results) {
      //每次查询都会 回调
      callback(err, dbRs2JSON(results));
      //只是释放链接，在缓冲池了，没有被销毁
      connection.release();
      if (err) throw new Error(err);
    });

  });
}

/**
 * 数据库操作的promise封装
 * @param {*} sql 
 * @param {*} values 
 * @param {*} findOne 是否只查找一个,boolean
 * @returns 
 */
function queryPromise(sql, values, findOne) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) throw new Error(err);
      connection.query(sql, values, function (err, results) {
        if (err) return reject(err);
        resolve(findOne ? dbRs2JSON(results)[0] : dbRs2JSON(results));
        //只是释放链接，在缓冲池了，没有被销毁
        connection.release();
      });
    });
  })
}



/**
 * 分页查询封装
 * @param {*} fromSql 
 * @param {*} sql 
 * @param {*} values [?,?,?,start,limit]
 */
async function queryPagePromise(fromSql, sql, values) {
  // 分页参数
  const limit = parseInt(values.pop());
  const start = parseInt(values.pop());

  let countSql = `select count(*) as count ${fromSql}`;
  // 总条目
  const countRs = await queryPromise(countSql, values);
  const count = countRs[0] ? countRs[0].count : 0;
  // 分页偏移量从0开始，查询参数从1开始。所以要-1；
  const startCount = (start - 1) * limit;
  let listSql = `${sql} limit ${startCount},${limit}`;
  // 分页数据
  const list = await queryPromise(listSql, values);
  // 组合分页对象
  return {
    totalRow: count,
    pageNumber: start,
    pageSize: limit,
    totalPage: Math.ceil(count / limit),
    list
  }
}

/**
 * 把数据库查询的结果转化为json
 */
function dbRs2JSON(results) {
  return JSON.parse(JSON.stringify(results));
}

module.exports = {
  query,
  queryPromise,
  queryPagePromise
}