// const htmlParse = require('./htmlParse');
const {createPage} = require('./createPage')
const Config = require('../config/list');
const { readFile } = require('./operaFs');
const WEBURL = './web/dist/index.html';
const  serverStart = () => {
    const Koa = require('koa');
    const Router = require('koa-router');

    const app = new Koa();
    const router = new Router();

    router.get('/', async function (ctx, next) {
        let result = 'you can do something';
        result = await readFile(WEBURL);
        ctx.type = 'text/html;charset=uft-8'
        ctx.body = result;
        console.log('start server')
    })

    router.get('/toCreatePage', async function (ctx, next) {
        let result = await createPage(Config);
        result = JSON.stringify(result, null, 4);
        ctx.body = result;
        console.log('start server')
    })

    app.use(router.routes())
    .use(router.allowedMethods()) ;

    app.listen(3000);
}

module.exports = {
    serverStart
}