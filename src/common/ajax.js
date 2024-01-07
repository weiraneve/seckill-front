import 'whatwg-fetch'
import {message} from 'antd'
import {isAuthenticated, logout} from './session'
import history from './history'

const BASE_URL = import.meta.env.VITE_BASE_URL || '';

/**
 * 处理url 带参数
 * @param url
 * @param param
 * @returns {*}
 */
function handleURL(url, param) {
    let completeUrl = '';
    // url为 'https://zhihu.com' 或 '/goods'
    if (url.match(/^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i)) {
        completeUrl = url
    } else {
        completeUrl = BASE_URL + url
    }
    if (param) {
        // indexOf 返回某个指定的字符串值在字符串中首次出现的位置
        if (completeUrl.indexOf('?') === -1) {
            completeUrl = `${completeUrl}?${ObjToURLString(param)}`
        } else {
            completeUrl = `${completeUrl}&${ObjToURLString(param)}`
        }
    }
    return completeUrl
}

/**
 * 处理url 不带参数
 * @param url
 * @returns {*}
 */
function handleUrl(url) {
    let completeUrl = '';
    if (url.match(/^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i)) {
        completeUrl = url
    } else {
        completeUrl = BASE_URL + url
    }
    return completeUrl
}

/**
 * 将参数对象转化为'test=1&test2=2'这种字符串形式
 * @param param
 * @returns {string}
 * @constructor
 */
function ObjToURLString(param) {
    let str = '';
    if (Object.prototype.toString.call(param) === '[object Object]') {
        const list = Object.entries(param).map(item => {
            return `${item[0]}=${item[1]}`
        });
        str = list.join('&')
    }
    return str
}

// 获取
export async function get(url, param) {
    const completeUrl = handleURL(url, param);
    let response;
    if (isAuthenticated()) {
        response = await fetch(completeUrl, {
            credentials: 'include',
            xhrFields: {
                withCredentials: true       // 跨域
            },
            headers: {
                Authorization: `${isAuthenticated()}`,
            },
        });
    } else {
        response = await fetch(completeUrl, {
            credentials: 'include',
            xhrFields: {
                withCredentials: true       // 跨域
            }
        });
    }
    const result = response.json();
    if (!response.ok) {
        if (response.status === 200) {
            if (result.code !== 200) {
                message.error(result.msg || '网络错误');
            }
        } else if (response.status === 401 || response.status === 403) {
            logout();
            history.push('/login');
            message.error('登录失效')
        }
    }
    return result;
}

// 提交
export async function post(url, param) {
    const completeUrl = handleUrl(url);
    let response;
    if (isAuthenticated()) {
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json",
                Authorization: `${isAuthenticated()}`,
            },
            body: JSON.stringify(param)
        });
    } else {
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(param)
        });
    }
    const result = response.json();
    if (!response.ok) {
        if (response.status === 200) {
            if (result.code !== 200) {
                message.error(result.msg || '网络错误')
            }
        } else if (response.status === 401 || response.status === 403) {
            logout();
            history.push('/login');
            message.error('登录失效')
        }
    }
    return result;
}

// patch修改
export async function patch(url, param) {
    const completeUrl = handleUrl(url);
    let response;
    if (isAuthenticated()) {
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: "PATCH",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json",
                Authorization: `${isAuthenticated()}`,
            },
            body: JSON.stringify(param)
        });
    } else {
        await fetch(completeUrl, {
            credentials: 'include',
            method: "PATCH",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(param)
        });
    }
    const result = response.json();
    if (!response.ok) {
        if (response.status === 200) {
            if (result.code !== 200) {
                message.error(result.msg || '网络错误')
            }
        } else if (response.status === 401 || response.status === 403) {
            logout();
            history.push('/login');
            message.error('登录失效')
        }
        return result;
    }
}

// put修改
export async function put(url, param) {
    const completeUrl = handleUrl(url);
    let response;
    if (isAuthenticated()) {
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: "PUT",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json",
                Authorization: `${isAuthenticated()}`,
            },
            body: JSON.stringify(param)
        });
    } else {
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: "PUT",
            xhrFields: {
                withCredentials: true
            },
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(param)
        });
    }
    const result = response.json();
    if (!response.ok) {
        if (response.status === 200) {
            if (result.code !== 200) {
                message.error(result.msg || '网络错误')
            }
        } else if (response.status === 401 || response.status === 403) {
            logout();
            history.push('/login');
            message.error('登录失效')
        }
    }
    return result;
}

// PUT与PATCH区别，PUT是修改了整条记录,不变的字段也重写一遍,不过重写的值与原来相同。而PATCH只是单独修改一个字段。

// 删除
export async function del(url, param) {
    const completeUrl = handleURL(url, param);
    let response;
    if (isAuthenticated()) {
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: 'delete',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                Authorization: `${isAuthenticated()}`,
            },
        });
    } else {
        response = await fetch(completeUrl, {
            credentials: 'include',
            method: 'delete',
            xhrFields: {
                withCredentials: true
            }
        });
    }
    const result = response.json();
    if (!response.ok) {
        if (response.status === 200) {
            if (result.code !== 200) {
                message.error(result.msg || '网络错误')
            }
        } else if (response.status === 401 || response.status === 403) {
            logout();
            history.push('/login');
            message.error('登录失效')
        }
    }
    return result;
}

