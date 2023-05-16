const express = require('express');
const router = express.Router();
const adminCtrl = require('../controller/user/admin');
const { userListSchema, lockUserSchema, delUserSchema, delUserBatchSchema, findUserByParamsSchema } = require('../validate/index');
// joi验证局部中间件
const joiMw = require('../middlewares/joiMw');
// 验证admin的中间件
const adminMw = require('../middlewares/adminMw');
// 分页获取用户列表
router.get('/getUserList', joiMw(userListSchema), adminMw, adminCtrl.getUserList);
// 停用某个账号
router.post('/lockUser', joiMw(lockUserSchema), adminMw, adminCtrl.lockUser);
// 启用账号
router.post('/unlockUser', joiMw(lockUserSchema), adminMw, adminCtrl.unlockUser);
// 删除用户
router.delete('/delUser', joiMw(delUserSchema), adminMw, adminCtrl.delUser);
// 批量删除
router.delete('/delUserBatch', joiMw(delUserBatchSchema), adminMw, adminCtrl.delUserBatch);
// 条件查询用户列表
router.get('/findUserByParams', joiMw(findUserByParamsSchema), adminMw, adminCtrl.findUserByParams);

module.exports = router;