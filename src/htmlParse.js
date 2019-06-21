
const HTML = require('html-parse-stringify2');
const operaFs = require('./operaFs');
const prettier = require('prettier');
const esprima = require('esprima');
const escodegen = require('escodegen');
const treeHTML = require('./treeHTML');
const treeJS = require('./treeJS');

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

// 如果node有值 preObj没值则说明在最外层 
// preObj为空的待续待续
const replaceElem = (ast, subnew) => {
    // let objAst = JSON.parse(ast);
    let reNode = treeHTML.getNode(ast, {key: 'name', value: 'replaceTag'});
    let sepaAst = separatJS(subnew);
    // console.log(reNode.node);
    if (reNode.preObj) {
        let parent = reNode.preObj.parentArr;
        let index = reNode.preObj.index;
        parent.splice(index, 1, ...sepaAst.astHtml);
    }
    return sepaAst.astJs;
}

const getJSStr = (ast) => {
    let node = ast[0];
    return node.children[0].content;
}

const optEsp = {
    comment: true,
    range: true,
    tokens: true
};
async function toAst(src, subSrcs) {
    if (!src) {
        return
    }
    let bodyContent = 'hahah';
    let originStr = await operaFs.readFile(src);
    let ast = HTML.parse(originStr);
    if (subSrcs && subSrcs.length > 0) {
        let substr0 = await operaFs.readFile(subSrcs[0]);
        let subAst = HTML.parse(substr0);
        // ast = treeDeal.normalizeTree(ast);
        let astJs = replaceElem(ast, subAst);
        let JSstr = getJSStr(astJs);
        let JSTree = esprima.parseScript(JSstr, optEsp);
        // bodyContent = code;
        let getFunction = treeJS.getFunction(JSTree, 'myHello');
        console.log(getFunction);
        let mainJSstr = await operaFs.readFile('./test/init.js');
        let mainJsTree = esprima.parseScript(mainJSstr, optEsp);
        mainJsTree = escodegen.attachComments(mainJsTree, mainJsTree.comments, mainJsTree.tokens);
        const mainClass = treeJS.getClass(mainJsTree);
        mainClass.body.push(getFunction);
        const code = escodegen.generate(mainJsTree, {
            comment: true
        });
        await operaFs.writeFiel('./test/test1.js', code);
        bodyContent = mainJsTree;
    }
    
    // let sepaAst = separatJS(ast);
    // console.log(sepaAst.astHtml);
    let result = HTML.stringify(ast);
    result = prettier.format(result, {parser: "html" , printWidth: 120});
    await operaFs.writeFiel('./test/test1.html', result);
    // console.log(result);
    return bodyContent
}

// toAst('./test/index.html');
module.exports = {
    toAst
}