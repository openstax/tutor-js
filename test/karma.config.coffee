module.exports = (config) ->
  config.set
    basePath: '../'
    frameworks: ['mocha']
    browsers: ['PhantomJS']
    reporters: ['mocha']
    # plugins: ['karma-mocha', 'karma-phantomjs-launcher', 'karma-mocha-reporter']
    files: [
      {pattern: 'test/phantomjs-shims.js'}
      {pattern: '.tmp/all-tests.js'}
    ]
