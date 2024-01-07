import React, {Component} from 'react';
import { Helmet } from "react-helmet";
import '../../styles/list.css';
import {get} from '../../common/ajax'
import {message, Button} from "antd";
import {logout} from "../../common/session";
import EditPasswordModal from './EditPasswordModal.jsx'

class GoodsList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            goodsList:[],
            passwordVisible: false,  // 控制修改密码的模态框
        }
    }

    componentDidMount() {
        this.getGoodsList().then();
        this.seckill_time_index().then();
    }

    getGoodsList = async () => {
        const res = await get('/mission/goods/getGoodsList')
        if (res.code !== 200) {
            message.error(res.msg)
        } else if (res.code == null) {
            message.error('客户端请求错误')
        }
        this.setState({
            goodsList: res.data
        })
    };

    // 商品信息渲染封装函数
    goodsListMap = (data, index) => {
        let goods = data.goods;
        let goodsId = goods.id;
        let goodsName = goods.goodsName;
        let goodsImg = goods.goodsImg;
        let goodsTitle = goods.goodsTitle;
        let goodsPrice = goods.goodsPrice;
        return (
            <li key={index}>
                <div className='bg'><img src={goodsImg} alt='商品照片'/></div>
                <div className='info'>
                    <div className='name' onClick={() => this.toDetail(goodsId)}>{goodsName}</div>
                    <p className='tips'>{goodsTitle}</p>
                    <p className='price'>{goodsPrice}元</p>
                    <div className='btn' onClick={() => this.toDetail(goodsId)}>进入秒杀详情</div>
                </div>
            </li>
        )
    }

    show_data_jsx_0 = () => this.state.goodsList.map((data, index) => {
        // 剩余时间等于0，正在秒杀中；剩余时间大于0，还没有开始秒杀；小于0，已经结束秒杀。大于0且小于86400为一天内
        if (data.remainSeconds ===0) {
            return this.goodsListMap(data, index);
        }
        return null;
    });

    show_data_jsx_1 = () => this.state.goodsList.map((data, index) => {
        if (data.remainSeconds > 0 && data.remainSeconds < 86400) {
            return this.goodsListMap(data, index);
        }
        return null;
    });

    show_data_jsx_2 = () => this.state.goodsList.map((data, index) => {
        if (data.remainSeconds > 86400) {
            return this.goodsListMap(data, index);
        }
        return null;
    });

    show_data_jsx_3 = () => this.state.goodsList.map((data, index) => {
        if (data.remainSeconds < 0) {
            return this.goodsListMap(data, index);
        }
        return null;
    });

    // 显示秒杀商品是何种时间状态
    seckill_time_index = async () => {
        let tabs = document.getElementById("tabs").getElementsByTagName("li");
        let lists = document.getElementById("lists").getElementsByTagName("ul");

        for (let i = 0; i < tabs.length; i++) {
            tabs[i].onclick = showList;
        }

        function showList() {
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i] === this) {
                    tabs[i].className = "active";
                    lists[i].className = "clearfix active";
                } else {
                    tabs[i].className = "";
                    lists[i].className = "clearfix";
                }
            }
        }

        let seckillNav = document.getElementById("seckillNav");
        window.onscroll = function() {
            let scrollTop = document.documentElement.scrollTop || 0;
            if (scrollTop >= 260) {
                seckillNav.className = "seckill-nav seckill-nav-fixed";
            } else {
                seckillNav.className = "seckill-nav";
            }
        };
    }

    // 注销并退出登录
    user_logout = () => {
        get('/uaa/user/logout').then();
        logout();
        message.success('注销成功');
        this.props.history.push("/login");
    }

    // 跳转商品细节页面
    toDetail = async (goodsId) => {
        this.props.history.push("/detail/" + goodsId);
    }

    // 展开/关闭修改密码模态框
    togglePasswordVisible = (visible) => {
        this.setState({
            passwordVisible: visible
        })
    };

    render() {

        return (
            <div className="application">
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>商品列表</title>
                </Helmet>

                <div className="top-bar">
                    <div className="container">
                        <div className="top-bar-nav">
                            <a href='/order'>客户订单</a><span>|</span>
                            <Button onClick={() => this.togglePasswordVisible(true)}>更换密码</Button><span>|</span>
                        </div>
                        <div className="top-bar-cart">
                            <button type="submit" onClick={() => this.user_logout()}>注销</button>
                        </div>
                    </div>
                </div>

                <div className="header">
                    <div className="container">
                        <div className="header-logo"><a href='/goods' className="lr">官网</a></div>
                    </div>
                </div>

                <div className="seckill">
                    <div className="seckill-head">
                        <h1>商品秒杀</h1>
                    </div>

                    <div className="container">
                        <div id="seckillNav" className="seckill-nav">
                            <ul className="n" id="tabs">
                                <li className="active"><em></em><span>已经开始</span></li>
                                <li><em> </em><span>今日即将开始</span></li>
                                <li><em> </em><span>未来即将开启</span></li>
                                <li><em> </em><span>抢购已结束</span></li>
                            </ul>
                        </div>

                        <div id="lists" className="seckill-goods">
                            <ul className="clearfix active">
                                <div id="show_data_0">
                                    {this.show_data_jsx_0()}
                                </div>
                            </ul>
                            <ul className="clearfix">
                                <div id="show_data_1">
                                    {this.show_data_jsx_1()}
                                </div>
                            </ul>
                            <ul className="clearfix">
                                <div id="show_data_2">
                                    {this.show_data_jsx_2()}
                                </div>
                            </ul>
                            <ul className="clearfix">
                                <div id="show_data_3">
                                    {this.show_data_jsx_3()}
                                </div>
                            </ul>
                        </div>

                        <p className="seckill-notice">
                            *秒杀活动规则：
                            1.秒杀商品是否参加活动、最终秒杀成功的商品，以订单结算页显示为准，活动包括但不限于优惠券、赠品、满减、满赠等；
                            2.秒杀商品数量有限，活动以下单支付成功为准，请加入购物车后尽快下单支付；
                            3.秒杀价不含运费，最终以订单结算页价格为准；
                            4.订单中商品的数量、型号等，以订单结算页为准；
                            温馨提示：因可能存在系统缓存、页面更新导致价格变动异常等不确定性情况出现，如您发现活动商品标价或促销信息有异常，请您立即联系客服，以便我们及时补正。
                        </p>

                    </div>
                </div>
                <EditPasswordModal toggleVisible={this.togglePasswordVisible} visible={this.state.passwordVisible} />
            </div>
        )
    }
}

export default GoodsList;
