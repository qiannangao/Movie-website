const { queryPagePromise, queryPromise } = require("../../db");
const { commonPromiseRs } = require("../../utils");

/**
 * 正在热映
 * @param {*} req
 * @param {*} res
 */
function getInTheaters(req, res) {
  // 分页信息
  let start = req.query.start;
  let limit = req.query.limit;
  res.sendPromise(findMoviesByType(start, limit, 0));
}

/**
 * 即将上映
 * @param {*} req
 * @param {*} res
 */
function getComingSoon(req, res) {
  let start = req.query.start;
  let limit = req.query.limit;
  res.sendPromise(findMoviesByType(start, limit, 1));
}

/**
 *
 *
 * 最热250
 * @param {*} req
 * @param {*} res
 */
function getTop250(req, res) {
  let start = req.query.start;
  let limit = req.query.limit;
  res.sendPromise(findMoviesByType(start, limit, 2));
}
/**
 * 电影明细  subject?mId=?
 * @param {*} req
 * @param {*} res
 */
async function getSubjectById(req, res) {
  // 电影id
  const mId = req.query.mId;
  let movieSql =
    "select a.*,b.summary from t_douban_movie a left join t_douban_subject b on a.mId = b.mId where a.mId = ?";
  let playersSql =
    "SELECT a.*,b.name_en from t_douban_movie_player a left join t_douban_player b on a.playerId = b.playerId  where a.mId = ?";
  let photosSql = "SELECT * from t_douban_photo where mId = ?";
  // 预告片
  let trailerSql = "SELECT * from t_douban_trailer where mId = ?";
  // 评论
  let commenSql = "from t_douban_comment where mid =  ?";
  // 查找一个结果集
  const { error: movieErr, result: movieRs } = await commonPromiseRs(
    queryPromise(movieSql, mId, true)
  );
  const { error: playersErr, result: playersRs } = await commonPromiseRs(
    queryPromise(playersSql, mId)
  );
  const { error: photosErr, result: photosRs } = await commonPromiseRs(
    queryPromise(photosSql, mId, true)
  );
  const { error: trailerErr, result: trailerRs } = await commonPromiseRs(
    queryPromise(trailerSql, mId, true)
  );
  // 评论默认最多拿20条
  const { error: commenErr, result: commenRs } = await commonPromiseRs(
    queryPagePromise(commenSql, `select * ${commenSql}`, [mId, 1, 20])
  );

  // 组合
  const movieSubject = {
    ...movieRs,
  };
  // 追加演员
  !playersErr && (movieSubject.players = playersRs);
  // 追加剧照
  !photosErr && (movieSubject.photos = photosRs);
  // 预告片
  !trailerErr && (movieSubject.trailers = trailerRs);
  // 评论
  !commenErr && (movieSubject.comments = commenRs);
  // 处理部分字符串字段
  if (!movieErr) {
    movieSubject.language = JSON.parse(movieSubject.language);
    movieSubject.genres = JSON.parse(movieSubject.genres);
    movieSubject.scriptwriter = JSON.parse(movieSubject.scriptwriter);
    movieSubject.longtime = JSON.parse(movieSubject.longtime);
    movieSubject.director = JSON.parse(movieSubject.director);
    movieSubject.countries = JSON.parse(movieSubject.countries);
    movieSubject.show_date = JSON.parse(movieSubject.show_date);
    movieSubject.photos.img = JSON.parse(movieSubject.photos.img);
    movieSubject.trailers.video = JSON.parse(movieSubject.trailers.video);
  }

  res.sd(movieErr, movieSubject);
}

/**
 * 根据演员id查询演员信息
 * @param {*} playerId
 */
async function findPlayerById(req, res) {
  // 演员id
  const playerId = parseInt(req.query.playerId);
  let sql = "select * from t_douban_player where playerId = ?";
  let photoSql = "select * from t_douban_player_photo where playerId = ?";
  const { error: playerErr, result: playerRs } = await commonPromiseRs(
    queryPromise(sql, playerId, true)
  );
  const { error: photoErr, result: photoRs } = await commonPromiseRs(
    queryPromise(photoSql, playerId, true)
  );
  // 转换内容
  const player = {
    ...playerRs,
  };
  // 转换字符串部分内容
  if (!playerErr) {
    player.movies = JSON.parse(player.movies);
  }
  if (!photoErr) {
    photoRs.img = JSON.parse(photoRs.img);
    player.photos = photoRs;
  }

  res.sd(playerErr, player);
}

/**
 * 精选预告
 */
async function findSelectPreview(req, res) {
  // 查询电影
  const { error: movieErr, result: movieRs } = await commonPromiseRs(
    findMoviesByType(1, 10, 0)
  );

  // in参数
  let inParams = "";
  movieRs.forEach((item) => {
    inParams += "," + item.mId;
  });
  inParams.substring(1);

  let sql = `select * from t_douban_trailer where mId in (${inParams})`;
  const { error: trailerErr, result: trailerRs } = await commonPromiseRs(
    queryPromise(sql)
  );
  if (!trailerErr) {
    // 遍历预告片，根据电影id追加到电影对象列表
    trailerRs.forEach((item) => {
      let theone = movieRs.find((m) => m.mId === item.mId);
      theone.video = JSON.parse(item.video);
    });
  }
  res.sd(movieErr, movieRs);
}

/**
 * 根据电影id查询预告片
 */
async function findPreviewByMId(req, res) {
  const mId = req.query.mId;
  let sql = `select * from t_douban_trailer where mId = ?`;
  const { error, result } = await commonPromiseRs(queryPromise(sql, mId, true));
  if (!error && result) {
    result.video = JSON.parse(result.video);
  }
  res.sd(error, result);
}

// function findMoviesByType(start, limit, type = 0) {
//   // 用于查询分页总数
//   let fromSql = `FROM t_douban_mid m LEFT JOIN t_douban_movie a ON m.mId = a.mId where m.type = ?`;
//   let sql = `select * ${fromSql} `;
//   // 返回promise
//   return queryPagePromise(fromSql, sql, [type, start, limit]);
// }
async function findMoviesByType(start, limit, type = 0) {
  // 用于查询分页总数
  let fromSql = `FROM t_douban_mid m LEFT JOIN t_douban_movie a ON m.mId = a.mId where a.type = ? and m.type=a.type`;
  let sql = `select * ${fromSql} `;
  // 返回promise
  // return queryPagePromise(fromSql, sql, [type, start, limit]);
  const { error, result } = await commonPromiseRs(
    queryPagePromise(fromSql, sql, [type, start, limit])
  );
  if (error) {
    return Promise.reject(error);
  } else {
    // 修复数据
    result.list.map((item) => {
      return formatStr2Json(item, [
        "genres",
        "director",
        "scriptwriter",
        "countries",
        "language",
        "show_date",
        "longtime",
      ]);
    });
    return Promise.resolve(result);
  }
}

function formatStr2Json(obj, keys) {
  keys.forEach((item) => {
    if (obj[item]) {
      try {
        obj[item] = JSON.parse(obj[item]);
      } catch (e) {
        console.error(e);
      }
    }
  });
}

module.exports = {
  getInTheaters,
  getComingSoon,
  getTop250,
  getSubjectById,
  findPlayerById,
  findSelectPreview,
  findPreviewByMId,
};
