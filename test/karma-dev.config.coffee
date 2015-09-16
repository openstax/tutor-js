{webpack} = require './karma.common'
_ = require 'underscore'
commonConfig = require './karma.common'

module.exports = (karmaConfig) ->

  config = _.extend(commonConfig, {
    browsers: ['Chrome']
  })
  console.log(config)

  karmaConfig.set(config)
