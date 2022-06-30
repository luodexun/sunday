'use strict'

process.env.BABEL_ENV = 'renderer'

const path = require('path')
const webpack = require('webpack')
const { readEnv, getConditionalLoader } = require('./utils')
const webpackCommonConfig = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const config = readEnv('./.env.development')
/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
console.log(config)
module.exports = merge(webpackCommonConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader', getConditionalLoader()]
      }
    ]
  },
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
      BASE_URL: JSON.stringify('/'),
      'process.env': config
    })
  ]
})
