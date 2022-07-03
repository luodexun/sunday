const { readdirSync } = require('fs')
const { resolve } = require('path')
module.exports = function () {
  const dirs = readdirSync(resolve('./mocks'))
  console.log(dirs)
  return function (req, res, next) {
    next()
  }
}
