ExtractTextPlugin = require 'extract-text-webpack-plugin'
webpack = require 'webpack'
path = require 'path'

isProduction = process.env.NODE_ENV is 'production'
LOADERS = if isProduction then [] else ["react-hot", "webpack-module-hot-accept"]

module.exports =
  cache: true

  devtool: if isProduction then undefined else 'source-map'

  entry: './index'

  output:
    path: if isProduction then './dist/' else '/'
    filename: '[name].js'
    publicPath: if isProduction then '/assets/' else 'http://localhost:8000/dist/'
    libraryTarget: 'amd'
    library: 'TutorJSShared'

  module:
    noParse: [
      /\/sinon\.js/
    ]
    loaders: [
      { test: /\.json$/,   loader: "json-loader" }
      { test: /\.coffee$/, loaders: LOADERS.concat("coffee-loader")}
      { test: /\.cjsx$/,   loaders: LOADERS.concat("coffee-jsx-loader")}
      { test: /\.(png|jpg|svg)/, loader: 'file-loader?name=[name].[ext]'}
      { test: /\.(woff|woff2|eot|ttf)/, loader: "url-loader?limit=30000&name=[name]-[hash].[ext]" }
   ]
  resolve:
    extensions: ['', '.js', '.json', '.coffee', '.cjsx']

  externals: [
    {
      react: 'react'
    },{
      'react/addons': 'react'
    },{
      'react-bootstrap': 'react-bootstrap'
    },{
      'react-scroll-components': 'react-scroll-components'
    },{
      underscore: 'underscore'
    }
  ]

  devServer:
    contentBase: './'
    publicPath: 'http://localhost:8000/dist/'
    historyApiFallback: true
    inline: true
    port: process.env['PORT'] or 8000
    # It suppress error shown in console, so it has to be set to false.
    quiet: false,
    # It suppress everything except error, so it has to be set to false as well
    # to see success build.
    noInfo: false
    host: 'localhost',
    outputPath: '/',
    filename: '[name].js',
    hot: true
    stats:
      # Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
