const path = require('path')
const {getExternals, resolve, getCdnConfig} = require('./utils')
const {VueLoaderPlugin} = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    renderer: path.join(__dirname, process.platform === 'darwin' ? '../src/renderer/main.js' : '../src/renderer/winEntry.js')
  },
  externals: getExternals(),
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader?indentedSyntax']
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]'
          }
        },
        exclude: [path.resolve('src/renderer/assets/svg')]
      },
      {
        test: /\.svg$/,
        use: [
          { loader: 'svg-sprite-loader',
            options: {
              symbolId: 'icon-[name]'
            }},
          { loader: 'svgo-loader',
            options: {
              plugins: [{
                name: 'removeAttrs', // 必须指定name！
                params: {attrs: 'fill'}
              }]
            }
          }
        ]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
  cache: {
    type: 'filesystem' // 使用本地缓存，默认使用内存
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({filename: 'styles.css'}),
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
      inject: 'body',
      minify: {
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空符与换符
        minifyCSS: true // 压缩内联css
      },
      cdnConfig: getCdnConfig()
    })
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node']
  },
  target: 'electron-renderer'
}
