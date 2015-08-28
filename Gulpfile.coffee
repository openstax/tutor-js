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
_ = require 'underscore'

KARMA_CONFIG =
  configFile: __dirname + '/test/karma.config.coffee'
  singleRun: false


handleErrors = (title) => (args...) =>
  # TODO: Send error to notification center with gulp-notify
  console.error(title, args...)
  # Keep gulp from hanging on this task
  @emit('end')


# -----------------------------------------------------------------------
#  Build Javascript and Styles using webpack
# -----------------------------------------------------------------------


gulp.task '_build', (done) ->
  webpack(webpackConfig, (err, stats) ->
    throw new gutil.PluginError("webpack", err) if err
    gutil.log("[webpack]", stats.toString({
      # output options
    }))
    done()
  )



# -----------------------------------------------------------------------
#  Production
# -----------------------------------------------------------------------
#
# JS/CSS Minification, build an archive file
#

gulp.task '_minJS', ['_build'], ->
  destDir = './dist/'
  gulp.src('./dist/tutor.js')
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(destDir))

gulp.task '_minCSS', ['_build'], ->
  destDir = './dist/'
  gulp.src('./dist/tutor.css')
    # TODO: Remove the `procesImport:false` and host the fonts locally
    .pipe(minifyCSS({keepBreaks:true, processImport:false}))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(destDir))

gulp.task '_min', ['_minJS', '_minCSS']

gulp.task '_rev', ['_min'], ->
  destDir = './dist/'
  gulp.src('./dist/*.min.*')
    .pipe(rev())
    .pipe(gulp.dest(destDir))
    .pipe(rev.manifest())
    .pipe(gulp.dest(destDir))

gulp.task '_archive', ['_cleanArchive', '_build', '_min', '_rev'], ->
  gulp.src([
    './dist/tutor.min-*.js',
    './dist/tutor.min-*.css',
    './dist/fonts/*',
    './dist/**/*.{svg,png,jpg}'], base: './dist')
    .pipe(tar('archive.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist/'))

gulp.task '_cleanArchive', (done) ->
  del(['./dist/*.tar', './dist/*.gz'], done)


# -----------------------------------------------------------------------
#  Development
# -----------------------------------------------------------------------
#
# Start a webserver, watch files, lint files
#

gulp.task '_watchLint', ['lint'], ->
  gulp.watch 'src/**/*.{cjsx,coffee}', ['lint']
  gulp.watch 'test/**/*.coffee', ['lint']
  gulp.watch '*.coffee', ['lint']


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

# same as TDD ?
gulp.task 'dev', ['tdd']

gulp.task 'tdd', ['_webserver', '_karma']
