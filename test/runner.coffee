_ = require 'underscore'
gulpKarma = require 'gulp-karma'
Karma     = require 'karma'
gulp      = require 'gulp'
gutil     = require 'gulp-util'
moment    = require 'moment'

KarmaConfig = __dirname + '/karma.config.coffee'

class TestRunner

  isKarmaRunning: false

  pendingSpecs: []

  runKarma: ->
    return if isKarmaRunning or _.isEmpty(@pendingSpecs)
    isKarmaRunning = true
    specs = _.unique @pendingSpecs
    gutil.log("[specs]", gutil.colors.green("testing #{specs.join(' ')}"))
    @pendingSpecs = []
    startAt = moment()
    gulp.src( specs )
      .pipe( gulpKarma({ configFile: __dirname + '/karma.config.coffee', action: 'run' }) )
      .on('error', (err) ->
        isKarmaRunning = false
        gutil.log("[karma]", gutil.colors.red(err))
      )
      .on('end',  (code) =>
        isKarmaRunning = false
        duration = moment.duration(moment().diff(startAt))
        elapsed = duration.minutes() + ':' + duration.seconds()
        gutil.log("[karma]", gutil.colors.green("done. #{specs.length} specs in #{elapsed}"))
        @runKarma()
      )

  onFileChange: (change) ->
    if change.relative.match(/^src/)
      testPath = change.relative.replace('src', 'test')
      testPath.replace(/\.(\w+)$/, ".spec.coffee")
      spec = testPath.replace(/\.(\w+)$/, ".spec.coffee")
      existingSpecs = _.select([
        testPath.replace(/\.(\w+)$/, ".spec.cjsx"), testPath.replace(/\.(\w+)$/, ".spec.coffee")
      ], fileExists)
      if _.isEmpty(existingSpecs)
        gutil.log("[change]", gutil.colors.red("no spec was found"))
      else
        gutil.log("[change]", gutil.colors.green("testing #{existingSpecs.join(' ')}"))
        @pendingSpecs.push(existingSpecs...)
    else
      @pendingSpecs.push(change.relative)
    @runKarma()

module.exports = TestRunner
