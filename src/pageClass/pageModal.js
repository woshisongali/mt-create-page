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
const pageParent = require('./pageParent');

class pageModal extends pageParent {
    constructor(config) {
        super(config);
    }
    
    async toAst(modConfig) {
        let src = modConfig.tpl;
        let children = modConfig.children;
        if (!src) {
            return;
        }
        let bodyContent = 'hahah';
        this.pageData = new pageData({ fileName: modConfig.fileName });
        let fileName = this.pageData.fileName;

        const sourceFiles = pageModal.CONFIG_PATH.sourFiles;
        const outPath = pageModal.CONFIG_PATH.outPath;
        let filepaths = {
            ctrl: `${outPath}${fileName}Ctrl.js`,
            service: `${outPath}${fileName}Service.js`,
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
            done();
        }
        gulp.task('default', defaultTask);
        gulp.run();

        // console.log(result);
        return bodyContent;
    }
}

pageModal.CONFIG_PATH = {
    sourFiles: {
        ctrl: './pageModules/tpl/modalTpl/myTestCtrl.js',
        service: './pageModules/tpl/modalTpl/myTestService.js',
        css: null
    },
    outPath: './temples/modalTpl/'
}
// toAst('./test/index.html');
module.exports = pageModal;


