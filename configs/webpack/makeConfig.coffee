{
  BASE_CONFIG,
  mergeWebpackConfigs,
  makePathsBase,
  makeBaseForEnvironment,
  getEnvironmentName,
  ENVIRONMENT_ALIASES
} = require './base'

conditionalRequire = (path) ->
  try
    require path
  catch e
    {}

makeConfig = (projectName, environmentName) ->
  environmentName = getEnvironmentName(environmentName)
  environmentFilename = if ENVIRONMENT_ALIASES[environmentName]
    ENVIRONMENT_ALIASES[environmentName]
  else
    environmentName

  projectWebpackBaseConfig =
    conditionalRequire("../../#{projectName}/configs/webpack.base")
  projectWebpackEnvironmentConfig =
    conditionalRequire(
      "../../#{projectName}/configs/webpack.#{environmentFilename}"
    )

  if environmentName is 'karma'
    configs = [
      makePathsBase(),
      makeBaseForEnvironment(environmentName),
      projectWebpackEnvironmentConfig
    ]
  else
    configs = [
      BASE_CONFIG,
      makePathsBase(),
      makeBaseForEnvironment(environmentName),
      projectWebpackBaseConfig,
      projectWebpackEnvironmentConfig
    ]

  mergeWebpackConfigs.apply(null, configs)

module.exports = makeConfig
