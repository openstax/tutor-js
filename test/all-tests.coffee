# Somehow this pulls in a test that crashes phantomjs, which in turn causes karma to exit with status 1
# testsContext = require.context("../tutor/test", true, /\.spec\.(cjsx|coffee)$/)
# testsContext.keys().forEach(testsContext)
fs = require 'fs'

fs.access 'test/some-tests', (err) ->
  if err?
    require 'test/all-tests'
  else
    require 'test/some-tests'
