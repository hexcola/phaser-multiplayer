const express = require('express')
    , path = require('path');


let rootDir = path.dirname(require.main.filename);
let handler = express();

// 设置静态文件目录
handler.use('/client', express.static( path.join(rootDir, 'client')));

// ROUTER
handler.get('/', (req, res) => {
    res.sendFile( rootDir + '/client/index.html'); 
});

module.exports = handler;