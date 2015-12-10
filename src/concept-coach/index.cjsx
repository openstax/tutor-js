_ = require 'lodash'
$ = require 'jquery'
EventEmitter2 = require 'eventemitter2'

helpers = require '../helpers'
restAPI = require '../api'

{ModalCoach} = require './modal-coach'
componentModel = require './model'
navigation = require '../navigation/model'
User = require '../user/model'
exercise = require '../exercise/collection'

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
    componentAPI.emit('book.update', eventData)

  exercise.channel.on 'component.*', (eventData) ->
    componentAPI.emit("exercise.component.#{eventData.status}", eventData)

setupAPIListeners = (componentAPI) ->
  navigation.channel.on "switch.*", (eventData) ->
    {data, view} = eventData
    componentAPI.update(data)
    navigation.channel.emit("show.#{view}", {view})

  componentAPI.on 'show.*', (eventData) ->
    componentAPI.updateToView(eventData.view)


modalCoachWrapped = helpers.wrapComponent(ModalCoach)

class ConceptCoachAPI extends EventEmitter2
  constructor: (baseUrl, navOptions = {}) ->
    super(wildcard: true)

    _.defaults(navOptions, {prefix: '/', base: 'concept-coach/'})

    restAPI.initialize(baseUrl)
    navigation.initialize(navOptions)

    listenAndBroadcast(@)
    setupAPIListeners(@)
    User.ensureStatusLoaded()

  setOptions: (options) ->
    isSame = _.isEqual(_.pick(options, PROPS), _.pick(componentModel, PROPS))
    options = _.extend({}, options, isSame: isSame)
    componentModel.update(options)

  open: (mountNode, props) ->
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
      modalCoachWrapped.unmountFrom(modalNode)
      mountNode.removeChild(modalNode) if modalNode.parentNode is mountNode

    # wait until our logout request has been received and the close
    User.channel.once 'logout.received', ->
      props.close()

    onPopStateClose = ->
      props.close()
      window.removeEventListener 'popstate', onPopStateClose
    window.addEventListener 'popstate', onPopStateClose

    @component = modalCoachWrapped.render(modalNode, props)
    @close = props.close

    @component

  openByRoute: (mountNode, props, route) ->
    props = _.clone(props)
    props.defaultView = navigation.getViewByRoute(route)

    if props.defaultView? and props.defaultView isnt 'close'
      @open(mountNode, props)

  updateToView: (view) ->
    if @component?.isMounted()
      if view is 'close'
        @component.props.close()
      else
        navigation.channel.emit("show.#{view}", {view})
    else if componentModel.mounter? and view isnt 'close'
      props = _.pick(componentModel, PROPS)
      props.defaultView = view
      @open(componentModel.mounter, props)

  updateToRoute: (route) ->
    view = navigation.getViewByRoute(route)
    @updateToView(view) if view?

  update: (nextProps) ->
    return unless @component?
    props = _.extend({}, _.pick(nextProps, PROPS))
    @component.setProps(props)

  handleOpened: (eventData, scrollTo, body = document.body) ->
    scrollTo ?= _.partial(window.scrollTo, 0)
    {top} = $(eventData.coach.el).offset()
    scrollY = $(window).scrollTop()

    componentModel.update(
      scrollY: scrollY
      closeScroll: ->
        scrollTo(@scrollY)
    )
    scrollTo(top)
    body.classList.add('cc-opened')

  handleClosed: (eventData, body = document.body) ->
    body.classList.remove('cc-opened')
    componentModel.closeScroll?()

  handleResize: ->
    return unless componentModel.el? and @component?.isMounted()
    {top} = $(componentModel.el).offset()

    window.scrollTo(0, top)

  handleError: (error) ->
    channel.emit('error', error)
    console.info(error)

module.exports = ConceptCoachAPI
