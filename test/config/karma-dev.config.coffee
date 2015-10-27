{webpack} = require './karma.common'
_ = require 'underscore'
commonConfig = require './karma.common'

module.exports = (karmaConfig) ->

  config = _.extend(commonConfig, {
    browsers: [process.env.KARMA_BROWSER or 'PhantomJS']
  })

  karmaConfig.set(config)
