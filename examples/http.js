const http = require('http')
const Jie = require('../lib/index.js')()

Jie._getDate = ()=>{
    return Date.now()
}
var date;
Jie.$getDate = ()=>{
    return date || (date = Date.now())
}

http.createServer((req,res)=>{
    Jie._getDate().then(dt=>res.end(dt))
}).listen(1111)

