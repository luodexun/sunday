'use strict'

process.env.BABEL_ENV = 'renderer'

const path = require('path')
const webpack = require('webpack')
const readEnv = require('./utils').readEnv
const MinifyPlugin = require('babel-minify-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpackCommonConfig = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const config = readEnv('./.env.production')
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
    publicPath: './',
    path: path.join(__dirname, '../dist/electron')
  },
  plugins: [
    new MinifyPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../static'),
        to: path.join(__dirname, '../dist/electron/static'),
        ignore: ['.*']
      }
    ]),
    new webpack.DefinePlugin({
      'process.env': config
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]
})
