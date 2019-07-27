const pageList = require('./pageClass/pageList');

async function createPage(config) {
    let page = new pageList();
    return await page.toAst(config);
}

module.exports = {
    createPage
}