
const HTML = require('html-parse-stringify2');
const operaFs = require('./operaFs');
const prettier = require('prettier');
const esprima = require('esprima');
const escodegen = require('escodegen');
const treeHTML = require('./treeHTML');
const treeJS = require('./treeJS');
const pageData = require('./pageData');


const getJSStr = (ast) => {
    let node = ast[0];
    if (!node) {
        return null;
    }
    return node.children ? node.children[0].content : null;
}

const optEsp = {
    comment: true,
    range: true,
    tokens: true
};

async function toAstComment(src, subSrcs) {
    if (!src) {
        return;
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
    return bodyContent;
}

function testGetFunction (JSTree) {
    let getFunction = treeJS.getFunction(JSTree, 'sendRequest');
}

async function appendToMain (JSstrs, mainJsTree) {
    const mainClass = treeJS.getClass(mainJsTree, 'myTestCtrl', true);
    JSstrs.forEach(JSstr => {
        if (JSstr) {
            let JSTree = esprima.parseScript(JSstr);
            const jsClass = treeJS.getClass(JSTree, 'myModlue');
            mainClass.body.push(...jsClass.body);
        }
    });
    
    return mainJsTree;
}

/**
 * @description: 
 * @param {type} 
 * @return: 
 * 在模板拼接之前进行变量替换
 * 扩展 时间区间选框时， 最大最小需要处理 
 */
const beforeAppendHTML = (ast, paramNames) => {
    let modelNodes = [];
    const modalKey = 'ng-model';
    const getNodes = (node) => {
        let children;
        if(Array.isArray(node)) {
            children = node;
        } else {
            children = node.children;
        }
        if (Array.isArray(children) && children.length > 0) {
            for (let i = 0, len = children.length; i < len; i++) {
                let element = children[i];
                getNodes(element);
            }
        }
        let modelParam = treeHTML.getAttr(node, modalKey);
        if (modelParam) {
            modelNodes.push(node);
        }
    };
    getNodes(ast);

    const names = Array.isArray(paramNames) ? paramNames : [paramNames];
    console.log(names);
    for (let i = 0, len = names.length; i < len; i++) {
        treeHTML.setAttr(modelNodes[i], 'ng-model', `vm.params.${names[i]}`);
    }
}
/**
 * @description: 
 * @param {type} 
 * 这里的node为config配置中的 节点信息， 此处起名容易误导
 * @return: 
 */
async function recurAppend(node, mainJsTree) {
    let children = node.children;
    if (Array.isArray(children) && children.length > 0) {
        for (let i = 0, len = children.length; i < len; i++) {
            let element = children[i];
            await recurAppend(element, mainJsTree);
        }
    }
    let type = node.type ? node.type : 'base';
    let nodeStr = await operaFs.readFile(node.tpl);
    let nodeAst = HTML.parse(nodeStr);
    if (node.paramNames) {
        beforeAppendHTML(nodeAst, node.paramNames);
    }
    node.nodeAst = nodeAst;
    let astResult = await treeHTML.replaceMap[type](node, children);
    let JSstr = astResult.astJs ? getJSStr(astResult.astJs) : null;
    if (JSstr) {
        await appendToMain([JSstr], mainJsTree);
    }
    
    return astResult;
}

/**
 *
 * 获取ng-model中的params信息
 * @param {*} 
 * @returns
 */
  const afterHTMLAst = (node) => {
    const modalKey = 'ng-model';
    let children;
    if(Array.isArray(node)) {
        children = node;
    } else {
        children = node.children;
    }
    if (Array.isArray(children) && children.length > 0) {
        for (let i = 0, len = children.length; i < len; i++) {
            let element = children[i];
            afterHTMLAst(element);
        }
    }

    let modelParam = treeHTML.getAttr(node, modalKey);
    if (modelParam) {
        pageData.setParams(modelParam);
    }
 }

 /** 
  * 最后对js html中的文件进行处理， 
  * 包括语句替换， 单词替换
 */
async function hasCreated() {
    let initParamStr = 'this.params={';
    pageData.params.forEach(param => {
        let name = param.split('\.');
        initParamStr += `${name[name.length - 1]}: null,`
    });
    initParamStr = initParamStr.substring(0, initParamStr.length - 1);
    initParamStr += '};';
    await operaFs.replaceWordNew('./temples/list/index.js', 'this.params = {};', initParamStr);
}

async function toAst(modConfig) {
    let src = modConfig.tpl;
    let children = modConfig.children;
    if (!src) {
        return;
    }
    let bodyContent = 'hahah';
    pageData.init();

    // let type = modConfig.type ? modConfig.type : 'base';
    // let astResult = await treeHTML.replaceMap[type](modConfig, children);
    // let JSstr = astResult.astJs ? getJSStr(astResult.astJs) : null;

    // let mainJSstr = await operaFs.readFile('./test/angularInit.js');

    // // let mainJsTree = esprima.parseScript(mainJSstr);
    // // const mainClass = treeJS.getClass(mainJsTree, null, true);
    // // console.log(mainClass);
    // // bodyContent = mainJsTree;

    // let mainJsTree = await appendToMain([JSstr], mainJSstr);
    // const code = escodegen.generate(mainJsTree);
    // await operaFs.writeFiel('./test/test1.js', code);

    let mainJSstr = await operaFs.readFile('./pageModules/tpl/list/myTestCtrl.js');
    let mainJsTree = esprima.parseScript(mainJSstr);
    // let mainJSstr = await operaFs.readFile('./test/angularInit.js');
    // await appendToMain([JSstr], mainJsTree);
    let astResult = await recurAppend(modConfig, mainJsTree);
    bodyContent = 'has ok';
    const code = escodegen.generate(mainJsTree);
    await operaFs.writeFiel('./temples/list/index.js', code);
    
    afterHTMLAst(astResult.tempAst);
    let result = HTML.stringify(astResult.tempAst);
    result = prettier.format(result, {
        parser: "html", 
        printWidth: 120, 
        tabWidth: 4,
        bracketSpacing: false
    });
    await operaFs.writeFiel('./temples/list/index.html', result);
    await hasCreated();
    // console.log(result);
    return bodyContent;
}

// toAst('./test/index.html');
module.exports = {
    toAst
}