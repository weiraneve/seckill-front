import React, {Component} from 'react';
import {Helmet} from "react-helmet";
import {get} from "../../common/ajax";
import '../../styles/detail.css';
import {message, Popconfirm} from "antd";
import moment from 'moment'

class GoodsDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detail:[],
            goods:{},
            remainSeconds:0,
            stockCount:0,
            disabled: true,
            seckillTip:'',
            startTime:'',
            endTime:'',
        }
    }

    componentDidMount() {
        this.getDetail().then();
    }

    // 获得商品细节
    getDetail = async () => {
        let goodsId = this.props.match.params.goodsId;
        const res = await get('/mission/goods/getDetail/' + goodsId)
        if (res.code === 200) {
            this.setState({
                detail:res.data,
                goods:res.data.goods,
                remainSeconds:res.data.remainSeconds,
                stockCount:res.data.stockCount,
                startTime:moment(res.data.goods.startTime).format('YYYY-MM-DD HH:mm:ss'),
                endTime:moment(res.data.goods.endTime).format('YYYY-MM-DD HH:mm:ss'),
            })
        } else if (res.code !== 200) {
            message.error(res.msg);
        } else {
            message.error('客户端请求错误');
        }
        // 库存不大于0，则秒杀按钮置灰
        if (!this.state.stockCount > 0) {
            this.setState({
                disabled: true
            })
        }
        this.countDown().then();
    }

    // 获得秒杀路径，也是秒杀流程的起手式
    getSeckillPath = async () => {
        if (this.state.disabled) {
            message.error("秒杀开始时间有误");
            return;
        }
        let goodsId = this.props.match.params.goodsId;
        const res = await get('/mission/seckill/getPath', {
            goodsId:goodsId
        })
        if (res.code === 200) {
            let path = res.data;
            this.doSeckill(path).then();
        } else if (res.code !== 200) {
            message.error(res.msg);
        } else {
            message.error("客户端请求错误");
        }
    }

    // 执行秒杀
    doSeckill = async (path) => {
        let goodsId = this.props.match.params.goodsId;
        const res = await get('/mission/seckill', {
            goodsId:goodsId,
            path:path
        })
        if (res.code === 200) {
            this.getSeckillResult(goodsId).then();
        } else if (res.code !== 200) {
            message.error(res.msg);
        } else {
            message.error("客户端请求错误");
        }
    }

    // 获得秒杀结果
    getSeckillResult = async (goodsId) => {
        const res = await get('/mission/seckill/result',{
            goodsId:goodsId
        })

        if (res.code === 200) {
            const result = res.data;
            switch (true) {
                case result === 0: // 继续轮询
                    setTimeout(() => this.getSeckillResult(goodsId).then(), 500) // 每0.5s短轮训服务器秒杀结果
                    break;
                case result > 0:
                    message.success("恭喜你，秒杀成功!");
                    break;
                case result < 0:
                    message.error("对不起，秒杀失败。秒杀时间已经结束。");
                    break;
                default:
                    break;
            }
        } else if (res.code !== 200) {
            message.error(res.msg);
        } else {
            message.error("客户端请求错误");
        }
    }

    // 秒杀计时
    countDown = async () => {
        let remainSeconds = this.state.remainSeconds;
        if (remainSeconds > 0) {
            remainSeconds--;
            this.setState({ // 秒杀还没开始，倒计时
                remainSeconds:remainSeconds,
                disabled:true,
                seckillTip:"秒杀倒计时：" + remainSeconds + "秒",
            })
        } else if (remainSeconds === 0) { // 秒杀进行中
            this.setState({
                disabled:false,
                seckillTip:"秒杀进行中"
            })
        } else { // 秒杀已经结束
            this.setState({
                disabled:true,
                seckillTip:"秒杀已经结束"
            })
        }
        setTimeout(() => {
            this.countDown(remainSeconds);
        }, 1000);
    }

    // 返回商品列表
    toGoodsList = () => {
        this.props.history.push('/goods');
    }

    render() {

        return (
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>商品详情</title>
                </Helmet>

                <div className="goods">
                    <div className="containers">
                        <div className="goods_view">
                            <img id="goodsImg" src={this.state.goods.goodsImg} width="560" alt="商品照片"/>
                        </div>
                        <div className="goods_info">
                            <h2 id="goodsName">{this.state.goods.goodsName}</h2>
                            <p className="title" id="goodsTitle"> </p>
                            <p>
                                <span className="price1" id="goodsPrice">{this.state.goods.goodsPrice}元</span>
                            </p>
                            <div className="seckill_data">
                                <div>
                                    <span>秒杀开始时间</span>
                                    <p id="startTime">{this.state.startTime}</p>
                                </div>
                                <div>
                                    <span>秒杀结束时间</span>
                                    <p id="endTime">{this.state.endTime}</p>
                                </div>
                            </div>
                            <div className="seckillStatus">
                                <span id="seckillTip">{this.state.seckillTip}</span>
                            </div>
                            <div className="count">
                                <span>库存数量：</span>
                                <span id="stockCount">{this.state.stockCount}</span>
                            </div>
                            <div>
                                <Popconfirm title='您确定秒杀购买当下商品并下单吗？' disabled={this.state.disabled} onConfirm={() => this.getSeckillPath()}>
                                    <button type="button" className="btn"  id="buyButton">立即秒杀</button>
                                </Popconfirm>
                            </div>
                            <button className="btn" type="button" id="backButton" onClick={() => this.toGoodsList()}>返回商品列表</button>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default GoodsDetail;
