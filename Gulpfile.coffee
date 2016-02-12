# coffeelint: disable=no_empty_functions
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

gulp.task '_build', ['_cleanDist'], (done) ->
  # use the webpack config as if it was being built for a remote machine
  # (ie no hotloader) but keep the actual React runtime warnings and sourcemaps
  # in place
  env(vars:{NODE_BUILD_TYPE: 'standalone'})
  # Default to "production"
  unless process.env.NODE_ENV
    env(vars:{NODE_ENV: JSON.stringify('production')})

  plugins = [
    # Use the production version of React (no warnings/runtime checks)
    new webpack.DefinePlugin({ 'process.env': {NODE_ENV: process.env.NODE_ENV} })
  ]

  webpackConfig = require './webpack.config'
  config = _.extend({}, webpackConfig, {plugins})

  if process.env.NODE_ENV is JSON.stringify('production') and process.env.NODE_MINIFY isnt JSON.stringify(false)
    plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}))
    plugins.push(new WPExtractText("tutor.min.css"))
    config.output.filename = 'tutor.min.js'
  else
    plugins.push(new WPExtractText("tutor.css"))
    config.output.filename = 'tutor.js'

  webpack(config, (err, stats) ->
    throw new gutil.PluginError("webpack", err) if err
    gutil.log("[webpack]", stats.toString({
      # output options
    }))
    done()
  )

gulp.task '_disableMinify', ->
  # Don't minify in order to save time
  env(vars:{NODE_MINIFY: JSON.stringify(false)})

# Used for selenium testing.
# Disable minify so the test process is quicker
gulp.task 'build', ['_disableMinify', '_build'], ->


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

gulp.task '_webserver', ->
  env(vars:{ NODE_ENV: 'development' })
  webpackConfig = require './webpack.config'
  config = _.extend( {}, webpackConfig)
  config.entry.tutor.unshift(
    './node_modules/webpack-dev-server/client/index.js?http://localhost:8000'
    'webpack/hot/dev-server'
  )
  config.plugins.push( new webpack.HotModuleReplacementPlugin() )
  for loader in config.module.loaders when _.isArray(loader.loaders)
    loader.loaders.unshift("react-hot", "webpack-module-hot-accept")
  server = new webpackServer(webpack(config), config.devServer)
  server.listen(webpackConfig.devServer.port, '0.0.0.0', (err) ->
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

# `gulp prod` is currently what deployments use until they switch to `npm run build-archive`
gulp.task 'prod', ['_archive']
gulp.task 'build-archive', ['_archive']

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
