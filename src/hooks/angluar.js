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

module.exports = {
    getClassParent
}