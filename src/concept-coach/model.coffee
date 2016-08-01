_ = require 'underscore'
EventEmitter2 = require 'eventemitter2'

coach =
  update: (options) ->
    _.extend(@, options)

  channel: new EventEmitter2 wildcard: true

module.exports = coach