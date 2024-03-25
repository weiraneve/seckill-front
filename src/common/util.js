import { Form } from 'antd'


// const SECRET_KEY = 'front_666666';


/**
 * 节流函数
 * @param {*} func 
 * @param {*} interval 
 */
export function throttle(func, interval = 100) {
    let timeout;
    let startTime = new Date();
    return function (event) {
        event.persist && event.persist();   //保留对事件的引用
        clearTimeout(timeout);
        let curTime = new Date();
        if (curTime - startTime <= interval) {
            //小于规定时间间隔时，用setTimeout在指定时间后再执行
            timeout = setTimeout(() => {
                func(event);
            }, interval)
        } else {
            //重新计时并执行函数
            startTime = curTime;
            func(event)
        }
    }
}

/**
 * 生成指定区间的随机整数
 * @param min
 * @param max
 * @returns {number}
 */
export function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * sm3加密函数
 * @param {*} str 
 */
export function encrypt(str) {
    const sm3 = require('sm-crypto').sm3 // sm3加密
    return sm3(JSON.stringify(str));
}

/**
 * 解密函数
 * @param {*} str 
 */
export function decrypt(str) {
    // 暂且删除
    return null;
}

/**
 * 判断是否是对象
 * @param {*} obj 
 */
export function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 创建表单回显的对象
 * @param {*} obj 
 */
export function createFormField(obj) {
    let target = {};
    if (isObject(obj)) {
        for (let [key, value] of Object.entries(obj)) {
            target[key] = Form.createFormField({
                value
            })
        }
    }
    return target
}

/**
 * 将img标签转换为【图片】
 * @param {string} str 
 */
export function replaceImg(str) {
    if(typeof str === 'string') {
        str = str.replace(/<img(.*?)>/g, "[图片]")
    }
    return str
}

/**
 * 图片预加载
 * @param arr
 * @constructor
 */
export function preloadingImages(arr) {
    if(Array.isArray(arr)) {
        arr.forEach(item=>{
            const img = new Image();
            img.src = item
          })
    }
  }

/**
 * sm3加盐加密
 */
export function sm3Pass(password) {
    // 密码前端做sm3加盐加密处理
    const salt="3a41dx1d";
    let inputPass = password;
    let str_password = "" + salt.charAt(0) + salt.charAt(2) + inputPass + salt.charAt(5) + salt.charAt(4);
    const sm3 = require('sm-crypto').sm3 // sm3加密
    let get_password = sm3(str_password) // 杂凑，单向加密
    return get_password;
}