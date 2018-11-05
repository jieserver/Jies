'use strict';
function Nothing(name){
    function nothing(){
        return Promise.reject({message:`${name} is nothing`,type:'nothing'})
    }
    return new Proxy(nothing,{
        get:function(o,k,c){
            return new Nothing(`${name}.${k}`);
        },
        set:function(o,k,v,c){
            throw new Error('Nothing could be set!')
        }
    })
}

module.exports = Nothing