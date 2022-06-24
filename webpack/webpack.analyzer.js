const { merge } = require('webpack-merge')
const webpackProConfig = require('./webpack.main.js')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(webpackProConfig, {
  plugins: [new BundleAnalyzerPlugin()]
})
