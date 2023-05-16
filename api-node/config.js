// 配置文件
const CONFIG = {
  port: 3000,
  mysql: {
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'bf_api_node',
    char: 'utf8mb4',
    timezone: "SYSTEM",
    connectionLimit: 30
  },
  // jwt密钥
  jwtSecretKey: 'bufanxuey',
  //上传基本路径
  UPLOAD_BASE_PATH: '/public/uploads/',
  // 上传虚拟路径
  V_UPLOAD_BASE_PATH:'/static/uploads/'
}
module.exports = CONFIG