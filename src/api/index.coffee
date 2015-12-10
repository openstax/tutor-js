EventEmitter2 = require 'eventemitter2'

loader = require './loader'
settings = require './settings'

channel = new EventEmitter2 wildcard: true

# HACK - WORKAROUND
# MediaBodyView.prototype.initializeConceptCoach calls this multiple times
# (triggered by back-button and most perhaps search)
IS_INITIALIZED = false

initialize = (baseUrl) ->
  settings.baseUrl ?= baseUrl
  loader(channel, settings) unless IS_INITIALIZED
  IS_INITIALIZED = true

module.exports = {loader, settings, initialize, channel}
