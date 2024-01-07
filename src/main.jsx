import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {Route, Router} from 'react-router-dom'
import {ConfigProvider} from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import history from './common/history'

moment.locale('zh-cn');

if (typeof window === 'undefined') {
    window.global = window;
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <Router history={history}>
        <ConfigProvider locale={zh_CN}>
            <Route path='' component={App}/>
        </ConfigProvider>
    </Router>
);
