baseConfig = {externals} = require './webpack.config.base'
webpack = require 'webpack'
_ = require 'lodash'

mergeWebpackConfig = (config) ->
  _.merge {}, _.omit(baseConfig, 'externals'), config, (a, b) ->
    if _.isArray(a)
      return a.concat(b)

module.exports =
  main: mergeWebpackConfig(
      entry: './index'
      externals: externals
      output:
        filename: 'main.js'
    )
  fullBuild: mergeWebpackConfig(
      entry: './full-build'
      output:
        filename: 'full-build.js'
    )
  'main.min': mergeWebpackConfig(
      entry: './index'
      externals: externals
      output:
        filename: 'main.min.js'
      plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
      ]
    )
  'fullBuild.min': mergeWebpackConfig(
      entry: './full-build'
      output:
        filename: 'full-build.min.js'
      plugins: [
        new webpack.optimize.UglifyJsPlugin({minimize: true})
      ]
    )
