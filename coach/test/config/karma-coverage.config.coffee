{webpack} = require './karma.common'
_ = require 'underscore'
commonConfig = require './karma.common'

module.exports = (karmaConfig) ->

  config = _.extend({

    # usefull for debugging Karma config
    # logLevel: karmaConfig.LOG_DEBUG

    coverageReporter:
      type: 'text'

  }, commonConfig)

  config.reporters.push('coverage')

  for spec, processors of config.preprocessors
    processors.push('coverage')

  config.webpack.module.postLoaders = [{
    test: /\.(cjsx|coffee)$/
    loader: 'istanbul-instrumenter'
    exclude: /(test|node_modules|resources|bower_components)/
  }]

  config.plugins.push(
    require('karma-coverage')
  )

  karmaConfig.set(config)
