// const htmlParse = require('./htmlParse');
const {createPage} = require('./createPage')
const Config = require('../config/list');
const { readFile } = require('./operaFs');
const WEBURL = './web/dist/index.html';
const path = require('path');
const  serverStart = () => {
    const Koa = require('koa');
    const Router = require('koa-router');
    const cors = require('koa2-cors');
    const bodyParser = require('koa-bodyparser');
    const staticFiles = require('koa-static')

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

    router.post('/pageJson', async function (ctx,next) {
        let dataConfig = ctx.request.body.configData
        dataConfig = JSON.parse(dataConfig)
        let pageResult = await createPage(dataConfig);

        let result = {
            success: true
        };
        ctx.body = result;
    })

    router.get('/getConfigJSON/**', async (ctx) => {
        let url = ctx.request.url;
        let fileName = url.split('getConfigJSON/')[1];
        let filePath = './config/formJSON/' + fileName;
        let result = await readFile(filePath)
        ctx.type = 'charset=uft-8'
        ctx.body = `"${result}"`;
    })

    router.get('/getConfigJSON_jsonp/**', async (ctx) => {
        let url = ctx.request.url;
        let fileName = url.split('getConfigJSON_jsonp/')[1];
        fileName = fileName.split('?')[0];
        let filePath = './config/formJSON/' + fileName;
        let fileStr = await readFile(filePath)
        let callbackName = ctx.query.callback || 'callback'
        
        let result = `${callbackName}(${fileStr})`;
        ctx.type = 'charset=uft-8'
        ctx.body = result;
    })
    
    app.use(cors());
    // 我们把web配置为静态资源目录后，在浏览器访问的时候，不需要输入web
    app.use(staticFiles('./web'))
    // parse 需在route之前注册
    app.use(bodyParser());
    app.use(router.routes())
    .use(router.allowedMethods()) ;


    app.listen(3000);
}

module.exports = {
    serverStart
}