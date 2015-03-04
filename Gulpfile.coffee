gulp            = require 'gulp'
karma           = require 'karma'
webserver       = require 'gulp-webserver'
less            = require 'gulp-less'
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


build = (isWatching)->
  destDir = './dist/'
  destFile = 'tutor.js'
  srcPath = './index.coffee'
  buildBrowserify(srcPath, destDir, destFile, isWatching)

gulp.task 'styles', ['cleanStyles'], ->
  destDirCss = './dist'
  # Build the CSS file
  gulp.src('./style/tutor.less')
  .pipe(less())
  .pipe(gulp.dest(destDirCss))

gulp.task 'cleanStyles', (done) ->
  del(['./dist/*.css'], done)

buildTests = (isWatching) ->
  destDir = './.tmp' # This is referenced in ./test/karma.config.coffee
  destFile = 'all-tests.js'
  srcPath = './test/all-tests.coffee'
  buildBrowserify(srcPath, destDir, destFile, isWatching)


gulp.task 'test', ['build'], (done) ->
  buildTests(false)
  .on 'end', ->
    config =
      configFile: __dirname + '/test/karma.config.coffee'
      singleRun: true
    karma.server.start(config, done)

  return # Since this is async

gulp.task 'tdd', ['build'],  (done) ->
  buildTests(true)
  .on 'end', ->
    config =
      configFile: __dirname + '/test/karma.config.coffee'
    karma.server.start(config, done)

  return # Since this is async

gulp.task 'buildJS', ['cleanJS'], -> build(false)

gulp.task 'cleanJS', (done) ->
  del([
    './dist/*.json',
    './dist/*.js'], done)

gulp.task 'copyResources', ['cleanResources'], ->
  destDir = './dist/'
  gulp.src('./style/**/*.svg')
    .pipe(flatten())
    .pipe(gulp.dest(destDir))

gulp.task 'cleanResources', (done) ->
  del(['./dist/**/*.svg'], done)

gulp.task 'copyFonts', ['cleanFonts'], ->
  destDirFonts = './dist/fonts/'
  copyBowerFonts = gulp.src('bower_components/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(flatten())
    .pipe(gulp.dest(destDirFonts))
  copyPkgFonts = gulp.src('node_modules/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(flatten())
    .pipe(gulp.dest(destDirFonts))
  merge(copyBowerFonts, copyPkgFonts)

gulp.task 'cleanFonts', (done) ->
  del([
    './dist/**/*.eot',
    './dist/**/*.woff',
    './dist/**/*.woff2',
    './dist/**/*.ttf'], done)

gulp.task 'minjs', ['build'], ->
  destDir = './dist/'
  gulp.src('./dist/tutor.js')
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(destDir))

gulp.task 'mincss', ['build'], ->
  destDir = './dist/'
  gulp.src('./dist/tutor.css')
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(rename({extname: '.min.css'}))
    .pipe(gulp.dest(destDir))

gulp.task 'min', ['minjs', 'mincss']

gulp.task 'rev', ['min'], ->
  destDir = './dist/'
  gulp.src('./dist/*.min.*')
    .pipe(rev())
    .pipe(gulp.dest(destDir))
    .pipe(rev.manifest())
    .pipe(gulp.dest(destDir))

gulp.task 'archive', ['cleanArchive', 'build', 'min', 'rev'], ->
  gulp.src([
    './dist/tutor.min-*.js',
    './dist/tutor.min-*.css',
    './dist/fonts',
    './dist/logo-brand.svg'])
    .pipe(tar('archive.tar'))
    .pipe(gzip())
    .pipe(gulp.dest('./dist/'))

gulp.task 'cleanArchive', (done) ->
  del(['./dist/*.tar', './dist/*.gz'], done)

gulp.task 'dist', ['build']
gulp.task 'prod', ['archive']
gulp.task 'watch', ['build'], ->
  gulp.watch ['src/**/*.coffee', 'src/**/*.cjsx', 'test/**/*.coffee'], ['build', 'test']
  gulp.watch 'style/**/{*.less, *.css}', ['styles']

gulp.task 'build',
  ['buildJS', 'styles', 'copyResources', 'copyFonts']

gulp.task 'serve', ['watch'], ->
  config = webserver
    port: process.env['PORT'] or undefined
    # host: '0.0.0.0'
    open: true
    livereload:
      filter: (f) -> console.log(arguments)
    fallback: 'index.html'

  gulp.src('./')
    .pipe(config)
