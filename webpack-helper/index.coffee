# Lodash deep merges properly.  Using lodash instead of underscore here is intentional.
_ = require 'lodash'
{base, optionConfigs, devServer} = require './configs'

mergeWebpackConfig = (baseConfig, config) ->
  _.merge {}, baseConfig, config, (a, b) ->
    if _.isArray(a)
      return a.concat(b)

makeConfig = (config, options) ->
  defaultOptions =
    isProduction: false
    minify: false
    excludeExternals: true

  {isProduction} = options = _.defaults({}, options, defaultOptions)
  options.isDev = not isProduction

  # merge in minify and externals with base as declared in options
  baseOptions = _.reduce options, (mergedOptions, isOn, option) ->
    # continue with reduce if option is not on
    return mergedOptions unless isOn
    # if option is on, merge the options
    mergeWebpackConfig(mergedOptions, optionConfigs[option])
  , base

  # merge in option configs with base config
  mergeWebpackConfig(baseOptions, config)

module.exports = {makeConfig, otherConfigs: {devServer}}
