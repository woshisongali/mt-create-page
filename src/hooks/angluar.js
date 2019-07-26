// define模式下的angluar文件， 找的class父层对应的节点
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

// 找到server文件下函数的插入点
const getServerInsertFunc = (tree, subTree) => {
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
module.exports = {
    getClassParent,
    getServerInsertFunc
}