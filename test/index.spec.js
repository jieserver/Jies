const {expect} = require('chai')
log = console.log.bind(console)

describe('JS syntax',()=>{
    it('arguments',()=>{
        function foo1(){
            log('foo1',arguments)
        }
        function foo2(){
            log('foo2',arguments)
            foo1(...arguments)
        }
        foo2(1,'test',[1,11,12],{obj:true})
    })
    it('prototype',()=>{
        function Foo(){}
        Foo.b = 1
        Foo.prototype = {
            a:1
            ,f(){
                return this.a
            }
        }
        var foo = new Foo()
        log(Object.keys(foo))
        log(foo.a,foo.b)
        foo.a = 2
        var foo2 = new Foo()
        log(foo.a,foo2.a)
        log(foo.f(),foo2.f())
    })
    it('async',()=>{
        async function foo1(){
            return 1
        }
        function foo2(){
            return 1
        }
        function foo3(){
            return Promise.resolve(1)
        }
        async function callFoo(foo){
            return foo()
        }
        callFoo(foo1).then(e=>log('foo1',e))
        callFoo(foo2).then(e=>log('foo2',e))
        callFoo(foo3).then(e=>log('foo3',e))
        log(callFoo(foo1),callFoo(foo2),callFoo(foo3))
    })
    it('net',()=>{
        const net = require('net')
        var s1 = net.createServer()
        s1.on('listening',e=>log('*******',e))
        s1.listen(10000,function(){
            log('net:',this)
        })//,n=>log('&&&&&&&&&',n))

        var s2 = net.createServer();
        s2.on('error',e=>log('--------',e))
        s2.on('close',e=>log('++++++++',e))
        s2.listen(10000)
    })
    it('buffer',()=>{
        var obj = {a:1}
        var str = JSON.stringify(obj)
        var buff = Buffer.from(str)
        log(JSON.parse(buff))
    })
    it('udp',()=>{
        const udp = require('dgram').createSocket('udp4')
        udp.bind(10000,()=>{
            udp.on('message',(msg)=>{
                log(JSON.parse(msg))
                udp.close()
            })
            udp.send(JSON.stringify({test:'str'}),10000)
        })
    })
    it('symbol',()=>{
        var sfoo = Symbol('sfoo')
        
    })
    it('promise',()=>{
        function err1(){ return Promise.reject('1')}
        function err2(){ return Promise.reject('2')}
        err1().then(err2).catch(e=>log(e))

        function p1(){ return Promise.resolve(1)}
        function p2(){ return Promise.resolve(2)}
        Promise.all([p1(),p2()]).then(res=>{
            log('promise all:',res)
        })
    })
    it('ips',()=>{
        const net = require('net')
        const dgram = require('dgram')
        const server = net.createServer().listen(11000)
        server.on('connection',skt=>{
            log('from net:',skt.remoteAddress)
        })
        const udp = dgram.createSocket('udp4').bind(11000)
        udp.on('message',(d,r)=>{
            log('from udp:',r.address)
        })

        net.createConnection({port:11000})
        dgram.createSocket('udp4').bind(function(){
            this.send('test',11000)
        })
    })
    it('Object',()=>{
        function FOO(){
            this.a = 1
            const b = 'teststring'
            const v = ()=>log(this)
            Object.assign(this,{b,v})
        }
        var foo = new FOO()
        foo.v()
        log(foo)
    })
    it('Callback',()=>{
        var c1,c2
        function Foo(a,cb){
            log(a)
            c1 ? (c2 = cb) : (c1 = cb)
            c1 && c2 && log('cb eq:',c1 == c2)
        }
        [1,2].forEach(p=>Foo(p,()=>{
            log('this is foo')
        }))
    })
})