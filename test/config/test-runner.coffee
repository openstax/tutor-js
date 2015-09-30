_ = require 'underscore'
#gulpKarma = require 'gulp-karma'
Karma  = require 'karma'
gulp   = require 'gulp'
gutil  = require 'gulp-util'
moment = require 'moment'
path   = require 'path'
spawn  = require('child_process').spawn
fileExists = require 'file-exists'
_ = require 'underscore'

class TestRunner

  isKarmaRunning: false

  pendingSpecs: []

  runKarma: ->
    specs = _.unique @pendingSpecs

    # no need to start a server if there are no pending specs, or the spec list hasn't changed
    return if _.isEmpty(@pendingSpecs) or _.isEqual(@curSpecs?.sort(), specs.sort())

    # if there's already a karma instance running, then kill it, since we're starting a new one
    if @isKarmaRunning and @child
      process.kill(@child.pid, 'SIGTERM')
      @child = null

    @isKarmaRunning = true
    gutil.log("[specs]", gutil.colors.green("testing #{specs.join(' ')}"))
    @pendingSpecs = []
    startAt = moment()

    @child = spawn( 'node', [
      path.join(__dirname, 'karma-in-background.js'),
      JSON.stringify(specs)
    ], {stdio: 'inherit'} )

    #save the spec list that is being run
    @curSpecs = specs[...]

    @child.on('exit', (exitCode) =>
      @isKarmaRunning = false
      duration = moment.duration(moment().diff(startAt))
      elapsed = duration.minutes() + ':' + duration.seconds()
      gutil.log("[test]", gutil.colors.green("done. #{specs.length} specs in #{elapsed}"))
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
