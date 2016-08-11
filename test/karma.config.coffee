_ = require 'underscore'
makeWebpackConfig = require '../configs/webpack/makeConfig'

KarmaConfig =

  basePath: '../'
  frameworks: ['mocha', 'chai', 'chai-sinon', 'phantomjs-shim']
  browsers: ['PhantomJS']
  reporters: ['mocha']

  # Ideally, would be able to use patterns instead...
  files: [
    'test/all-source-files.coffee'
    'test/all-tests.coffee'
  ]

  preprocessors:
    'src/**/*.{coffee,cjsx}': ['webpack', 'sourcemap']
    'test/**/*':  ['webpack', 'sourcemap']

  webpack: makeWebpackConfig(process.env.OX_PROJECT, 'karma')

  webpackMiddleware:
    # True will suppress error shown in console, so it has to be set to false.
    quiet: false
    # Suppress everything except error, so it has to be set to false as well
    # to see success build.
    noInfo: false
    stats:
      # Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false


  plugins:[
    require('karma-phantomjs-shim')
    require('karma-mocha')
    require('karma-webpack')
    require('karma-mocha-reporter')
    require('karma-phantomjs-launcher')
    require('karma-chrome-launcher')
    require('karma-chai')
    require('karma-chai-sinon')
    require('karma-sourcemap-loader')
  ]

module.exports = (config) ->
  config.set(KarmaConfig)
