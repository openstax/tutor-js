path = require 'path'

webpack = require 'webpack'
ExtractTextPlugin = require 'extract-text-webpack-plugin'
webpackUMDExternal = require 'webpack-umd-external'

_ = require 'lodash'


# base config, true for all builds no matter what conditions
BASE_CONFIG =
  cache: true
  devtool: 'cheap-module-eval-source-map'
  output:
    filename: '[name].js'
    # path: defined in project/environment specific
    # publicPath: defined in project/environment specific
  module:
    noParse: [
      /\/sinon\.js/
    ]
    loaders:   [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader', query: { presets: ['stage-3']}}
      { test: /\.json$/,   loader: 'json-loader' }
      { test: /\.(png|jpg|svg|gif)/, loader: 'file-loader?name=[name].[ext]'}
      { test: /\.(woff|woff2|eot|ttf)/, loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]' }
    ]
  resolve:
    extensions: ['', '.js', '.json', '.coffee', '.cjsx']
  plugins: [
    new webpack.optimize.DedupePlugin()
  ]

KARMA_BASE_CONFIG =
  devtool: 'cheap-module-eval-source-map'
  node:
    fs: "empty"
  resolve:
    extensions: ['', '.js', '.json', '.coffee', '.cjsx']
  module:
    noParse: [
      /\/sinon\.js/
    ]
    loaders: [
      { test: /\.coffee$/, loader: "coffee"     }
      { test: /\.json$/,   loader: "json"       }
      { test: /\.cjsx$/,   loader: "coffee-jsx" }
    ]
    preLoaders: [{
      test: /\.(cjsx|coffee)$/
      loader: "coffeelint"
      exclude: /(node_modules|resources|bower_components)/
    }]

BASE_BUILD_LOADERS =
  [
    # less, coffee, and cjsx will have ["react-hot"]
    # added in dev config.
    { test: /\.less$/,   loader: ExtractTextPlugin.extract('css!less') }
    { test: /\.coffee$/, loader: 'coffee' }
    { test: /\.cjsx$/,   loader: 'coffee-jsx' }
  ]

DEV_LOADERS = ['react-hot'] #, 'webpack-module-hot-accept']

BASE_DEV_LOADERS =
  [
    { test: /\.coffee$/, loaders: DEV_LOADERS.concat('coffee')}
    { test: /\.cjsx$/,   loaders: DEV_LOADERS.concat('coffee-jsx')}
    { test: /\.less$/,   loaders: DEV_LOADERS.concat('style', 'css', 'less') }
  ]

mergeWebpackConfigs = ->

  mergeArrays = (a, b) ->
    if _.isArray(a)
      return a.concat(b)

  mergeArgs = _.chain(arguments).toArray().unshift({}).push(mergeArrays).value()
  _.mergeWith.apply(null, mergeArgs)

# TODO handle if project doesn't exist
loadProjectBaseConfig = (projectName) ->
  projectBaseConfig = require "../../#{projectName}/configs/base"

  _.extend({basePath: projectName}, projectBaseConfig)


makeBuildOutputs = (projectConfig) ->
  path: "dist"
  publicPath: "/assets/"

makeBuildPlugins = (projectConfig) ->
  {styleFilename} = projectConfig

  styleFilename ?= '[name].css'

  [new ExtractTextPlugin(styleFilename)]


makePathsBase = (projectConfig) ->
  {basePath} = projectConfig

  pathConfigs =
    resolve:
      root: [
        path.resolve(basePath)
        path.resolve(basePath, 'src')
        path.resolve(basePath, 'api')
      ]
      alias:
        'shared': path.resolve('shared')

  pathConfigs

makeDebugBase = (projectConfig) ->
  # omits minification and using production build of react.
  debugBase =
    output: makeBuildOutputs(projectConfig)
    module:
      loaders: BASE_BUILD_LOADERS
    plugins: makeBuildPlugins(projectConfig)

makeProductionBase = (projectConfig) ->

  output = makeBuildOutputs(projectConfig)

  # rename to minified
  output.filename = '[name].min.js'
  output.path = "#{projectConfig.basePath}/dist"
  {styleFilename} = projectConfig
  styleFilename ?= '[name].min.css'

  productionBase =
    output: output
    devtool: 'source-map'
    module:
      loaders: BASE_BUILD_LOADERS
    plugins: makeBuildPlugins({styleFilename}).concat([
      # Minify
      new webpack.optimize.UglifyJsPlugin(minimize: true)

      # Use the production version of React (no warnings/runtime checks)
      new webpack.DefinePlugin(
        'process.env':
          NODE_ENV: JSON.stringify('production')
      )
    ])

makeProductionWithCoverageBase = (projectConfig) ->
  productionBase = makeProductionBase(projectConfig)
  postLoaders = [
    { test: /\.coffee$/, loaders: ["istanbul-instrumenter"] }
    { test: /\.cjsx$/, loaders: ["istanbul-instrumenter"] }
  ]
  mergeWebpackConfigs(productionBase, {postLoaders})

makeDevelopmentBase = (projectConfig) ->
  host = projectConfig.host or 'localhost'
  servePath = "http://#{host}:#{projectConfig.devPort}"
  publicPath = "#{servePath}/dist/"
  outputPath = "#{projectConfig.basePath}/"

  developmentBase =
    output:
      path: 'dist'
      publicPath: publicPath
    module:
      loaders: BASE_DEV_LOADERS
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
    devServer:
      contentBase: "#{projectConfig.basePath}/"
      outputPath: outputPath
      publicPath: publicPath
      historyApiFallback: true
      inline: true
      port: projectConfig.devPort
      # It suppress error shown in console, so it has to be set to false.
      quiet: false
      progress: true
      # It suppress everything except error, so it has to be set to false as well
      # to see success build.
      noInfo: false
      host: "#{host}",
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

  developmentBase

makeEnvironmentBase =
  debug: makeDebugBase
  production: makeProductionBase
  productionWithCoverage: makeProductionWithCoverageBase
  development: makeDevelopmentBase
  karma: ->
    KARMA_BASE_CONFIG

ENVIRONMENTS = _.keys(makeEnvironmentBase)

getEnvironmentName = (environmentName) ->
  if _.includes(ENVIRONMENTS, environmentName)
    environmentName
  else
    'development'

makeBaseForEnvironment = (environmentName) ->
  environmentName = getEnvironmentName(environmentName)
  makeEnvironmentBase[environmentName]

ENVIRONMENT_ALIASES =
  productionWithCoverage: 'production'

module.exports =
  mergeWebpackConfigs: mergeWebpackConfigs
  BASE_CONFIG: BASE_CONFIG
  loadProjectBaseConfig: loadProjectBaseConfig
  makePathsBase: makePathsBase
  makeBaseForEnvironment: makeBaseForEnvironment
  getEnvironmentName: getEnvironmentName
  ENVIRONMENT_ALIASES: ENVIRONMENT_ALIASES
