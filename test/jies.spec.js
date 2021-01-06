const Jies = require('..')
const {expect} = require('chai')
const fkill = require('fkill')
const log = console.log.bind(console)

describe('Jies index',function(){
    var pid;
    after(function(){
        console.log('kill',pid)
        pid && fkill(pid,{force:true,tree:false})
        pid = null
    })
    describe('require',function(){
        it('require',function(){
            expect(Jies).to.be.a('function')
        })
        it('Proxy get set',function(){
            var jies = new Jies('test');
            jies.a = 0
            expect(jies.a).to.eq(0)
        })
    })
    describe('collect',function(){
        it('first collect back & chaos.process',function(done){
            var jies = new Jies('test');
            jies.collect({reconnect:2,id:1},chaos=>{
                pid = chaos.process && chaos.process.pid
                expect(chaos.process).to.be.an('object')
                done()
            })
        })
        // it('second collect back without chaos.process',function(done){
        //     var jies = new Jies('test');
        //     jies.collect({reconnect:2,id:2},chaos=>{
        //         expect(chaos.process).to.be.an('undefined')
        //         done()
        //     })
        // })
        it('collect no back',function(){
            var jies = new Jies('test');
            jies.collect({reconnect:1})
            expect(jies).to.be.a('function')
        })
    })
    describe('functor',function(){
        it('set local function',function(done){
            var jies = new Jies('test');
            jies._add = (a,b)=>a+b
            log('-----------')
            jies.collect({reconnect:1},chaos=>{
                expect(chaos._add).to.be.a('function')
                done()
            })
        })
        it('get local function',function(done){
            var jies = new Jies('test');
            jies.collect({reconnect:1},chaos=>{
                expect(chaos._add).to.be.a('function')
                done()
            })
        })
        it('call local function',function(done){
            var jies = new Jies('test');
            jies.collect({reconnect:1},chaos=>{
                expect(chaos._add(1,2)).to.eq(3)
                done()
            })
        })
        it('duplex local function',function(){
            // var jies = new Jies('test');
            // expect(function(){jies._add = (a,b)=>a+b}).to.be.a('function')
            // jies.collect({reconnect:1})
        })
    })
    
})