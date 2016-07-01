ExtractTextPlugin = require 'extract-text-webpack-plugin'
webpack = require 'webpack'

isStandaloneBuild = process.env.NODE_BUILD_TYPE is 'standalone'
isCoverage = process.env.NODE_COVERAGE
LOADERS = if isStandaloneBuild then [] else ["react-hot", "webpack-module-hot-accept"]
lessLoader = if isStandaloneBuild
  { test: /\.less$/,   loader: ExtractTextPlugin.extract('css!less') }
else
  { test: /\.less$/,   loaders: LOADERS.concat('style-loader', 'css-loader', 'less-loader') }

if isCoverage
  POST_LOADERS = [
    { test: /\.coffee$/, loaders: ["istanbul-instrumenter"] }
    { test: /\.cjsx$/, loaders: ["istanbul-instrumenter"] }
  ]
else
  POST_LOADERS = []

module.exports =
  cache: true

  devtool: '#inline-source-map' # Always include source maps!

  entry:
    tutor: [
      './index.coffee',
      './resources/styles/tutor.less'
    ]
    qa: [
      './src/qa.coffee'
    ]

  output:
    path: if isStandaloneBuild then 'dist' else '/'
    filename: '[name].js'
    publicPath: if isStandaloneBuild then '/assets/' else 'http://localhost:8000/dist/'

  plugins: [ new ExtractTextPlugin('tutor.css') ]

  module:
    noParse: [
      /\/sinon\.js/
    ]
    loaders: [
      lessLoader
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: ['stage-3']}}
      { test: /\.json$/,   loader: 'json-loader' }
      { test: /\.coffee$/, loaders: LOADERS.concat("coffee-loader") }
      { test: /\.cjsx$/,   loaders: LOADERS.concat("coffee-jsx-loader") }
      { test: /\.(png|jpg|svg)/, loader: 'file-loader?name=[name].[ext]'}
      { test: /\.(woff|woff2|eot|ttf)/, loader: "url-loader?limit=30000&name=[name]-[hash].[ext]" }
    ]
    postLoaders: POST_LOADERS
  resolve:
    extensions: ['', '.js', '.json', '.coffee', '.cjsx']

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
