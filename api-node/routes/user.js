const express = require('express');
const router = express.Router();
const userCtrl = require('../controller/user');

const { loginSchema,updateUserSchema,resetPasswordSchema } = require('../validate/index');
// joi验证局部中间件
const joiMw = require('../middlewares/joiMw');

const upload = require('../utils/multer');

// 登录模块
router.post('/login',joiMw(loginSchema),userCtrl.login);
// 注册模块
router.post('/register',joiMw(loginSchema),userCtrl.register);
// 更新用户信息
router.post('/updateUserInfo',joiMw(updateUserSchema),userCtrl.updateUserInfo);
// 修改密码
router.post('/resetPassword',joiMw(resetPasswordSchema),userCtrl.resetPassword);
// 获取用户信息
router.get('/getUserInfo',userCtrl.getUserInfo);
// 上传头像
router.post('/uploadAvatar',upload.single('file'),userCtrl.uploadAvatar);

 

module.exports = router;