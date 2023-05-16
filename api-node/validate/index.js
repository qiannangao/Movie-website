// https://www.npmjs.com/package/joi

const Joi = require('joi');
// string() 值必须是字符串
// alphanum() 值只能是包含 a-zA-ZO-9 的字符串
// required() 值是必填项，不能为 undefined
// pattern(正则表达式) 值必须符合正则表达式的规则

// const userSchema = {
//   // 2.1 校验 req.body 中的数据
//   body: {
//     username: Joi.string().alphanum().min(3).max(12).required(),
//     password: Joi.string()
//       .pattern(/^[\S]{6,15}$/)
//       .required(),
//     repassword: Joi.ref('password')
//   },
//   // 2.2 校验 req.query 中的数据
//   query: {
//     name: Joi.string().alphanum().min(3).required(),
//     age: Joi.number().integer().min(1).max(100).required()
//   },
//   // 2.3 校验 req.params 中的数据
//   params: {
//     id: Joi.number().integer().min(0).required()
//   }
// }
// 电影列表的验证
const moveListSchema = {
  query: {
    start: Joi.string().pattern(/^\d+$/).required(),
    limit: Joi.string().pattern(/^\d+$/).required()
  }
}
// 验证mId
const subjectSchema = {
  query: {
    mId: Joi.string().required()
  }
}
// 演员信息
const playerSchema = {
  query: {
    playerId: Joi.string().required()
  }
}
// 预告信息
const previewSchema = {
  query: {
    mId: Joi.string().required()
  }
}
// 用户登录验证
const loginSchema = {
  body: {
    username: Joi.string().min(2).max(20).pattern(/^[\w]+$/).required(),
    password: Joi.string().alphanum().min(6).max(20).required()
  }
}
// 更新用户验证
const updateUserSchema = {
  body: {
    id: Joi.string().required(),
    sex: Joi.string().pattern(/^[01]$/),
    birthday: Joi.date()
  }
}

// 重置密码
const resetPasswordSchema = {
  body: {
    username: Joi.string().min(2).max(20).pattern(/^[\w]+$/).required(),
    password: Joi.string().alphanum().min(6).max(20).required(),
    newPassword: Joi.string().alphanum().min(6).max(20).required()
  }
}

// admin相关
const userListSchema = {
  query: {
    start: Joi.string().pattern(/^\d+$/).required(),
    limit: Joi.string().pattern(/^\d+$/).required()
  }
}
// lockUser
const lockUserSchema = {
  body: {
    username: Joi.string().min(2).max(20).pattern(/^[\w]+$/).required()
  }
}

// delUser
const delUserSchema = {
  body: {
    userId: Joi.string().required()
  }
}
// 批量删除
const delUserBatchSchema = {
  body: {
    ids: Joi.array().items(Joi.string(), Joi.number())
  }
}
// 条件查询用户列表
const findUserByParamsSchema = {
  query: {
    username: Joi.string(),
    available: Joi.string().pattern(/^[01]$/)
  }
}
module.exports = {
  moveListSchema,
  subjectSchema,
  playerSchema,
  previewSchema,
  loginSchema,
  updateUserSchema,
  resetPasswordSchema,
  userListSchema,
  lockUserSchema,
  delUserSchema,
  delUserBatchSchema,
  findUserByParamsSchema
};