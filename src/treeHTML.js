
const HTML = require('html-parse-stringify2');
const operaFs = require('./operaFs');
const prettier = require('prettier');
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const {isObject} = require('./util');

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
 * 
 * @param {*} ast 
 * 将js 从模板中分离出来
 */
const separatJS = (ast) => {
    let astHtml = [], astJs = [];
    if (Array.isArray(ast)) {
        ast.forEach((node) => {
            if (node.name === 'script') {
                astJs.push(node);
            } else {
                astHtml.push(node);
            }
        })
    }
    return {astHtml, astJs};
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

// 满足n个属性才算是匹配
const getNodeKeys = (parentNode, wordObj, preObj) => {

    let node = null;
    let curChildren = null
    if (!Array.isArray(parentNode) && equalKeys(parentNode, wordObj)) {
        node = parentNode;
        return {node, preObj};
    } else if(Array.isArray(parentNode)) {
        curChildren = parentNode;
    } else {
        curChildren = parentNode.children;
    }
    if (!curChildren || curChildren.length === 0) {
        return null;
    }
    for (let i = 0, len = curChildren.length; i < len; i++) {
        let outNode = getNodeKeys(curChildren[i], wordObj, {index: i, parentArr: curChildren});
        if (outNode) {
            // break;
            return outNode;
        }
    }
    return node;
}

const getAttr = (node, key) => {
    const attrs = node.attrs || null;
    if (!attrs) {
        return false;
    }
    return attrs[key] || null
}

const setAttr = (node, key, value) => {
    const attrs = node.attrs || null;
    if (!attrs) {
        return;
    }
    attrs[key] = value;
}

const getSubJsStr = (ast, timers) => {
    let result = null
    let curTime = 0;
    if (Array.isArray(ast)) {
        for (let i = 0, len = ast.length; i < len; i++) {
            let node = ast[i];
            if (curTime >= timers) {
                break;
            }
            if (node.name === 'script') {
                result = node;
                curTime++;
            }
        }
    }
    return result;
}


const replaceMap = {
    /**
     * 
     * @param {*} modNode 
     * @param {*} subNodes 
     * 如果node有值 preObj没值则说明在最外层 
     * preObj为空的待续待续
     */
    'base': async function replaceElemBase(modNode, subNodes) {
        let sepaAst = null;
        let arrSepaAst = [];
        let arrSepaJs = [];
        let reNode = getNode(modNode.nodeAst, {key: 'name', value: 'replaceTag'});
        
        if (subNodes) {
            for (let i = 0, len = subNodes.length; i < len; i++) {
                let curTemp = subNodes[i];
                // let curTempStr = await operaFs.readFile(curTemp.tpl);
                // let curTempAst = HTML.parse(curTempStr);
                let curTempAst = curTemp.nodeAst;
                sepaAst = separatJS(curTempAst);
                arrSepaAst.push(sepaAst);
                // console.log(reNode.node);
            }
            let sepaHtml = [];
            arrSepaAst.forEach(element => {
                sepaHtml.push(...element.astHtml);
                if (element.astJs.length > 0) {
                    arrSepaJs.push(element.astJs);
                }
            })
            if (reNode && reNode.preObj) {
                let parent = reNode.preObj.parentArr;
                let index = reNode.preObj.index;
                // parent.splice(index, 1, ...sepaAst.astHtml);
                parent.splice(index, 1, ...sepaHtml);
            }
        }

        // return sepaAst.astJs;
        return {
            tempAst: modNode.nodeAst,
            // astJs: (sepaAst && sepaAst.astJs) ? sepaAst.astJs : null
            astJs: arrSepaJs
        }
    },

    'tableUix': async function replaceElemTableUix (modNode, subNodes) {
        let baseAst = await replaceMap['base'](modNode, subNodes);
        const creatArr = (arr) => {
            let str = "const baseColumns = ["
            arr.forEach((item, index)=> {
                str += "{key: '" + item.key +"', title: '" + item.title + "' }"
                if (index < arr.length - 1) {
                    str += ","
                }
            })
            str += "]; ";
            // let colsAst = esprima.parseScript(str)
            return str;
        }
        if (modNode.cols) {
            const cols = modNode.cols.split(/[;；]/);
            let formatCols = []
            cols.forEach(item => {
                item = item.trim();
                let obj = {};
                if (item.length > 0) {
                    let keys = item.split('=');
                    obj = {
                        title: keys[0],
                        key: keys[1] ? keys[1] : null
                    };
                    formatCols.push(obj);
                }
            })
            let theCols = creatArr(formatCols)
            const subMinJsContainer = getSubJsStr(baseAst.tempAst, 1).children[0]
            let subMinJs = subMinJsContainer.content
            let startIndex = subMinJs.indexOf('const baseColumns');
            let endIndex = subMinJs.indexOf('let  cols');
            if (startIndex > -1 && endIndex > -1) {
                let newSubMain = subMinJs.substring(0, startIndex)
                    + theCols
                    + subMinJs.substring(endIndex);
                subMinJsContainer.content = newSubMain   
            }
        }
        
        return baseAst;
    },
    'table': async function replaceElemTable(modNode, subNodes) {
        let tempAst = modNode.nodeAst;
        let sepaAst = null;
        let arrSepaAst = [];
        // let reNode = getNode(tempAst, {key: 'name', value: 'replaceTag'});

        const appendCell = (reNode, cellTag) => {
            if (!reNode) {
                return;
            }
            let cells = null;
            if (modNode.names) {
                const nameArr = modNode.names.split(',');
                if (cellTag === 'th') {
                    nameArr.forEach(element => {
                        cells += `<${cellTag}>${element}</${cellTag}>`;
                    })
                } else if (cellTag === 'td') {
                    valueArr = modNode.nameValues ? modNode.nameValues.split(',') : [];

                    nameArr.forEach((element, index) => {
                        valueArr[index] ? cells += `<${cellTag}>{{item.${valueArr[index]}}}</${cellTag}>`
                            : cells += `<${cellTag}>{{item}}</${cellTag}>`;
                        // cells += `<${cellTag}>${element}</${cellTag}>`;
                    })
                }
               
                
            }
            let cellsHtml;
            if (cells) {
                cellsHtml = HTML.parse(cells);
            }
    
            if (reNode && reNode.preObj) {
                let parent = reNode.preObj.parentArr;
                let index = reNode.preObj.index;
                // parent.splice(index, 1, ...sepaAst.astHtml);
                parent.splice(index, 1, ...cellsHtml);
            }
        }

        let rethNode = getNodeKeys(tempAst, {
            name: 'replaceTag',
            attrs: {
                'autocreate-table-tag': 'th'
            }
        });
        appendCell(rethNode, 'th');

        let retdNode = getNodeKeys(tempAst, {
            name: 'replaceTag',
            attrs: {
                'autocreate-table-tag': 'td'
            }
        });
        appendCell(retdNode, 'td');


        // return sepaAst.astJs;
        return {
            tempAst,
            astJs: []
        }
    }
};

module.exports = {
    normalizeTree,
    getNode,
    replaceMap,
    equalKeys,
    getAttr,
    setAttr
}
