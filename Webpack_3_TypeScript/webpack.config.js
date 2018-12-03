const path = require('path');
const fs = require('fs');

const { WebPlugin } = require('web-webpack-plugin');
const { DefinePlugin } = require('webpack');

const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');



module.exports = {
  // JavaScript 执行入口文件
  entry: './entry.js',
  // 输出的结果
  output: {
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    // filename: 'bundle.js',
    //  给js文件添加hash值。
    filename: '[name]_[chunkhash:8].js',
    // 输出文件都放到 dist 目录下
    path: path.resolve(__dirname, './dist'),
    // 指定存放CDN的目录URL
    publicPath: '//js.cdn.com/id/'
  },
  mode: 'development',
  devServer: {
    port: 7777,
    inline: true,
    // 当404 自动跳转回首页
    historyApiFallback: true,
    // 让命令中少一些输出
    noInfo: true,
    // 代理到后端的接口
    proxy: {
      // 只有/api开头的请求地址，才会被代理
      // 如果请求地址是 /test/home,这种不以/api开头的，是不会被代理的
      // 示例： /api/logout, 最终会变成  http://api.xxx.com/v1/logout
      "/api/*": {
        // 目标服务器地址
        target: "http://127.0.0.1:7001/api/v1",
        // 目标服务器地址是否是安全协议
        secure: false,
        // 是否修改来源, true时-->让目标服务器以为是webpack-dev-server发出的请求
        changeOrigin: true,
        // '/api/login' => target + '/login'
        // 将/api开头的请求地址, /api 改为 /, 即 /api/xx 改为 /xx
        pathRewrite: { "^/api": "/" }
      },
      // 启用热替换属性
      hot: true,
      // 使用颜色
      colors: true,
    },
    // 单页面程序
    historyApiFallback: {
      // 使用正则匹配命中路由
      rewrites: [
        // user 开头的返回user.html
        {from: /^\/user/, to: '/user.html'},
        // game 开头的返回game.html
        {from: /^\/game/, to: '/game.html'},
        // 其他的返回index.html
        {from: /./, to: '/index.html'}
      ]
    },
    // // 白名单
    // allowedHosts: [
    //   '.host.com',
    //   '.host2.com'
    // ],
    // // http 证书
    // https: {
    //   key: fs.readFileSync('/path/to/server.key'),
    //   cert: fs.readFileSync('/path/to/server.crt'),
    //   ca: fs.readFileSync('/path/to/ca.pem'),
    // },
  },
  // Source Map
  devtool: 'source-map',
  // 监听模式
  watch: true,
  // 定制监听模式
  watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 1000,
  },
  // externals 外部文件，不需要打包
  externals: {
    jquery: 'jQuery'
  },
  // 寻找模块 配置规则
  resolve: {
    // 先尝试 ts 后缀的 TypeScript 源码文件
    extensions: ['.ts', '.js'],
    // 配置别名
    alias: {
      // moment: "moment/min/moment-with-locales.min.js"
    }
  },
  module: {
    rules:[
      // 配置autoprefixer
      {
        test:/\.css$/,
        use:[
          'style-loader',
          {
            loader:'css-loader',
            options:{importLoaders:1}
            },
          // importLoaders代表import进来的资源；
          // 2代表css-loader后还需要使用几个loader
          {
            loader: 'postcss-loader',
            options:{
              plugins:[
                require("autoprefixer")("last 100 versions")
              ]
            }
          }
        ],
        exclude:path.resolve(__dirname,'/node_modules'),
        include:path.resolve(__dirname,'src'),
      },
      {
        test: /\.js$/,
        loader: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    // flow webpack
    new FlowBabelWebpackPlugin(),
    // 一个WebPlugin对应生成一个html文件
    new WebPlugin({
      //输出的html文件名称
      filename: 'index.html',
      // //这个html依赖的`entry`
      requires: ['app'],
    }),
    // 将包或包中的文本提取到单独的文件中。
    new ExtractTextPlugin({
      filename: `[name]_[contenthash:8].css`,// 给输出的 CSS 文件名称加上 Hash 值
    }),
    // 定义一个全局变量
    new DefinePlugin({
      // 定义 NODE_ENV 环境变量为 production，以去除源码中只有开发时才需要的部分
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // 压缩输出的 JavaScript 代码
    new UglifyPlugin({
      uglifyOptions: {
        // 启用IE8支持
        ie8: false,
        // 支持的ECMAScript版本（5,6,7或8）。影响解析，压缩和输出选项
        ecma: 8,
        output: {
          // 删除所有的注释
          comments: false,
          // 最紧凑的输出
          beautify: false,
        },
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
        }
      }
    }),
  ],
};
