const {expect} = require('chai')
const Chaos = require('../lib/chaos')
const fkill = require('fkill')
const log = console.log.bind(console)

describe('Chaos',function(){
    describe('domain',function(){
        var yin = 
        before(function(){
            yin = new Chaos().Yin()
        })
        after(function(){
            //setTimeout(() => {
                yin.destroy()
            //}, 2000);
        })
    
        it('delay emit',function(){
            setTimeout(() => {
                yin.emit('test1',{t:1})
            }, 100);
        })
        it('listen',function(done){
            yin.on('test1',function (d){
                expect(d).to.be.eql({t:1})
                done()
            })
        })
        it('delay emit 2',function(){
            setTimeout(() => {
                yin.emit('test2',{t:2}).to(13527,'255.255.255.255')
            }, 100);
        })
        it('listen 2',function(done){
            yin.on('test2',function (d){
                expect(d).to.be.not.eql({t:1})
                done()
            })
        })
    })
    describe('Open',function(){
        var yin
        before(function(){
            yin = new Chaos().Yin()
        })
        after(function(){
            yin.destroy()
        })
        var yang
        beforeEach(function(){
            yang = new Chaos().open()
        })
        afterEach(function(){
            yang.close()
        })
        it('emit and domain listen',function(done){
            yin.on('test',d=>{
                expect(d).to.eql({t:3})
                done()
            })
            setTimeout(() => {
                yang.emit('test',{t:3})
            }, 1000);
        })
        it('sync function' ,function(done){
            yang.sync('_add',(a,b)=>{return a+b})
            setTimeout(() => {
                expect(yang._add(1,2)).to.eq(3)
                done()
            }, 1000);
        })
    })
})