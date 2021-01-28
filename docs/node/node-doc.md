# Node.js 内置模块笔记

## dns 模块
可以用于
### dns.lookup() 
DNS 查询，根据 hostname（主机名） 获取 IP 地址以及对应的版本。内部使用 getaddrinfo 系统调用，会读取 `/etc/hosts` 的配置
```js
// dns.js
const dns = require('dns');

// 注意不能使用 http 等协议
const arr = [
  'www.zuo11.com',
  'fe.zuo11.com'
]

arr.forEach(host => {
  // dns 查询，
  dns.lookup(host, (err, address, family) => {
    console.log('host: %j \naddress: %j family: IPv%s', host, address, family);
  });
})

// node dns.js
// host: "fe.zuo11.com" 
// address: "120.77.166.5" family: IPv4
// host: "zuo11.com" 
// address: "47.107.190.93" family: IPv4
```
### dns.resolveAny() 
DNS 解析记录查询，比 dns.lookup() 查询的信息更详细，准确。忽略 `/etc/hosts` 的配置，始终通过网络执行 DNS 查询。可以根据 hostname 获取对应的解析类型、解析值。
```js
const dns = require('dns');

// 注意不能使用 http 等协议
const arr = [
  'www.zuo11.com',
  'fe.zuo11.com'
]

arr.forEach(host => {
  dns.resolveAny(host, (err, ret) => {
    console.log(err, ret)
  })
})
// null [
//   { value: 'fe-zuo11-com.oss-cn-shenzhen.aliyuncs.com', type: 'CNAME' }
// ]
// null [ { address: '47.107.190.93', ttl: 600, type: 'A' } ]
```
除了 dns.resolveAny() 外，还有粒度更细的相关 API，参考 [ns_dns_resolve_hostname](https://nodejs.org/dist/latest-v14.x/docs/api/dns.html#dns_dns_resolve_hostname_rrtype_callback)
- `dns.resolveAny()` Uses the DNS protocol to resolve all records (also known as ANY or * query).
- `dns.resolve4()` Uses the DNS protocol to resolve a IPv4 addresses (A records) for the hostname.
- `dns.resolve6()` Uses the DNS protocol to resolve a IPv6 addresses (AAAA records) for the hostname.
- `dns.resolveCname()` Uses the DNS protocol to resolve CNAME records for the hostname. 
- `dns.resolveNs()` Uses the DNS protocol to resolve name server records (NS records) for the hostname.
- ...

### dns.reverse() 
反向 DNS 查询
```js
const ipArr = [
  '47.107.190.93',
]

ipArr.forEach(ip => {
  // 使用 getHostByAddr 系统调用
  // 执行一个反向 DNS 查询，将 IPv4 或 IPv6 地址解析为主机名数组。
  dns.reverse(ip, (err, hostnames) => {
    console.log('dns.reverse', err, hostnames)
  })
})
```
一般服务供应商不允许反向 DNS 查询，会报错 **Error: getHostByAddr ENOTFOUND 47.107.190.93**，参考: [Firebase reverse dns lookup ENOTFOUND error node.js dns](https://stackoverflow.com/questions/48548085/firebase-reverse-dns-lookup-enotfound-error-node-js-dns)
```js
// dns.reverse Error: getHostByAddr ENOTFOUND 47.107.190.93
//     at QueryReqWrap.onresolve [as oncomplete] (dns.js:203:19) {
//   errno: 'ENOTFOUND',
//   code: 'ENOTFOUND',
//   syscall: 'getHostByAddr',
//   hostname: '47.107.190.93'
// } undefined

// don't allow reverse DNS lookups
```

参考: [DNS | Node.js v14.15.4 Documentation](https://nodejs.org/dist/latest-v14.x/docs/api/dns.html#dns_dns_lookup_hostname_options_callback)

### dns.getServers()
返回 IP 地址字符串的数组，该字符串根据 RFC 5952 进行了格式化，作为当前 DNS 解析。如果使用自定义端口，则字符串将包含端口部分。
```js
console.log(`dns.getServers()`, dns.getServers())
// dns.getServers() [ '192.168.31.1' ] 本地路由地址
```

### dns Promise 形式接口
使用 require('dns').promises 相当于之前的 dns，相关 API 都是 Promise 形式
```js
const dnsPromises = require('dns').promises

dnsPromises.lookup('fe.zuo11.com').then((result) => {
  console.log('address: %j family: IPv%s', result.address, result.family);
  // address: "120.77.166.5" family: IPv4
});

dnsPromises.resolveAny('fe.zuo11.com').then((ret) => {
  console.log(ret)
});
// [
//   { value: 'fe-zuo11-com.oss-cn-shenzhen.aliyuncs.com', type: 'CNAME' }
// ]

dnsPromises.reverse('120.77.166.5').then(console.log).catch(err => {
  console.log(err) // 错误
})
// Error: getHostByAddr ENOTFOUND 120.77.166.5
```

## http 模块
### http.get()、http.request()
可以使用 http.get()、http.request() 发送 http 请求。这两个函数返回 http.ClientRequest 对象，
### http.createServer()
### http.METHODS、http.STATUS_CODES
http 模块包含两个常量属性，分别表示支持 http 请求方法，http 响应状态码集合。
```js
METHODS: [
  'ACL',         'BIND',       'CHECKOUT',
  'CONNECT',     'COPY',       'DELETE',
  'GET',         'HEAD',       'LINK',
  'LOCK',        'M-SEARCH',   'MERGE',
  'MKACTIVITY',  'MKCALENDAR', 'MKCOL',
  'MOVE',        'NOTIFY',     'OPTIONS',
  'PATCH',       'POST',       'PROPFIND',
  'PROPPATCH',   'PURGE',      'PUT',
  'REBIND',      'REPORT',     'SEARCH',
  'SOURCE',      'SUBSCRIBE',  'TRACE',
  'UNBIND',      'UNLINK',     'UNLOCK',
  'UNSUBSCRIBE'
],
STATUS_CODES: {
  '100': 'Continue',
  '101': 'Switching Protocols',
  '102': 'Processing',
  '103': 'Early Hints',
  '200': 'OK',
  '201': 'Created',
  '202': 'Accepted',
  '203': 'Non-Authoritative Information',
  '204': 'No Content',
  '205': 'Reset Content',
  '206': 'Partial Content',
  '207': 'Multi-Status',
  '208': 'Already Reported',
  '226': 'IM Used',
  '300': 'Multiple Choices',
  '301': 'Moved Permanently',
  '302': 'Found',
  '303': 'See Other',
  '304': 'Not Modified',
  '305': 'Use Proxy',
  '307': 'Temporary Redirect',
  '308': 'Permanent Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '402': 'Payment Required',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '406': 'Not Acceptable',
  '407': 'Proxy Authentication Required',
  '408': 'Request Timeout',
  '409': 'Conflict',
  '410': 'Gone',
  '411': 'Length Required',
  '412': 'Precondition Failed',
  '413': 'Payload Too Large',
  '414': 'URI Too Long',
  '415': 'Unsupported Media Type',
  '416': 'Range Not Satisfiable',
  '417': 'Expectation Failed',
  '418': "I'm a Teapot",
  '421': 'Misdirected Request',
  '422': 'Unprocessable Entity',
  '423': 'Locked',
  '424': 'Failed Dependency',
  '425': 'Unordered Collection',
  '426': 'Upgrade Required',
  '428': 'Precondition Required',
  '429': 'Too Many Requests',
  '431': 'Request Header Fields Too Large',
  '451': 'Unavailable For Legal Reasons',
  '500': 'Internal Server Error',
  '501': 'Not Implemented',
  '502': 'Bad Gateway',
  '503': 'Service Unavailable',
  '504': 'Gateway Timeout',
  '505': 'HTTP Version Not Supported',
  '506': 'Variant Also Negotiates',
  '507': 'Insufficient Storage',
  '508': 'Loop Detected',
  '509': 'Bandwidth Limit Exceeded',
  '510': 'Not Extended',
  '511': 'Network Authentication Required'
}
```
## https 模块
## http2
HTTP/2 相关