{BASE_CONFIG, mergeWebpackConfigs, makeBaseForEnvironment} = require './base'

conditionalRequire = (path) ->
  try
    require path
  catch e
    {}

makeConfig = (projectName, environmentName = 'development') ->
  projectBaseConfig = require "../../#{projectName}/configs/base"
  projectWebpackBaseConfig = conditionalRequire "../../#{projectName}/configs/webpack.base"
  projectWebpackEnvironmentConfig = conditionalRequire "../../#{projectName}/configs/webpack.#{environmentName}"

  mergeWebpackConfigs(
    BASE_CONFIG,
    makeBaseForEnvironment(environmentName)(projectBaseConfig),
    projectWebpackBaseConfig,
    projectWebpackEnvironmentConfig
  )

module.exports = makeConfig
