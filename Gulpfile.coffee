gulp            = require 'gulp'
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
del             = require 'del'
rename          = require 'gulp-rename'
flatten         = require 'gulp-flatten'
merge           = require 'merge-stream'
tar             = require 'gulp-tar'
gzip            = require 'gulp-gzip'
livereload      = require 'gulp-livereload'
coffeelint      = require 'gulp-coffeelint'
shaSuffix       = require 'gulp-gitshasuffix'


handleErrors = (title) => (args...) =>
  # TODO: Send error to notification center with gulp-notify
  console.error(title, args...)
  # Keep gulp from hanging on this task
  @emit('end')


# -----------------------------------------------------------------------
#  Javascript
# -----------------------------------------------------------------------
#
# Browserify, watch files (to incrementally rebuild)
#

buildBrowserify = (srcPath, destDir, destFile, isWatching) ->
  args = (if isWatching then watchify.args else {})
  args.entries = [srcPath]
  args.extensions = ['.coffee', '.cjsx']
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

  bundler.on('update', bundle) if isWatching
  bundle()

build = (isWatching) ->
  destDir = './dist/'
  destFile = 'tutor.js'
  srcPath = './index.coffee'
  buildBrowserify(srcPath, destDir, destFile, isWatching)

buildTests = (isWatching) ->
  destDir = './.tmp' # This is referenced in ./test/karma.config.coffee
  destFile = 'all-tests.js'
  srcPath = './test/all-tests.coffee'
  buildBrowserify(srcPath, destDir, destFile, isWatching)


buildAndTest = (shouldWatch, done) ->
  build(shouldWatch).on 'end', ->
    buildTests(shouldWatch).on 'end', ->
      config =
        configFile: __dirname + '/test/karma.config.coffee'
        singleRun: not shouldWatch
        proxies:
          '/api': '/api'

      if shouldWatch
        karma.server.start(config)
        done()
      else
        karma.server.start(config, done)


gulp.task '_buildJS', ['_cleanJS'], -> build(false)

gulp.task '_cleanJS', (done) ->
  del([
    './dist/*.json',
    './dist/*.js'], done)


# -----------------------------------------------------------------------
#  Styles
# -----------------------------------------------------------------------
#
# CSS, fonts, and image resources
#

gulp.task '_css', ['_cleanCSS'], ->
  destDirCss = './dist'
  # Build the CSS file
  gulp.src('./resources/styles/tutor.less')
  .pipe(less())
  .on('error', (error) -> console.warn error.message)
  .pipe(gulp.dest(destDirCss))
  .pipe(livereload())

gulp.task '_cleanCSS', (done) ->
  del(['./dist/*.css'], done)

gulp.task '_copyResources', ['_cleanResources'], ->
  destDir = './dist'
  gulp.src("./resources/images/**/*.{svg,png,jpg}")
    .pipe(flatten())
    .pipe(gulp.dest(destDir))

gulp.task '_cleanResources', (done) ->
  del(['./dist/**/*.{svg,png,jpg}'], done)

gulp.task '_copyFonts', ['_cleanFonts'], ->
  destDirFonts = './dist/fonts/'
  gulp.src([
      'bower_components/**/*.{eot,svg,png,jpg,ttf,woff,woff2}',
      'node_modules/**/*.{eot,svg,png,jpg,ttf,woff,woff2}',
      'resources/fonts/**/*'
    ])
    .pipe(flatten())
    .pipe(gulp.dest(destDirFonts))

gulp.task '_cleanFonts', (done) ->
  del([
    './dist/**/*.eot',
    './dist/**/*.woff',
    './dist/**/*.woff2',
    './dist/**/*.ttf'], done)


gulp.task '_styles', ['_css', '_copyResources', '_copyFonts']



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

gulp.task '_shaSuffix', ['_min'], ->
  destDir = './dist/'
  gulp.src('./dist/*.min.*')
    .pipe(shaSuffix())
    .pipe(gulp.dest(destDir))

gulp.task '_archive', ['_cleanArchive', '_build', '_min', '_shaSuffix'], ->
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

gulp.task '_build', ['_buildJS', '_styles']



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


gulp.task '_webserver', ->
  livereload.listen()
  config =
    port: process.env['PORT'] or 8000
    # host: '0.0.0.0'
    # livereload: true # Use the livereload.listen to notify when
    # the CSS file is rebuilt
    fallback: 'index.html'
    middleware: -> [
      cors(), # For font loading from tutor-server
      (req, res, next) ->
        if req.url.match(/\.svg$/)
          res.setHeader('Content-Type', 'image/svg+xml')
        if req.url.match(/woff[2]?$/)
          name = req.url[req.url.lastIndexOf('/') + 1 .. req.url.length]
          ext  = name[name.lastIndexOf('.') + 1 .. name.length]
          res.setHeader("Content-Disposition", "attachment; filename=\"#{name}\"")
          res.setHeader('Content-Type', "application/font-#{ext}")
        next()

    ]
  connect.server(config)

gulp.task '_tdd', ['_watchLint'], (done) ->
  buildAndTest(true, done)
  return # Since this is async


# -----------------------------------------------------------------------
#  Public Tasks
# -----------------------------------------------------------------------
#
# External tasks called by various people (devs, testers, Travis, production)
#

gulp.task 'lint', ->
  gulp.src(['./src/**/*.{cjsx,coffee}', './*.coffee', './test/**/*.{cjsx,coffee}'])
  .pipe(coffeelint())
  # Run through both reporters so lint failures are visible and Travis will error
  .pipe(coffeelint.reporter())
  .pipe(coffeelint.reporter('fail'))

# gulp.task 'dist', ['_build']
gulp.task 'prod', ['_archive']

gulp.task 'serve', ['_buildJS', '_styles', '_webserver']

gulp.task 'test', ['lint'], (done) ->
  buildAndTest(false, done)
  return # Since this is async

gulp.task 'dev', ['_watchLint', '_styles', '_webserver'], ->
  gulp.watch 'resources/styles/**/{*.less, *.css}', ['_css']
  build(true)

gulp.task 'tdd', ['_styles', '_tdd', '_webserver'], ->
  gulp.watch 'resources/styles/**/{*.less, *.css}', ['_css']
  gulp.watch ['test/**/*.coffee'], ['_tdd']
