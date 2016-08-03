testsContext = require.context("../tutor/src", true, /\.(cjsx|coffee)$/)
testsContext.keys().forEach(testsContext)
