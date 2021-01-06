const net = require('net')
const dgram = require('dgram')
const {stringify,parse} = JSON
const log = console.log.bind(console)
const Yin = require('./yin')

module.exports = function Yang(chaos,callback){
    if(!chaos) return
    chaos.udp && chaos.udp.close(),delete chaos.udp
    var socket = new net.Socket().connect(chaos.port)
        .on('error',e=>{
            Yang(chaos(),callback)
        }).on('connect',e=>{
            var localAddress = socket.address()
            var udp = dgram.createSocket('udp4')
            .on('message',function(msg,rinfo){
                chaos.on(Object.assign(parse(msg.toString()),{rinfo}))
            }).on('error',e=>log(e))
            udp.bind(localAddress.port,n=>{
                //TODO:send handlers to Chaos
                udp.target = {port:chaos.port}//ip:''127.0.0.1
                chaos.udp = udp
                chaos.emit({name:'!bang'})
            })
            callback && callback(chaos)
        })
    chaos.on('!sync',handlers=>{
        Object.keys(handlers).forEach(k=>{
            var func = eval(handlers[k])
            chaos[k] = typeof func == 'function' ? func.bind(chaos) : func
        })
    })
    chaos.close = function(){
        socket.destroy()
        chaos.udp.close()
    }
    return chaos
}