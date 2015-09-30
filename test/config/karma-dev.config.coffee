{webpack} = require './karma.common'
_ = require 'underscore'
commonConfig = require './karma.common'

module.exports = (karmaConfig) ->

  config = _.extend(commonConfig, {
    browsers: ['Chrome']
    reporters: ['nyan']
    nyanReporter:
      suppressErrorReport: false
      suppressErrorHighlighting: true
      numberOfRainbowLines: 5
  })

  karmaConfig.set(config)
