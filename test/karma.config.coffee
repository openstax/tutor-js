webpack = require('webpack')

module.exports = (config) ->
  config.set
    basePath: '../'
    frameworks: ['mocha', 'chai', 'chai-sinon']
    browsers: ['PhantomJS']
    reporters: ['mocha', 'coverage']

    files: [
      'test/all-tests.coffee'
    ]

    preprocessors:
      'src/**/*.cjsx': ['webpack', 'coverage']
      'test/*':  ['webpack', 'coverage']

    coverageReporter:
      type: 'text'
      # type: 'html' # will create html report in ./coverage directory



    webpack:
      resolve:
        extensions: ['', '.js', '.json', '.coffee', '.cjsx']
      module:
        loaders: [
          { test: /\.coffee$/, loader: "coffee-loader"     }
          { test: /\.json$/,   loader: "json-loader"       }
          { test: /\.cjsx$/,   loader: "coffee-jsx-loader" }
        ]

      postLoaders: [
        {
          test: /\.(cjsx|coffee)$/
          loader: 'istanbul-instrumenter'
          exclude: /(node_modules|resources|bower_components)/
        }
      ]

    webpackMiddleware:
      stats:
        colors: true

    logLevel: config.LOG_DEBUG

    plugins:[
      require("karma-coverage")
      require("karma-mocha")
      require("karma-webpack")
      require("karma-mocha-reporter")
      require("karma-phantomjs-launcher")
      require("karma-chai")
      require("karma-chai-sinon")
    ]
