const http = require('http')
    , handler = require('./server/httpHandler')
    , io = require('./server/io')

let serv = http.Server(handler)
// 添加 Socket 连接
io.attach(serv, {})

serv.listen(process.env.PORT || 2000);
console.log("Server started.");