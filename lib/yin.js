const net = require('net')
const dgram = require('dgram')
const EventEmitter = require('events')
const {stringify,parse} = JSON
const log = console.log.bind(console)
const {LOCAL_IP} = require('./common')

//syntony 共振

function Yin(port){
    //socket server use to keep the yang's connection
    const yangs = {}
    const connected = {}
    const tcp = net.createServer()
    const udp = dgram.createSocket('udp4')
    udp.setBroadcast(true)

    Object.assign(this,{port,connected,tcp,udp})

    port && this.open(port)
}

function open(port){
    Promise.all([
        new Promise((res,rej)=>{ this.tcp.on('error',rej).listen(port,res)}),
        new Promise((res,rej)=>{ this.udp.on('error',rej).bind(port,res)})
    ]).then(res=>{
        //after tcp and udp launched
        this.tcp.on('connection',skt=>{
            var ip = LOCAL_IP[skt.remoteAddress] || skt.remoteAddress
            this.connected[`${ip}:${skt.remotePort}`] = skt
        })
        this.udp.on('message',(msg,rinfo)=>{
            
        })
    }).catch(e=>{
        this.close()
    })
}

function close(){
    this.udp.close()
    //socketList.forEach(skt=>{skt.destroy()})
    this.tcp.close()
}


Yin.prototype = Object.assign({open,close},EventEmitter.prototype)
module.exports = Yin



chaos.on('!bang',(pl,rinfo)=>{
    yangMap[rinfo.port] = rinfo

    // udp.target = { port:chaos.port,ip:'255.255.255.255' }
            // chaos.udp = udp
            // chaos.emit('!big',{
            //     pid:process.pid
            // })
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