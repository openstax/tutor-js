path = require 'path'
webpack = require 'webpack'
ExtractTextPlugin = require 'extract-text-webpack-plugin'

DEV_LOADERS = ['react-hot', 'webpack-module-hot-accept']

module.exports =
  devtool: 'eval-source-map'
  resolve:
    root: [
      path.resolve(__dirname, '../../tutor')
      path.resolve(__dirname, '../../tutor/src')
    ]
    extensions: ['', '.js', '.json', '.coffee', '.cjsx']
  entry:
    tutor: [
      'index.coffee',
      'resources/styles/tutor.less'
    ]
    qa: [
      'src/qa.coffee'
    ]
  output:
    path: 'dist'
    publicPath: 'http://localhost:8000/dist/'
    filename: '[name].js'

  module:
    loaders:   [
      { test: /\.coffee$/, loaders: DEV_LOADERS.concat('coffee-loader')}
      { test: /\.cjsx$/,   loaders: DEV_LOADERS.concat('coffee-jsx-loader')}
      { test: /\.svg/,     loader: 'svg-url-loader'}
      { test: /\.(png|jpg)/, loader: 'file-loader?name=[name].[ext]'}
      { test: /\.json$/,   loader: 'json-loader' }
      {
        test: /\.(woff|woff2|eot|ttf)/
        loader: "url-loader?limit=30000&name=[name]-[hash].[ext]"
      }
      {
        test: /\.less$/,   loaders: DEV_LOADERS.concat(
          'style-loader', 'css-loader', 'less-loader'
        ) }
    ]

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]

  devServer:
    port: 8000
    historyApiFallback: true
    # It suppress error shown in console, so it has to be set to false.
    quiet: false
    progress: true
    # It suppress everything except error, so it has to be set to false as well
    # to see success build.
    noInfo: false
    filename: '[name].js',
    stats:
      # Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
