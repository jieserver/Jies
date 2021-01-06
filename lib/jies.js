'use strict';
const Chaos = require('./chaos')
const Nothing = require('./nothing')
const log = console.log.bind(console)
exports = module.exports = createJies

var jiesCache = {}
function createJies(name){
    if(jiesCache[name]) return jiesCache[name]

    var jies = function(){}
    var chaos
    jies.collect = function(options,callback){
        //TODO:should set chaos's options again
        !callback && (typeof options == 'function') && (callback = options) && (options = { port:13527 })
        log(chaos)
        if(chaos) return callback && callback(chaos.sync(handlers))
        chaos = new Chaos(options).open(chaos=>{
            chaos.sync(handlers)
            callback && callback(chaos)
        })
    }
    var handlers = {}
    jies = new Proxy(jies,{
        get:function(o,k,c){
            //TODO:jies namespace
            if(chaos && chaos[k]) return chaos[k]
            return Reflect.get(o,k,c);// || Reflect.apply(jies.findKey,jies,k)
        },
        set:function(o,k,v,c){
            switch(k[0]){
                case '$': case '@': case '~': case '|': case '_':
                    chaos ? chaos.sync(k,v):(handlers[k] = v)
                    break
                default:
                    Reflect.set(o,k,v,c)
            }
        }
    })
    return jiesCache[name] = jies
}
