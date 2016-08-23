webpack = require 'webpack'

module.exports =
  output:
    libraryTarget: 'umd'
    library: 'OpenStaxConceptCoach'
    umdNamedDefine: true
