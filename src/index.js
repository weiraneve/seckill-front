import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Router, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import history from './common/history'

moment.locale('zh-cn');

ReactDOM.render(
    <Router history={history}>
        <ConfigProvider locale={zh_CN}>
            <Route path = '' component={App}/>
        </ConfigProvider>
    </Router>,
    document.getElementById('root')
);