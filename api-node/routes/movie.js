const express = require('express');
const router = express.Router();
const movieCtrl = require('../controller/movie');
// 表单验证规则
const { moveListSchema, subjectSchema, playerSchema, previewSchema } = require('../validate/index');
// joi验证局部中间件
const joiMw = require('../middlewares/joiMw');


// 获取正在热映
router.get('/in_theaters', joiMw(moveListSchema), movieCtrl.getInTheaters);
// 即将上映
router.get('/coming_soon', joiMw(moveListSchema), movieCtrl.getComingSoon);
// top250
router.get('/top250', joiMw(moveListSchema), movieCtrl.getTop250);
// 根据id获取电影明细
router.get('/subject', joiMw(subjectSchema),movieCtrl.getSubjectById);
// 根据演员id获取演员明细
router.get('/playerInfo', joiMw(playerSchema),movieCtrl.findPlayerById);
// 查询电影预告片
router.get('/selectPreview', movieCtrl.findSelectPreview);
// 根据电影id查询预告片
router.get('/findPreviewByMid',joiMw(previewSchema), movieCtrl.findPreviewByMId);


module.exports = router;