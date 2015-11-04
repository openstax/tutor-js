_ = require 'lodash'
EventEmitter2 = require 'eventemitter2'

helpers = require '../helpers'
api = require '../api'

{ConceptCoach, channel} = require './base'

renderConceptCoach = helpers.wrapComponent(ConceptCoach)

publicChannel = new EventEmitter2 wildcard: true

listenAndBroadcast = (channelOut) ->
  api.channel.on 'error', (response) ->
    channelOut.emit('api.error', response)

  api.channel.on 'user.receive.statusUpdate', (response) ->
    channelOut.emit('user.change', response)

  channel.on 'coach.mount.success', ->
    channelOut.emit('open')
  channel.on 'close.clicked', ->
    channelOut.emit('ui.close')

publicMethods =
  init: (baseUrl) ->
    api.initialize(baseUrl)
    listenAndBroadcast(publicChannel)

    api.channel.emit('user.send.statusUpdate')

  open: renderConceptCoach

  handleError: (error) ->
    channel.emit('error', error)
    console.info(error)

cc = _.defaults(publicChannel, publicMethods)

module.exports = cc
