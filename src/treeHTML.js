const HTML = require('html-parse-stringify2');
const operaFs = require('./operaFs');
const prettier = require('prettier');
const esprima = require('esprima');
const escodegen = require('escodegen');

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

const replaceMap = {
    /**
     * 
     * @param {*} modConfig 
     * @param {*} subTemps 
     * 如果node有值 preObj没值则说明在最外层 
     * preObj为空的待续待续
     */
    'base': async function replaceElem(modConfig, subTemps) {
        // let objAst = JSON.parse(ast);
        let tempSrcStr = await operaFs.readFile(modConfig.tpl);
        let tempAst = HTML.parse(tempSrcStr);
        let sepaAst = null;
        let arrSepaAst = [];
        let reNode = getNode(tempAst, {key: 'name', value: 'replaceTag'});
        
        
        for (let i = 0, len = subTemps.length; i < len; i++) {
            let curTemp = subTemps[i];
            let curTempStr = await operaFs.readFile(curTemp.tpl);
            let curTempAst = HTML.parse(curTempStr);
            sepaAst = separatJS(curTempAst);
            arrSepaAst.push(sepaAst);
            // console.log(reNode.node);
        }
        let sepaHtml = [];
        arrSepaAst.forEach(element => {
            sepaHtml.push(...element.astHtml);
        })
        console.log('aaaaa');
        if (reNode.preObj) {
            let parent = reNode.preObj.parentArr;
            let index = reNode.preObj.index;
            // parent.splice(index, 1, ...sepaAst.astHtml);
            parent.splice(index, 1, ...sepaHtml);
        }
        // return sepaAst.astJs;
        return {
            tempAst,
            astJs: sepaAst.astJs
        }
    },

    'table': async function replaceElem(modConfig, subTemps) {
        // let objAst = JSON.parse(ast);
        let tempSrcStr = await operaFs.readFile(modConfig.tpl);
        let tempAst = HTML.parse(tempSrcStr);
        let sepaAst = null;
        let arrSepaAst = [];
        let reNode = getNode(tempAst, {key: 'name', value: 'replaceTag'});
        let ths = null;
        if (modConfig.names) {
            const nameArr = modConfig.names.split(',');
            nameArr.forEach(element => {
                ths += `<th>${element}</th>`;
            })
        }
        let thsHtml;
        if (ths) {
            thsHtml = HTML.parse(ths);
        }
   
        if (reNode.preObj) {
            let parent = reNode.preObj.parentArr;
            let index = reNode.preObj.index;
            // parent.splice(index, 1, ...sepaAst.astHtml);
            parent.splice(index, 1, ...thsHtml);
        }
        // return sepaAst.astJs;
        return {
            tempAst,
            astJs: null
        }
    }
};

module.exports = {
    normalizeTree,
    getNode,
    replaceMap
}
