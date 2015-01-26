gulp            = require 'gulp'
karma           = require 'karma'
webserver       = require 'gulp-webserver'
less            = require 'gulp-less'
source          = require 'vinyl-source-stream'
browserify      = require 'browserify'
watchify        = require 'watchify'
cjsxify         = require 'cjsxify'
# browserifyShim  = require 'browserify-shim'


handleErrors = (title) -> (args...)->
  # TODO: Send error to notification center with gulp-notify
  console.error(title, args...)
  # Keep gulp from hanging on this task
  @emit('end')


buildBrowserify = (srcPath, destDir, destFile, isWatching) ->
  args = (if isWatching then watchify.args else {})
  args.entries = [srcPath]
  args.extensions = ['.coffee', '.cjsx']
  args.debug = true if isWatching
  bundler = browserify(args)
  # bundler.transform(browserifyShim)
  bundler.transform(cjsxify)

  bundler = watchify(bundler, {}) if isWatching

  bundle = ->
    bundler
    .bundle()
    .on('error', handleErrors('Browserify error'))
    .pipe(source(destFile))
    .pipe(gulp.dest(destDir))

  bundler.on('update', bundle) if isWatching
  bundle()


build = (isWatching)->
  destDir = './'
  destFile = './dist/exercise.js'
  srcPath = './src/index.coffee'
  buildBrowserify(srcPath, destDir, destFile, isWatching)
  .on 'end', ->
    # Build the CSS file
    gulp.src('./style.less')
    .pipe(less())
    .pipe(gulp.dest(destDir))

# buildTests = (isWatching) ->
#   destDir = './.tmp' # This is referenced in ./test/karma.config.coffee
#   destFile = 'all-tests.js'
#   srcPath = './test/all-tests.coffee'
#   buildBrowserify(srcPath, destDir, destFile, isWatching)
#
#
# gulp.task 'test', (done) ->
#   buildTests(false)
#   .on 'end', ->
#     config =
#       configFile: __dirname + '/test/karma.config.coffee'
#       singleRun: true
#     karma.server.start(config, done)
#
#   return # Since this is async
#
# gulp.task 'tdd', (done) ->
#   buildTests(true)
#   .on 'end', ->
#     config =
#       configFile: __dirname + '/test/karma.config.coffee'
#     karma.server.start(config, done)
#
#   return # Since this is async


gulp.task 'dist', -> build(false)
gulp.task 'watch', -> build(true)
# gulp.task 'serve', ->
#   build(true)
#   config = webserver
#     port: process.env['PORT'] or undefined
#     # host: '0.0.0.0'
#     open: true
#     livereload:
#       filter: (f) -> console.log(arguments)
#     fallback: 'index.html'
#
#   gulp.src('./')
#     .pipe(config)
