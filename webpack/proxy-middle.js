const http = require('http')
const stream = require('stream')
module.exports = function () {
  return function (req, res, next) {
    let newReq = http.request({
      host: process.env.PROXY_HOST,
      port: process.env.PROXY_PORT,
      path: req.url,
      headers: {
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIsInJpZCI6MCwiaWF0IjoxNjU2ODE1NTY4LCJleHAiOjE2NTY5MDE5Njh9.d4fIl6uY5y_wD7dNhbF_CZcm_h8FCgCDxrDU-tphDNQ',
        ...req.headers
      },
      method: req.method
    }, (newRes) => {
      newRes.pipe(res)
      // newRes.on('data', (data) => {
      //   res.write(data, 'binary')
      // })
      // newRes.on('end', () => {
      //   res.end()
      // })
      if (newRes.headers) {
        if (newRes.headers['set-cookie']) {
          let cookie = newRes.headers['set-cookie'].toString()
          let arr = /(?:[^:]+;\s*)*?path=([^;]+);?\s*(?:HttpOnly)?/.exec(cookie)
          if (arr) {
            newRes.headers['set-cookie'] = arr[0].replace(arr[1], '/')
          }
        }
      }
      res.writeHead(newRes.statusCode, newRes.headers)
    })
    req.pipe(map(item => {
      let newItem = JSON.parse(item.toString())
      console.log(newItem)
      return item
    })).pipe(newReq)
    // req.on('data', (data) => {
    //   newReq.write(data)
    // })
    // req.on('end', (data) => {
    //   newReq.end()
    // })
  }

  function map (callback) {
    const trans = new stream.Transform({
      readableObjectMode: true,
      writableObjectMode: true
    })
    let index = 0
    trans._transform = function (chunk, enc, next) {
      next(null, callback(chunk, index++))
    }
    trans._flush = function (cb) {
      cb()
    }
    return trans
  }
}
