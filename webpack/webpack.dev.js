'use strict'

process.env.BABEL_ENV = 'renderer'

const path = require('path')
const webpack = require('webpack')

const webpackCommonConfig = require('./webpack.common.js')
const { merge } = require('webpack-merge')
/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
module.exports = merge(webpackCommonConfig, {
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    publicPath: '/',
    path: path.join(__dirname, '../dist/electron')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  ]
})
