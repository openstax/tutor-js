_ = require 'lodash'
EventEmitter2 = require 'eventemitter2'

helpers = require '../helpers'
restAPI = require '../api'

{ModalCoach} = require './modal-coach'
componentModel = require './model'
navigation = require '../navigation/model'
User = require '../user/model'

PROPS = ['moduleUUID', 'collectionUUID', 'cnxUrl']

listenAndBroadcast = (componentAPI) ->
  # Broadcast various internal events out to parent
  restAPI.channel.on 'error', (response) ->
    componentAPI.emit('api.error', response)

  restAPI.channel.on 'user.status.receive.fetch', (response) ->
    componentAPI.emit('user.change', response)

  componentModel.channel.on 'coach.mount.success', (eventData) ->
    componentModel.update(eventData.coach)

    componentAPI.emit('open', eventData)
    componentAPI.emit('view.update', navigation.getDataByView(eventData.coach.view))

  componentModel.channel.on 'coach.unmount.success', (eventData) ->
    componentModel.update(eventData.coach)

    componentAPI.emit('close', eventData)
    componentAPI.emit('view.update', navigation.getDataByView('close'))

  componentModel.channel.on 'close.clicked', ->
    componentAPI.emit('ui.close')

  navigation.channel.on 'show.*', (eventData) ->
    componentAPI.emit('view.update', navigation.getDataByView(eventData.view))

  navigation.channel.on 'close.for.book', (eventData) ->
    console.info(eventData)
    componentAPI.emit('book.update', eventData)

setupAPIListeners = (componentAPI) ->
  navigation.channel.on "switch.*", (eventData) ->
    {data, view} = eventData
    componentAPI.update(data)
    navigation.channel.emit("show.#{view}", {view})

  componentAPI.on 'show.*', (eventData) ->
    componentAPI.updateToView(eventData.view)

CCWrapped = helpers.wrapComponent(ModalCoach)

coachAPI = new EventEmitter2 wildcard: true

coachAPI.init = (baseUrl, navOptions = {}) ->
  _.defaults(navOptions, {prefix: '/', base: 'concept-coach/'})

  restAPI.initialize(baseUrl)
  navigation.initialize(navOptions)

  listenAndBroadcast(@)
  setupAPIListeners(@)
  User.ensureStatusLoaded()

coachAPI.setOptions = (options) ->
  isSame = _.isEqual(_.pick(options, PROPS), _.pick(componentModel, PROPS))
  options = _.extend({}, options, isSame: isSame)
  componentModel.update(options)

coachAPI.open = (mountNode, props) ->
  props = _.clone(props)
  props.defaultView ?= if componentModel.isSame then componentModel.view else 'task'

  componentModel.update(
    mounter: mountNode
    isSame: true
  )

  modalNode = document.createElement('div')
  modalNode.classList.add('concept-coach-wrapper')
  mountNode.appendChild(modalNode)

  props.close = ->
    componentModel.channel.emit('close.clicked')
    CCWrapped.unmountFrom(modalNode)
    mountNode.removeChild(modalNode)

  @component = CCWrapped.render(modalNode, props)
  @close = props.close

  @component

coachAPI.openByRoute = (mountNode, props, route) ->
  props = _.clone(props)
  props.defaultView = navigation.getViewByRoute(route)

  if props.defaultView? and props.defaultView isnt 'close'
    @open(mountNode, props)

coachAPI.updateToView = (view) ->
  if @component?.isMounted()
    if view is 'close'
      @component.props.close()
    else
      navigation.channel.emit("show.#{view}", {view})
  else if componentModel.mounter? and view isnt 'close'
    props = _.pick(componentModel, PROPS)
    props.defaultView = view
    @open(componentModel.mounter, props)

coachAPI.updateToRoute = (route) ->
  view = navigation.getViewByRoute(route)
  @updateToView(view) if view?

coachAPI.update = (nextProps) ->
  return unless @component?
  props = _.extend({}, _.pick(nextProps, PROPS))
  @component.setProps(props)

coachAPI.handleOpened = (eventData, scrollTo, body = document.body) ->
  scrollTo ?= _.partial(window.scrollTo, 0)
  {top} = eventData.coach.el.getBoundingClientRect()
  top +=  window.scrollY
  scrollTo(top)
  body.classList.add('cc-opened')

coachAPI.handleClosed = (eventData, body = document.body) ->
  body.classList.remove('cc-opened')

coachAPI.handleError = (error) ->
  channel.emit('error', error)
  console.info(error)

module.exports = coachAPI
