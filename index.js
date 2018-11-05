'use strict';
//module.exports = require('./lib/jies')


// var net  = require('net')
// var log = console.log
// var server = net.createServer()
// server.on('connection',skt=>{
//     server.getConnections()
//     log(skt)
// })
// server.on('error',e=>{
//     log(e)
// })
// server.listen(10000)

// var Socekt = net.Socket

// var client1 = new Socekt()
// client1.connect(10000)
// var client2 = new Socekt()
// client2.connect(10000)
// var client3 = new Socekt()
// client3.connect(10000)
var EventEmitter = require('events')
function Foo(){

}
Foo.prototype = Object.assign(EventEmitter.prototype,{
    open(){ console.log('open')},
    close(){ console.log('close')},
})

var e = new Foo()
e.open()
e.close()
e.on('test',e=>console.log(e))
e.emit('test','test')
setInterval(()=>{},1000)
