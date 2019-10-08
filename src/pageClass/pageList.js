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
const { getserviceInsertFunc, beforeParseHooks, serviceReturnProp } = require('../hooks/angluar.js');
const pageParent = require('./pageParent');


const optEsp = {
    comment: true,
    range: true,
    tokens: true
};

function testGetFunction(JSTree) {
    let getFunction = treeJS.getFunction(JSTree, 'sendRequest');
}



class pageList extends pageParent{
    constructor(config) {
        super(config);
    }
    /**
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
            let strArr = modelParam.split('.');
            modelParam = strArr[strArr.length - 1];
            if (node.type === 'tag' && node.name === 'uix-select') {
                let modelSplit = modelParam.split('Val');
                let value = modelSplit[1] ? `${modelSplit[0]}List${modelSplit[1]}[0]`
                        : `${modelSplit[0]}List[0]`
                let paramObj = {
                    name: modelParam,
                    value: value
                }
                this.pageData.setParams(paramObj);
            } else {
                this.pageData.setParams(modelParam);
            }
        }
    }

    async toAst(modConfig) {
        let src = modConfig.tpl;
        let children = modConfig.children;
        if (!src) {
            return;
        }
        let bodyContent = 'hahah';
        this.pageData = new pageData({ fileName: modConfig.fileName });
        // pageData.init({ fileName: modConfig.fileName });

        const sourceFiles = pageList.CONFIG_PATH.sourFiles;
        const outPath = pageList.CONFIG_PATH.outPath;
        let fileName = this.pageData.fileName;

        let filepaths = {
            ctrl: `${outPath}${fileName}Ctrl.js`,
            service: `${outPath}${fileName}Service.js`,
            html: `${outPath}${fileName}.html`,
            css: `${outPath}${fileName}.css`
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
        const cssStr = await operaFs.readFile(sourceFiles.css);
        await operaFs.writeFiel(filepaths.css, cssStr);

        let result = HTML.stringify(astResult.tempAst);
        result = prettier.format(result, {
            parser: 'html',
            printWidth: 120,
            tabWidth: 4,
            bracketSpacing: false
        });
        await operaFs.writeFiel(filepaths.html, result);
    
        await this.hasCreated(filepaths);

        let outFilePath = modConfig.outFilePath ? modConfig.outFilePath : pageData.defaultOutPath;
        // gulp.task('default', ['copyFile']);
        function defaultTask(done) {
            // place code for your default task here
            for (let key in filepaths) {
                if (filepaths.hasOwnProperty(key)) {
                    gulp.src(filepaths[key])
                        .pipe(gulpReplace('myTest', fileName))
                        .pipe(gulp.dest(`${outFilePath}${fileName}/`));
                }
            }
            console.log('i doddd')
            done();
        }
        gulp.task('default', defaultTask);
        gulp.run();

        // console.log(result);
        return bodyContent;
    }
}

pageList.CONFIG_PATH = {
    sourFiles: {
        ctrl: './pageModules/tpl/list/myTestCtrl.js',
        service: './pageModules/tpl/list/myTestService.js',
        css: './pageModules/tpl/list/myTest.css'
    },
    outPath: './temples/list/'
};
// toAst('./test/index.html');
module.exports = pageList;
