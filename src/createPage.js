const pageList = require('./pageClass/pageList');
const pageModal = require('./pageClass/pageModal');
const pageDetail = require('./pageClass/pageDetail');

const modalDefault = {
    tpl: "./pageModules/tpl/modalTpl/myTest.html",
    pageType: "modal",
    outFilePath: "./build/",
    fileName: "addCustoms",
    children: [
      {
        tpl: "./pageModules/modalTest.html"
      }
    ]
}

async function createSubModals (config) {
    let modalsCfg = config.modals;
    modalsCfg.forEach(async subCfg => {
        let opts = Object.assign({},modalDefault);
        for (let key in subCfg) {
            switch (key) {
                case 'name':
                    opts.fileName = subCfg[key];
                    break;
                case 'children':
                    opts.children = subCfg[key];
                    break;
                default:            
            }
        }
        let filePath = `${config.outFilePath}${config.fileName}/tpl/`;
        opts.outFilePath = filePath;
        let page = new pageModal();
        await page.toAst(opts);
    })
}
async function createPage(config) {
    let page = null
    if (config.pageType === 'modal') {
        page = new pageModal();
    } else if (config.pageType === 'detail') {
        page = new pageDetail();
    }else {
        page = new pageList();
    }
    await page.toAst(config);
    if (config.modals) {
        try {
            await createSubModals(config);            
        } catch (e) {
            throw new Error(e)
        }
    }
    return 'succes'
}

module.exports = {
    createPage
}