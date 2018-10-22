const http = require('http')
const dgram = require('dgram')
const {stringify,parse} = JSON
const log = console.log.bind(console)

var socketList = []
var yangMap = {}
var allHandlers = {}
module.exports = function yin(chaos){
    chaos = chaos || this;
    var httpserver = http.createServer((req,res)=>{
        res.end(stringify(socketList.map(s=>{return {port :s.remotePort,address:s.remoteAddress,family:s.remoteFamily,id:s.index}})))
    }).on('connection',skt=>{
        socketList.push(skt)
        skt.on('close',n=>{
            delete yangMap[skt.remotePort]
            socketList.splice(socketList.indexOf(skt),1)
        })
    })
    .listen(chaos.port)

    var udp = dgram.createSocket('udp4')
        .on('message',(msg,rinfo)=>{
            chaos.on(Object.assign(parse(msg.toString()),{rinfo}))
        })
        .on('error',e=>log(e))
    udp.bind(chaos.port,n=>{
        udp.setBroadcast(true)
        udp.target = { port:chaos.port,ip:'255.255.255.255' }
        chaos.udp = udp
        chaos.emit('!big',{
            pid:process.pid
        })
    })

    chaos.destroy = function (){
        socketList.forEach(skt=>{skt.destroy()})
        httpserver.close()
        chaos.udp.close()
    }
    
    chaos.on('!bang',(pl,rinfo)=>{
        yangMap[rinfo.port] = rinfo
    })
    chaos.on('!sync',(handlers,rinfo)=>{
        //TODO:need namespace?
        Object.assign(allHandlers,handlers)
        Object.values(yangMap).forEach(p=>{
            chaos.emit('!sync',allHandlers).to(p.port,p.address)
        })
        //if event is from other yin(chaos)
        rinfo.port != chaos.port && chaos.emit('!sync',handlers)
    })
    
    return chaos
}