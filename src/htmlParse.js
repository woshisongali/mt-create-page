const HTML = require('html-parse-stringify2');
const operaFs = require('./operaFs');
const prettier = require('prettier');
const treeHTML = require('./treeHTML');

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
    console.log(sepaAst.astHtml);
    // console.log(reNode.node);
    if (reNode.preObj) {
        let parent = reNode.preObj.parentArr;
        let index = reNode.preObj.index;
        parent.splice(index, 1, ...sepaAst.astHtml);
    }
    // reNode.node.children = [{
    //     "type": "text",
    //     "content": "let me see the content is  new"
    // }];
}

async function toAst(src, subSrcs) {
    if (!src) {
        return
    }
    let originStr = await operaFs.readFile(src);
    let ast = HTML.parse(originStr);
    if (subSrcs && subSrcs.length > 0) {
        let substr0 = await operaFs.readFile(subSrcs[0]);
        let subAst = HTML.parse(substr0);
        // ast = treeDeal.normalizeTree(ast);
        replaceElem(ast, subAst);
    }
    
    // let sepaAst = separatJS(ast);
    // console.log(sepaAst.astHtml);
    let result = HTML.stringify(ast);
    result = prettier.format(result, {parser: "html" });
    await operaFs.writeFiel('./test/test1.html', result);
    // console.log(result);
    return ast
}

// toAst('./test/index.html');
module.exports = {
    toAst
}