const http = require('http')
module.exports = function () {
  return function (req, res, next) {
    let ret = []
    req.on('data', (data) => {
      ret.push(data)
    })
    req.on('end', (data) => {
      let newReq = http.request({
        host: '',
        port: '',
        path: req.url,
        method: req.method,
        headers: req.headers
      }, (newRes) => {
        let result = []
        newRes.on('data', (data) => {
          result.push(data)
        })
        newRes.on('end', () => {
          if (newRes.headers) {
            if (newRes.headers['set-cookie']) {
              let cookie = newRes.headers['set-cookie'].toString()
              let arr = /(?:[^:]+;\s*)*?path=([^;]+);?\s*(?:HttpOnly)?/.exec(cookie)
              if (arr) {
                newRes.headers['set-cookie'] = arr[0].replace(arr[1], '/')
              }
            }
            res.writeHead(200, newRes.headers)
          }
        })
        if (ret) {
          newReq.write(ret.join(''))
        }
        newReq.on('error', (err) => {
          console.log(err)
        })
        newReq.end()
      })
    })
  }
}
