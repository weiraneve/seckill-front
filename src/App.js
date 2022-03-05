import React from 'react'
import {Switch, Route, withRouter, Redirect} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import './assets/iconfont/iconfont.css'
import GoodsList from './pages/GoodsList'
import GoodsDetail from './pages/GoodsDetail'
import OrderList from './pages/OrderList'
import Login from './pages/Login'

@withRouter
class App extends React.Component {

  // PrivateRoute path属性设为/，意为只要登陆token有效，则一切跳转除登陆页面之外都跳转为组件首页
  render() {
    return (
      <Switch>
          <Route path='/login' component={Login} />
          <PrivateRoute path='/goods' component={GoodsList} />
          <PrivateRoute path='/detail/:goodsId' component={GoodsDetail} />
          <PrivateRoute path='/order' component={OrderList} />

          <Redirect from='/' to='/goods'/>
      </Switch>
    )
  }
}

export default App
