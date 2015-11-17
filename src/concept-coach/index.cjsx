_ = require 'lodash'
EventEmitter2 = require 'eventemitter2'

helpers = require '../helpers'
api = require '../api'

{ModalCoach} = require './modal-coach'
model = {channel} = require './model'

navigation = require '../navigation'

CCWrapped = helpers.wrapComponent(ModalCoach)

publicChannel = new EventEmitter2 wildcard: true

VIEWS =
  'profile': '/concept-coach/profile'
  'dashboard': '/concept-coach/dashboard'
  'task': '/concept-coach/task'
  'progress': '/concept-coach/progress'
  'default': '/concept-coach'
  'close': '/'

PROPS = ['moduleUUID', 'collectionUUID']

getViewData = (view) ->
  url: VIEWS[view]
  state: {view}

listenAndBroadcast = (channelOut) ->
  api.channel.on 'error', (response) ->
    channelOut.emit('api.error', response)

  api.channel.on 'user.status.receive.fetch', (response) ->
    channelOut.emit('user.change', response)

  channel.on 'coach.mount.success', (eventData) ->
    channelOut.emit('open', eventData)
    channelOut.emit('view.update', getViewData(eventData.coach.view))

  channel.on 'coach.unmount.success', (eventData) ->
    view = 'close'
    _.extend(model, eventData.coach)
    channelOut.emit('close', eventData)
    channelOut.emit('view.update', getViewData(view))

  channel.on 'close.clicked', ->
    channelOut.emit('ui.close')

  navigation.channel.on 'show.*', (eventData) ->
    {view} = eventData
    channelOut.emit('view.update', getViewData(view))

  channelOut.on 'show.*', (eventData) ->
    {view} = eventData

    if @component.isMounted()
      if view is 'close'
        @component.props.close()
      else
        navigation.channel.emit("show.#{view}", eventData)
    else if @component?
      props = _.pick(model, PROPS)
      props.defaultView = view

      @open(model.mounter, props)

publicMethods =
  init: (baseUrl) ->
    api.initialize(baseUrl)
    listenAndBroadcast(publicChannel)

    api.channel.emit('user.status.send.fetch')

  getViewByUrl: (url) ->
    URL_TO_VIEWS = _.invert(VIEWS)

    view = URL_TO_VIEWS[url]

    if view?
      view = 'task' if view is 'default'

    view

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

  openByUrl: (mountNode, props, url) ->
    props = _.clone(props)

    props.defaultView = @getViewByUrl(url)

    if props.defaultView?
      @open(mountNode, props) unless props.defaultView is 'close'

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
