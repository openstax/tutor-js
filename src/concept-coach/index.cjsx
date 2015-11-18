_ = require 'lodash'
EventEmitter2 = require 'eventemitter2'

helpers = require '../helpers'
api = require '../api'

{ModalCoach} = require './modal-coach'
model = {channel} = require './model'

CCWrapped = helpers.wrapComponent(ModalCoach)

publicChannel = new EventEmitter2 wildcard: true

listenAndBroadcast = (channelOut) ->
  api.channel.on 'error', (response) ->
    channelOut.emit('api.error', response)

  api.channel.on 'user.status.receive.fetch', (response) ->
    channelOut.emit('user.change', response)

  channel.on 'coach.mount.success', (eventData) ->
    channelOut.emit('open', eventData)

  channel.on 'coach.unmount.success', (eventData) ->
    cache = _.pick(eventData.coach, 'view', 'moduleUUID', 'collectionUUID')
    _.extend(model, cache)

    channelOut.emit('close', eventData)
  channel.on 'close.clicked', ->
    channelOut.emit('ui.close')

publicMethods =
  init: (baseUrl) ->
    api.initialize(baseUrl)
    listenAndBroadcast(publicChannel)

    api.channel.emit('user.status.send.fetch')

  open: (mountNode, props) ->
    props = _.clone(props)

    toCompare = ['moduleUUID', 'collectionUUID']
    if _.isEqual(_.pick(props, toCompare), _.pick(model, toCompare))
      props.defaultView ?= model.view

    modalNode = document.createElement('div')
    modalNode.classList.add('concept-coach-wrapper')
    mountNode.appendChild(modalNode)

    props.close = ->
      channel.emit('close.clicked')
      CCWrapped.unmountFrom(modalNode)
      mountNode.removeChild(modalNode)

    @component = CCWrapped.render(modalNode, props)
    @close = props.close

    @component

  handleOpened: (eventData, scrollTo, body = document.body) ->
    scrollTo ?= _.partial(window.scrollTo, 0)
    {top} = eventData.coach.el.getBoundingClientRect()
    top +=  window.scrollY
    scrollTo(top)
    body.classList.add('cc-opened')

  handleClosed: (eventData, body = document.body) ->
    body.classList.remove('cc-opened')

  handleError: (error) ->
    channel.emit('error', error)
    console.info(error)

cc = _.defaults(publicChannel, publicMethods)

module.exports = cc
