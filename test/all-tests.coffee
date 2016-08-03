testsContext = require.context("../tutor/test", true, /\.spec\.(cjsx|coffee)$/)
testsContext.keys().forEach(testsContext)
