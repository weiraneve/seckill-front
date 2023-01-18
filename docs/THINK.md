# 总结
- 这里客户端的权限方面的处理，是在登录认证之后，后端服务器会发送一个JWT，然后前端服务器存储，每次ajax请求都会上传这个JWT给后端，后端服务器有对应的拦截器去验证是否此JWT是否有效。然后通行传输数据。
- React的async和await关键字，这里先总结下promise。

promise用于异步计算，是一个对象，拥有一些异步操作。promise是js的抽象异步处理对象实现异步编程的方案，简单的说就是解决传统js运行单线程的诟病以及异步操作的多层级嵌套带来的麻烦。可以将异步数据变为同步。而本项目中的ajax请求封装就是用的基于promise的ajax请求。所以封装的get、post等方法都是要基于异步的。

await关键在要在async操作中得以体现作用。使用async和await后，async 关键字将函数转换为 promise，用更少的.then()块来封装代码，同时它看起来很像同步代码，所以它非常直观。
- @withRouter装饰器使用后，组件便可以使用this.props.history.push('/a');
- @Form.create() 装饰器修饰过的组件，组件会自带this.props.form 属性
