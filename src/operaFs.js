const fs = require('fs');
const path = require('path');

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

async function mkdirs(dirpath) {
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

module.exports = {
    mkdirs
}