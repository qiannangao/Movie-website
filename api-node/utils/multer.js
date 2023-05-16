// 文件上传中间件封装
// http://expressjs.com/en/resources/middleware/multer.html
const multer = require('multer');
// 上传文件的文件夹
const { UPLOAD_BASE_PATH } = require('../config');
const { resolvePath } = require('./index');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolvePath(UPLOAD_BASE_PATH));
  },
  filename: function (req, file, cb) {
    // 文件后缀  .png  .jpg
    const fileExt = file.originalname.split('.')[1];
    // 重命名图片
    const newFileName = new Date().getTime() + '_' + Math.floor(Math.random() * 100) + '.' + fileExt;
    req.filename = newFileName;
    cb(null, newFileName);
  },

})

const fileFilter = function (req, file, cb) {
  // 文件后缀  .png  .jpg
  const fileExt = file.originalname.split('.')[1];
  if (!/^(png|jpg|gif|webp)$/i.test(fileExt)) {
    return cb(new Error('只允许.png|.jpg|.gif|.webp格式！'));
  }
  cb(null, true);
}

const upload = multer({
  // 限制大小2M以内
  storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 }
});


module.exports = upload;