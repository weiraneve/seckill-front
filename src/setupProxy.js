const { createProxyMiddleware } = require('http-proxy-middleware');

const matchUrl = '/api'; // 请求是匹配的地址
const targetUrl = 'http://localhost:8205'; // 目标网址

// 修改反向代理设置后要重启才能生效
module.exports = function (app) {
    app.use(
        // 后端项目访问名称
        createProxyMiddleware(matchUrl, {
            // 本地访问地址
            target: targetUrl,
            changeOrigin: true,
            pathRewrite: {
                "^/api" : "", // 发送到目标网址后带不带这个路由
            }
        }
    ))
};
