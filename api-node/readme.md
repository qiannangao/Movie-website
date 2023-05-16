## 虫虫电影api
> 项目采用express+mysql开发。

### api
> 主要实现电影列表展示，即将上映，正在热映，top250等。用户可以注册，收藏喜欢的电影，参与评论互动，发布观影感受等。

#### 电影列表api

#### 用户中心api


### mysql数据库

## 启动服务

### 本地安装mysql
+ 安装mysql数据库，并导入项目数据bf_api_node
+ 本地全局安装pm2
```
  npm install pm2 -g
  // 查看版本
  pm2 -v
```
+ 启动项目
```
  // 通过pm2启动项目
  pm2 start process.prod.json
  
```

### pm2常用命令

pm2 start <script_file|config_file> [options] 启动指定应用，如pm2 start index.js --name httpServer；

pm2 stop <appName> [options] 停止指定应用，如pm2 stop httpServer；

pm2 list  把所有pm2启动实例列举出来，注意：pm2 stop 某个项目后，该项目还会存在pm2 list 的列表里面， 只是状态是 stop, 要想去掉该项目，用pm2 delete
pm2 reload|restart <appName> [options]  重启指定应用，如pm2 restart httpServer；

pm2 show <appName> [options] 显示指定应用详情，如pm2 show httpServer；

pm2 delete <appName> [options] 删除指定应用，如pm2 delete httpServer，如果修改应用配置行为，最好先删除应用后，重新启动方才生效，如修改脚本入口文件；

pm2 kill 杀掉pm2管理的所有进程；

pm2 logs <appName>  查看指定应用的日志，即标准输出和标准错误；

pm2 monit 监控各个应用进程cpu和memory使用情况；

pm2 startOrReload <appName> 如果项目没有启动就执行 start  如果项目正在运行 就执行relaod