const LOGIN_TOKEN_NAME = 'seckill_login_token';
// const LOGIN_COOKIES_NAME = 'seckill_login_token';


// 验证是否已经认证，返回浏览器localStorage存储的JWT或cookie
export function isAuthenticated() {
  // return _getCookie(LOGIN_COOKIES_NAME)
  return _getStorage(LOGIN_TOKEN_NAME)
}

// JWT保存在浏览器的localStorage里或cookie
export function authenticateSuccess(token) {
  // _setCookie(LOGIN_COOKIES_NAME, token)
  _setStorage(LOGIN_TOKEN_NAME, token)
}

// 注销
export function logout() {
  // _setCookie(LOGIN_COOKIES_NAME, '')
  _setStorage(LOGIN_TOKEN_NAME, '')
}

function _getStorage(name) {
  let item = localStorage.getItem(name);
  if (item) {
    return item;
  }
  return ''
}

function _setStorage(name, value) {
  let item = localStorage.setItem(name, value);
  if (item) {
    return item;
  }
  return ''
}

// function _getCookie(name) {
//   let start, end;
//   if (document.cookie.length > 0) {
//     start = document.cookie.indexOf(name + '=');
//     if (start !== -1) {
//       start = start + name.length + 1;
//       end = document.cookie.indexOf(';', start);
//       if (end === -1) {
//         end = document.cookie.length
//       }
//       return unescape(document.cookie.substring(start, end))
//     }
//   }
//   return ''
// }

// function _setCookie(name, value, expire) {
//   let date = new Date();
//   date.setDate(date.getDate() + expire);
//   document.cookie = name + '=' + escape(value) + '; path=/' +
//     (expire ? ';expires=' + date.toTimeString() : '')
// }
