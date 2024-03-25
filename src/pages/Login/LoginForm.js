import React from 'react'
import {Form, Input, Row, Col, message} from 'antd'
import {randomNum, sm3Pass} from '../../common/util'
import PromptBox from '../../components/PromptBox/index'
import { withRouter } from 'react-router-dom'
import { post } from '../../common/ajax'
import {authenticateSuccess} from "../../common/session";

@withRouter @Form.create()
class LoginForm extends React.Component {

    state = {
        focusItem: -1,   //当前焦点聚焦在哪一项上
        code: ''  //验证码
    };

    componentDidMount() {
        this._createCode()
    }

    onSubmit = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.onLogin(values).then()
            }
        });
    };

    /**
     * 转换面板为注册面板
     */
    goRegister = () => {
        this.props.form.resetFields();
        this.props.toggleShow();
        this._createCode()
    };

    /**
     * 表单验证成功后的登录函数
     */
    onLogin = async (values) => {

        // 表单登录时，若验证码长度小于4则不会验证，所以我们这里要手动验证一次
        if (this.state.code.toUpperCase() !== values.captcha.toUpperCase()) {
            this.props.form.setFields({
                captcha: {
                    value: values.captcha,
                    errors: [new Error('验证码错误')]
                }
            });
            return
        }

        // 登录
        const res = await post('/uaa/user/doLogin', {
            mobile: values.mobile,
            password: sm3Pass(values.password)
        });
        if (res.code !== 200) {
            this.props.form.setFields({
                password:{
                    value: '',
                    errors: [new Error(res.msg)]
                }
            });
            this._createCode();
            this.props.form.resetFields('captcha');
            return
        }
        await authenticateSuccess('Bearer ' + res.data);
        message.loading('加载中...', 0.5, ()=>this.props.history.push('/goods'));
        this.props.history.push('/goods');
    };

    /**
     * 生成验证码
     */
    _createCode = () => {
        const ctx = this.canvas.getContext('2d');
        const chars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
        let code = '';
        ctx.clearRect(0, 0, 80, 40);
        for (let i = 0; i < 4; i++) {
            const char = chars[randomNum(0, 57)];
            code += char;
            ctx.font = randomNum(20, 25) + 'px SimHei';//设置字体随机大小
            ctx.fillStyle = '#D3D7F7';
            ctx.textBaseline = 'middle';
            ctx.shadowOffsetX = randomNum(-3, 3);
            ctx.shadowOffsetY = randomNum(-3, 3);
            ctx.shadowBlur = randomNum(-3, 3);
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            let x = 80 / 5 * (i + 1);
            let y = 40 / 2;
            let deg = randomNum(-25, 25);
            /**设置旋转角度和坐标原点**/
            ctx.translate(x, y);
            ctx.rotate(deg * Math.PI / 180);
            ctx.fillText(char, 0, 0);
            /**恢复旋转角度和坐标原点**/
            ctx.rotate(-deg * Math.PI / 180);
            ctx.translate(-x, -y)
        }
        this.setState({
            code
        })
    };
    changeCaptcha = () => {
        this.props.form.resetFields(['captcha']);
        this._createCode()
    };

    render() {
        const { getFieldDecorator, getFieldError } = this.props.form;
        const { focusItem, code } = this.state;
        return (
            <div>
                <h3 className="title">客户登录</h3>
                <Form hideRequiredMark>
                    <Form.Item
                        help={<PromptBox info={getFieldError('mobile') && getFieldError('mobile')[0]} />}
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 0 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 0 ? 1 : 0 }}
                        label={<span className='iconfont icon-User' style={{ opacity: focusItem === 0 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('mobile', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '请输入登录手机号' },
                                { pattern: /^[^\s']+$/, message: '不能输入特殊字符' },
                                { min: 11, message: '手机号至少为11位' },
                            ]
                        })(
                            <Input
                                maxLength={11}
                                className="myInput"
                                onFocus={() => this.setState({ focusItem: 0 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                onPressEnter={this.onSubmit}
                                placeholder="登录手机号"
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        help={<PromptBox info={getFieldError('password') && getFieldError('password')[0]} />}
                        style={{ marginBottom: 10 }}
                        wrapperCol={{ span: 20, pull: focusItem === 1 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 1 ? 1 : 0 }}
                        label={<span className='iconfont icon-suo1' style={{ opacity: focusItem === 1 ? 1 : 0.6 }} />}
                        colon={false}>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码' }]
                        })(
                            <Input
                                className="myInput"
                                type="password"
                                onFocus={() => this.setState({ focusItem: 1 })}
                                onBlur={() => this.setState({ focusItem: -1 })}
                                onPressEnter={this.onSubmit}
                                placeholder="密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        help={<PromptBox info={getFieldError('captcha') && getFieldError('captcha')[0]} />}
                        style={{ marginBottom: 20 }}
                        wrapperCol={{ span: 20, pull: focusItem === 2 ? 1 : 0 }}
                        labelCol={{ span: 3, pull: focusItem === 2 ? 1 : 0 }}
                        label={<span className='iconfont icon-securityCode-b' style={{ opacity: focusItem === 2 ? 1 : 0.6 }} />}
                        colon={false}>
                        <Row gutter={8}>
                            <Col span={15}>
                                {getFieldDecorator('captcha', {
                                    validateFirst: true,
                                    rules: [
                                        { required: true, message: '请输入验证码' },
                                        {
                                            validator: (rule, value, callback) => {
                                                if (value.length >= 4 && code.toUpperCase() !== value.toUpperCase()) {
                                                    callback('验证码错误')
                                                }
                                                callback()
                                            }
                                        }
                                    ]
                                })(
                                    <Input
                                        className="myInput"
                                        onFocus={() => this.setState({ focusItem: 2 })}
                                        onBlur={() => this.setState({ focusItem: -1 })}
                                        onPressEnter={this.onSubmit}
                                        placeholder="验证码"
                                    />
                                )}
                            </Col>
                            <Col span={9}>
                                <canvas onClick={this.changeCaptcha} width="80" height='40' ref={el => this.canvas = el} />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <div className="btn-box">
                            <div className="loginBtn" onClick={this.onSubmit}>登录</div>
                            <div className="registerBtn" onClick={this.goRegister}>注册</div>
                        </div>
                    </Form.Item>
                </Form>
                <div className="footer">欢迎登录秒杀商品系统</div>
            </div>
        )
    }
}

export default LoginForm
