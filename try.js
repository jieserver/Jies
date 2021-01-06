var sip = process.argv[2] || 'signhuwei.vicp.net'
var net = require('net')
var http = require('http')
var qss = require('querystring')
var _port = 8778
var seeds = {}
var contacts = {}
var links = {}

//TODO: 1.启动服务,监听8778
//TODO: 2.向种子服务器请求代理列表
//TODO: 3.分析自己是否可做代理,刷新代理列表
//TODO: 4.如果自己是代理,发布http服务,
//TODO: 5.如果自己不是代理,监听每个代理的指令[连代理xxx端口,转发给指定本机端口]
/** 目前只能n:1
 *     visitor[n]    contact
 *          \       /       \
 *           \     /         \
 *            seed         target
 */
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  (index > -1) && this.splice(index, 1);
}
function urlParse(url) {
  url = url.split('?')
  return { route: url[0], params: qss.parse(url[1]) }
}
const server = http.createServer((q, s) => {
  s.end(JSON.stringify(urlParse(q.url)))
})
server.on('connection', skt => {
  var ciport = `${skt.remoteAddress}:${skt.remotePort}`
  skt.on('close', () => (delete contacts[ciport]))
  skt.on('error', e => skt.destroy())
  skt.on('data', d => {
    if (d[0] != 123) return
    contacts[ciport] = skt
    try {
      var cmds = JSON.parse(d.toString())
      console.log('up1',cmds)
      seedHandler(cmds)
    } catch (e) { } //nothing
  })
}).listen(_port)
console.log(server.address())

function seedHandler(cmds) {
  cmds.seeds && (seeds = cmds.seeds) //TODO: 增量更新&校验
  cmds.link && createLink(cmds.links)
  cmds.proxy && createProxy()
}

function createProxy(next, errback) {
  var outSvr, inSvr, cntSkt;
  var vstSkts = []
  outSvr = net.createServer(skt => {
    cntSkt = skt;
    cntSkt.on('data', d => vstSkts.forEach(i => i.write(d))) //可能会因为in的error影响out吧
    cntSkt.on('error', errback)
  }).listen(() => {
    inSvr = net.createServer(skt => {
      vstSkts.push(skt);
      skt.on('data', d => cntSkt && cntSkt.write(d))
      skt.on('error', e => vstSkts.remove(skt))//访问者错误直接移除
    }).listen(() => {
      next && next(inSvr, outSvr)
    })
  })
}

function createLink(sPort, sIP, lPort, lIP, next, errback) {
  var mapkey = `${lIP}:${lPort}>${sIP}:${sPort}`
  var sskt = new net.Socket();
  var lskt = new net.Socket();
  try {
    sskt.connect(sPort, sIP, () => {
      lskt.connect(lPort, lIP, () => {
        lskt.on('data', d => sskt.write(d))
        sskt.on('data', d => lskt.write(d))
        next(mapkey, [sskt, lskt])
      })
    })
    sskt.on('error', e => errback(mapkey, e))
    lskt.on('error', e => errback(mapkey, e))
  } catch (error) { errback(mapkey, error) }
}

var skt = net.createConnection(_port, '::ffff:127.0.0.1', _ => {
  console.log(skt.localAddress, skt.localPort)
  skt.write(JSON.stringify({ name: 'test' }))
})
skt.on('error', e => {
  console.log(e)
})
skt.on('data', d => {
  console.log(d.toString())
})
setTimeout(() => {
  skt.write(JSON.stringify({ name: 'test---1' }))
}, 10000);

var requst = http.request({ 
  method: 'get', 
  path: '/test', hostname: '127.0.0.1', port: _port
},function(pres){pres.on('data',d=>console.log('down',d.toString()))});
requst.end()