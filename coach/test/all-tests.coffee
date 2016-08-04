testsContext = require.context("./", true, /\.spec\.(cjsx|coffee)$/)
testsContext.keys().forEach(testsContext)
