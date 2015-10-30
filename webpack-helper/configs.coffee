webpack = require 'webpack'
ExtractTextPlugin = require 'extract-text-webpack-plugin'
webpackUMDExternal = require 'webpack-umd-external'

DEV_PORT = process.env['PORT'] or 8000
DEV_LOADERS = ['react-hot', 'webpack-module-hot-accept']

# base config, true for all builds no matter what conditions
base =
  cache: true
  output:
    filename: '[name].js'
    libraryTarget: 'umd'
    library: 'OpenStaxReactComponents'
    umdNamedDefine: true
  module:
    noParse: [
      /\/sinon\.js/
    ]
    loaders:   [
      { test: /\.json$/,   loader: 'json-loader' }
      { test: /\.(png|jpg|svg)/, loader: 'file-loader?name=[name].[ext]'}
      { test: /\.(woff|woff2|eot|ttf)/, loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]' }
    ]
  resolve:
    extensions: ['', '.js', '.json', '.coffee', '.cjsx']
  plugins: [
    # TODO check what plugins are need
    # new webpack.NormalModuleReplacementPlugin(/\/react\/lib\/cloneWithProps/, '../../react-clonewithprops/index.js')
    new ExtractTextPlugin('main.css')
    new webpack.optimize.DedupePlugin()
  ]

# option configs, gets merged with base depending on build
optionConfigs =
  excludeExternals:
    externals: webpackUMDExternal(
      react: 'React'
      'react/addons': 'React.addons'
      'react-bootstrap': 'ReactBootstrap'
      'react-scroll-components': 'ReactScrollComponents'
      underscore: '_'
    )

  minify:
    plugins: [
      new webpack.optimize.UglifyJsPlugin({minimize: true})
    ]

  isProduction:
    output:
      path: './dist/'
      publicPath: '/assets/'
    module:
      loaders: [
        { test: /\.coffee$/, loaders: ['coffee-loader']}
        { test: /\.cjsx$/,   loaders: ['coffee-jsx-loader']}
        { test: /\.less$/,   loader: ExtractTextPlugin.extract('css!less') }
      ]
    plugins: [
      # Use the production version of React (no warnings/runtime checks)
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } })
      new webpack.ProvidePlugin({
        React: 'react/addons'
        _: 'underscore'
        BS: 'react-bootstrap'
      })
    ]

  isDev:
    devtool: 'source-map'
    entry:
      demo: [
        "./node_modules/webpack-dev-server/client/index.js?http://localhost:#{DEV_PORT}"
        'webpack/hot/dev-server'
      ]
    output:
      path: '/'
      publicPath: "http://localhost:#{DEV_PORT}/dist/"
    module:
      loaders: [
        { test: /\.coffee$/, loaders: DEV_LOADERS.concat('coffee-loader')}
        { test: /\.cjsx$/,   loaders: DEV_LOADERS.concat('coffee-jsx-loader')}
        { test: /\.less$/,   loaders: DEV_LOADERS.concat('style-loader', 'css-loader', 'less-loader') }
      ]
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
    devServer:
      contentBase: './'
      publicPath: "http://localhost:#{DEV_PORT}/dist/"
      historyApiFallback: true
      inline: true
      port: DEV_PORT
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

module.exports = {base, optionConfigs}
