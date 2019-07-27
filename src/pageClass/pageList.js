const HTML = require('html-parse-stringify2');
const gulp = require('gulp');
const gulpReplace = require('../util/gulpReplace');
// const gulpPrefixer = require('./util/gulpPrefixer.js');
const operaFs = require('../operaFs');
const prettier = require('prettier');
const esprima = require('esprima');
const escodegen = require('escodegen');
const treeHTML = require('../treeHTML');
const treeJS = require('../treeJS');
const pageData = require('../pageData');
const { getServerInsertFunc, beforeParseHooks } = require('../hooks/angluar.js');

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
            const jsClass = treeJS.getClass(JSTree, 'myModlue');
            mainClass.body.push(...jsClass.body);
        }
    });

    return mainJsTree;
}






class pageList {
    constructor(config) {}
    /**
     * 语法树解析之前对文档做一些出来
     * @description:
     * @param {type}
     * @return:
     */
    beforeParse(str, node) {
        let selectKey = node.selectKey || null;
        if (~str.indexOf('auto-create="select"')) {
            let autoCreate = selectKey ? false : true;
            let curKey = selectKey ? selectKey : 'select';
            str = beforeParseHooks['select'](str, curKey, autoCreate);
        }
        return str;
    }

    /**
     * @description:
     * @param {type}
     * @return:
     * 在模板拼接之前进行变量替换
     * 扩展 时间区间选框时， 最大最小需要处理
     */
    beforeAppendHTML(ast, paramNames) {
        let modelNodes = [];
        const modalKey = 'ng-model';
        const getNodes = node => {
            let children;
            if (Array.isArray(node)) {
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
     * 最后对js html中的文件进行处理，
     * 包括语句替换， 单词替换
     */
    async hasCreated(filepaths) {
        if (pageData.params.length <= 0) {
            return;
        }
        let initParamStr = 'this.params={';
        pageData.params.forEach(param => {
            let name = param.split('.');
            initParamStr += `${name[name.length - 1]}: null,`;
        });
        initParamStr = initParamStr.substring(0, initParamStr.length - 1);
        initParamStr += '};';
        await operaFs.replaceWordNew(filepaths.ctrl, 'this.params = {};', initParamStr);
    }
    /**
     *
     * 获取ng-model中的params信息
     * @param {*}
     * @returns
     */
     afterHTMLAst(node) {
        const modalKey = 'ng-model';
        let children;
        if (Array.isArray(node)) {
            children = node;
        } else {
            children = node.children;
        }
        if (Array.isArray(children) && children.length > 0) {
            for (let i = 0, len = children.length; i < len; i++) {
                let element = children[i];
                this.afterHTMLAst(element);
            }
        }

        let modelParam = treeHTML.getAttr(node, modalKey);
        if (modelParam) {
            pageData.setParams(modelParam);
        }
    }
    
    /**
     * @description:
     * @param {type}
     * 这里的node为config配置中的 节点信息， 此处起名容易误导
     * @return:
     */
    async  recurAppend(node, mainJsTree, serverTree) {
        let children = node.children;
        if (Array.isArray(children) && children.length > 0) {
            for (let i = 0, len = children.length; i < len; i++) {
                let element = children[i];
                await this.recurAppend(element, mainJsTree, serverTree);
            }
        }
        let type = node.type ? node.type : 'base';
        let nodeStr = await operaFs.readFile(node.tpl);
        nodeStr = this.beforeParse(nodeStr, node);
        let nodeAst = HTML.parse(nodeStr);
        if (node.paramNames) {
            this.beforeAppendHTML(nodeAst, node.paramNames);
        }
        node.nodeAst = nodeAst;
        let astResult = await treeHTML.replaceMap[type](node, children);
        let JSstr = astResult.astJs.length ? getJSStr(astResult.astJs) : null;
        if (JSstr) {
            await appendToMain(JSstr, mainJsTree);
        }

        let serverStr = astResult.astJs.length ? getServerJSStr(astResult.astJs) : null;
        if (serverStr) {
            serverStr.forEach(element => {
                let subSeverTree = esprima.parseScript(element);
                getServerInsertFunc(serverTree, subSeverTree);
            });
        }

        return astResult;
    }
    async toAst(modConfig) {
        let src = modConfig.tpl;
        let children = modConfig.children;
        if (!src) {
            return;
        }
        let bodyContent = 'hahah';
        pageData.init({ fileName: modConfig.fileName });

        let mainJSstr = await operaFs.readFile('./pageModules/tpl/list/myTestCtrl.js');
        let mainJsTree = esprima.parseScript(mainJSstr);
        let serverJStr = await operaFs.readFile('./pageModules/tpl/list/myTestServer.js');
        let serverJSTree = esprima.parseScript(serverJStr);
        // let mainJSstr = await operaFs.readFile('./test/angularInit.js');
        // await appendToMain([JSstr], mainJsTree);
        let astResult = await this.recurAppend(modConfig, mainJsTree, serverJSTree);
        bodyContent = 'has ok';

        let fileName = pageData.fileName;
        const code = escodegen.generate(mainJsTree);
        await operaFs.writeFiel(`./temples/list/${fileName}Ctrl.js`, code);
        const serverCode = escodegen.generate(serverJSTree);
        await operaFs.writeFiel(`./temples/list/${fileName}Server.js`, serverCode);

        this.afterHTMLAst(astResult.tempAst);
        let result = HTML.stringify(astResult.tempAst);
        result = prettier.format(result, {
            parser: 'html',
            printWidth: 120,
            tabWidth: 4,
            bracketSpacing: false
        });
        await operaFs.writeFiel(`./temples/list/${fileName}.html`, result);
        let filepaths = {
            ctrl: `./temples/list/${fileName}Ctrl.js`,
            server: `./temples/list/${fileName}Server.js`,
            html: `./temples/list/${fileName}.html`
        };
        await this.hasCreated(filepaths);

        // gulp.task('default', ['copyFile']);
        function defaultTask(done) {
            // place code for your default task here
            console.log('Hello World!============');
            for (let key in filepaths) {
                if (filepaths.hasOwnProperty(key)) {
                    gulp.src(filepaths[key])
                        .pipe(gulpReplace('myTest', fileName))
                        .pipe(gulp.dest(`./build/${fileName}/`));
                }
            }
            done();
        }
        gulp.task('default', defaultTask);
        gulp.run();

        // console.log(result);
        return bodyContent;
    }
}
// toAst('./test/index.html');
module.exports = pageList;
