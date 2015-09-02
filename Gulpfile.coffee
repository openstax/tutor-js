_ = require 'underscore'
gulp            = require 'gulp'
gutil           = require 'gulp-util'
karma           = require 'karma'
connect         = require 'gulp-connect'
cors            = require 'cors'
less            = require 'gulp-less-sourcemap'
source          = require 'vinyl-source-stream'
browserify      = require 'browserify'
watchify        = require 'watchify'
cjsxify         = require 'cjsxify'
browserifyShim  = require 'browserify-shim'
minifyCSS       = require 'gulp-minify-css'
uglify          = require 'gulp-uglify'
rev             = require 'gulp-rev'
del             = require 'del'
rename          = require 'gulp-rename'
flatten         = require 'gulp-flatten'
merge           = require 'merge-stream'
tar             = require 'gulp-tar'
gzip            = require 'gulp-gzip'
livereload      = require 'gulp-livereload'
coffeelint      = require 'gulp-coffeelint'
webpack         = require 'webpack'
webpackConfig   = require './webpack.config'
webpackServer   = require 'webpack-dev-server'
ExtractTextPlugin = require 'extract-text-webpack-plugin'

KARMA_CONFIG =
  configFile: __dirname + '/test/karma.config.coffee'
  singleRun: false

KARMA_COVERAGE_CONFIG =
  configFile: __dirname + '/test/karma-coverage.config.coffee'
  singleRun: false

handleErrors = (title) => (args...) =>
  # TODO: Send error to notification center with gulp-notify
  console.error(title, args...)
  # Keep gulp from hanging on this task
  @emit('end')


# -----------------------------------------------------------------------
#  Build Javascript and Styles using webpack
# -----------------------------------------------------------------------
gulp.task '_cleanDist', (done) ->
  del(['./dist/*'], done)

gulp.task '_build', ['_cleanDist'], (done) ->
  config = _.extend({}, webpackConfig, {
    plugins: [
      new ExtractTextPlugin("tutor.min.css")
    ]
  })
  config.output.filename = 'tutor.min.js'
  webpack(config, (err, stats) ->
    throw new gutil.PluginError("webpack", err) if err
    gutil.log("[webpack]", stats.toString({
      # output options
    }))
    done()
  )


# -----------------------------------------------------------------------
#  Production
# -----------------------------------------------------------------------

gulp.task '_archive', ['_build'], ->
  destDir = './dist'
  gulp.src("#{destDir}/*.min.*")
    .pipe(rev())
    .pipe(gulp.dest(destDir))
    .pipe(rev.manifest())
    .pipe(gulp.dest(destDir))

  gulp.src(["#{destDir}/*"], base: destDir)
    .pipe(tar('archive.tar'))
    .pipe(gzip())
    .pipe(gulp.dest(destDir))

# -----------------------------------------------------------------------
#  Development
# -----------------------------------------------------------------------
#
gulp.task '_karma', ->
  server = new karma.Server(KARMA_CONFIG)
  server.start()

gulp.task '_webserver', ->
  config = _.extend( {}, webpackConfig, {
    devtool: 'source-map'
    debug: true
    output:
      path: '/'
      filename: 'tutor.js'
      pubicPath: '/dist/'
  })
  new webpackServer(webpack(config), config.devServer)
  .listen(webpackConfig.devServer.port, 'localhost', (err) ->
    throw new gutil.PluginError("webpack-dev-server", err) if err
  )

# -----------------------------------------------------------------------
#  Public Tasks
# -----------------------------------------------------------------------
#
# External tasks called by various people (devs, testers, Travis, production)
#
# TODO: Add this to webpack
gulp.task 'lint', ->
  gulp.src(['./src/**/*.{cjsx,coffee}', './*.coffee', './test/**/*.{cjsx,coffee}'])
  .pipe(coffeelint())
  # Run through both reporters so lint failures are visible and Travis will error
  .pipe(coffeelint.reporter())
  .pipe(coffeelint.reporter('fail'))

gulp.task 'prod', ['_archive']

gulp.task 'serve', ['_webserver']

gulp.task 'test', ['lint'], (done) ->
  config = _.extend({}, KARMA_CONFIG, singleRun: true)
  server = new karma.Server(config)
  server.start()

gulp.task 'coverage', ->
  config = _.extend({}, KARMA_COVERAGE_CONFIG, singleRun: true)
  server = new karma.Server(config)
  server.start()

# same as TDD, not sure if anyone uses 'dev' ?
gulp.task 'dev', ['tdd']

gulp.task 'tdd', ['_cleanDist', '_webserver', '_karma']
