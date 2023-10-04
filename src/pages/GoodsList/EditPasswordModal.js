import React from 'react'
import { Modal, Input, Form, message } from 'antd'
import {post} from "../../common/ajax";
import {sm3Pass} from "../../common/util";


// 修改管理用户密码
@Form.create()
class EditPasswordModal extends React.Component {
    handleCancel = () => {
        this.props.form.resetFields();
        this.props.toggleVisible(false)
    };

    /**
     * 模态框的确定按钮
     */
    handleOk = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.onSubmit(values).then();
            }
        });
    };

    /**
     * 提交修改密码
     */
    onSubmit = async (values) => {
        const res = await post('/uaa/user/updatePass', {
            oldPassword: sm3Pass(values.oldPassword),
            newPassword: sm3Pass(values.newPassword)
        });
        if (res.code === 200) {
            message.success('修改密码成功');
        } else if (res.code === 500800 || res.code === 500801) {
            message.error(res.msg);
        } else {
            message.error('客户端请求错误')
        }
    };

    render() {
        const { visible } = this.props;
        const { getFieldDecorator, getFieldValue } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <Modal
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                visible={visible}
                centered
                title="修改密码">
                <Form>
                    <Form.Item label={'旧密码'} {...formItemLayout}>
                        {getFieldDecorator('oldPassword', {
                            rules: [
                                { required: true, message: '请输入旧密码' },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value === getFieldValue('newPassword')) {
                                            callback('新密码不能和旧密码一致！')
                                        }
                                        callback()
                                    }
                                }
                            ],
                        })(
                            <Input
                                placeholder="请输入旧密码"
                                autoComplete="new-password"
                                type={'password'} />
                        )}
                    </Form.Item>
                    <Form.Item label={'新密码'} {...formItemLayout}>
                        {getFieldDecorator('newPassword', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '密码不能为空' },
                                { pattern: '^[^ ]+$', message: '密码不能有空格' },
                                { min: 3, message: '密码至少为3位' },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value === getFieldValue('oldPassword')) {
                                            callback('新密码不能和旧密码一致！')
                                        }
                                        callback()
                                    }
                                }
                            ]
                        })(
                            <Input
                                placeholder="请输入新密码"
                                autoComplete="new-password"
                                type={'password'} />
                        )}
                    </Form.Item>
                    <Form.Item label={'确认密码'} {...formItemLayout}>
                        {getFieldDecorator('confirmPassword', {
                            validateFirst: true,
                            rules: [
                                { required: true, message: '请确认密码' },
                                {
                                    validator: (rule, value, callback) => {
                                        if (value !== getFieldValue('newPassword')) {
                                            callback('两次输入不一致！')
                                        }
                                        callback()
                                    }
                                },
                            ]
                        })(
                            <Input
                                onPressEnter={this.handleOk}
                                placeholder="请确认密码"
                                autoComplete="new-password"
                                type={'password'} />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default EditPasswordModal
