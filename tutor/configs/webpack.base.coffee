baseConfig = require './base'

module.exports =
  entry:
    tutor: [
      "#{baseConfig.basePath}/index.coffee",
      "#{baseConfig.basePath}/resources/styles/tutor.less"
    ]
    qa: [
      "#{baseConfig.basePath}/src/qa.coffee"
    ]
