# Somehow this pulls in a test that crashes phantomjs, which in turn causes karma to exit with status 1
# testsContext = require.context("../tutor/test", true, /\.spec\.(cjsx|coffee)$/)
# testsContext.keys().forEach(testsContext)

require 'test/all-tests'
