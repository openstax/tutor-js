{
  BASE_CONFIG,
  loadProjectBaseConfig,
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

  projectBaseConfig = loadProjectBaseConfig(projectName)

  projectWebpackBaseConfig =
    conditionalRequire("../../#{projectName}/configs/webpack.base")
  projectWebpackEnvironmentConfig =
    conditionalRequire(
      "../../#{projectName}/configs/webpack.#{environmentFilename}"
    )

  mergeWebpackConfigs(
    BASE_CONFIG,
    makePathsBase(projectBaseConfig),
    makeBaseForEnvironment(environmentName)(projectBaseConfig),
    projectWebpackBaseConfig,
    projectWebpackEnvironmentConfig
  )

module.exports = makeConfig
