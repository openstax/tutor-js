baseConfig = require './base'
path = require 'path'

module.exports =
  entry:
    tutor: [
      "index.coffee",
      "resources/styles/tutor.less"
    ]
    qa: [
      "src/qa.coffee"
    ]
  resolve:
    root: [
      path.resolve(__dirname, '../')
      path.resolve(__dirname, '../src')
      path.resolve(__dirname, '../api')
    ]
