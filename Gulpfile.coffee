gulp            = require 'gulp'

gulp.task 'try', ->
  makeConfig = require './webpack.config'

  config = makeConfig('tutor', 'development')
  console.log(config)
