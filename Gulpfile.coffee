gulp            = require 'gulp'
webserver       = require 'gulp-webserver'
source          = require 'vinyl-source-stream'
browserify      = require 'browserify'
watchify        = require 'watchify'
cjsxify         = require 'cjsxify'
browserifyShim  = require 'browserify-shim'


handleErrors = (title) -> (args...)->
  # TODO: Send error to notification center with gulp-notify
  console.error(title, args...)
  # Keep gulp from hanging on this task
  @emit('end')


build = (isWatching)->
  destDir = './'
  destFile = 'bundle.js'
  sourceName = './index.coffee'
  args = (if isWatching then watchify.args else {})
  args.entries = ['./index.coffee']
  args.extensions = ['.coffee']
  args.debug = true if isWatching
  bundler = browserify(args)
  bundler.transform(browserifyShim)
  bundler.transform(cjsxify)

  bundler = watchify(bundler, {}) if isWatching

  bundle = ->
    bundler
    .bundle()
    .on('error', handleErrors('Browserify error'))
    .pipe(source(destFile))
    .pipe(gulp.dest(destDir))


  bundler.on('update', bundle)
  bundle()


gulp.task 'test', -> build(false)
gulp.task 'dist', -> build(false)
gulp.task 'watch', -> build(true)
gulp.task 'serve', ->
  build(true)
  config = webserver
    port: process.env['PORT'] or undefined
    # host: '0.0.0.0'
    open: true
    livereload:
      filter: (f) -> console.log(arguments)
    fallback: 'index.html'

  gulp.src('./')
    .pipe(config)
