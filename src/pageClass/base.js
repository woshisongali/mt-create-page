
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const treeHTML = require('../treeHTML');
const treeJS = require('../treeJS');
const pageData = require('../pageData');

const getJSStr = ast => {
    let result = [];
    ast.forEach(element => {
        let node = element[0];
        if (node.children[0] && node.children[0].content) {
            result.push(node.children[0].content);
        }
    });

    return result;
};

const getServerJSStr = ast => {
    let result = [];
    ast.forEach(element => {
        let node = element[1] || null;
        if (!node) {
            return;
        }
        if (node.children[0] && node.children[0].content) {
            result.push(node.children[0].content);
        }
    });

    return result;
};

const optEsp = {
    comment: true,
    range: true,
    tokens: true
};

function testGetFunction(JSTree) {
    let getFunction = treeJS.getFunction(JSTree, 'sendRequest');
}

async function appendToMain(JSstrs, mainJsTree) {
    const mainClass = treeJS.getClass(mainJsTree, 'myTestCtrl', true);
    JSstrs.forEach(JSstr => {
        if (JSstr) {
            let JSTree = esprima.parseScript(JSstr);
            let initNode = null;
            let newTree = estraverse.replace(JSTree, {
                enter: function (node, parent) {
                    if (node.type == 'MethodDefinition' && node.key.name == 'init') {
                        initNode = node;
                        return this.remove();
                    }
                }
            })
            if (initNode) {
                this.pageData.setInitFuncs(initNode);
            }
            const jsClass = treeJS.getClass(newTree, 'myModlue');
            mainClass.body.push(...jsClass.body);
        }
    });

    return mainJsTree;
}


const setTitle = (node, titlestr) => {
    let autostr = treeHTML.getAttr(node, 'auto-create');
    if (autostr === 'title') {
        node.children[0].content = titlestr;
    }
}

const createParamsAst = function () {
    let params = this.pageData.params;
    let str = '';
    if (params.length > 0) {
        str = `function setParams() {
            this.params = {`
        params.forEach((param, index) => {
            if (typeof param === 'object') {
                str +=`${param.name}: this.${param.value}`
            } else {
                str += `${param}: null`
            }
            if (index < params.length -1) {
                str +=`,`;
            }
        }); 
        str += `};
        }`
    }
    return str ? esprima.parseScript(str) : null;
}

module.exports = {
    getJSStr,
    getServerJSStr,
    appendToMain,
    createParamsAst,
    setTitle
}