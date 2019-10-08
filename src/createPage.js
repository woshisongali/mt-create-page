const pageList = require('./pageClass/pageList');
const pageModal = require('./pageClass/pageModal');
const pageDetail = require('./pageClass/pageDetail_old');

async function createPage(config) {
    let page = null
    if (config.pageType === 'modal') {
        page = new pageModal();
    } else if (config.pageType === 'detail') {
        page = new pageDetail();
    }else {
        page = new pageList();
    }
    return await page.toAst(config);
}

module.exports = {
    createPage
}