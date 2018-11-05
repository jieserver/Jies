'use strict';
const net = require('net')
const http = require('http')
const dgram = require('dgram')
const path = require('path')
const {spawn} = require('child_process')
const log = console.log.bind(console)
const {parse,stringify} = JSON
const EventEmitter = require('events')
const Yin = require('./yin')
const Yang = require('./yang')

const DEFAULT_PORT = 13527
exports = module.exports = createChaos




function createChaos(options){
    var eventCache = []
    var eventHandlers = {}
    var emiter = new EventEmitter()

    options = Object.assign({ port:DEFAULT_PORT,rotate:10 },options)
    function chaos(){
        if(!options.reconnect--) return null
        var proc = spawn(process.execPath,[__filename,options.port],{detached:true,stdio:'ignore'})
        proc.unref()
        chaos.process = proc;
        return chaos;
    }
    chaos.yin = Yin.call(chaos,options.port)
    chaos.yang = new Yang(chaos)
    // function createUDP(port,onBinding){
    //     var udp = dgram.createSocket('udp4')
    //         .on('message',function(msg,rinfo){
    //             //emiter.emit()
    //             //chaos.on(Object.assign(parse(msg.toString()),{rinfo}))
    //         }).on('error',e=>{
    //             log(e)
    //         })
    //     udp.bind(port,n=>{
    //         onBinding(udp)
    //     })
    // }
    chaos.port = options.port
    //FIXME:for test
    chaos.Yin = Yin
    
    //TODO:for jies addins
    chaos.open = function(callback){
        return Yang(chaos,()=>{
            callback && callback(chaos.emit())//send all events in cache
        })
    }
    chaos.sync = function(handlers,func){
        var handlerStringify = {}
        typeof handlers == 'string' ? (handlerStringify[handlers] = `${func}`) 
           : Object.keys(handlers).forEach(k=>handlerStringify[k] = `${handlers[k]}`)
        return chaos.emit('!sync',handlerStringify)
    }
    chaos.emit = function(name,payload){
        var event = name && (typeof name == 'object' ? name : { name,payload })
        event &&　eventCache.push(stringify(event))
        chaos.udp && process.nextTick(n=>chaos.to(chaos.udp.target.port,chaos.udp.target.ip))
        return chaos
    }
    chaos.to = function(port,ip){
        while(chaos.udp && eventCache[0]){
            chaos.udp.send(eventCache.shift(),port,ip)
        }
        return chaos
    }
    chaos.on = function(event,callback){
        var etype = typeof event
        if(etype == 'string') {//use as "chaos.on('name',(pl,rinfo)=>{})""
            if(!callback) throw Error('missing listener function!')
            return callback && (eventHandlers[event] || (eventHandlers[event] = [])) && eventHandlers[event].push(callback)
        }
        if(etype != 'object') throw Error('"event" should be string or object!')
        //use as "chaos.on({name:'ename',payload,rinfo})""
        eventHandlers[event.name] && eventHandlers[event.name].forEach(cb=>cb(event.payload,event.rinfo))
        return chaos
    }
    return chaos
    
}

if(require.main == module){
    createChaos({ port:process.argv[2]||DEFAULT_PORT }).Yin()
}
