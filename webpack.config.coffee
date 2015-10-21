{makeConfig, otherConfigs} = require './webpack-helper'

getWebpackConfig = (name, isProduction) ->
  configs =
    main: [{
        entry: './index'
        output:
          filename: 'main.js'
      }, {isProduction}]
    fullBuild: [{
        entry: './full-build'
        output:
          filename: 'full-build.js'
      }, {isProduction, excludeExternals: false}]
    'main.min': [{
        entry: './index'
        output:
          filename: 'main.min.js'
      }, {isProduction, minify: true}]
    'fullBuild.min': [{
        entry: './full-build'
        output:
          filename: 'full-build.min.js'
      }, {isProduction, excludeExternals: false, minify: true}]

  if configs[name]?
    makeConfig.apply(null, configs[name])
  else
    otherConfigs[name]

module.exports = getWebpackConfig
