import { createBrowserHistory } from 'history'

let options = {};

// const env = process.env.REACT_APP_NODE_ENV;  // 环境参数
// if (env === 'dev') {
//     options.basename = '/weiran_manage' // weiran_manage
// } else {
//     // 生产服
//     options.basename = '/admin'
// }

export default createBrowserHistory(options)
