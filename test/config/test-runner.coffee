_ = require 'underscore'
#gulpKarma = require 'gulp-karma'
Karma  = require 'karma'
gulp   = require 'gulp'
gutil  = require 'gulp-util'
moment = require 'moment'
path   = require 'path'
spawn  = require('child_process').spawn
fileExists = require 'file-exists'

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

    child = spawn( 'node', [
      path.join(__dirname, 'karma-in-background.js'),
      JSON.stringify(specs)
    ], {stdio: 'inherit'} )

    child.on('exit', (exitCode) =>
      isKarmaRunning = false
      duration = moment.duration(moment().diff(startAt))
      elapsed = duration.minutes() + ':' + duration.seconds()
      gutil.log("[test]", gutil.colors.green("done. #{specs.length} specs in #{elapsed}"))
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
        gutil.log("[change]", gutil.colors.red("no spec was found for #{change.relative}"))
      else
        @pendingSpecs.push(existingSpecs...)
    else
      @pendingSpecs.push(change.relative)
    gutil.log("[test]", gutil.colors.green("pending: #{@pendingSpecs.join(' ')}")) if @pendingSpecs.length
    @runKarma()

module.exports = TestRunner
