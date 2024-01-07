import React from "react";
import {
    Table,
    Card, Button,
} from 'antd'
import moment from 'moment'
import {get} from "../../common/ajax";
import {Helmet} from "react-helmet";

class OrderDetail extends React.Component {

    state = {
        orderDetailList: [],
        orderLoading: false,
    };

    componentDidMount() {
        this.getOrder().then();
    }

    getOrder = async () => {
        this.setState({
            orderLoading: true,
        });
        const res = await get('/mission/order');
        if (res.code !== 200) {
            this.setState({
                orderLoading: false,
            });
        }
        this.setState({
            orderLoading: false,
            orderDetailList: res.data,
        })
    };

    render() {
        const columns = [
            {
                title: '订单id',
                dataIndex: 'orderId',
                align: 'center',
            },
            {
                title: '商品id',
                dataIndex: 'goodsId',
                align: 'center',
            },
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                align: 'center',
            },
            {
                title: '创建时间',
                dataIndex: 'createdAt',
                align: 'center',
                render: (text) => text && moment(text).format('YYYY-MM-DD HH:mm:ss'),
            },
        ];
        return(
            <div>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>订单列表</title>
                </Helmet>

                <div style={{ padding: 5 }}>
                    <Button icon="arrow-left" onClick={() => this.props.history.push('/goods')}>返回商品列表</Button>
                    <Card bordered={false}>
                        <Table
                            style={{marginTop: '50px'}}
                            rowKey='orderId'
                            bordered
                            columns={columns}
                            dataSource={this.state.orderDetailList}
                            loading={this.state.orderLoading}
                        />
                    </Card>
                </div>
            </div>

        )
    }
}

export default OrderDetail;
