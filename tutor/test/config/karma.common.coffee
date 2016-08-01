_ = require 'underscore'

module.exports =
  basePath: '../../'
  frameworks: ['mocha', 'chai', 'chai-sinon', 'phantomjs-shim']
  browsers: ['PhantomJS']
  reporters: ['mocha']

  files: [
    'test/all-tests.coffee'
    'test/all-source-files.coffee'
  ]

  preprocessors:
    'src/**/*.{coffee,cjsx}': ['webpack', 'sourcemap']
    'test/**/*':  ['webpack', 'sourcemap']

  webpack:
    devtool: 'eval-source-map'
    resolve:
      extensions: ['', '.js', '.json', '.coffee', '.cjsx']
    module:
      noParse: [
        /\/sinon\.js/
      ]
      loaders: [
        { test: /\.coffee$/, loader: "coffee-loader"     }
        { test: /\.json$/,   loader: "json-loader"       }
        { test: /\.cjsx$/,   loader: "coffee-jsx-loader" }
      ]
      preLoaders: [{
        test: /\.(cjsx|coffee)$/
        loader: "coffeelint-loader"
        exclude: /(node_modules|resources|bower_components)/
      }]

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
    require('karma-nyan-reporter')
    require('karma-phantomjs-launcher')
    require('karma-chrome-launcher')
    require('karma-chai')
    require('karma-chai-sinon')
    require('karma-sourcemap-loader')
  ]
