import React from 'react'
import {Col, Form, Input, message, Row} from 'antd'
import PromptBox from '../../components/PromptBox/index'
import {post} from '../../common/ajax'
import {randomNum} from "../../common/util";

@Form.create()
class RegisterForm extends React.Component {

    state = {
        focusItem: -1,   // 当前焦点聚焦在哪一项上
        loading: false,   // 注册的loading
        code: ''  //验证码
    };

    componentDidMount() {
        this._createCode()
    }

    /**
     * 返回登录面板
     */
    backLogin = () => {
        this.props.form.resetFields();
        this.props.toggleShow();
        this._createCode();
    };

    onSubmit = () => {
        this.props.form.validateFields((errors, values) => {
            if (!errors) {
                this.onRegister(values).then();
            }
        });
    };

    /**
     * 注册函数
     */
    onRegister = async (values) => {

        // 如果正在注册，则return，防止重复注册
        if (this.state.loading) {
            return
        }

        this.setState({
            loading: true
        });
        const hide = message.loading('注册中...', 0);

        // 表单注册时，若验证码长度小于4则不会验证，所以我们这里要手动验证一次
        if (this.state.code.toUpperCase() !== values.captcha.toUpperCase()) {
            this.props.form.setFields({
                captcha: {
                    value: values.captcha,
                    errors: [new Error('验证码错误')]
                }
            });
            return
        }

        // 密码前端做sm3加盐加密处理
        const salt = "3a41dx1d";
        let inputPass = values.registerPassword;
        let str_password = "" + salt.charAt(0) + salt.charAt(2) + inputPass + salt.charAt(5) + salt.charAt(4);
        const sm3 = require('sm-crypto').sm3 // sm3加密
        let password = sm3(str_password) // 杂凑，单向加密

        const res = await post('/uaa/user/doRegister', {
            registerMobile: values.registerMobile,
            registerPassword: password,
        });
        this.setState({
            loading: false
        });
        hide();
        if (res.code === 200) {
            message.success('注册成功')
        } else if (res.code !== 200) {
            message.error(res.msg)
        } else {
            message.error('客户端请求错误')
        }
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
        const {getFieldDecorator, getFieldValue, getFieldError} = this.props.form;
        const {focusItem, code} = this.state;
        return (
            <div>
                <h3 className="title">客户注册</h3>
                <Form hideRequiredMark>
                    <Form.Item
                        help={<PromptBox info={getFieldError('registerMobile') && getFieldError('registerMobile')[0]}/>}
                        style={{marginBottom: 10}}
                        wrapperCol={{span: 20, pull: focusItem === 0 ? 1 : 0}}
                        labelCol={{span: 3, pull: focusItem === 0 ? 1 : 0}}
                        label={<span className='iconfont icon-User' style={{opacity: focusItem === 0 ? 1 : 0.6}}/>}
                        colon={false}>
                        {getFieldDecorator('registerMobile', {
                            validateFirst: true,
                            rules: [
                                {required: true, message: '手机号不能为空'},
                                {pattern: /^[^\s']+$/, message: '不能输入特殊字符'},
                                {min: 11, message: '手机号至少为11位'},
                            ]
                        })(
                            <Input
                                maxLength={11}
                                className="myInput"
                                onFocus={() => this.setState({focusItem: 0})}
                                onBlur={() => this.setState({focusItem: -1})}
                                onPressEnter={this.onSubmit}
                                placeholder="注册手机号"
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        help={<PromptBox
                            info={getFieldError('registerPassword') && getFieldError('registerPassword')[0]}/>}
                        style={{marginBottom: 10}}
                        wrapperCol={{span: 20, pull: focusItem === 1 ? 1 : 0}}
                        labelCol={{span: 3, pull: focusItem === 1 ? 1 : 0}}
                        label={<span className='iconfont icon-suo1' style={{opacity: focusItem === 1 ? 1 : 0.6}}/>}
                        colon={false}>
                        {getFieldDecorator('registerPassword', {
                            validateFirst: true,
                            rules: [
                                {required: true, message: '密码不能为空'},
                                {pattern: '^[^ ]+$', message: '密码不能有空格'},
                                {min: 3, message: '密码至少为3位'},
                            ]

                        })(
                            <Input
                                maxLength={16}
                                className="myInput"
                                type="password"
                                onFocus={() => this.setState({focusItem: 1})}
                                onBlur={() => this.setState({focusItem: -1})}
                                onPressEnter={this.onSubmit}
                                placeholder="密码"
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        help={<PromptBox
                            info={getFieldError('confirmPassword') && getFieldError('confirmPassword')[0]}/>}
                        style={{marginBottom: 10}}
                        wrapperCol={{span: 20, pull: focusItem === 2 ? 1 : 0}}
                        labelCol={{span: 3, pull: focusItem === 2 ? 1 : 0}}
                        label={<span className='iconfont icon-suo1' style={{opacity: focusItem === 2 ? 1 : 0.6}}/>}
                        colon={false}>
                        {getFieldDecorator('confirmPassword', {
                            rules: [
                                {required: true, message: '请确认密码'},
                                {
                                    validator: (rule, value, callback) => {
                                        if (value && value !== getFieldValue('registerPassword')) {
                                            callback('两次输入不一致！')
                                        }
                                        callback()
                                    }
                                },
                            ]

                        })(
                            <Input
                                className="myInput"
                                type="password"
                                onFocus={() => this.setState({focusItem: 2})}
                                onBlur={() => this.setState({focusItem: -1})}
                                onPressEnter={this.onSubmit}
                                placeholder="确认密码"
                            />
                        )}
                    </Form.Item>

                    <Form.Item
                        help={<PromptBox info={getFieldError('captcha') && getFieldError('captcha')[0]}/>}
                        style={{marginBottom: 10}}
                        wrapperCol={{span: 20, pull: focusItem === 2 ? 1 : 0}}
                        labelCol={{span: 3, pull: focusItem === 2 ? 1 : 0}}
                        label={<span className='iconfont icon-securityCode-b'
                                     style={{opacity: focusItem === 2 ? 1 : 0.6}}/>}
                        colon={false}>
                        <Row gutter={8}>
                            <Col span={15}>
                                {getFieldDecorator('captcha', {
                                    validateFirst: true,
                                    rules: [
                                        {required: true, message: '请输入验证码'},
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
                                        onFocus={() => this.setState({focusItem: 2})}
                                        onBlur={() => this.setState({focusItem: -1})}
                                        onPressEnter={this.onSubmit}
                                        placeholder="验证码"
                                    />
                                )}
                            </Col>
                            <Col span={9}>
                                <canvas onClick={this.changeCaptcha} width="80" height='40'
                                        ref={el => this.canvas = el}/>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item>
                        <div className="btn-box">
                            <div className="loginBtn" onClick={this.onSubmit}>注册</div>
                            <div className="registerBtn" onClick={this.backLogin}>返回</div>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default RegisterForm
