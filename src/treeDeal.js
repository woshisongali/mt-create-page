
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

const getNode = (parentNode, wordObj) => {
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
        return node;
    }
    if (!curChildren || curChildren.length === 0) {
        return null;
    }
    for (let i = 0, len = curChildren.length; i < len; i++) {
        node = getNode(curChildren[i], wordObj);
        if (node) {
            // break;
            return node;
        }
    }
    return node;
}

module.exports = {
    normalizeTree,
    getNode
}
