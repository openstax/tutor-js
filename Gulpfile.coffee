gulp            = require 'gulp'
webpack         = require 'webpack'
gutil           = require 'gulp-util'

makeConfig = require './webpack.config'

gulp.task 'try', ->

  config = makeConfig('tutor', 'development')
  console.log(config)

gulp.task 'serve', (done) ->
  config = makeConfig('tutor', 'development')

  webpack(config, (err, stats) ->
    throw new gutil.PluginError("webpack", err) if err
    gutil.log("[webpack]", stats.toString({
      # output options
    }))
    done()
  )
