_ = require 'underscore'

wait = require './wait'
dom = require './dom'
windowPosition = require './window-position'

forEach = require './for-each'
screenshot = require './screenshot'
{verbose, verboseWrap} = require './verbose'

freshId = require './fresh-id'
toLocator = require './to-locator'

class Utils
  constructor: (test) ->
    @test = test

    @wait = wait(@test)
    @dom = dom(@test)
    @windowPosition = windowPosition(@test)

    @forEach = _.partial forEach, @test
    @screenshot = _.partial screenshot, @test

    @verbose = _.partial verbose, @test
    @verboseWrap = _.partial verboseWrap, @test

  getFreshId: freshId
  toLocator: toLocator

getUtils = (test) ->
  new Utils(test)

module.exports = getUtils
