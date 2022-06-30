const path = require('path')
const {getExternals, resolve, getCdnConfig} = require('./utils')
const {VueLoaderPlugin} = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    renderer: path.join(__dirname, '../src/renderer/main.js')
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
        type: 'asset', // webpack5使用内置静态资源模块，且不指定具体，根据以下规则使用
        generator: {
          filename: 'imgs/[name]--[folder].[ext]' // ext本身会附带点，放入img目录下
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 超过10kb的进行复制，不超过则直接使用base64
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
        ],
        include: [path.resolve('src/renderer/assets/svg')]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'media/[name].[ext]' // 放入font目录下
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024 // 超过10kb的进行复制，不超过则直接使用base64
          }
        }
      },
      {
        test: /\.(ttf|woff2?|eot)$/,
        type: 'asset/resource', // 指定静态资源类复制
        generator: {
          filename: 'fonts/[name]--[folder].[ext]' // 放入font目录下
        }
      }
    ]
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [resolve('.env.development'), resolve('.env.production')]
    }
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve('public/index.ejs'),
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
