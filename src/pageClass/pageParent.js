

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
const {SPREADSYMBOL} = require('../config')
const {
    getJSStr,
    getServerJSStr,
    appendToMain,
    createParamsAst,
    setTitle
} = require('./base.js')

const MODALCODE = `./pageModules/openModal.html`
class pageParent {
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
            str = beforeParseHooks['select'].call(this, str, curKey, autoCreate);
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

    // 是否有modal弹框如果有的话需要进一步处理
    async preJSAst (ast) {
        let defineNode = treeJS.getDefineFunction(ast);
        let modalCode = null;
        let modalJs = null;
        let jsStrs = [];
        let modalJsons = this.pageData.jsonConfig.modals;
        if (defineNode && modalJsons) {
            modalCode = await operaFs.readFile(MODALCODE);
            modalCode = HTML.parse(modalCode);
            modalJs = modalCode[0].children[0].content;
            modalJs = modalJs.replace(/\.\.\./g, SPREADSYMBOL);
            modalJsons.forEach(element => {
                let newStr = modalJs;
                // let reg = new RegExp(element.name, g);
                newStr = newStr.replace(/testModal/, element.name)
                .replace(/TestModal/, element.name.charAt(0).toUpperCase() + element.name.slice(1));
                jsStrs.push(newStr);
                treeJS.insertDefine(defineNode, element.name);
            })
            // console.log(escodegen.generate(ast))
        }
        await appendToMain.call(this, jsStrs, ast);
    }

    afterJSAst(ast) {
        
        let funcs = this.pageData.getInitFuncs();
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
            let paramAst = createParamsAst.call(this);
            if (!paramAst) {
                return;
            }
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
            await appendToMain.call(this, JSstr, mainJsTree);
        }

        let serviceStr = astResult.astJs.length ? getServerJSStr(astResult.astJs) : null;
        let returnStatement = treeJS.getReturnStatement(serviceTree);

        if (serviceStr) {
            serviceStr.forEach(element => {
                let subSeverTree = esprima.parseScript(element);
                getserviceInsertFunc(serviceTree, subSeverTree);
                let returnProps = serviceReturnProp(serviceTree, subSeverTree);
                if (returnStatement) {
                    returnStatement.argument.properties.unshift(...returnProps);
                }
            });
        }

        return astResult;
    }
    async toAst(modConfig) {
    }
}

// toAst('./test/index.html');
module.exports = pageParent;
