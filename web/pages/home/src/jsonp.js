function noop () {}

let uid = 0
const random = (n) => {
  var str = ''
  for (let i = 0; i < n; i++) {
    str += Math.ceil(Math.random() * 10)
  }
  return str
}
const cbRandom = random(8)
export default function jsonp (url, options = {}) {
  if (typeof url === 'string') {
    options.url = url
  } else {
    options = url || {}
  }

  // callbackName: 请求的回调函数的名字
  let {
    name = 'callback',
    callbackName = '__wuagecallback' + cbRandom + uid++,
    timeout = 60000
  } = options
  url = options.url
  let script = document.createElement('script')
  let responseData
  let abortTimeout
  window[callbackName] = function () {
    responseData = arguments
  }

  let complete = function () {
    clearTimeout(abortTimeout)
    window[callbackName] = noop
    if (script.parentNode) script.parentNode.removeChild(script)
  }

  return new Promise((resolve, reject) => {
    // 加载完毕
    script.onload = function () {
      complete()
      if (responseData) {
        try {
          resolve(responseData[0])
        } catch (e) {
          reject(e)
        }
      }
    }

    // 加载失败
    script.onerror = function (e) {
      complete()
      reject(e)
    }

    url += (~url.indexOf('?') ? '&' : '?') + name + '=' + callbackName
    url = url.replace('?&', '?')
    script.src = url
    document.head.appendChild(script)

    abortTimeout = setTimeout(function () {
      reject(new Error('timeout'))
    }, timeout)
  })
}