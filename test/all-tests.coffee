# Somehow this pulls in a test that crashes phantomjs, which in turn causes karma to exit with status 1
# testsContext = require.context("../tutor/test", true, /\.spec\.(cjsx|coffee)$/)
# testsContext.keys().forEach(testsContext)
try
  require 'test/some-tests'
catch e
  # I know, this is gross, but it seems to be the way to
  # catch specifically if 'some-tests' does not exist,
  # as opposed to another module we might be requiring within some-tests.
  if e.message is 'Cannot find module "test/some-tests"'
    require 'test/all-tests'
