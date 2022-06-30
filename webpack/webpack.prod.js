'use strict'

process.env.BABEL_ENV = 'renderer'

const path = require('path')
const webpack = require('webpack')
const { readEnv, getConditionalLoader } = require('./utils')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpackCommonConfig = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const WebpackBar = require('webpackbar')
const config = readEnv('./.env.production')
/**
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
module.exports = merge(webpackCommonConfig, {
  mode: 'production',
  devtool: false,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader', getConditionalLoader()]
      }
    ]
  },
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
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash:8].css'
    }),
    new CleanWebpackPlugin(),
    new WebpackBar(),
    ...(process.env.APP_GZIP === 'ON'
      ? [
        new CompressionPlugin({
          filename: '[path][base].gz',
          threshold: 10240,
          minRatio: 0.8
        })
      ]
      : [])
  ],
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: true,
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      }),
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ],
    splitChunks: {
      chunks: 'all',
      minChunks: 3,
      maxAsyncRequests: 5,
      maxInitialRequests: 5,
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'all',
          priority: 10, // 优先级
          enforce: true
        },
        main: {
          test: /src\/renderer/,
          name: 'renderer',
          enforce: true
        }
      }
    }
  }
})
