testsContext = require.context("../src", true, /\.(cjsx|coffee)$/)
testsContext.keys().forEach(testsContext)
