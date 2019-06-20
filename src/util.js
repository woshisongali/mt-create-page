
const toString = Object.prototype.toString;
// 简单的判断是否为对象
const isObject = (obj) => {
    return toString.call(obj) === '[object Object]';
}

module.exports = {
    isObject
}