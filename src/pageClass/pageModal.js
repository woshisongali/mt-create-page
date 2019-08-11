const HTML = require('html-parse-stringify2');
const gulp = require('gulp');
const gulpReplace = require('../util/gulpReplace');
// const gulpPrefixer = require('./util/gulpPrefixer.js');
const operaFs = require('../operaFs');
const prettier = require('prettier');
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require('escodegen');
const treeHTML = require('../treeHTML');
const treeJS = require('../treeJS');
const pageData = require('../pageData');
const { getserviceInsertFunc, beforeParseHooks } = require('../hooks/angluar.js');
const {
    getJSStr,
    getserviceJSStr,
    appendToMain,
    createParamsAst,
    setTitle
} = require('./base.js')

const CONFIG_PATH = {
    sourFiles: {
        ctrl: './pageModules/tpl/modalTpl/myTestCtrl.js',
        service: './pageModules/tpl/modalTpl/myTestService.js',
        css: null
    },
    outPath: './temples/modalTpl/'
}
class pageModal {
    constructor(config) {
        this.configNode = null;
    }
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
            if (this.configNode.title) {
                setTitle(node, this.configNode.title);
            }
            
        };
        getNodes(ast);

        if (paramNames) {
            const names = Array.isArray(paramNames) ? paramNames : [paramNames];
            for (let i = 0, len = names.length; i < len; i++) {
                treeHTML.setAttr(modelNodes[i], 'ng-model', `vm.params.${names[i]}`);
            }
        }
    }
       /**
     * 最后对js html中的文件进行处理，
     * 包括语句替换， 单词替换
     */
    async hasCreated(filepaths) {
        
    }
    /**
     *
     * 获取ng-model中的params信息
     * @param {*}
     * @returns
     */
     afterHTMLAst(node) {
        
    }

    afterJSAst(ast) {
        let funcs = pageData.getInitFuncs();
        let initNode = null;
        let newBody = []
        estraverse.traverse(ast, {
            enter: function (node, parent) {
                if (node.type == 'MethodDefinition' && node.key.name == 'init') {
                    initNode = node;
                    return estraverse.VisitorOption.Skip;
                }
            }
        });
        if (initNode) {
            newBody = initNode.value.body.body;
        }
        funcs.forEach(node => {
            let subBody = node.value.body.body;
            newBody.unshift(...subBody);
        })

        let queryNode = null;
        estraverse.traverse(ast, {
            enter: function (node, parent) {
                if (node.type == 'MethodDefinition' && node.key.name == 'initQuery') {
                    queryNode = node;
                    return estraverse.VisitorOption.Skip;
                }
            }
        });

        if (queryNode) {
            let paramAst = createParamsAst();
            let newBody = paramAst.body[0].body.body;
            queryNode.value.body.body = newBody;
        }
    }
    
    /**
     * @description:
     * @param {type}
     * 这里的node为config配置中的 节点信息， 此处起名容易误导
     * @return:
     */
    async  recurAppend(node, mainJsTree, serviceTree) {
        let children = node.children;
        if (Array.isArray(children) && children.length > 0) {
            for (let i = 0, len = children.length; i < len; i++) {
                let element = children[i];
                await this.recurAppend(element, mainJsTree, serviceTree);
            }
        }
        this.configNode = node;
        let type = node.type ? node.type : 'base';
        let nodeStr = await operaFs.readFile(node.tpl);
        nodeStr = this.beforeParse(nodeStr, node);
        let nodeAst = HTML.parse(nodeStr);
        if (node.paramNames || node.title) {
            this.beforeAppendHTML(nodeAst, node.paramNames);
        }
        node.nodeAst = nodeAst;
        let astResult = await treeHTML.replaceMap[type](node, children);
        let JSstr = astResult.astJs.length ? getJSStr(astResult.astJs) : null;
        if (JSstr) {
            await appendToMain(JSstr, mainJsTree);
        }

        let serviceStr = astResult.astJs.length ? getserviceJSStr(astResult.astJs) : null;
        if (serviceStr) {
            serviceStr.forEach(element => {
                let subSeverTree = esprima.parseScript(element);
                getserviceInsertFunc(serviceTree, subSeverTree);
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
        let fileName = pageData.fileName;

        const sourceFiles = CONFIG_PATH.sourFiles;
        const outPath = CONFIG_PATH.outPath;
        let filepaths = {
            ctrl: `${outPath}${fileName}Ctrl.js`,
            service: `${outPath}${fileName}service.js`,
            html: `${outPath}${fileName}.html`
        };
        let mainJSstr = await operaFs.readFile(sourceFiles.ctrl);
        let mainJsTree = esprima.parseScript(mainJSstr);
        let serviceJStr = await operaFs.readFile(sourceFiles.service);
        let serviceJSTree = esprima.parseScript(serviceJStr);
        // let mainJSstr = await operaFs.readFile('./test/angularInit.js');
        // await appendToMain([JSstr], mainJsTree);
        let astResult = await this.recurAppend(modConfig, mainJsTree, serviceJSTree);
        bodyContent = 'has ok';
        this.afterHTMLAst(astResult.tempAst);

        this.afterJSAst(mainJsTree);
        const code = escodegen.generate(mainJsTree);
        await operaFs.writeFiel(filepaths.ctrl, code);
        const serviceCode = escodegen.generate(serviceJSTree);
        await operaFs.writeFiel(filepaths.service, serviceCode);
        // const cssStr = await operaFs.readFile('./pageModules/tpl/list/myTest.css');
        // await operaFs.writeFiel(`./temples/list/${fileName}.css`, cssStr);

        let result = HTML.stringify(astResult.tempAst);
        result = prettier.format(result, {
            parser: 'html',
            printWidth: 120,
            tabWidth: 4,
            bracketSpacing: false
        });
        await operaFs.writeFiel(filepaths.html, result);
        
        await this.hasCreated(filepaths);

        // gulp.task('default', ['copyFile']);
        function defaultTask(done) {
            // place code for your default task here
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
module.exports = pageModal;
