
const normalizeTree = (originTree) => {
    let curTree = null;
    if (Array.isArray(originTree)) {
        curTree = {
            "type": "tag",
            "name": "div"
        };
        curTree.children = originTree;
    } else {
        curTree = originTree;
    }
    return curTree;
}

/** 
 * 如果Node有值， 且preObj为null 则说明找到的节点在最外层中
*/
const getNode = (parentNode, wordObj, preObj) => {
    let node = null;
    const {key, value} = wordObj;
    let curChildren = null
    if (Array.isArray(parentNode)) {
        curChildren = parentNode
    } else {
        curChildren = parentNode.children;
    }
    if (parentNode[key] === value) {
        node = parentNode;
        return {node, preObj};
    }
    if (!curChildren || curChildren.length === 0) {
        return null;
    }
    for (let i = 0, len = curChildren.length; i < len; i++) {
        let outNode = getNode(curChildren[i], wordObj, {index: i, parentArr: curChildren});
        if (outNode) {
            // break;
            return outNode;
        }
    }
    return node;
}

module.exports = {
    normalizeTree,
    getNode
}
