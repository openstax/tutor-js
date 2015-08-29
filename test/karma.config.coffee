webpack = require('webpack')

module.exports = (config) ->
  config.set
    basePath: '../'
    frameworks: ['mocha', 'chai', 'chai-sinon', 'phantomjs-shim']
    browsers: ['PhantomJS']
    reporters: ['mocha', 'coverage']

    files: [
      'test/all-tests.coffee'
      'test/all-source-files.coffee'
    ]

    preprocessors:
      'src/**/*.{coffee,cjsx}': ['webpack', 'sourcemap', 'coverage']
      'test/*':  ['webpack', 'sourcemap', 'coverage']

    coverageReporter:
      type: 'text'
      # type: 'html' # will create html report in ./coverage directory

    webpack:
      devtool: 'eval-source-map'
      resolve:
        extensions: ['', '.js', '.json', '.coffee', '.cjsx']
      module:
        loaders: [
          { test: /\.coffee$/, loader: "coffee-loader"     }
          { test: /\.json$/,   loader: "json-loader"       }
          { test: /\.cjsx$/,   loader: "coffee-jsx-loader" }
        ]
        preLoaders: [{
            test: /\.(cjsx|coffee)$/
            exclude: /(node_modules|resources|bower_components)/
            loader: "coffeelint-loader"
        }]
        postLoaders: [
          {
            test: /\.(cjsx|coffee)$/
            loader: 'istanbul-instrumenter'
            exclude: /(test|node_modules|resources|bower_components)/
          }
        ]

    # usefull for debugging Karma config
    # logLevel: config.LOG_DEBUG

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
      require("karma-phantomjs-shim")
      require("karma-coverage")
      require("karma-mocha")
      require("karma-webpack")
      require("karma-mocha-reporter")
      require("karma-phantomjs-launcher")
      require("karma-chai")
      require("karma-chai-sinon")
      require("karma-sourcemap-loader")
    ]
