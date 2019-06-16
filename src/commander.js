const program = require('commander');
const server = require('./server');
const fs = require('fs');
const operaFs = require('./operaFs');

function range(val) {
    return val.split('..').map(Number);
  }
   
  function list(val) {
    return val.split(',');
  }
   
  function collect(val, memo) {
    memo.push(val);
    return memo;
  }

 const copyFiles = (orgin, args) => {
    let newName = args[0];
    operaFs.copyPage(orgin, newName);
  }
   
 const startServer = (val) => {
  server.serverStart()
 }


program
  .version('0.1.0')
  // .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-s, --server', 'A value that can be increased', startServer, 0)

program
  .command('copy <orginDir> [newDirs...]')
  .action(function (orginDir, newDirs) {
    copyFiles(orginDir, newDirs);
    // console.log('fffrmdir %s', orginDir);
    // if (newDirs) {
    //   newDirs.forEach(function (oDir) {
    //     console.log('rmdir %s', oDir);
    //   });
    // }
  });

program.parse(process.argv);