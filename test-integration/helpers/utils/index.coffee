_ = require 'underscore'

wait = require './wait'
windowPosition = require './window-position'

forEach = require './for-each'
screenshot = require './screenshot'

freshId = require './fresh-id'
toLocator = require './to-locator'

class Utils
  constructor: (test) ->
    @test = test

    @wait = wait(@test)
    @windowPosition = windowPosition(@test)

    @forEach = _.partial forEach, @test
    @screenshot = _.partial screenshot, @test

  getFreshId: freshId
  toLocator: toLocator

getUtils = (test) ->
  new Utils(test)

module.exports = getUtils
