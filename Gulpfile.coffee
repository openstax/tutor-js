_ = require 'underscore'
coffeelint      = require 'gulp-coffeelint'
del             = require 'del'
env             = require 'gulp-env'
gulp            = require 'gulp'
gutil           = require 'gulp-util'
gzip            = require 'gulp-gzip'
karma           = require 'karma'
rev             = require 'gulp-rev'
tar             = require 'gulp-tar'
watch           = require 'gulp-watch'
webpack         = require 'webpack'
webpackServer   = require 'webpack-dev-server'
WPExtractText   = require 'extract-text-webpack-plugin'

getWebpackConfig = require './webpack.config'

TestRunner      = require './test/config/test-runner'

KARMA_DEV_CONFIG =
  configFile: __dirname + '/test/karma-dev.config.coffee'
  singleRun: false

KARMA_CONFIG =
  configFile: __dirname + '/test/config/karma.config.coffee'
  singleRun: true

KARMA_COVERAGE_CONFIG =
  configFile: __dirname + '/test/config/karma-coverage.config.coffee'
  singleRun: true

DIST_DIR = './dist'

# -----------------------------------------------------------------------
#  Build Javascript and Styles using webpack
# -----------------------------------------------------------------------
gulp.task '_cleanDist', (done) ->
  del(['./dist/*'], done)

gulpWebpack = (name) ->
  env(vars:{ NODE_ENV: 'production' })
  config = getWebpackConfig(name, process.env.NODE_ENV is 'production')
  webpack(config, (err, stats) ->
    throw new gutil.PluginError("webpack", err) if err
    gutil.log("[webpack]", stats.toString({
      # output options
    }))
  )

gulp.task '_buildMain', _.partial(gulpWebpack, 'main')
gulp.task '_buildMainMin', _.partial(gulpWebpack, 'main.min')
gulp.task '_buildFull', _.partial(gulpWebpack, 'fullBuild')
gulp.task '_buildFullMin', _.partial(gulpWebpack, 'fullBuild.min')
gulp.task '_buildDemo', _.partial(gulpWebpack, 'demo')

gulp.task '_build', ['_cleanDist', '_buildMain', '_buildMainMin', '_buildFull', '_buildFullMin', '_buildDemo']

gulp.task '_tagRev', ['_build'], ->
  gulp.src("#{DIST_DIR}/*.min.*")
    .pipe(rev())
    .pipe(gulp.dest(DIST_DIR))
    .pipe(rev.manifest())
    .pipe(gulp.dest(DIST_DIR))

# -----------------------------------------------------------------------
#  Production
# -----------------------------------------------------------------------

gulp.task '_archive', ['_tagRev'], ->
  gulp.src(["#{DIST_DIR}/*"], base: DIST_DIR)
    .pipe(tar('archive.tar'))
    .pipe(gzip())
    .pipe(gulp.dest(DIST_DIR))

# -----------------------------------------------------------------------
#  Development
# -----------------------------------------------------------------------
#
gulp.task '_karma', ->
  server = new karma.Server(KARMA_DEV_CONFIG)
  server.start()

# TODO will rewrite this to fit new config
gulp.task '_webserver', ->
  env(vars:{ NODE_ENV: 'development' })
  config = getWebpackConfig('devServer', process.env.NODE_ENV is 'production')
  server = new webpackServer(webpack(config), config.devServer)
  server.listen(config.devServer.port, '0.0.0.0', (err) ->
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
  server = new karma.Server(KARMA_CONFIG)
  server.start()

gulp.task 'coverage', ->
  server = new karma.Server(KARMA_COVERAGE_CONFIG)
  server.start()

# clean out the dist directory before running since otherwise stale files might be served from there.
# The _webserver task builds and serves from memory with a fallback to files in dist
gulp.task 'dev', ['_cleanDist', '_webserver']

gulp.task 'tdd', ['_cleanDist', '_webserver'], ->
  runner = new TestRunner()
  watch('{src,test}/**/*', (change) ->
    runner.onFileChange(change) unless change.unlink
  )
