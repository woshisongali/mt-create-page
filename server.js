#!/usr/bin/env node

require('./src/commander.js');
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
    console.log('start server')
})
app.use(router.routes())
   .use(router.allowedMethods()) ;

app.listen(3000);