const Nothing = require('../lib/nothing')
const test = new Nothing('test')
const {expect} = require('chai')
const log = console.log.bind(console)

describe('test nothing',function(){
    it('nothing get nothing',function(){
        expect(test.foo).to.be.a('function')
    })
    it('anything could be get',function(){
        expect(test.foo.foo).to.be.a('function')
    })
    it('nothing could be set',function(){
        expect(()=>test.something = {}).to.throw(Error)
    })
    it('test is nothing',function(done){
        test().catch(e=>{
            expect(e).to.be.eql({message:'test is nothing',type:'nothing'})
            done()
        })
    })
    it('test.foo is nothing',function(done){
        test.foo().catch(e=>{
            expect(e).to.be.eql({message:'test.foo is nothing',type:'nothing'})
            done()
        })
    })
    it('test.anything.foo is nothing',function(done){
        test.anything.foo().catch(e=>{
            expect(e).to.be.eql({message:'test.anything.foo is nothing',type:'nothing'})
            done()
        })
    })
})
