
const estraverse = require('estraverse');
const {isObject} = require('./util');
const {getClassParent} = require('./hooks/angluar.js')

const getNode = (tree, wordObj) => {
    const {key, value} = wordObj;
    let body = tree.body;
    if (tree[key] && tree[key] === value) {
        return tree;
    }
    if (body[key] && body[key] === value) {
        return body;
    }
    let result = null;
    if (Array.isArray(body)) {
        for (let i = 0, len = body.length; i < len; i++) {
            result = getNode(body[i], wordObj);
            if (result) {
                return result;
            }
        }
    } else {
        result = getNode(body.body, wordObj);
    }
    return result;
}

const equalKeys = (target, keys) => {
    if (!target) {
        return false;
    }
    let result = true;
    for (let key in keys) {
        if (isObject(keys[key])) {
            if (!target[key]) {
                return false;
            }
            result = equalKeys(target[key], keys[key]);
            if (!result) {
                return result;
            }
        } else if (target[key] !== keys[key]) {
            result = false;
        }
        if (!result) {
            break;
        }
    }
    return result;

}
// 满足n个属性才算是匹配
const getNodeKeys = (tree, wordObj) => {
    let body = tree.body;
    let result = null;
    if (!Array.isArray(tree) && equalKeys(tree, wordObj)) {
        return tree;
    }
    if (!body) {
        return null;
    }
    if (!Array.isArray(body) && equalKeys(body, wordObj)) {
        return body;
    }
    if (Array.isArray(body)) {
        for (let i = 0, len = body.length; i < len; i++) {
            result = getNodeKeys(body[i], wordObj);
            if (result) {
                return result;
            }
        }
    } else {
        result = getNodeKeys(body, wordObj);
    }
    return result;
}

const getClass = (tree, name, isDefine) => {
    // return getNode(tree, {key: 'type', value: 'ClassBody'});
    if (isDefine) {
        tree = getClassParent(tree);
    }
    let node = getNodeKeys(tree, {
        "id": {
            "type": "Identifier",
            "name": name || "myTestCtrl"
        },
        "body": {
            "type": "ClassBody"
        }    
    });
    return node ? node.body : null;
}

const getFunction = (tree, name) => {
    return getNodeKeys(tree, {
        "key": {
            "type": "Identifier",
            "name": name
        },
        "kind": "method"
    });
}

// 给一个对象新增属性时返回的结构类型
const getObjectPropty = (name) => {
    return {
        "type": "Property",
        "key": {
            "type": "Identifier",
            "name": name
        },
        "computed": false,
        "value": {
            "type": "Identifier",
            "name": name
        },
        "kind": "init",
        "method": false,
        "shorthand": true
    }
}

const getReturnStatement = (serTree) => {
    let returnNode = null;
    let returnStatement = null;
    estraverse.traverse(serTree, {
        enter: function (node, parent) {
            if (node.type == 'FunctionDeclaration' && node.id.name == 'service') {
                returnNode = node;
                return estraverse.VisitorOption.Skip;
            }
        }
    });
    if (returnNode) {
        estraverse.traverse(returnNode, {
            enter: function (node, parent) {
                if (node.type == 'ReturnStatement') {
                    returnStatement = node;
                    return estraverse.VisitorOption.Skip;
                }
            }
        });
    }
    return returnStatement;
}

// 获取define  functionExpression节点， 向其中注入modal对象
const getDefineFunction = (ast) => {
    let defineNode = null;
    let functionExpression = {};
    estraverse.traverse(ast, {
        enter: function (node, parent) {
            if (node.callee && node.callee.type === 'Identifier'
            && node.callee.name === 'define') {
                defineNode = node;
                return estraverse.VisitorOption.Skip;
            }
        }
    });
    if (defineNode) {
        // functionExpression.elements = defineNode.arguments[0].elements;
        // functionExpression.params = defineNode.arguments[1].params;
        functionExpression.arguments = defineNode.arguments;
    }
    return functionExpression;
}

const insertDefine = (ast, modalName) => {
    ast.arguments[0].elements.splice(1, 0, {
        "type": `Literal`,
        "value": `./tpl/${modalName}/${modalName}Ctrl`,
        "raw": `'./tpl/${modalName}/${modalName}Ctrl'`
    });
    ast.arguments[1].params.splice(1, 0, {
        "type": `Identifier`,
        "name": `${modalName}Ctrl`
    });
}

module.exports = {
    getNode,
    getClass,
    getFunction,
    getObjectPropty,
    getReturnStatement,
    getDefineFunction,
    insertDefine
}