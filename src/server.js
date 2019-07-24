const htmlParse = require('./htmlParse');
const Config = require('../pageModules/config/list');
const  serverStart = () => {
    const Koa = require('koa');
    const Router = require('koa-router');

    const app = new Koa();
    const router = new Router();

    router.get('/', async function (ctx, next) {
        let result = await htmlParse.toAst(Config);
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