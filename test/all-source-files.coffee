sourceFiles = require.context("src", true, /\.(cjsx|coffee)$/)
sourceFiles.keys().forEach(sourceFiles)