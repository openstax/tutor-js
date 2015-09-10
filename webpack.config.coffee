ExtractTextPlugin = require 'extract-text-webpack-plugin'

module.exports =
  cache: true

  entry:
    tutor: ["./index.coffee"]

  output:
    path: 'dist'
    filename: '[name].js'
    publicPath: '/dist/'

  plugins: [
    new ExtractTextPlugin("tutor.css")
  ]

  module:
    noParse: [
      /\/sinon\.js/
    ]
    loaders: [
      { test: /\.json$/,   loader: "json-loader" }
      { test: /\.coffee$/, loaders: ["coffee-loader" ] }
      { test: /\.cjsx$/,   loaders: ["coffee-jsx-loader"] }
      { test: /\.less$/,   loader: ExtractTextPlugin.extract('css!less')}
      { test: /\.(png|jpg|svg)/, loader: 'file-loader?name=[name].[ext]'}
      { test: /\.(woff|woff2|eot|ttf)/, loader: "url-loader?limit=30000&name=[name]-[hash].[ext]" }
   ]
  resolve:
    extensions: ['', '.js', '.json', '.coffee', '.cjsx']

  devServer:
    contentBase: './dist'
    publicPath: 'http://localhost:8000/dist/'
    hot: true
    inline: true
    port: 8000
    # It suppress error shown in console, so it has to be set to false.
    quiet: false,
    # It suppress everything except error, so it has to be set to false as well
    # to see success build.
    noInfo: false
    stats:
      # Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
