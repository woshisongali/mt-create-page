const fs = require('fs');
const {resolve} = require('path')

const mkdir = (pos, dirArray,_callback) => {
    const len = dirArray.length;
    if( pos >= len || pos > 10){
        _callback();
        return;
    }
    let currentDir = '';
    for(let i= 0; i <=pos; i++){
        if(i!=0)currentDir+='/';
        currentDir += dirArray[i];
    }
    fs.exists(currentDir,function(exists){
        if(!exists){
            fs.mkdir(currentDir,function(err){
                if(err){
                    console.log('has some err to create');
                }else{
                    // console.log(currentDir+'文件夹-创建成功！');
                    mkdir(pos+1,dirArray,_callback);
                }
            });
        }else{
            console.log(currentDir+'the dirs has exists！');
            mkdir(pos+1,dirArray,_callback);
        }
    });
}

// 建立文件夹目录
const mkdirs = (dirpath) => {
    const dirArray = dirpath.split('/');
    return new Promise((resolve, reject) => {
        fs.exists( dirpath , (exists) => {
            if(!exists){
                mkdir(0, dirArray,function(){
                    resolve();
                });
            }else{
                resolve();
            }
        });
    }) 
}

const createFile = (src) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(src, '', (err) => {
            if (err) {
                reject(false);
            }
            resolve(true);
        });
    })
}

const readFile = (src) => {
    return new Promise((resolve, reject) => {
        fs.readFile(src, 'utf8', function (err, data) {
            if (err) {
                console.error(err);
            }
            // console.log("异步读取: " + data.toString());
            let filedata = data;
            resolve(filedata);
         });
    });
}

const isExists = (src) => {
    return new Promise((resolve, reject) => {
        fs.exists(src, (exists) => {
            if (exists) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    })
}

const writeFiel = (src, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(src, data, 'utf8', function (err) {
            if (err) return console.log(err);
            resolve(true);
       });
    })
}

const replaceWord = (orgin, src) => {
    return new Promise((resolve, reject) => {
        let oldName = orgin.split('\/')[0];
        let newName = src.split('\/')[0];
        const namePatt = new RegExp(oldName, 'ig');
        fs.readFile(src, 'utf8', async function (err, files) {
            if (err) throw err;
            const result = files.replace(namePatt, newName);
            // console.log(result);
            await writeFiel(src, result);
            resolve(true);
        })
    })
}

const replaceWordNew = (src, oldkey, key) => {
    return new Promise((resolve, reject) => {
        const keyPatt = new RegExp(oldkey, 'ig');
        fs.readFile(src, 'utf8', async function (err, files) {
            if (err) throw err;
            const result = files.replace(keyPatt, key);
            // console.log(result);
            await writeFiel(src, result);
            resolve(true);
        })
    })
}

const copySingle = (origin, src) => {
    return new Promise((resolve, reject) => {
        fs.stat(origin,function(err,stats){  //stats  该对象 包含文件属性
            if (err) throw err;
            if (stats.isFile()) { //如果是个文件则拷贝 
                let  readable=fs.createReadStream(origin);//创建读取流
                let  writable=fs.createWriteStream(src);//创建写入流
                readable.pipe(writable);
                resolve(true);
            } else {
                reject(false);
            }
        });
    })
}

async function copyPage(orgin, newName) {
    let curPath = resolve('./');
    let checkNew = await isExists(newName);
    let checkOrgin = await isExists(orgin);
    if (!checkOrgin) {
        return;
    }
    let dataCtrlStr = null;
    const newFilesSrc = {
        tpl: newName + '/' + newName + '.html',
        ctrl: newName + '/' + newName + 'Ctrl.js',
        service: newName + '/' + newName + 'Service.js'
    }
    if (!checkNew) {
        await mkdirs(newName);
        await createFile(newFilesSrc.tpl);
        await createFile(newFilesSrc.ctrl);
        await createFile(newFilesSrc.service);
        let ctrlPath = orgin + '/' + orgin + 'Ctrl.js';
        const orginSrc = {
            tpl: orgin + '/' + orgin + '.html',
            ctrl: orgin + '/' + orgin + 'Ctrl.js',
            service: orgin + '/' + orgin + 'Service.js'
        }
        // let checkCtrlPath = await isExists(orginSrc.tpl);
        for (let key in newFilesSrc) {
            let checkCtrlPath = await isExists(orginSrc[key]);
            if (checkCtrlPath) {
                await copySingle(orginSrc[key], newFilesSrc[key]);
            }
        }
        for (let key in newFilesSrc) {
            await replaceWord(orginSrc[key], newFilesSrc[key]);
        }

        console.log('has done!')
    } else {
        console.log('the dirs has exist');
    }
    
}


module.exports = {
    mkdirs,
    copyPage,
    readFile,
    writeFiel,
    replaceWordNew
}