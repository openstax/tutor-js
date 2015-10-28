EventEmitter2 = require 'eventemitter2'

loader = require './loader'
settings = require './settings'

channel = new EventEmitter2 wildcard: true

initialize = ->
  loader(channel, settings)

module.exports = {loader, settings, initialize, channel}
