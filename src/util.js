
const toString = Object.prototype.toString;
// 简单的判断是否为对象
const isObject = (obj) => {
    return toString.call(obj) === '[object Object]';
}

const firstCharCase = (str) => {
    return str.slice(0, 1).toUpperCase() + str.slice(1); 
}
module.exports = {
    isObject,
    firstCharCase
}