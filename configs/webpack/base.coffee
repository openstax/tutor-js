path = require 'path'

_ = require 'lodash'
webpack = require 'webpack'
ExtractTextPlugin = require 'extract-text-webpack-plugin'


LOADERS =
  babel:  'babel-loader'
  file:   'file-loader?name=[name].[ext]'
  url:    'url-loader?limit=30000&name=[name]-[hash].[ext]'
  coffee: 'coffee-loader'
  cjsx:   'coffee-jsx-loader'
  style:  'style-loader'
  css:    'css-loader?minimize=true'
  less:   'less-loader'

RESOLVABLES =
  js:     { test: /\.js$/,     use: LOADERS.babel, exclude: /node_modules/}
  jsx:    { test: /\.jsx$/,    use: LOADERS.babel  }
  coffee: { test: /\.coffee$/, use: LOADERS.coffee }
  cjsx:   { test: /\.cjsx$/,   use: LOADERS.cjsx   }

STATICS =
  image: { test: /\.(png|jpg|svg|gif)/,    use: [ LOADERS.file ] }
  font:  { test: /\.(woff|woff2|eot|ttf)/, use: [ LOADERS.url  ] }

BASE_BUILD =
  # TODO
  #   Loading .js through babel is not yet working.
  #   It doesn't seem to exclude node_modules,
  #   will need to eventually for ES6 support.
  # js: RESOLVABLES.js
  jsx:    RESOLVABLES.jsx
  coffee: RESOLVABLES.coffee
  cjsx:   RESOLVABLES.cjsx
  less: {
    test: /\.less$/, use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [ LOADERS.css, LOADERS.less ]
    })
  }

DEV_LOADERS = ['react-hot-loader/webpack']

BASE_DEV_LOADER_RULES = _.map(BASE_BUILD, (loaderConfig, type) ->
  config = _.pick(loaderConfig, 'test')
  config.use ||= []

  if type is 'less'
    config.use = config.use.concat DEV_LOADERS.concat(LOADERS.style, LOADERS.css, LOADERS.less)
  else
    config.use = loaderConfig.use
  config
)

BASE_BUILD_LOADERS = _.values(BASE_BUILD)

RESOLVABLE_EXTENSIONS = _.union(_.chain(RESOLVABLES).keys().map((ext) -> ".#{ext}").value())

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
    ]
    rules: _.values(STATICS)
  plugins: [

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
  path: "#{projectConfig.basePath}/dist"
  publicPath: "/assets/"

makeBuildPlugins = (projectConfig) ->
  {styleFilename} = projectConfig

  styleFilename ?= '[name].css'

  [
    new ExtractTextPlugin(
      styleFilename
    )
  ]

makePathsBase = (projectConfig) ->
  {basePath} = projectConfig

  pathConfigs =
    resolve:
      modules: [
        'node_modules'
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
      rules: BASE_BUILD_LOADERS
    plugins: makeBuildPlugins(projectConfig)

makeProductionBase = (projectConfig) ->

  output = makeBuildOutputs(projectConfig)

  # rename to minified
  output.filename = '[name].min.js'
  {styleFilename} = projectConfig
  styleFilename ?= '[name].min.css'

  productionBase =
    output: output
    devtool: 'source-map'
    module:
      rules: BASE_BUILD_LOADERS
    plugins: makeBuildPlugins({styleFilename}).concat([
      # Minify
      # https://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
      # https://github.com/webpack/webpack/issues/2704
      new webpack.optimize.UglifyJsPlugin(
        mangle: false
        comments: false
        sourceMap: true
      )

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
    context: path.resolve(__dirname, '../../', projectConfig.basePath)
    output:
      path: '/'
      publicPath: publicPath
    module:
      rules: BASE_DEV_LOADER_RULES
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
    devServer:
      contentBase: "#{projectConfig.basePath}/"

      publicPath: publicPath
      historyApiFallback: true
      inline: true
      port: projectConfig.devPort
      # It suppress error shown in console, so it has to be set to false.
      quiet: false
      # progress: true
      # It suppress everything except error, so it has to be set to false as well
      # to see success build.
      noInfo: false
      host: "#{host}",
      filename: '[name].js'
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
