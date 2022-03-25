# 前言
商品详情页进行部分的异步优化，其他地方小小优化。对应seckillcloud-0.0.7

# 简介
针对前后端分离的需求，构建了用React框架的客户端前端服务器。负责前端的客户端秒杀服务器。

# 如何使用
## `项目准备`
由于此项目是前后端分离，请先把后端项目跑起来。
下载前端源码后
- npm install   或者 yarn install (建议yarn方式)
下载环境依赖包
## `本地部署`
1. 修改根目录下 .env 全局文件中的变量。变量PORT是控制启动端口，与package.json文件中的启动脚本语句结合使用，可改为3000，无妨使用。.env文件中的REACT_APP_BASE_URL变量是结合setupProxy.js文件中的目标网址使用，这一块代理请求的知识在[自己的总结](./THINK.md)里说。以及.env和setupProxy.js文件改了内容后都要重启才生效。
2. 终端输入```yarn start```

本地运行项目，一般会自动打开游览器直接访问。

# 解决BUG
- 有时候启动时会报错babel-jest错误，看具体报错内容，去lock文件中删除与项目制定babel-jest版本不符的依赖，再删除node_modules包，再yarn install 命令重新安装。

# 参考
- [国密算法sm2、sm3和sm4的js版](https://github.com/JuneAndGreen/sm-crypto)

- [自己总结](./THINK.md)
