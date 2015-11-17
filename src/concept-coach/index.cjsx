_ = require 'lodash'
EventEmitter2 = require 'eventemitter2'

helpers = require '../helpers'
api = require '../api'

{ModalCoach} = require './modal-coach'
model = {channel} = require './model'

navigation = require '../navigation/model'

CCWrapped = helpers.wrapComponent(ModalCoach)

publicChannel = new EventEmitter2 wildcard: true

PROPS = ['moduleUUID', 'collectionUUID']

listenAndBroadcast = (channelOut) ->
  api.channel.on 'error', (response) ->
    channelOut.emit('api.error', response)

  api.channel.on 'user.status.receive.fetch', (response) ->
    channelOut.emit('user.change', response)

  channel.on 'coach.mount.success', (eventData) ->
    channelOut.emit('open', eventData)
    channelOut.emit('view.update', navigation.getDataByView(eventData.coach.view))

  channel.on 'coach.unmount.success', (eventData) ->
    view = 'close'
    _.extend(model, eventData.coach)
    channelOut.emit('close', eventData)
    channelOut.emit('view.update', navigation.getDataByView(view))

  channel.on 'close.clicked', ->
    channelOut.emit('ui.close')

  navigation.channel.on 'show.*', (eventData) ->
    {view} = eventData
    channelOut.emit('view.update', navigation.getDataByView(view))

  channelOut.on 'show.*', (eventData) ->
    @updateToView(eventData.view)

publicMethods =
  init: (baseUrl, navOptions = {}) ->
    _.defaults(navOptions, {prefix: '/', base: 'concept-coach/'})

    api.initialize(baseUrl)
    navigation.initialize(navOptions)
    listenAndBroadcast(publicChannel)

    api.channel.emit('user.status.send.fetch')

  setOptions: (initialModel) ->
    _.extend(model, initialModel)

  open: (mountNode, props) ->
    props = _.clone(props)
    model.mounter = mountNode

    if _.isEqual(_.pick(props, PROPS), _.pick(model, PROPS))
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

  openByRoute: (mountNode, props, route) ->
    props = _.clone(props)
    props.defaultView = navigation.getViewByRoute(route)

    if props.defaultView?
      @open(mountNode, props) unless props.defaultView is 'close'

  updateToView: (view) ->
    if @component?.isMounted()
      if view is 'close'
        @component.props.close()
      else
        navigation.channel.emit("show.#{view}", {view})
    else if model.mounter?
      props = _.pick(model, PROPS)
      props.defaultView = view
      @open(model.mounter, props)

  updateToRoute: (route) ->
    view = navigation.getViewByRoute(route)
    @updateToView(view) if view?

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
