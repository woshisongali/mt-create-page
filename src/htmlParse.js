const HTML = require('html-parse-stringify2');
const operaFs = require('./operaFs');
const prettier = require('prettier');
const treeDeal = require('./treeDeal')

async function toAst(src) {
    if (!src) {
        return
    }
    let originStr = await operaFs.readFile(src);
    let ast = HTML.parse(originStr);
    // ast = treeDeal.normalizeTree(ast);
    let reNode = treeDeal.getNode(ast, {key: 'name', value: 'replaceTag'});
    console.log(reNode);
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