testsContext = require.context("test", true, /\.spec\.(cjsx|coffee)$/)
testsContext.keys().forEach(testsContext)
