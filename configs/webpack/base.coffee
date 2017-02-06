path = require 'path'

_ = require 'lodash'
webpack = require 'webpack'
ExtractTextPlugin = require 'extract-text-webpack-plugin'

LOADERS =
  babel: 'babel'
  json: 'json'
  file: 'file?name=[name].[ext]'
  url: 'url?limit=30000&name=[name]-[hash].[ext]'
  coffee: 'coffee'
  cjsx: 'coffee-jsx'
  lessCompiled: ExtractTextPlugin.extract('css!less')
  style: 'style'
  css: 'css'
  less: 'less'

RESOLVABLES =
  js: { test: /\.js$/, exclude: /node_modules/, loader: LOADERS.babel}
  json: { test: /\.json$/,   loader: LOADERS.json }
  jsx: { test: /\.jsx$/, loader: LOADERS.babel}
  coffee: { test: /\.coffee$/,  loader: LOADERS.coffee }
  cjsx: { test: /\.cjsx$/,    loader: LOADERS.cjsx }

STATICS =
  json: RESOLVABLES.json
  image: { test: /\.(png|jpg|svg|gif)/, loader: LOADERS.file }
  font: { test: /\.(woff|woff2|eot|ttf)/, loader: LOADERS.url }

BASE_BUILD =
  # TODO
  #   Loading .js through babel is not yet working.
  #   It doesn't seem to exclude node_modules,
  #   will need to eventually for ES6 support.
  # js: RESOLVABLES.js
  jsx: RESOLVABLES.jsx
  coffee: RESOLVABLES.coffee
  cjsx: RESOLVABLES.cjsx
  less: { test: /\.less$/,    loader: LOADERS.lessCompiled }

DEV_LOADERS = ['react-hot-loader/webpack']

BASE_DEV_LOADERS = _.map(BASE_BUILD, (loaderConfig, type) ->
  config = _.pick(loaderConfig, 'test')
  if type is 'less'
    config.loaders = DEV_LOADERS.concat(LOADERS.style, LOADERS.css, LOADERS.less)
  else
    config.loaders = DEV_LOADERS.concat(loaderConfig.loader)

  config
)

BASE_BUILD_LOADERS = _.values(BASE_BUILD)

RESOLVABLE_EXTENSIONS = _.union([''], _.chain(RESOLVABLES).keys().map((ext) -> ".#{ext}").value())

# base config, true for all builds no matter what conditions
BASE_CONFIG =
  cache: true
  devtool: 'cheap-module-eval-source-map'
  resolve:
    extensions: RESOLVABLE_EXTENSIONS
  output:
    filename: '[name].js'
    # path: defined in project/environment specific
    # publicPath: defined in project/environment specific
  module:
    noParse: [
      /\/sinon\.js/
      /braintree-web/  # https://github.com/braintree/braintree-web/issues/52
    ]
    loaders: _.values(STATICS)
  plugins: [
    new webpack.optimize.DedupePlugin()
  ]

KARMA_BASE_CONFIG =
  devtool: 'cheap-module-eval-source-map'
  resolve:
    extensions: RESOLVABLE_EXTENSIONS
  node:
    fs: 'empty'
  module:
    noParse: [
      /\/sinon\.js/
    ]
    loaders: _.values(RESOLVABLES)
    preLoaders: [{
      test: /\.(cjsx|coffee)$/
      loader: 'coffeelint'
      exclude: /(node_modules|resources)/
    }]
  externals:
    'sinon': true
    'react/addons': true
    'react/lib/ExecutionEnvironment': true
    'react/lib/ReactContext': true

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
  path: "#{projectConfig.basePath}/dist"
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
  # output.path = "#{projectConfig.basePath}/dist"
  {styleFilename} = projectConfig
  styleFilename ?= '[name].min.css'

  productionBase =
    output: output
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
  host = process.env.OX_PROJECT_HOST or projectConfig.host or 'localhost'
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
