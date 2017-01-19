_ = require 'underscore'

EventEmitter2 = require 'eventemitter2'
helpers = require '../helpers'

restAPI = require '../api'
componentModel = require './model'
navigation = require '../navigation/model'
User = require '../user/model'
exercise = require '../exercise/collection'
progress = require '../progress/collection'
task = require '../task/collection'

{Coach} = require './coach'
coachWrapped = helpers.wrapComponent(Coach)

PROPS = ['moduleUUID', 'collectionUUID', 'cnxUrl', 'getNextPage', 'processHtmlAndMath', 'enrollmentCode']
WRAPPER_CLASSNAME = 'concept-coach-wrapper'

listenAndBroadcast = (componentAPI) ->
  # Broadcast various internal events out to parent
  restAPI.channel.on 'error', (response) ->
    componentAPI.emit('api.error', response)

  restAPI.channel.on 'user.status.fetch.receive', (response) ->
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

  componentModel.channel.on 'launcher.clicked.*', (args)->
    componentAPI.emit('ui.launching', args)

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

initializeModels = (models) ->
  _.each models, (model) ->
    model.init?()

stopModelChannels = (models) ->
  _.each models, (model) ->
    model.destroy?() or model.channel?.removeAllListeners?()

deleteProperties = (obj) ->
  for property, value of obj
    delete obj[property] unless _.isFunction(obj[property]) or property is 'channel'
    null

class ConceptCoachAPI extends EventEmitter2
  constructor: (baseUrl, navOptions = {}) ->
    super(wildcard: true)

    _.defaults(navOptions, {prefix: '/', base: 'concept-coach/'})

    restAPI.init = _.partial restAPI.initialize, baseUrl
    navigation.init = _.partial navigation.initialize, navOptions

    @models = [restAPI, navigation, User, exercise, progress, task, componentModel]
    initializeModels(@models)

    listenAndBroadcast(@)
    setupAPIListeners(@)
    User.ensureStatusLoaded(true)

  destroy: ->
    @close?()
    @remove()

    stopModelChannels(@models)
    deleteProperties(@models)
    deleteProperties(componentModel)

    @removeAllListeners()

  remove: ->
    coachWrapped.unmount() if @component
    @component = null

  setOptions: (options) ->
    isSame = _.isEqual(_.pick(options, PROPS), _.pick(componentModel, PROPS))
    options = _.extend({}, options, isSame: isSame)
    componentModel.update(options)

  initialize: (mountNode, props = {}) ->
    @remove()
    props = _.extend(_.clone(props), _.pick(componentModel, PROPS))
    props.defaultView ?= if componentModel.isSame then componentModel.view else 'task'

    componentModel.update(
      mounter: mountNode
      isSame: true
    )

    props.close = =>
      coachWrapped.update(open: false)
      componentModel.channel.emit('close.clicked')

    @close = props.close

    # Needs to be added on initialize since opening from a coach path calls
    # initialize, and not open.  On will handle multiple logging in and out.
    #
    # Wait until our logout request has been received and the close
    User.channel.on('logout.received', @close)

    @component = coachWrapped.render(mountNode, props)
    if module.hot
      module.hot.accept('./coach', =>
        pastProps = coachWrapped.props
        coachWrapped.unmount()
        {Coach} = require('./coach')
        coachWrapped = helpers.wrapComponent(Coach)
        @component = coachWrapped.render(mountNode, pastProps)
      )


  open: (openArgs...) ->
    openProps = _.extend({}, openArgs..., open: true)
    openProps.triggeredFrom = _.pick(openProps, 'moduleUUID', 'collectionUUID')

    coachWrapped.update(openProps)

  openByRoute: (props, route) ->
    props = _.clone(props)
    props.defaultView = navigation.getViewByRoute(route)

    if props.defaultView? and props.defaultView isnt 'close'
      @open(props)

  updateToView: (view) ->
    if @component
      if view is 'close'
        @component.props?.close?()
      else
        navigation.channel.emit("show.#{view}", {view})
    else if componentModel.mounter? and view isnt 'close'
      props = _.pick(componentModel, PROPS)
      props.defaultView = view
      @open(props)

  updateToRoute: (route) ->
    view = navigation.getViewByRoute(route)
    @updateToView(view) if view?

  update: (nextProps) ->
    return unless @component?
    props = _.extend({}, _.pick(nextProps, PROPS))
    coachWrapped.update(props)

  handleOpened: (eventData, body = document.body) ->
    body.classList.add('cc-opened')

  handleClosed: (eventData, body = document.body) ->
    body.classList.remove('cc-opened')

  handleError: (error) ->
    channel.emit('error', error)
    console.info(error)

module.exports = ConceptCoachAPI
