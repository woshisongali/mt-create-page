// define模式下的angluar文件， 找的class父层对应的节点
const pageData = require('../pageData');
const {firstCharCase} = require('../util');
const getClassParent = (tree) => {
    const theArg = tree.body[0].expression.arguments;
    for (let index = 0, len = theArg.length; index < len; index++) {
        const element = theArg[index];
        if (element.body) {
            return element;
        }
    }
    return null;
}

// 找到service文件下函数的插入点
const getserviceInsertFunc = (tree, subTree) => {
    const theArg = tree.body[0].expression.arguments;
    let funcBody;
    for (let index = 0, len = theArg.length; index < len; index++) {
        const element = theArg[index];
        if (element.body) {
           funcBody = element.body.body;
        }
    }
    if (funcBody) {
        let funcs = subTree.body
        funcs.forEach(element => {
            // funcBody.unshift(element);
            funcBody.splice(2, 0, element);
        });
    }
}

// 组装之前涉及到节点属性需要变更的地方
const SELECTKEYS = [
    {
        key: 'selectVal',
        after: 'Val'
    },
    {
        key: 'selectList',
        after: 'List'
    },
    {
       key: 'getSelectList',
       before: 'get',
       after: 'List'
    }
];
const beforeParseHooks = {
    'select': (str, key, auto) => {
        let uuid = pageData.getSelectUUid();
        SELECTKEYS.forEach(element => {
            let reg = new RegExp(element.key, 'g');
            let curKey = element.before ? element.before + firstCharCase(key) : key;
            curKey = `${curKey}${element.after}`
            if (auto) {
                str = str.replace(reg, curKey + uuid);
            } else {
                str = str.replace(reg, curKey);
            }
        })
        return str
    }
}

module.exports = {
    getClassParent,
    getserviceInsertFunc,
    beforeParseHooks
}