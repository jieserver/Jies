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

function chaos(options){
    options = Object.assign({ port:DEFAULT_PORT,rotate:10 },options)
    this.id = 100000000*Math.random()|0

    this.yin = new Yin(options)
    this.yang = new Yang(options)
}
var proto = {
    
}
chaos.prototype = EventEmitter

module.exports = chaos