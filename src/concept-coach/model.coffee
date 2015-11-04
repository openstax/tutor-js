EventEmitter2 = require 'eventemitter2'
api = require '../api'
_ = require 'underscore'

coach = {}
channel = new EventEmitter2 wildcard: true


api.on 'error', _.partial(channel.emit('api.error'))


module.exports = {channel}